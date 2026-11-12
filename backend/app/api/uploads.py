from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from app.core.security import require_teacher
from app.database.connection import get_db
from app.database.models import User, UploadBatch, AnswerSheet
from app.services.upload_service import UploadService
from app.schemas.uploads import UploadBatchResponse, FileUploadResult, BatchStatusResponse

router = APIRouter(prefix="/api/upload", tags=["Uploads"])


@router.post("/bulk", response_model=UploadBatchResponse, status_code=201)
async def bulk_upload(
    exam_id: str = Form(...),
    files: List[UploadFile] = File(...),
    student_id_map: Optional[str] = Form(None),  # JSON string: {"filename": "STU001"}
    db: Session = Depends(get_db),
    teacher: User = Depends(require_teacher),
):
    """
    Upload multiple answer sheets for an exam.

    **Student identification:**
    - Option A (recommended): Include student_id_map as JSON.
      e.g. `{"STU001_exam.pdf": "STU001", "john_q2.pdf": "STU002"}`
    - Option B: Name files starting with student ID.
      e.g. `STU001_answers.pdf` or `STU001.pdf`

    Max file size: configured in settings (default 50 MB per file).
    Supported formats: PDF, PNG, JPG, JPEG, WEBP.
    """
    if not files:
        raise HTTPException(400, detail="No files provided")

    sid_map = {}
    if student_id_map:
        try:
            sid_map = json.loads(student_id_map)
        except json.JSONDecodeError:
            raise HTTPException(400, detail="student_id_map must be a valid JSON string")

    try:
        batch, results = await UploadService.process_bulk_upload(
            db=db,
            exam_id=exam_id,
            files=files,
            uploader_id=teacher.id,
            student_id_map=sid_map,
        )
    except ValueError as e:
        raise HTTPException(400, detail=str(e))

    file_results = [
        FileUploadResult(
            file_name=r["file_name"],
            student_id=r["student_id"],
            status=r["status"],
            answer_sheet_id=r.get("answer_sheet_id"),
            message=r["message"],
        )
        for r in results
    ]

    return UploadBatchResponse(
        batch_id=batch.id,
        exam_id=batch.exam_id,
        total_files=batch.total_files,
        successful=batch.successful,
        failed=batch.failed,
        duplicates=batch.duplicates,
        results=file_results,
        created_at=batch.created_at,
    )


@router.get("/{batch_id}/status", response_model=BatchStatusResponse)
def get_batch_status(
    batch_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_teacher),
):
    """Get status of a previously submitted upload batch."""
    batch = db.query(UploadBatch).filter(UploadBatch.id == batch_id).first()
    if not batch:
        raise HTTPException(404, detail="Batch not found")

    sheets = db.query(AnswerSheet).filter(AnswerSheet.batch_id == batch_id).all()
    sheet_data = [
        {
            "answer_sheet_id": s.id,
            "student_id": s.student_id,
            "file_name": s.file_name,
            "upload_status": s.upload_status.value,
            "evaluation_status": s.evaluation_status.value,
            "ocr_confidence": s.ocr_confidence,
        }
        for s in sheets
    ]

    return BatchStatusResponse(
        batch_id=batch.id,
        exam_id=batch.exam_id,
        total_files=batch.total_files,
        successful=batch.successful,
        failed=batch.failed,
        duplicates=batch.duplicates,
        answer_sheets=sheet_data,
        created_at=batch.created_at,
    )

