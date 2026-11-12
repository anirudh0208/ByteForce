# GradeX — Backend

> **AI-powered answer sheet evaluation platform built with FastAPI + PostgreSQL + Google Gemini**

---

## Quick Start

### Prerequisites

| Requirement | Notes |
|---|---|
| Python 3.11+ | Installed via `uv` (see below) |
| PostgreSQL | Local or Docker |
| Google Gemini API Key | Optional for MVP (mock mode available) |
| Tesseract OCR | Optional — for image/handwritten OCR |

### 1. Install `uv` (Python package manager)

```powershell
# Windows PowerShell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
$env:PATH = "$HOME\.local\bin;" + $env:PATH
```

### 2. Set up PostgreSQL

```sql
CREATE USER gradewise WITH PASSWORD 'gradewise123';
CREATE DATABASE gradewise_db OWNER gradewise;
```

Or using Docker:

```bash
docker run -d --name gradewise-db \
  -e POSTGRES_USER=gradewise \
  -e POSTGRES_PASSWORD=gradewise123 \
  -e POSTGRES_DB=gradewise_db \
  -p 5432:5432 \
  postgres:16
```

### 3. Configure environment

```powershell
cd backend
copy .env.example .env
# Edit .env — set DATABASE_URL and GEMINI_API_KEY
```

### 4. Install dependencies

```powershell
cd backend
uv venv --python 3.11
uv pip install -r requirements.txt
```

### 5. Start the server

```powershell
# Option A — using the startup script
.\start.bat

# Option B — manually
$env:PATH = "$HOME\.local\bin;" + $env:PATH
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at **http://localhost:8000**

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health check:** http://localhost:8000/health

### 6. Seed sample data (optional)

```powershell
uv run python -m app.utils.seed_db
```

This creates:
- Teacher account: `teacher@gradewise.ai` / `teacher123`
- 3 Student accounts: `alice@student.edu` / `student123` etc.
- A sample exam with questions and answer keys

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string |
| `SECRET_KEY` | (required) | JWT signing secret (min 32 chars) |
| `GEMINI_API_KEY` | (optional) | Google Gemini API key |
| `UPLOAD_DIR` | `uploads` | Directory for answer sheet files |
| `MAX_FILE_SIZE_MB` | `50` | Per-file upload limit |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allowed origin |

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register teacher or student |
| POST | `/api/auth/login` | Login and get JWT token |

### Students & Classes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/students` | Create student record |
| GET | `/api/students` | List all students |
| GET | `/api/students/{id}` | Get student by ID |
| PUT | `/api/students/{id}` | Update student |
| POST | `/api/classes` | Create a class |
| GET | `/api/classes` | List classes |

### Examinations

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/exams` | Create exam with questions |
| GET | `/api/exams` | List exams |
| GET | `/api/exams/{id}` | Get exam details |
| PUT | `/api/exams/{id}` | Update exam |
| POST | `/api/exams/{id}/questions` | Add question to exam |
| GET | `/api/exams/{id}/questions` | List exam questions |

### Subjects

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/subjects` | Create subject |
| GET | `/api/subjects` | List subjects |

### Bulk Upload

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload/bulk` | Upload multiple answer sheets |
| GET | `/api/upload/{batch_id}/status` | Check upload batch status |

**Student identification in filenames:**
Files must start with the student ID, e.g., `STU001_answers.pdf`.
Alternatively, provide a JSON `student_id_map` field in the form.

### Evaluation

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/evaluate/{sheet_id}` | Trigger OCR + AI evaluation |
| POST | `/api/evaluate/exam/{exam_id}/all` | Evaluate all pending sheets |
| GET | `/api/evaluate/{sheet_id}/status` | Check evaluation status |

### Results

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/results/{result_id}` | Get full evaluation with feedback |
| GET | `/api/results/exam/{exam_id}` | Get all results for exam |
| PUT | `/api/results/{result_id}/marks` | Teacher modifies marks |
| POST | `/api/results/{result_id}/approve` | Teacher approves evaluation |
| POST | `/api/results/{result_id}/publish` | Publish result to student |
| GET | `/api/results/review-queue/pending` | Get review queue |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/teacher` | Teacher analytics |
| GET | `/api/dashboard/student` | Student performance |

