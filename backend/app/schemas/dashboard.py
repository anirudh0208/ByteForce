from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class TeacherDashboardResponse(BaseModel):
    total_students: int
    total_exams: int
    total_answer_sheets: int
    evaluated: int
    pending_evaluation: int
    pending_review: int
    published: int
    average_class_marks: Optional[float]
    recent_exams: List[dict]
    subject_performance: List[dict]
    low_confidence_count: int


class StudentDashboardResponse(BaseModel):
    student_id: str
    full_name: str
    total_exams: int
    submitted: int
    evaluated: int
    average_percentage: Optional[float]
    recent_results: List[dict]


class StudentPerformanceResponse(BaseModel):
    student_id: str
    full_name: str
    exam_results: List[dict]
    overall_average: Optional[float]

