from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import List

from app.core.security import get_current_user, require_teacher, hash_password
from app.database.connection import get_db
from app.database.models import User, Student, Class, UserRole
from app.schemas.students import (
    StudentCreateRequest, StudentUpdateRequest, StudentResponse,
    ClassCreateRequest, ClassResponse,
)

router = APIRouter(prefix="/api/students", tags=["Students"])
class_router = APIRouter(prefix="/api/classes", tags=["Classes"])


# ─── Classes ──────────────────────────────────────────────────────────

@class_router.post("", response_model=ClassResponse, status_code=201)
def create_class(
    payload: ClassCreateRequest,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_teacher),
):
    cls = Class(name=payload.name, description=payload.description, teacher_id=teacher.id)
    db.add(cls)
    db.commit()
    db.refresh(cls)
    return cls


@class_router.get("", response_model=List[ClassResponse])
def list_classes(
    db: Session = Depends(get_db),
    teacher: User = Depends(require_teacher),
):
    return db.query(Class).filter(Class.teacher_id == teacher.id).all()


# ─── Students ─────────────────────────────────────────────────────────

@router.post("", response_model=StudentResponse, status_code=201)
def create_student(
    payload: StudentCreateRequest,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_teacher),
):
    # Check for duplicate student_id or email
    if db.query(Student).filter(Student.student_id == payload.student_id).first():
        raise HTTPException(400, detail=f"Student ID '{payload.student_id}' already exists")
    if db.query(Student).filter(Student.email == payload.email).first():
        raise HTTPException(400, detail=f"Email '{payload.email}' already registered")

    user_id = None
    if payload.create_login:
        if not payload.login_password:
            raise HTTPException(400, detail="login_password is required when create_login=true")
        if db.query(User).filter(User.email == payload.email).first():
            raise HTTPException(400, detail=f"Login account for '{payload.email}' already exists")
        user = User(
            email=payload.email,
            hashed_password=hash_password(payload.login_password),
            full_name=payload.full_name,
            role=UserRole.student,
        )
        db.add(user)
        db.flush()
        user_id = user.id

    student = Student(
        student_id=payload.student_id,
        full_name=payload.full_name,
        email=payload.email,
        class_id=payload.class_id,
        user_id=user_id,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@router.get("", response_model=List[StudentResponse])
def list_students(
    class_id: str = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_teacher),
):
    q = db.query(Student)
    if class_id:
        q = q.filter(Student.class_id == class_id)
    return q.all()


@router.get("/{student_id}", response_model=StudentResponse)
def get_student(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    student = db.query(Student).filter(
        or_(Student.id == student_id, Student.student_id == student_id)
    ).first()
    if not student:
        raise HTTPException(404, detail="Student not found")

    # Students can only fetch their own record
    if current_user.role == "student":
        if student.user_id != current_user.id:
            raise HTTPException(403, detail="Access denied")

    return student


@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: str,
    payload: StudentUpdateRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_teacher),
):
    student = db.query(Student).filter(
        or_(Student.id == student_id, Student.student_id == student_id)
    ).first()
    if not student:
        raise HTTPException(404, detail="Student not found")

    for field, value in payload.dict(exclude_none=True).items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return student

