from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List

from app.core.security import require_teacher, get_current_user
from app.database.connection import get_db
from app.database.models import (
    User, Student, Examination, AnswerSheet, Evaluation,
    EvaluationStatus, Class, Subject
)

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/teacher")
def teacher_dashboard(
    db: Session = Depends(get_db),
    teacher: User = Depends(require_teacher),
):
    """Comprehensive teacher dashboard analytics."""

    # Counts scoped to this teacher's exams
    exam_ids = [
        e.id for e in db.query(Examination.id).filter(
            Examination.created_by_id == teacher.id
        ).all()
    ]

    total_students = db.query(func.count(Student.id)).scalar()
    total_exams = len(exam_ids)

    answer_sheets = db.query(AnswerSheet).filter(
        AnswerSheet.exam_id.in_(exam_ids)
    ).all() if exam_ids else []

    total_sheets = len(answer_sheets)
    evaluated = sum(
        1 for s in answer_sheets
        if s.evaluation_status in (
            EvaluationStatus.ai_complete, EvaluationStatus.under_review,
            EvaluationStatus.approved, EvaluationStatus.published
        )
    )
    pending_evaluation = sum(
        1 for s in answer_sheets
        if s.evaluation_status in (
            EvaluationStatus.pending, EvaluationStatus.ocr_processing,
            EvaluationStatus.ocr_complete, EvaluationStatus.ai_evaluating,
        )
    )
    pending_review = sum(
        1 for s in answer_sheets
        if s.evaluation_status in (
            EvaluationStatus.ai_complete, EvaluationStatus.under_review
        )
    )
    published = sum(
        1 for s in answer_sheets
        if s.evaluation_status == EvaluationStatus.published
    )

    # Average percentage across all published evaluations
    sheet_ids = [s.id for s in answer_sheets]
    published_evals = db.query(Evaluation).filter(
        Evaluation.answer_sheet_id.in_(sheet_ids),
        Evaluation.is_published == True,
    ).all() if sheet_ids else []

    avg_marks = None
    if published_evals:
        total_pct = sum(e.percentage or 0 for e in published_evals)
        avg_marks = round(total_pct / len(published_evals), 2)

    # Recent exams
    recent_exams = (
        db.query(Examination)
        .filter(Examination.created_by_id == teacher.id)
        .order_by(Examination.created_at.desc())
        .limit(5)
        .all()
    )
    recent_exam_data = []
    for ex in recent_exams:
        ex_sheets = [s for s in answer_sheets if s.exam_id == ex.id]
        ex_evaluated = sum(
            1 for s in ex_sheets
            if s.evaluation_status in (
                EvaluationStatus.ai_complete, EvaluationStatus.approved, EvaluationStatus.published
            )
        )
        recent_exam_data.append({
            "exam_id": ex.id,
            "title": ex.title,
            "total_marks": ex.total_marks,
            "is_published": ex.is_published,
            "submission_count": len(ex_sheets),
            "evaluated": ex_evaluated,
            "created_at": ex.created_at.isoformat(),
        })

    # Low-confidence count
    low_conf_count = sum(
        1 for s in answer_sheets
        if s.evaluation and (s.evaluation.ai_confidence or 1.0) < 0.6
        and not s.evaluation.is_approved
    )

    # Subject-wise performance across all subjects
    teacher_exams = db.query(Examination).filter(
        Examination.created_by_id == teacher.id
    ).all()
    all_subjects = db.query(Subject).all()
    subject_performance = []
    for subj in all_subjects:
        subj_exam_ids = {e.id for e in teacher_exams if e.subject_id == subj.id}
        subj_evals = [
            s.evaluation for s in answer_sheets
            if s.exam_id in subj_exam_ids
            and s.evaluation is not None
            and s.evaluation.percentage is not None
        ]
        avg_pct = (
            round(sum(ev.percentage for ev in subj_evals) / len(subj_evals), 2)
            if subj_evals else None
        )
        subject_performance.append({
            "subject_id": subj.id,
            "subject_name": subj.name,
            "subject_code": subj.code,
            "exam_count": len(subj_exam_ids),
            "evaluated_count": len(subj_evals),
            "average_percentage": avg_pct,
        })

    return {
        "total_students": total_students,
        "total_exams": total_exams,
        "total_answer_sheets": total_sheets,
        "evaluated": evaluated,
        "pending_evaluation": pending_evaluation,
        "pending_review": pending_review,
        "published": published,
        "average_class_marks": avg_marks,
        "recent_exams": recent_exam_data,
        "subject_performance": subject_performance,
        "low_confidence_count": low_conf_count,
    }


@router.get("/student")
def student_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Student's personal dashboard."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(403, detail="Student profile not found")

    sheets = db.query(AnswerSheet).filter(AnswerSheet.student_id == student.id).all()
    submitted = len(sheets)
    evaluated = sum(
        1 for s in sheets
        if s.evaluation_status in (
            EvaluationStatus.ai_complete, EvaluationStatus.approved, EvaluationStatus.published
        )
    )

    # Collect published evaluations
    sheet_ids = [s.id for s in sheets]
    pub_evals = db.query(Evaluation).filter(
        Evaluation.answer_sheet_id.in_(sheet_ids),
        Evaluation.is_published == True,
    ).all() if sheet_ids else []

    avg_pct = None
    if pub_evals:
        avg_pct = round(sum(e.percentage or 0 for e in pub_evals) / len(pub_evals), 2)

    recent_results = []
    for ev in sorted(pub_evals, key=lambda x: x.created_at, reverse=True)[:5]:
        sheet = ev.answer_sheet
        exam = db.query(Examination).filter(Examination.id == sheet.exam_id).first()
        recent_results.append({
            "evaluation_id": ev.id,
            "exam_title": exam.title if exam else "Unknown",
            "total_marks_awarded": ev.total_marks_awarded,
            "total_marks_possible": ev.total_marks_possible,
            "percentage": ev.percentage,
            "published_at": ev.published_at.isoformat() if ev.published_at else None,
        })

    return {
        "student_id": student.student_id,
        "full_name": student.full_name,
        "total_exams": db.query(Examination).filter(Examination.is_published == True).count(),
        "submitted": submitted,
        "evaluated": evaluated,
        "average_percentage": avg_pct,
        "recent_results": recent_results,
    }

