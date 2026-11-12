@echo off
REM GradeX — Windows startup script
REM Run this from the backend\ directory

SET PATH=%USERPROFILE%\.local\bin;%PATH%

echo [1/4] Creating virtual environment...
uv venv --python 3.11

echo [2/4] Installing dependencies...
uv pip install -r requirements.txt

echo [3/4] Starting server...
echo.
echo API docs: http://localhost:8000/docs
echo Health:   http://localhost:8000/health
echo.
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

