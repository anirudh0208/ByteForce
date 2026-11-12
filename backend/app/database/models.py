import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Text, DateTime,
    ForeignKey, Enum as SAEnum, JSON, UniqueConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import enum

from app.database.connection import Base


def generate_uuid():
    return str(uuid.uuid4())


# ─────────────────────────── Enums ───────────────────────────

class UserRole(str, enum.Enum):
    teacher = "teacher"
    student = "student"


class EvaluationStatus(str, enum.Enum):
    pending = "pending"
    ocr_processing = "ocr_processing"
    ocr_complete = "ocr_complete"
    ocr_failed = "ocr_failed"
    ai_evaluating = "ai_evaluating"
    ai_complete = "ai_complete"
    ai_failed = "ai_failed"
    under_review = "under_review"
    approved = "approved"
    published = "published"


class UploadStatus(str, enum.Enum):
    uploaded = "uploaded"
    duplicate = "duplicate"
    failed = "failed"
    processing = "processing"
    complete = "complete"


# ─────────────────────────── Models ───────────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(SAEnum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Teacher owns these
    classes = relationship("Class", back_populates="teacher", foreign_keys="Class.teacher_id")
    exams = relationship("Examination", back_populates="created_by")

    # Student profile (1-to-1)
    student_profile = relationship("Student", back_populates="user", uselist=False)


class Class(Base):
    __tablename__ = "classes"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    teacher_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    teacher = relationship("User", back_populates="classes", foreign_keys=[teacher_id])
    students = relationship("Student", back_populates="class_")
    exams = relationship("Examination", back_populates="class_")


class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, default=generate_uuid)
    student_id = Column(String, unique=True, nullable=False, index=True)  # e.g. "STU001"
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    class_id = Column(String, ForeignKey("classes.id"), nullable=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)  # linked login account
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    class_ = relationship("Class", back_populates="students")
    user = relationship("User", back_populates="student_profile")
    answer_sheets = relationship("AnswerSheet", back_populates="student")


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    code = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    exams = relationship("Examination", back_populates="subject")


class Examination(Base):
    __tablename__ = "examinations"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    subject_id = Column(String, ForeignKey("subjects.id"), nullable=True)
    class_id = Column(String, ForeignKey("classes.id"), nullable=True)
    created_by_id = Column(String, ForeignKey("users.id"), nullable=False)
    total_marks = Column(Float, default=0)
    due_date = Column(DateTime, nullable=True)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    subject = relationship("Subject", back_populates="exams")
    class_ = relationship("Class", back_populates="exams")
    created_by = relationship("User", back_populates="exams")
    questions = relationship("Question", back_populates="exam", cascade="all, delete-orphan", order_by="Question.order")
    upload_batches = relationship("UploadBatch", back_populates="exam")
    answer_sheets = relationship("AnswerSheet", back_populates="exam")


class Question(Base):
    __tablename__ = "questions"

    id = Column(String, primary_key=True, default=generate_uuid)
    exam_id = Column(String, ForeignKey("examinations.id"), nullable=False)
    order = Column(Integer, nullable=False, default=1)
    question_text = Column(Text, nullable=False)
    max_marks = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    exam = relationship("Examination", back_populates="questions")
    answer_key = relationship("AnswerKey", back_populates="question", uselist=False, cascade="all, delete-orphan")
    extracted_answers = relationship("ExtractedAnswer", back_populates="question")
    question_results = relationship("QuestionResult", back_populates="question")


class AnswerKey(Base):
    __tablename__ = "answer_keys"

    id = Column(String, primary_key=True, default=generate_uuid)
    question_id = Column(String, ForeignKey("questions.id"), nullable=False, unique=True)
    model_answer = Column(Text, nullable=False)
    marking_rubric = Column(JSON, nullable=True)  # list of {criterion, marks, description}
    keywords = Column(JSON, nullable=True)         # important keywords to look for
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    question = relationship("Question", back_populates="answer_key")


class UploadBatch(Base):
    __tablename__ = "upload_batches"

    id = Column(String, primary_key=True, default=generate_uuid)
    exam_id = Column(String, ForeignKey("examinations.id"), nullable=False)
    uploaded_by_id = Column(String, ForeignKey("users.id"), nullable=False)
    total_files = Column(Integer, default=0)
    successful = Column(Integer, default=0)
    failed = Column(Integer, default=0)
    duplicates = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    exam = relationship("Examination", back_populates="upload_batches")
    answer_sheets = relationship("AnswerSheet", back_populates="batch")


