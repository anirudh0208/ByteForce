from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.database.models import UploadStatus


class FileUploadResult(BaseModel):
    file_name: str
    student_id: str
    status: UploadStatus
    answer_sheet_id: Optional[str] = None
    message: str


class UploadBatchResponse(BaseModel):
    batch_id: str
    exam_id: str
    total_files: int
    successful: int
    failed: int
    duplicates: int
    results: List[FileUploadResult]
    created_at: datetime

    class Config:
        from_attributes = True


class BatchStatusResponse(BaseModel):
    batch_id: str
    exam_id: str
    total_files: int
    successful: int
    failed: int
    duplicates: int
    answer_sheets: List[dict]
    created_at: datetime

