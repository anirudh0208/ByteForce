from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime
from app.database.models import EvaluationStatus


class EvaluationStatusResponse(BaseModel):
    answer_sheet_id: str
    student_id: str
    evaluation_status: EvaluationStatus
    evaluation_id: Optional[str]
    total_marks_awarded: Optional[float]
    total_marks_possible: Optional[float]
    percentage: Optional[float]
    is_approved: Optional[bool]
    is_published: Optional[bool]

    class Config:
        from_attributes = True


class FeedbackResponse(BaseModel):
    id: str
    strengths: Optional[str]
    missing_concepts: Optional[List[str]]
    incorrect_info: Optional[List[str]]
    suggestions: Optional[str]
    rubric_breakdown: Optional[Any]
    ai_explanation: Optional[str]

    class Config:
        from_attributes = True


class QuestionResultResponse(BaseModel):
    id: str
    question_id: str
    marks_awarded: float
    max_marks: float
    ai_marks_awarded: Optional[float]
    ai_confidence: Optional[float]
    is_modified: bool
    teacher_note: Optional[str]
    feedback: Optional[FeedbackResponse]

    class Config:
        from_attributes = True


class EvaluationResponse(BaseModel):
    id: str
    answer_sheet_id: str
    total_marks_awarded: Optional[float]
    total_marks_possible: Optional[float]
    percentage: Optional[float]
    ai_confidence: Optional[float]
    is_ai_generated: bool
    is_approved: bool
    is_published: bool
    overall_feedback: Optional[str]
    reviewed_at: Optional[datetime]
    published_at: Optional[datetime]
    question_results: List[QuestionResultResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


class MarkUpdateRequest(BaseModel):
    question_results: List[dict]  # [{question_result_id, marks_awarded, teacher_note}]


class ApproveRequest(BaseModel):
    publish_immediately: bool = False

