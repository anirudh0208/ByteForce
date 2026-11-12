from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class RubricCriterion(BaseModel):
    criterion: str
    marks: float
    description: Optional[str] = None


class AnswerKeyCreateRequest(BaseModel):
    model_answer: str
    marking_rubric: Optional[List[RubricCriterion]] = None
    keywords: Optional[List[str]] = None


class QuestionCreateRequest(BaseModel):
    question_text: str
    max_marks: float
    order: Optional[int] = None
    answer_key: Optional[AnswerKeyCreateRequest] = None


class AnswerKeyResponse(BaseModel):
    id: str
    question_id: str
    model_answer: str
    marking_rubric: Optional[List[Any]] = None
    keywords: Optional[List[str]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class QuestionResponse(BaseModel):
    id: str
    exam_id: str
    order: int
    question_text: str
    max_marks: float
    answer_key: Optional[AnswerKeyResponse] = None
    created_at: datetime

    class Config:
        from_attributes = True


class SubjectCreateRequest(BaseModel):
    name: str
    code: Optional[str] = None


class SubjectResponse(BaseModel):
    id: str
    name: str
    code: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ExamCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    subject_id: Optional[str] = None
    class_id: Optional[str] = None
    due_date: Optional[datetime] = None
    questions: Optional[List[QuestionCreateRequest]] = None


class ExamUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    due_date: Optional[datetime] = None
    is_published: Optional[bool] = None


class ExamResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    instructions: Optional[str]
    subject_id: Optional[str]
    class_id: Optional[str]
    created_by_id: str
    total_marks: float
    due_date: Optional[datetime]
    is_published: bool
    questions: List[QuestionResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

