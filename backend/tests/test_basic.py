"""
Basic smoke tests for GradeX backend.
Run with:  uv run pytest tests/ -v
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database.connection import Base, get_db

# ─── Test database setup ─────────────────────────────────────────────

SQLITE_TEST_URL = "sqlite:///./test_gradewise.db"
engine = create_engine(SQLITE_TEST_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

Base.metadata.create_all(bind=engine)

client = TestClient(app)


# ─── Health ───────────────────────────────────────────────────────────

def test_root():
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["app"] == "GradeX"


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert "status" in r.json()


# ─── Auth ─────────────────────────────────────────────────────────────

TEACHER_EMAIL = "testteacher@example.com"
TEACHER_PASS = "TestPass123"
STUDENT_EMAIL = "teststudent@example.com"
STUDENT_PASS = "StudentPass123"


def test_register_teacher():
    r = client.post("/api/auth/register", json={
        "email": TEACHER_EMAIL,
        "password": TEACHER_PASS,
        "full_name": "Test Teacher",
        "role": "teacher",
    })
    assert r.status_code == 201
    assert r.json()["email"] == TEACHER_EMAIL


def test_register_duplicate_email():
    r = client.post("/api/auth/register", json={
        "email": TEACHER_EMAIL,
        "password": TEACHER_PASS,
        "full_name": "Duplicate",
        "role": "teacher",
    })
    assert r.status_code == 400


def test_login_teacher():
    r = client.post("/api/auth/login", json={
        "email": TEACHER_EMAIL,
        "password": TEACHER_PASS,
    })
    assert r.status_code == 200
    data = r.json()
    assert "access_token" in data
    assert data["role"] == "teacher"
    return data["access_token"]


def test_login_wrong_password():
    r = client.post("/api/auth/login", json={
        "email": TEACHER_EMAIL,
        "password": "wrongpassword",
    })
    assert r.status_code == 401


# ─── Students ─────────────────────────────────────────────────────────

def _teacher_token():
    r = client.post("/api/auth/login", json={
        "email": TEACHER_EMAIL,
        "password": TEACHER_PASS,
    })
    return r.json()["access_token"]


def test_create_student():
    token = _teacher_token()
    r = client.post("/api/students", json={
        "student_id": "STU999",
        "full_name": "Test Student",
        "email": STUDENT_EMAIL,
    }, headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 201
    assert r.json()["student_id"] == "STU999"


def test_list_students():
    token = _teacher_token()
    r = client.get("/api/students", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert isinstance(r.json(), list)


# ─── Exams ────────────────────────────────────────────────────────────

def test_create_exam():
    token = _teacher_token()
    r = client.post("/api/exams", json={
        "title": "Test Exam",
        "description": "A simple test exam",
        "questions": [
            {
                "question_text": "What is 2+2?",
                "max_marks": 5,
                "answer_key": {
                    "model_answer": "4",
                    "marking_rubric": [{"criterion": "Correct answer", "marks": 5}],
                },
            }
        ],
    }, headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 201
    data = r.json()
    assert data["title"] == "Test Exam"
    assert data["total_marks"] == 5.0
    return data["id"]


def test_list_exams():
    token = _teacher_token()
    r = client.get("/api/exams", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200


def test_teacher_dashboard():
    token = _teacher_token()
    r = client.get("/api/dashboard/teacher", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    data = r.json()
    assert "total_students" in data
    assert "total_exams" in data


# ─── End-to-End Upload, OCR, Evaluation, Results & Student Flow ───────

def _make_sample_pdf(text: str) -> bytes:
    import fitz
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), text)
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes


def test_full_evaluation_workflow():
    token = _teacher_token()
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create a student with login account
    r = client.post("/api/students", json={
        "student_id": "STU101",
        "full_name": "E2E Student",
        "email": "e2estudent@example.com",
        "create_login": True,
        "login_password": STUDENT_PASS,
    }, headers=headers)
    assert r.status_code == 201

    # 2. Create exam with 2 questions
    r = client.post("/api/exams", json={
        "title": "E2E Biology Exam",
        "questions": [
            {
                "question_text": "What is photosynthesis?",
                "max_marks": 10,
                "answer_key": {
                    "model_answer": "Process by which plants convert light energy into chemical energy.",
                    "marking_rubric": [{"criterion": "Core definition", "marks": 10}],
                },
            },
            {
                "question_text": "Name the organelle where photosynthesis occurs.",
                "max_marks": 5,
                "answer_key": {
                    "model_answer": "Chloroplast",
                    "marking_rubric": [{"criterion": "Organelle", "marks": 5}],
                },
            },
        ],
    }, headers=headers)
    assert r.status_code == 201
    exam_id = r.json()["id"]

    # 3. Bulk upload PDF for STU101
    pdf_bytes = _make_sample_pdf(
        "Q1. Photosynthesis is how plants use sunlight to make glucose from CO2 and water.\n"
        "Q2. It happens in the chloroplast."
    )
    r = client.post(
        "/api/upload/bulk",
        data={"exam_id": exam_id},
        files=[("files", ("STU101_biology.pdf", pdf_bytes, "application/pdf"))],
        headers=headers,
    )
    assert r.status_code == 201
    upload_data = r.json()
    assert upload_data["successful"] == 1
    sheet_id = upload_data["results"][0]["answer_sheet_id"]
    batch_id = upload_data["batch_id"]

    # 4. Duplicate upload is detected
    r_dup = client.post(
        "/api/upload/bulk",
        data={"exam_id": exam_id},
        files=[("files", ("STU101_biology.pdf", pdf_bytes, "application/pdf"))],
        headers=headers,
    )
    assert r_dup.status_code == 201
    assert r_dup.json()["duplicates"] == 1

    # 5. Check batch status
    r_batch = client.get(f"/api/upload/{batch_id}/status", headers=headers)
    assert r_batch.status_code == 200
    assert len(r_batch.json()["answer_sheets"]) == 1

    # 6. Trigger evaluation (runs deterministically with mock model in unit tests)
    from unittest.mock import patch
    with patch("app.services.ai_evaluation_service._get_gemini_model", return_value=None):
        r_eval = client.post(f"/api/evaluate/{sheet_id}", headers=headers)
    assert r_eval.status_code == 200

    # 7. Check evaluation status
    r_status = client.get(f"/api/evaluate/{sheet_id}/status", headers=headers)
    assert r_status.status_code == 200
    status_data = r_status.json()
    assert status_data["evaluation_status"] == "ai_complete"
    result_id = status_data["evaluation_id"]
    assert result_id is not None

    # 8. Check review queue
    r_queue = client.get("/api/results/review-queue/pending", headers=headers)
    assert r_queue.status_code == 200
    assert any(item["evaluation_id"] == result_id for item in r_queue.json())

    # 9. Student cannot view unpublished result
    r_stu_login = client.post("/api/auth/login", json={
        "email": "e2estudent@example.com",
        "password": STUDENT_PASS,
    })
    assert r_stu_login.status_code == 200
    stu_headers = {"Authorization": f"Bearer {r_stu_login.json()['access_token']}"}
    r_forbidden = client.get(f"/api/results/{result_id}", headers=stu_headers)
    assert r_forbidden.status_code == 403

    # 10. Teacher gets result, modifies marks, approves & publishes
    r_res = client.get(f"/api/results/{result_id}", headers=headers)
    assert r_res.status_code == 200
    qr_id = r_res.json()["question_results"][0]["id"]

    r_mod = client.put(f"/api/results/{result_id}/marks", json={
        "question_results": [
            {"question_result_id": qr_id, "marks_awarded": 9.0, "teacher_note": "Well explained"}
        ]
    }, headers=headers)
    assert r_mod.status_code == 200
    assert r_mod.json()["question_results"][0]["is_modified"] is True

    r_app = client.post(f"/api/results/{result_id}/approve", json={
        "publish_immediately": True
    }, headers=headers)
    assert r_app.status_code == 200
    assert r_app.json()["is_approved"] is True
    assert r_app.json()["is_published"] is True

    # 11. Student can now view published result & dashboard
    r_stu_res = client.get(f"/api/results/{result_id}", headers=stu_headers)
    assert r_stu_res.status_code == 200
    r_stu_dash = client.get("/api/dashboard/student", headers=stu_headers)
    assert r_stu_dash.status_code == 200
    assert r_stu_dash.json()["evaluated"] >= 1


# ─── Cleanup ──────────────────────────────────────────────────────────

def test_cleanup():
    import os
    import shutil
    engine.dispose()
    if os.path.exists("test_gradewise.db"):
        os.remove("test_gradewise.db")
    # Clean up uploaded test files if created
    from app.core.config import settings
    if os.path.exists(settings.UPLOAD_DIR):
        for entry in os.listdir(settings.UPLOAD_DIR):
            full = os.path.join(settings.UPLOAD_DIR, entry)
            if os.path.isdir(full):
                shutil.rmtree(full, ignore_errors=True)

