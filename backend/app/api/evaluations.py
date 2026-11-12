from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from sqlalchemy.orm import Session
from typing import List

from app.core.security import require_teacher, get_current_user
from app.database.connection import get_db
from app.database.models import (
    User, AnswerSheet, Evaluation, EvaluationStatus
)
from app.services.result_service import ResultService
from app.schemas.evaluations import (
    EvaluationStatusResponse, EvaluationResponse,
    MarkUpdateRequest, ApproveRequest,
)

router = APIRouter(prefix="/api/evaluate", tags=["Evaluation"])


def _run_full_pipeline(answer_sheet_id: str, get_db_fn):
    """Background task: OCR → AI evaluation with its own DB session."""
    gen = get_db_fn()
    db = next(gen)
    try:
        ocr_result = ResultService.run_ocr(db, answer_sheet_id)
        if ocr_result["success"]:
            ResultService.run_ai_evaluation(db, answer_sheet_id)
    finally:
        try:
            next(gen)
        except StopIteration:
            pass


@router.post("/{answer_sheet_id}", response_model=dict)
def trigger_evaluation(
    answer_sheet_id: str,
    background_tasks: BackgroundTasks,
    request: Request,
    db: Session = Depends(get_db),
    _: User = Depends(require_teacher),
):
    """
    Trigger OCR + AI evaluation for a single answer sheet.
    Processing runs asynchronously in the background.
    Poll /status to check progress.
    """
    sheet = db.query(AnswerSheet).filter(AnswerSheet.id == answer_sheet_id).first()
    if not sheet:
        raise HTTPException(404, detail="Answer sheet not found")

    if sheet.evaluation_status in (
        EvaluationStatus.ocr_processing, EvaluationStatus.ai_evaluating
    ):
        raise HTTPException(409, detail="Evaluation already in progress")

    get_db_fn = request.app.dependency_overrides.get(get_db, get_db)
    background_tasks.add_task(_run_full_pipeline, answer_sheet_id, get_db_fn)

    return {
        "message": "Evaluation started",
        "answer_sheet_id": answer_sheet_id,
        "status": "processing",
    }


@router.post("/exam/{exam_id}/all", response_model=dict)
def trigger_bulk_evaluation(
    exam_id: str,
    background_tasks: BackgroundTasks,
    request: Request,
    db: Session = Depends(get_db),
    _: User = Depends(require_teacher),
):
    """Trigger evaluation for all pending answer sheets in an exam."""
    pending_sheets = (
        db.query(AnswerSheet)
        .filter(
            AnswerSheet.exam_id == exam_id,
            AnswerSheet.evaluation_status.in_([
                EvaluationStatus.pending,
                EvaluationStatus.ocr_failed,
                EvaluationStatus.ai_failed,
            ]),
        )
        .all()
    )

    get_db_fn = request.app.dependency_overrides.get(get_db, get_db)
    for sheet in pending_sheets:
        background_tasks.add_task(_run_full_pipeline, sheet.id, get_db_fn)

    return {
        "message": f"Evaluation triggered for {len(pending_sheets)} answer sheets",
        "exam_id": exam_id,
        "count": len(pending_sheets),
    }


@router.get("/{answer_sheet_id}/status", response_model=EvaluationStatusResponse)
def get_evaluation_status(
    answer_sheet_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Check the OCR/evaluation status of an answer sheet."""
    sheet = db.query(AnswerSheet).filter(AnswerSheet.id == answer_sheet_id).first()
    if not sheet:
        raise HTTPException(404, detail="Answer sheet not found")

    evaluation = sheet.evaluation
    return EvaluationStatusResponse(
        answer_sheet_id=sheet.id,
        student_id=sheet.student_id,
        evaluation_status=sheet.evaluation_status,
        evaluation_id=evaluation.id if evaluation else None,
        total_marks_awarded=evaluation.total_marks_awarded if evaluation else None,
        total_marks_possible=evaluation.total_marks_possible if evaluation else None,
        percentage=evaluation.percentage if evaluation else None,
        is_approved=evaluation.is_approved if evaluation else None,
        is_published=evaluation.is_published if evaluation else None,
    )

