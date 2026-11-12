from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.security import get_current_user, require_teacher
from app.database.connection import get_db
from app.database.models import (
    User, Examination, Question, AnswerKey, Subject
)
from app.schemas.exams import (
    ExamCreateRequest, ExamUpdateRequest, ExamResponse,
    QuestionCreateRequest, QuestionResponse,
    SubjectCreateRequest, SubjectResponse,
)

router = APIRouter(prefix="/api/exams", tags=["Examinations"])
subject_router = APIRouter(prefix="/api/subjects", tags=["Subjects"])


# ─── Subjects ─────────────────────────────────────────────────────────

@subject_router.post("", response_model=SubjectResponse, status_code=201)
def create_subject(
    payload: SubjectCreateRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_teacher),
):
    subject = Subject(name=payload.name, code=payload.code)
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject


@subject_router.get("", response_model=List[SubjectResponse])
def list_subjects(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return db.query(Subject).all()


# ─── Examinations ─────────────────────────────────────────────────────

@router.post("", response_model=ExamResponse, status_code=201)
def create_exam(
    payload: ExamCreateRequest,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_teacher),
):
    exam = Examination(
        title=payload.title,
        description=payload.description,
        instructions=payload.instructions,
        subject_id=payload.subject_id,
        class_id=payload.class_id,
        created_by_id=teacher.id,
        due_date=payload.due_date,
    )
    db.add(exam)
    db.flush()

    total_marks = 0.0
    if payload.questions:
        for idx, q_data in enumerate(payload.questions, start=1):
            question = Question(
                exam_id=exam.id,
                order=q_data.order or idx,
                question_text=q_data.question_text,
                max_marks=q_data.max_marks,
            )
            db.add(question)
            db.flush()
            total_marks += q_data.max_marks

            if q_data.answer_key:
                ak = AnswerKey(
                    question_id=question.id,
                    model_answer=q_data.answer_key.model_answer,
                    marking_rubric=[c.dict() for c in (q_data.answer_key.marking_rubric or [])],
                    keywords=q_data.answer_key.keywords,
                )
                db.add(ak)

    exam.total_marks = total_marks
    db.commit()
    db.refresh(exam)
    return exam


def _serialize_exam(exam: Examination, is_student: bool) -> ExamResponse:
    """Serialize an Examination, hiding answer keys from students."""
    resp = ExamResponse.model_validate(exam)
    if is_student:
        for q in resp.questions:
            q.answer_key = None
    return resp


def _serialize_question(question: Question, is_student: bool) -> QuestionResponse:
    """Serialize a Question, hiding answer_key from students."""
    resp = QuestionResponse.model_validate(question)
    if is_student:
        resp.answer_key = None
    return resp


@router.get("", response_model=List[ExamResponse])
def list_exams(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Examination)
    is_student = current_user.role == "student"
    if current_user.role == "teacher":
        q = q.filter(Examination.created_by_id == current_user.id)
    else:
        q = q.filter(Examination.is_published == True)
    return [_serialize_exam(exam, is_student) for exam in q.all()]


@router.get("/{exam_id}", response_model=ExamResponse)
def get_exam(
    exam_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exam = db.query(Examination).filter(Examination.id == exam_id).first()
    if not exam:
        raise HTTPException(404, detail="Exam not found")
    is_student = current_user.role == "student"
    if is_student and not exam.is_published:
        raise HTTPException(403, detail="Exam not yet published")
    return _serialize_exam(exam, is_student)


@router.put("/{exam_id}", response_model=ExamResponse)
def update_exam(
    exam_id: str,
    payload: ExamUpdateRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_teacher),
):
    exam = db.query(Examination).filter(Examination.id == exam_id).first()
    if not exam:
        raise HTTPException(404, detail="Exam not found")
    for field, value in payload.dict(exclude_none=True).items():
        setattr(exam, field, value)
    db.commit()
    db.refresh(exam)
    return exam


@router.post("/{exam_id}/questions", response_model=QuestionResponse, status_code=201)
def add_question(
    exam_id: str,
    payload: QuestionCreateRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_teacher),
):
    exam = db.query(Examination).filter(Examination.id == exam_id).first()
    if not exam:
        raise HTTPException(404, detail="Exam not found")

    # Auto-increment order
    last_order = db.query(Question).filter(
        Question.exam_id == exam_id
    ).count()

    question = Question(
        exam_id=exam_id,
        order=payload.order or (last_order + 1),
        question_text=payload.question_text,
        max_marks=payload.max_marks,
    )
    db.add(question)
    db.flush()

    if payload.answer_key:
        ak = AnswerKey(
            question_id=question.id,
            model_answer=payload.answer_key.model_answer,
            marking_rubric=[c.dict() for c in (payload.answer_key.marking_rubric or [])],
            keywords=payload.answer_key.keywords,
        )
        db.add(ak)

    exam.total_marks += payload.max_marks
    db.commit()
    db.refresh(question)
    return question


@router.get("/{exam_id}/questions", response_model=List[QuestionResponse])
def list_questions(
    exam_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exam = db.query(Examination).filter(Examination.id == exam_id).first()
    if not exam:
        raise HTTPException(404, detail="Exam not found")
    is_student = current_user.role == "student"
    if is_student and not exam.is_published:
        raise HTTPException(403, detail="Exam not yet published")
    questions = (
        db.query(Question)
        .filter(Question.exam_id == exam_id)
        .order_by(Question.order)
        .all()
    )
    return [_serialize_question(q, is_student) for q in questions]

