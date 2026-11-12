"""
Regression tests for Phase 1 & Phase 2 fixes in GradeX backend.
Run with:  uv run pytest tests/ -v
"""
import os
import shutil
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import fitz
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.database.connection import Base, get_db
from app.database.models import AnswerSheet, Evaluation, EvaluationStatus
from app.main import app
from app.services.ai_evaluation_service import AIEvaluationService, GeminiEvaluationError
from app.services.ocr_service import _segment_by_questions
from app.services.result_service import ResultService

SQLITE_REG_URL = "sqlite:///./test_regressions.db"
engine = create_engine(SQLITE_REG_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


def _setup():
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)
    return TestClient(app)


def _make_pdf(text: str) -> bytes:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), text)
    data = doc.tobytes()
    doc.close()
    return data


def _auth_header(client: TestClient, email: str, password: str) -> dict:
    r = client.post("/api/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_answer_key_security_for_students_and_teachers():
    client = _setup()
    client.post("/api/auth/register", json={
        "email": "reg_teacher@example.com",
        "password": "Pass123!",
        "full_name": "Reg Teacher",
        "role": "teacher",
    })
    th = _auth_header(client, "reg_teacher@example.com", "Pass123!")

    # Create student with login
    client.post("/api/students", headers=th, json={
        "student_id": "STUREG1",
        "full_name": "Reg Student 1",
        "email": "reg_stu1@example.com",
        "create_login": True,
        "login_password": "StuPass123!",
    })
    sh = _auth_header(client, "reg_stu1@example.com", "StuPass123!")

    # Create published exam + unpublished exam with answer keys
    r_pub = client.post("/api/exams", headers=th, json={
        "title": "Published Exam",
        "questions": [{
            "question_text": "Explain gravity.",
            "max_marks": 10,
            "answer_key": {
                "model_answer": "SECRET MODEL ANSWER",
                "marking_rubric": [{"criterion": "Definition", "marks": 10}],
                "keywords": ["mass", "attraction"],
            },
        }],
    })
    assert r_pub.status_code == 201
    pub_exam_id = r_pub.json()["id"]
    client.put(f"/api/exams/{pub_exam_id}", headers=th, json={"is_published": True})

    r_unpub = client.post("/api/exams", headers=th, json={
        "title": "Unpublished Exam",
        "questions": [{
            "question_text": "Hidden Q",
            "max_marks": 5,
            "answer_key": {"model_answer": "HIDDEN"},
        }],
    })
    unpub_exam_id = r_unpub.json()["id"]

    # Teacher sees full answer_key on all 3 GET endpoints
    assert client.get("/api/exams", headers=th).json()[0]["questions"][0]["answer_key"]["model_answer"] == "SECRET MODEL ANSWER"
    assert client.get(f"/api/exams/{pub_exam_id}", headers=th).json()["questions"][0]["answer_key"]["model_answer"] == "SECRET MODEL ANSWER"
    assert client.get(f"/api/exams/{pub_exam_id}/questions", headers=th).json()[0]["answer_key"]["model_answer"] == "SECRET MODEL ANSWER"

    # Student NEVER sees answer_key on any GET endpoint
    s_list = client.get("/api/exams", headers=sh)
    assert s_list.status_code == 200
    assert len(s_list.json()) == 1
    assert s_list.json()[0]["questions"][0]["answer_key"] is None

    s_detail = client.get(f"/api/exams/{pub_exam_id}", headers=sh)
    assert s_detail.status_code == 200
    assert s_detail.json()["questions"][0]["answer_key"] is None

    s_qs = client.get(f"/api/exams/{pub_exam_id}/questions", headers=sh)
    assert s_qs.status_code == 200
    assert s_qs.json()[0]["answer_key"] is None

    # Student cannot access unpublished exam or its questions
    assert client.get(f"/api/exams/{unpub_exam_id}", headers=sh).status_code == 403
    assert client.get(f"/api/exams/{unpub_exam_id}/questions", headers=sh).status_code == 403


def test_student_id_lookup_uuid_and_public_id():
    client = _setup()
    th = _auth_header(client, "reg_teacher@example.com", "Pass123!")
    sh1 = _auth_header(client, "reg_stu1@example.com", "StuPass123!")

    r_s2 = client.post("/api/students", headers=th, json={
        "student_id": "STUREG2",
        "full_name": "Reg Student 2",
        "email": "reg_stu2@example.com",
    })
    assert r_s2.status_code == 201
    s2_uuid = r_s2.json()["id"]

    # Teacher lookup by UUID and by public student_id
    assert client.get(f"/api/students/{s2_uuid}", headers=th).status_code == 200
    r_pub_lookup = client.get("/api/students/STUREG2", headers=th)
    assert r_pub_lookup.status_code == 200
    assert r_pub_lookup.json()["id"] == s2_uuid

    # Student 1 can fetch own record via STUREG1, forbidden for STUREG2
    assert client.get("/api/students/STUREG1", headers=sh1).status_code == 200
    assert client.get("/api/students/STUREG2", headers=sh1).status_code == 403


def test_gemini_503_bounded_retry_ai_failed_and_recovery():
    client = _setup()
    th = _auth_header(client, "reg_teacher@example.com", "Pass123!")

    # Create subject & exam
    r_subj = client.post("/api/subjects", headers=th, json={"name": "Physics", "code": "PHY101"})
    subj_id = r_subj.json()["id"]
    client.post("/api/subjects", headers=th, json={"name": "Chemistry (Empty)", "code": "CHM101"})

    r_exam = client.post("/api/exams", headers=th, json={
        "title": "Physics Quiz",
        "subject_id": subj_id,
        "questions": [{
            "question_text": "Define velocity.",
            "max_marks": 10,
            "answer_key": {"model_answer": "Rate of change of displacement."},
        }],
    })
    exam_id = r_exam.json()["id"]

    # Upload PDF for STUREG1
    pdf_bytes = _make_pdf("Q1. Velocity is the rate of change of displacement with time.")
    r_up = client.post(
        "/api/upload/bulk",
        headers=th,
        data={"exam_id": exam_id},
        files=[("files", ("STUREG1_phy.pdf", pdf_bytes, "application/pdf"))],
    )
    assert r_up.status_code == 201
    sheet_id = r_up.json()["results"][0]["answer_sheet_id"]

    # 1. Simulate Gemini 503 failure -> bounded retries, status=ai_failed, no fabricated evaluation
    failing_model = MagicMock()
    failing_model.generate_content.side_effect = Exception("503 Service Unavailable")

    with patch("app.services.ai_evaluation_service._get_gemini_model", return_value=failing_model), \
         patch("app.services.ai_evaluation_service.time.sleep"):
        r_ev = client.post(f"/api/evaluate/{sheet_id}", headers=th)
        assert r_ev.status_code == 200

    assert failing_model.generate_content.call_count == settings.GEMINI_MAX_RETRIES + 1

    st = client.get(f"/api/evaluate/{sheet_id}/status", headers=th).json()
    assert st["evaluation_status"] == "ai_failed"
    assert st["evaluation_id"] is None
    assert st["total_marks_awarded"] is None

    # 2. Retry evaluation when Gemini recovers -> succeeds cleanly, no duplicates
    good_resp = SimpleNamespace(text='{"marks_awarded": 8.5, "confidence": 0.95, "rubric_breakdown": [], "strengths": "Clear", "missing_concepts": [], "incorrect_info": [], "suggestions": "None", "ai_explanation": "Accurate"}')
    working_model = MagicMock()
    working_model.generate_content.return_value = good_resp

    with patch("app.services.ai_evaluation_service._get_gemini_model", return_value=working_model):
        r_retry = client.post(f"/api/evaluate/{sheet_id}", headers=th)
        assert r_retry.status_code == 200

    st2 = client.get(f"/api/evaluate/{sheet_id}/status", headers=th).json()
    assert st2["evaluation_status"] == "ai_complete"
    assert st2["total_marks_awarded"] == 8.5
    first_eval_id = st2["evaluation_id"]

    # 3. If a subsequent re-evaluation fails with 503, existing Evaluation must be preserved
    db = TestingSessionLocal()
    sheet = db.query(AnswerSheet).filter(AnswerSheet.id == sheet_id).first()
    sheet.evaluation_status = EvaluationStatus.ai_failed
    db.commit()

    with patch("app.services.ai_evaluation_service._get_gemini_model", return_value=failing_model), \
         patch("app.services.ai_evaluation_service.time.sleep"):
        res_fail = ResultService.run_ai_evaluation(db, sheet_id)
        assert res_fail["success"] is False

    evals = db.query(Evaluation).filter(Evaluation.answer_sheet_id == sheet_id).all()
    assert len(evals) == 1
    assert evals[0].id == first_eval_id
    assert evals[0].total_marks_awarded == 8.5
    db.close()

    # 4. Verify Subject Performance in Teacher Dashboard
    dash = client.get("/api/dashboard/teacher", headers=th).json()
    sp = {item["subject_name"]: item for item in dash["subject_performance"]}
    assert sp["Physics"]["evaluated_count"] == 1
    assert sp["Physics"]["average_percentage"] == 85.0
    assert sp["Chemistry (Empty)"]["evaluated_count"] == 0
    assert sp["Chemistry (Empty)"]["average_percentage"] is None


def test_ocr_question_segmentation_formats():
    samples = [
        ("Q1. Stack is LIFO.\nQ2. Queue is FIFO.", 2, "Stack is LIFO.", "Queue is FIFO."),
        ("Q1: Stack is LIFO.\nQ2: Queue is FIFO.", 2, "Stack is LIFO.", "Queue is FIFO."),
        ("Question 1) Stack is LIFO.\nQuestion 2 - Queue is FIFO.", 2, "Stack is LIFO.", "Queue is FIFO."),
        ("1. Stack is LIFO.\n2) Queue is FIFO.", 2, "Stack is LIFO.", "Queue is FIFO."),
    ]
    for text, count, exp1, exp2 in samples:
        seg = _segment_by_questions(text, count)
        assert seg[1] == exp1, f"Failed for {text!r}: got {seg[1]!r}"
        assert seg[2] == exp2, f"Failed for {text!r}: got {seg[2]!r}"


def test_regression_cleanup():
    app.dependency_overrides.clear()
    engine.dispose()
    if os.path.exists("test_regressions.db"):
        os.remove("test_regressions.db")
    if os.path.exists(settings.UPLOAD_DIR):
        for entry in os.listdir(settings.UPLOAD_DIR):
            full = os.path.join(settings.UPLOAD_DIR, entry)
            if os.path.isdir(full):
                shutil.rmtree(full, ignore_errors=True)

