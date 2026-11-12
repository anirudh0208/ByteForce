"""
Result Service — orchestrates OCR → AI evaluation → result storage pipeline.
"""

import logging
from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from app.database.models import (
    AnswerSheet, Evaluation, EvaluationStatus, ExtractedAnswer,
    Feedback, Question, QuestionResult, UploadStatus
)
from app.services.ocr_service import OCRService
from app.services.ai_evaluation_service import AIEvaluationService

logger = logging.getLogger(__name__)


class ResultService:

    @staticmethod
    def run_ocr(db: Session, answer_sheet_id: str) -> dict:
        """Extract text from an answer sheet and persist extracted answers."""
        sheet = db.query(AnswerSheet).filter(AnswerSheet.id == answer_sheet_id).first()
        if not sheet:
            raise ValueError(f"Answer sheet {answer_sheet_id} not found")

        # Update status
        sheet.evaluation_status = EvaluationStatus.ocr_processing
        db.commit()

        try:
            questions = (
                db.query(Question)
                .filter(Question.exam_id == sheet.exam_id)
                .order_by(Question.order)
                .all()
            )

            ocr_result = OCRService.extract_and_segment(sheet.file_path, questions)

            # Remove old extractions if re-running
            db.query(ExtractedAnswer).filter(
                ExtractedAnswer.answer_sheet_id == answer_sheet_id
            ).delete()

            for q in questions:
                seg_text = ocr_result["segments"].get(q.id, "")
                confidence = ocr_result["confidence"]
                ea = ExtractedAnswer(
                    answer_sheet_id=answer_sheet_id,
                    question_id=q.id,
                    extracted_text=seg_text,
                    confidence=confidence,
                    needs_review=ocr_result["needs_review"],
                )
                db.add(ea)

            sheet.ocr_confidence = ocr_result["confidence"]
            sheet.evaluation_status = EvaluationStatus.ocr_complete
            db.commit()

            return {
                "success": True,
                "confidence": ocr_result["confidence"],
                "needs_review": ocr_result["needs_review"],
                "method": ocr_result["method"],
                "questions_extracted": len(questions),
            }

        except Exception as e:
            logger.error(f"OCR failed for {answer_sheet_id}: {e}")
            sheet.evaluation_status = EvaluationStatus.ocr_failed
            db.commit()
            return {"success": False, "error": str(e)}

    @staticmethod
    def run_ai_evaluation(db: Session, answer_sheet_id: str) -> dict:
        """
        Run AI evaluation on an already-OCR'd answer sheet.
        Creates or replaces the Evaluation and QuestionResult records.
        """
        sheet = db.query(AnswerSheet).filter(AnswerSheet.id == answer_sheet_id).first()
        if not sheet:
            raise ValueError(f"Answer sheet {answer_sheet_id} not found")

        if sheet.evaluation_status not in (
            EvaluationStatus.ocr_complete, EvaluationStatus.ai_failed
        ):
            raise ValueError(
                f"OCR must complete before AI evaluation. Current status: {sheet.evaluation_status}"
            )

        sheet.evaluation_status = EvaluationStatus.ai_evaluating
        db.commit()

        try:
            questions = (
                db.query(Question)
                .filter(Question.exam_id == sheet.exam_id)
                .order_by(Question.order)
                .all()
            )

            # Build lookup maps
            extracted_map = {}
            for ea in sheet.extracted_answers:
                # Use teacher-reviewed text if available
                extracted_map[ea.question_id] = ea.reviewed_text or ea.extracted_text or ""

            ak_map = {}
            for q in questions:
                if q.answer_key:
                    ak_map[q.id] = q.answer_key

            # Run evaluation
            eval_data = AIEvaluationService.evaluate_full_sheet(
                questions=questions,
                extracted_answers=extracted_map,
                answer_keys=ak_map,
            )

            # Remove old evaluation if re-running
            existing_eval = (
                db.query(Evaluation)
                .filter(Evaluation.answer_sheet_id == answer_sheet_id)
                .first()
            )
            if existing_eval:
                db.delete(existing_eval)
                db.flush()

            # Create Evaluation record
            evaluation = Evaluation(
                answer_sheet_id=answer_sheet_id,
                total_marks_awarded=eval_data["total_awarded"],
                total_marks_possible=eval_data["total_possible"],
                percentage=eval_data["percentage"],
                ai_confidence=eval_data["avg_confidence"],
                is_ai_generated=True,
                is_approved=False,
                is_published=False,
            )
            db.add(evaluation)
            db.flush()

            # Create per-question results and feedback
            for q in questions:
                q_eval = eval_data["question_results"].get(q.id)
                if q_eval is None:
                    continue

                qr = QuestionResult(
                    evaluation_id=evaluation.id,
                    question_id=q.id,
                    marks_awarded=q_eval["marks_awarded"],
                    max_marks=q.max_marks,
                    ai_marks_awarded=q_eval["marks_awarded"],
                    ai_confidence=q_eval.get("confidence"),
                    is_modified=False,
                )
                db.add(qr)
                db.flush()

                fb = Feedback(
                    question_result_id=qr.id,
                    strengths=q_eval.get("strengths", ""),
                    missing_concepts=q_eval.get("missing_concepts", []),
                    incorrect_info=q_eval.get("incorrect_info", []),
                    suggestions=q_eval.get("suggestions", ""),
                    rubric_breakdown=q_eval.get("rubric_breakdown", []),
                    ai_explanation=q_eval.get("ai_explanation", ""),
                )
                db.add(fb)

            sheet.evaluation_status = EvaluationStatus.ai_complete
            sheet.upload_status = UploadStatus.complete
            db.commit()

            return {
                "success": True,
                "evaluation_id": evaluation.id,
                "total_marks_awarded": eval_data["total_awarded"],
                "total_marks_possible": eval_data["total_possible"],
                "percentage": eval_data["percentage"],
                "avg_confidence": eval_data["avg_confidence"],
                "is_mock": eval_data["is_mock"],
            }

        except Exception as e:
            logger.error(f"AI evaluation failed for {answer_sheet_id}: {e}")
            sheet.evaluation_status = EvaluationStatus.ai_failed
            db.commit()
            return {"success": False, "error": str(e)}

    @staticmethod
    def approve_result(
        db: Session, result_id: str, teacher_id: str, publish: bool = False
    ) -> Evaluation:
        """Teacher approves (and optionally publishes) an evaluation."""
        evaluation = db.query(Evaluation).filter(Evaluation.id == result_id).first()
        if not evaluation:
            raise ValueError(f"Evaluation {result_id} not found")

        evaluation.is_approved = True
        evaluation.reviewed_by_id = teacher_id
        evaluation.reviewed_at = datetime.utcnow()

        sheet = evaluation.answer_sheet
        sheet.evaluation_status = EvaluationStatus.approved

        if publish:
            evaluation.is_published = True
            evaluation.published_at = datetime.utcnow()
            sheet.evaluation_status = EvaluationStatus.published

        db.commit()
        db.refresh(evaluation)
        return evaluation

    @staticmethod
    def update_marks(
        db: Session, result_id: str, teacher_id: str, question_updates: list
    ) -> Evaluation:
        """
        Allow teacher to modify individual question marks.
        question_updates: [{question_result_id, marks_awarded, teacher_note}]
        """
        evaluation = db.query(Evaluation).filter(Evaluation.id == result_id).first()
        if not evaluation:
            raise ValueError(f"Evaluation {result_id} not found")

        for update in question_updates:
            qr = db.query(QuestionResult).filter(
                QuestionResult.id == update["question_result_id"],
                QuestionResult.evaluation_id == result_id,
            ).first()
            if not qr:
                continue

            new_marks = float(update.get("marks_awarded", qr.marks_awarded))
            # Clamp to max
            new_marks = max(0.0, min(new_marks, qr.max_marks))

            qr.marks_awarded = new_marks
            qr.teacher_note = update.get("teacher_note")
            qr.is_modified = True

        # Recalculate totals
        all_qr = db.query(QuestionResult).filter(
            QuestionResult.evaluation_id == result_id
        ).all()
        total_awarded = sum(r.marks_awarded for r in all_qr)
        total_possible = sum(r.max_marks for r in all_qr)
        evaluation.total_marks_awarded = round(total_awarded, 2)
        evaluation.total_marks_possible = round(total_possible, 2)
        evaluation.percentage = round((total_awarded / total_possible) * 100, 2) if total_possible else 0

        evaluation.reviewed_by_id = teacher_id
        evaluation.reviewed_at = datetime.utcnow()

        sheet = evaluation.answer_sheet
        sheet.evaluation_status = EvaluationStatus.under_review

        db.commit()
        db.refresh(evaluation)
        return evaluation

