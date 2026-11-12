"""
Upload Service — handles bulk file uploads, deduplication and storage.
"""

import hashlib
import logging
import os
import shutil
from pathlib import Path
from typing import List, Tuple

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.models import (
    AnswerSheet, Examination, Student, UploadBatch, UploadStatus
)

logger = logging.getLogger(__name__)


def _file_hash(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _ensure_upload_dir(exam_id: str) -> Path:
    upload_root = Path(settings.UPLOAD_DIR) / exam_id
    upload_root.mkdir(parents=True, exist_ok=True)
    return upload_root


def _infer_student_id_from_filename(filename: str) -> str:
    """
    Convention: filename must start with the student_id.
    Examples:
      STU001_answer.pdf     → STU001
      STU001.pdf            → STU001
      john_doe_STU001.pdf   → STU001 (last segment before extension)
    """
    stem = Path(filename).stem
    parts = stem.replace("-", "_").split("_")
    # Try each part against 'STU' prefix or pure digit
    for part in parts:
        if part.upper().startswith("STU") or part.isdigit():
            return part.upper()
    # Fallback: first segment
    return parts[0].upper()


class UploadService:

    @staticmethod
    async def process_bulk_upload(
        db: Session,
        exam_id: str,
        files: List[UploadFile],
        uploader_id: str,
        student_id_map: dict = None,  # optional override: {filename: student_id}
    ) -> Tuple[UploadBatch, List[dict]]:
        """
        Process multiple file uploads for one exam.

        student_id_map: optional dict mapping filename → student_id.
        If not provided, student IDs are inferred from filenames.
        """
        exam = db.query(Examination).filter(Examination.id == exam_id).first()
        if not exam:
            raise ValueError(f"Exam {exam_id} not found")

        upload_dir = _ensure_upload_dir(exam_id)

        # Create batch record
        batch = UploadBatch(
            exam_id=exam_id,
            uploaded_by_id=uploader_id,
            total_files=len(files),
        )
        db.add(batch)
        db.flush()  # get batch.id

        results = []
        successful = failed = duplicates = 0

        for file in files:
            result = await UploadService._process_single_file(
                db=db,
                file=file,
                exam_id=exam_id,
                batch_id=batch.id,
                upload_dir=upload_dir,
                student_id_map=student_id_map or {},
            )
            results.append(result)
            if result["status"] == UploadStatus.uploaded:
                successful += 1
            elif result["status"] == UploadStatus.duplicate:
                duplicates += 1
            else:
                failed += 1

        batch.successful = successful
        batch.failed = failed
        batch.duplicates = duplicates
        db.commit()

        return batch, results

    @staticmethod
    async def _process_single_file(
        db: Session,
        file: UploadFile,
        exam_id: str,
        batch_id: str,
        upload_dir: Path,
        student_id_map: dict,
    ) -> dict:
        filename = file.filename or "unknown"
        result_base = {"file_name": filename, "answer_sheet_id": None}

        # 1. Validate extension
        ext = Path(filename).suffix.lower().lstrip(".")
        if ext not in settings.allowed_extensions_list:
            return {**result_base, "student_id": "", "status": UploadStatus.failed,
                    "message": f"Unsupported file type: .{ext}"}

        # 2. Read content
        content = await file.read()
        if len(content) > settings.max_file_size_bytes:
            return {**result_base, "student_id": "", "status": UploadStatus.failed,
                    "message": f"File too large ({len(content) // 1024}KB). Max {settings.MAX_FILE_SIZE_MB}MB"}

        # 3. Identify student
        student_id_str = student_id_map.get(filename) or _infer_student_id_from_filename(filename)
        student = db.query(Student).filter(Student.student_id == student_id_str).first()
        if not student:
            return {**result_base, "student_id": student_id_str, "status": UploadStatus.failed,
                    "message": f"Student '{student_id_str}' not found in the system"}

        # 4. Deduplicate by hash
        file_hash = _file_hash(content)
        existing_by_hash = db.query(AnswerSheet).filter(
            AnswerSheet.file_hash == file_hash
        ).first()
        if existing_by_hash:
            return {**result_base, "student_id": student_id_str, "status": UploadStatus.duplicate,
                    "answer_sheet_id": existing_by_hash.id,
                    "message": "Duplicate file (same content already uploaded)"}

        # 5. Check if student already submitted for this exam
        existing_submission = db.query(AnswerSheet).filter(
            AnswerSheet.exam_id == exam_id,
            AnswerSheet.student_id == student.id,
        ).first()
        if existing_submission:
            return {**result_base, "student_id": student_id_str, "status": UploadStatus.duplicate,
                    "answer_sheet_id": existing_submission.id,
                    "message": f"Student {student_id_str} already has an answer sheet for this exam"}

        # 6. Save file to disk
        safe_name = f"{student_id_str}_{file_hash[:8]}{Path(filename).suffix}"
        dest_path = upload_dir / safe_name
        try:
            with open(dest_path, "wb") as f:
                f.write(content)
        except IOError as e:
            logger.error(f"Failed to save {filename}: {e}")
            return {**result_base, "student_id": student_id_str, "status": UploadStatus.failed,
                    "message": f"Storage error: {e}"}

        # 7. Determine file type category
        file_type = "pdf" if ext == "pdf" else "image"

        # 8. Create AnswerSheet record
        sheet = AnswerSheet(
            exam_id=exam_id,
            student_id=student.id,
            batch_id=batch_id,
            file_path=str(dest_path),
            file_name=filename,
            file_hash=file_hash,
            file_type=file_type,
            upload_status=UploadStatus.uploaded,
        )
        db.add(sheet)
        db.flush()

        return {
            **result_base,
            "student_id": student_id_str,
            "status": UploadStatus.uploaded,
            "answer_sheet_id": sheet.id,
            "message": f"Uploaded successfully for student {student_id_str}",
        }