class AnswerSheet(Base):
    __tablename__ = "answer_sheets"

    id = Column(String, primary_key=True, default=generate_uuid)
    exam_id = Column(String, ForeignKey("examinations.id"), nullable=False)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    batch_id = Column(String, ForeignKey("upload_batches.id"), nullable=True)
    file_path = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    file_hash = Column(String, nullable=True)       # SHA-256 for deduplication
    file_type = Column(String, nullable=False)      # pdf / image
    upload_status = Column(SAEnum(UploadStatus), default=UploadStatus.uploaded)
    evaluation_status = Column(SAEnum(EvaluationStatus), default=EvaluationStatus.pending)
    ocr_confidence = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("exam_id", "student_id", name="uq_exam_student"),
    )

    exam = relationship("Examination", back_populates="answer_sheets")
    student = relationship("Student", back_populates="answer_sheets")
    batch = relationship("UploadBatch", back_populates="answer_sheets")
    extracted_answers = relationship("ExtractedAnswer", back_populates="answer_sheet", cascade="all, delete-orphan")
    evaluation = relationship("Evaluation", back_populates="answer_sheet", uselist=False, cascade="all, delete-orphan")


class ExtractedAnswer(Base):
    __tablename__ = "extracted_answers"

    id = Column(String, primary_key=True, default=generate_uuid)
    answer_sheet_id = Column(String, ForeignKey("answer_sheets.id"), nullable=False)
    question_id = Column(String, ForeignKey("questions.id"), nullable=False)
    extracted_text = Column(Text, nullable=True)
    confidence = Column(Float, nullable=True)
    needs_review = Column(Boolean, default=False)
    reviewed_text = Column(Text, nullable=True)   # teacher-corrected OCR
    created_at = Column(DateTime, default=datetime.utcnow)

    answer_sheet = relationship("AnswerSheet", back_populates="extracted_answers")
    question = relationship("Question", back_populates="extracted_answers")


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(String, primary_key=True, default=generate_uuid)
    answer_sheet_id = Column(String, ForeignKey("answer_sheets.id"), nullable=False, unique=True)
    total_marks_awarded = Column(Float, nullable=True)
    total_marks_possible = Column(Float, nullable=True)
    percentage = Column(Float, nullable=True)
    ai_confidence = Column(Float, nullable=True)      # 0-1 average confidence
    is_ai_generated = Column(Boolean, default=True)
    reviewed_by_id = Column(String, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    is_approved = Column(Boolean, default=False)
    is_published = Column(Boolean, default=False)
    published_at = Column(DateTime, nullable=True)
    overall_feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    answer_sheet = relationship("AnswerSheet", back_populates="evaluation")
    question_results = relationship("QuestionResult", back_populates="evaluation", cascade="all, delete-orphan")
    reviewed_by = relationship("User", foreign_keys=[reviewed_by_id])


class QuestionResult(Base):
    __tablename__ = "question_results"

    id = Column(String, primary_key=True, default=generate_uuid)
    evaluation_id = Column(String, ForeignKey("evaluations.id"), nullable=False)
    question_id = Column(String, ForeignKey("questions.id"), nullable=False)
    marks_awarded = Column(Float, nullable=False, default=0)
    max_marks = Column(Float, nullable=False)
    ai_marks_awarded = Column(Float, nullable=True)   # original AI suggestion
    ai_confidence = Column(Float, nullable=True)
    is_modified = Column(Boolean, default=False)      # teacher changed AI mark
    teacher_note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    evaluation = relationship("Evaluation", back_populates="question_results")
    question = relationship("Question", back_populates="question_results")
    feedback = relationship("Feedback", back_populates="question_result", uselist=False, cascade="all, delete-orphan")


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String, primary_key=True, default=generate_uuid)
    question_result_id = Column(String, ForeignKey("question_results.id"), nullable=False, unique=True)
    strengths = Column(Text, nullable=True)
    missing_concepts = Column(JSON, nullable=True)   # list of strings
    incorrect_info = Column(JSON, nullable=True)      # list of strings
    suggestions = Column(Text, nullable=True)
    rubric_breakdown = Column(JSON, nullable=True)    # criterion-wise marks
    ai_explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    question_result = relationship("QuestionResult", back_populates="feedback")