---

## Workflow

```
Teacher creates exam → Adds questions + answer keys + rubric
         ↓
Teacher uploads bulk answer sheets (PDF/image)
         ↓
System runs OCR (PyMuPDF + Tesseract)
         ↓
Gemini AI evaluates each question → marks + feedback
         ↓
Teacher reviews via Review Queue → modifies if needed → approves
         ↓
Teacher publishes → Students view marks + feedback
```

---

## AI Evaluation

GradeX uses **Google Gemini** for semantic answer evaluation.

**Without `GEMINI_API_KEY`:** A clearly labelled mock evaluator runs automatically — results are marked `⚠️ MOCK RESULT` and must not be treated as real grades.

**Evaluation response includes:**
- `marks_awarded` — clamped to max marks (AI can never exceed maximum)
- `confidence` — 0–1 confidence score
- `rubric_breakdown` — criterion-wise marks
- `strengths` — what the student did well
- `missing_concepts` — concepts not addressed
- `suggestions` — actionable improvement advice

---

## Project Structure

```
backend/
├── app/
│   ├── main.py                  # FastAPI app, routers, CORS
│   ├── core/
│   │   ├── config.py            # Settings (pydantic-settings)
│   │   └── security.py          # JWT, password hashing, auth deps
│   ├── database/
│   │   ├── connection.py        # SQLAlchemy engine + session
│   │   └── models.py            # All ORM models
│   ├── schemas/
│   │   ├── auth.py              # Request/response schemas
│   │   ├── students.py
│   │   ├── exams.py
│   │   ├── uploads.py
│   │   ├── evaluations.py
│   │   └── dashboard.py
│   ├── api/
│   │   ├── auth.py              # Authentication endpoints
│   │   ├── students.py          # Student & class management
│   │   ├── exams.py             # Exam & question management
│   │   ├── uploads.py           # Bulk upload handling
│   │   ├── evaluations.py       # OCR + AI evaluation triggers
│   │   ├── results.py           # Result review & approval
│   │   └── dashboard.py         # Analytics endpoints
│   ├── services/
│   │   ├── ocr_service.py       # PDF + image text extraction
│   │   ├── ai_evaluation_service.py  # Gemini evaluation engine
│   │   ├── upload_service.py    # File storage + deduplication
│   │   └── result_service.py    # Evaluation pipeline orchestrator
│   └── utils/
│       └── seed_db.py           # Development data seeder
├── tests/
│   └── test_basic.py            # Smoke tests
├── uploads/                     # Uploaded answer sheets (gitignored)
├── .env                         # Local config (not committed)
├── .env.example                 # Config template
├── requirements.txt
├── start.bat                    # Windows startup script
└── README.md
```

---

## Running Tests

```powershell
uv run pytest tests/ -v
```

Tests use an in-memory SQLite database — no PostgreSQL required.

---

## Frontend Integration

This backend is designed to work with a separately built React frontend.

**Base URL:** `http://localhost:8000`

**Authentication:** Include `Authorization: Bearer <token>` header on protected routes.

**Common response format:**
```json
{
  "id": "uuid",
  "field": "value",
  "created_at": "2024-01-01T00:00:00"
}
```

**Error format:**
```json
{
  "detail": "Human-readable error message"
}
```

**HTTP Status Codes:**
- `200` — Success
- `201` — Created
- `400` — Bad request / validation error
- `401` — Unauthenticated
- `403` — Forbidden (wrong role)
- `404` — Not found
- `409` — Conflict (duplicate)
- `422` — Pydantic validation error (check field names)

---

## Notes for Hackathon

- **Mock mode** is active without a Gemini API key — perfectly fine for demos
- **OCR** works best with typed/digital PDFs; handwritten OCR requires Tesseract + good scan quality
- **Database** auto-creates tables on startup — no migration tool needed for MVP
- **File uploads** are stored locally in `uploads/` — use cloud storage in production

