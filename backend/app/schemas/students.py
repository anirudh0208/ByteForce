from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class StudentCreateRequest(BaseModel):
    student_id: str           # e.g. "STU001" - used in filenames for upload mapping
    full_name: str
    email: EmailStr
    class_id: Optional[str] = None
    create_login: bool = False   # if true, also creates a User account
    login_password: Optional[str] = None


class StudentUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    class_id: Optional[str] = None


class StudentResponse(BaseModel):
    id: str
    student_id: str
    full_name: str
    email: str
    class_id: Optional[str]
    user_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ClassCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None


class ClassResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    teacher_id: str
    created_at: datetime

    class Config:
        from_attributes = True

