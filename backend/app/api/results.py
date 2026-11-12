from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.security import require_teacher, get_current_user
from app.database.connection import get_db
from app.database.models import (
    User, Evaluation, AnswerSheet, Student, EvaluationStatus
)
from app.services.result_service import ResultService
from app.schemas.evaluations import (
    EvaluationResponse, MarkUpdateRequest, ApproveRequest
)

router = APIRouter(prefix="/api/results", tags=["Results"])


@router.get("/{result_id}", response_model=EvaluationResponse)
def get_result(
    result_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a full evaluation result with question-wise marks and feedback."""
    evaluation = db.query(Evaluation).filter(Evaluation.id == result_id).first()
    if not evaluation:
        raise HTTPException(404, detail="Result not found")

    # Students can only see published results for their own sheets
    if current_user.role == "student":
        sheet = evaluation.answer_sheet
        student = db.query(Student).filter(
            Student.user_id == current_user.id
        ).first()
        if not student or sheet.student_id != student.id:
            raise HTTPException(403, detail="Access denied")
        if not evaluation.is_published:
            raise HTTPException(403, detail="Results not yet published by teacher")

    return evaluation


@router.get("/exam/{exam_id}", response_model=List[EvaluationResponse])
def get_exam_results(
    exam_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all evaluation results for an exam (teacher) or own result (student)."""
    if current_user.role == "teacher":
        sheets = db.query(AnswerSheet).filter(AnswerSheet.exam_id == exam_id).all()
        sheet_ids = [s.id for s in sheets]
        return db.query(Evaluation).filter(
            Evaluation.answer_sheet_id.in_(sheet_ids)
        ).all()
    else:
        # Students get only their own published result
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if not student:
            raise HTTPException(403, detail="Student profile not found")
        sheet = db.query(AnswerSheet).filter(
            AnswerSheet.exam_id == exam_id,
            AnswerSheet.student_id == student.id,
        ).first()
        if not sheet:
            return []
        evaluations = db.query(Evaluation).filter(
            Evaluation.answer_sheet_id == sheet.id,
            Evaluation.is_published == True,
        ).all()
        return evaluations


@router.put("/{result_id}/marks", response_model=EvaluationResponse)
def update_marks(
    result_id: str,
    payload: MarkUpdateRequest,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_teacher),
):
    """
    Teacher modifies individual question marks.

    Request body:
    ```json
    {
      "question_results": [
        {"question_result_id": "...", "marks_awarded": 4.5, "teacher_note": "Partial credit"}
      ]
    }
    ```
    """
    try:
        evaluation = ResultService.update_marks(
            db=db,
            result_id=result_id,
            teacher_id=teacher.id,
            question_updates=payload.question_results,
        )
    except ValueError as e:
        raise HTTPException(404, detail=str(e))
    return evaluation


@router.post("/{result_id}/approve", response_model=EvaluationResponse)
def approve_result(
    result_id: str,
    payload: ApproveRequest,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_teacher),
):
    """
    Teacher approves an AI evaluation.
    Set `publish_immediately: true` to also publish it to the student.
    """
    try:
        evaluation = ResultService.approve_result(
            db=db,
            result_id=result_id,
            teacher_id=teacher.id,
            publish=payload.publish_immediately,
        )
    except ValueError as e:
        raise HTTPException(404, detail=str(e))
    return evaluation


@router.post("/{result_id}/publish", response_model=EvaluationResponse)
def publish_result(
    result_id: str,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_teacher),
):
    """Publish an approved evaluation so the student can see it."""
    evaluation = db.query(Evaluation).filter(Evaluation.id == result_id).first()
    if not evaluation:
        raise HTTPException(404, detail="Result not found")
    if not evaluation.is_approved:
        raise HTTPException(400, detail="Result must be approved before publishing")

    from datetime import datetime
    evaluation.is_published = True
    evaluation.published_at = datetime.utcnow()
    evaluation.answer_sheet.evaluation_status = EvaluationStatus.published
    db.commit()
    db.refresh(evaluation)
    return evaluation


@router.get("/review-queue/pending", response_model=List[dict])
def get_review_queue(
    exam_id: str = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_teacher),
):
    """Get all evaluations pending teacher review (AI complete, low confidence, or under review)."""
    q = db.query(Evaluation).join(AnswerSheet).filter(
        Evaluation.is_approved == False,
        AnswerSheet.evaluation_status.in_([
            EvaluationStatus.ai_complete,
            EvaluationStatus.under_review,
        ])
    )
    if exam_id:
        q = q.filter(AnswerSheet.exam_id == exam_id)

    evaluations = q.all()
    result = []
    for ev in evaluations:
        sheet = ev.answer_sheet
        student = db.query(Student).filter(Student.id == sheet.student_id).first()
        result.append({
            "evaluation_id": ev.id,
            "answer_sheet_id": sheet.id,
            "student_id": student.student_id if student else None,
            "student_name": student.full_name if student else None,
            "exam_id": sheet.exam_id,
            "total_marks_awarded": ev.total_marks_awarded,
            "total_marks_possible": ev.total_marks_possible,
            "percentage": ev.percentage,
            "ai_confidence": ev.ai_confidence,
            "evaluation_status": sheet.evaluation_status.value,
            "needs_review": (ev.ai_confidence or 1.0) < 0.6,
        })
    return result

