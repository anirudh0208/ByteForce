"""
GradeX — FastAPI Backend
Main application entry point.
"""

import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.database.connection import create_tables

# API Routers
from app.api.auth import router as auth_router
from app.api.students import router as students_router, class_router
from app.api.exams import router as exams_router, subject_router
from app.api.uploads import router as uploads_router
from app.api.evaluations import router as evaluations_router
from app.api.results import router as results_router
from app.api.dashboard import router as dashboard_router

logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")

    # Ensure upload directory exists
    Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    logger.info(f"Upload directory ready: {settings.UPLOAD_DIR}")

    # Create database tables
    try:
        create_tables()
        logger.info("Database tables created/verified")
    except Exception as e:
        logger.error(f"Database setup failed: {e}")
        logger.warning("Server starting without database — check DATABASE_URL")

    yield

    logger.info("GradeX shutting down")


# ─── App instance ─────────────────────────────────────────────────────

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
## GradeX — Backend API

An AI-powered answer sheet evaluation platform for teachers and students.

### Key Features
- **Authentication**: JWT-based login for teachers and students
- **Exam Management**: Create exams, questions, answer keys and rubrics
- **Bulk Uploads**: Upload multiple student answer sheets at once
- **OCR**: Extract text from PDF and image answer sheets
- **AI Evaluation**: Gemini-powered semantic evaluation against rubrics
- **Review Queue**: Teacher review and approval workflow
- **Results**: Question-wise marks and feedback for students
- **Analytics**: Class performance dashboard

### Authentication
All protected endpoints require a Bearer token obtained from `/api/auth/login`.
""",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# ─── CORS ─────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Static files (uploaded documents) ───────────────────────────────

uploads_dir = Path(settings.UPLOAD_DIR)
uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

# ─── Routers ──────────────────────────────────────────────────────────

app.include_router(auth_router)
app.include_router(students_router)
app.include_router(class_router)
app.include_router(exams_router)
app.include_router(subject_router)
app.include_router(uploads_router)
app.include_router(evaluations_router)
app.include_router(results_router)
app.include_router(dashboard_router)


# ─── Health check ─────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health():
    from app.database.connection import engine
    db_ok = False
    try:
        with engine.connect() as conn:
            conn.execute(__import__("sqlalchemy").text("SELECT 1"))
        db_ok = True
    except Exception:
        pass

    gemini_configured = bool(
        settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your-gemini-api-key-here"
    )

    return {
        "status": "healthy" if db_ok else "degraded",
        "database": "connected" if db_ok else "disconnected",
        "gemini": "configured" if gemini_configured else "not_configured (mock mode)",
        "version": settings.APP_VERSION,
    }

