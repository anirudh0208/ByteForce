"""
AI Evaluation Service — uses Google Gemini to evaluate student answers.

Design decisions:
 - Sends a structured prompt with question, model answer, rubric and student answer.
 - Requests a JSON response with criterion-wise marks, feedback and confidence.
 - Validates that awarded marks never exceed maximum marks.
 - Falls back to a mock evaluator when GEMINI_API_KEY is not set (MVP dev mode).
 - Clearly labels mock results so they are never confused with real AI output.
"""

import json
import logging
import time
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

# ─── Gemini client (lazy) ─────────────────────────────────────────────

_gemini_model = None


def _get_gemini_model():
    global _gemini_model
    if _gemini_model is not None:
        return _gemini_model

    api_key = settings.GEMINI_API_KEY
    if not api_key or api_key == "your-gemini-api-key-here":
        logger.warning("GEMINI_API_KEY not configured — using mock evaluator")
        return None

    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        _gemini_model = genai.GenerativeModel(settings.GEMINI_MODEL)
        logger.info(f"Gemini model '{settings.GEMINI_MODEL}' initialised successfully")
        return _gemini_model
    except Exception as e:
        logger.error(f"Failed to initialise Gemini: {e}")
        return None


# ─── Prompt builder ───────────────────────────────────────────────────

EVAL_PROMPT_TEMPLATE = """You are an expert academic evaluator. Evaluate the student's answer strictly and fairly.

## Question
{question_text}

## Maximum Marks
{max_marks}

## Model Answer
{model_answer}

## Marking Rubric
{rubric}

## Student's Answer
{student_answer}

---

Evaluate the student answer against the model answer and rubric.

Return ONLY a valid JSON object with this exact structure:
{{
  "marks_awarded": <number, must not exceed {max_marks}>,
  "confidence": <float between 0 and 1>,
  "rubric_breakdown": [
    {{"criterion": "...", "marks_awarded": <number>, "max_marks": <number>, "comment": "..."}}
  ],
  "strengths": "<what the student did well>",
  "missing_concepts": ["<concept 1>", "<concept 2>"],
  "incorrect_info": ["<incorrect claim 1>"],
  "suggestions": "<actionable improvement advice>",
  "ai_explanation": "<brief explanation of marks awarded>"
}}

Rules:
- marks_awarded MUST be between 0 and {max_marks} inclusive.
- Evaluate semantic understanding, not keyword matching.
- Be concise in feedback — this is formative assessment.
- If student answer is blank, award 0 marks.
- Do not include any text outside the JSON object.
"""


def _build_rubric_text(rubric: Optional[list]) -> str:
    if not rubric:
        return "Award marks based on accuracy and completeness of the answer."
    lines = []
    for c in rubric:
        lines.append(f"- {c.get('criterion', '?')}: {c.get('marks', 0)} marks — {c.get('description', '')}")
    return "\n".join(lines)


# ─── Mock evaluator (dev / no-API mode) ───────────────────────────────

def _mock_evaluate(question_text: str, student_answer: str, max_marks: float, rubric: Optional[list]) -> dict:
    """
    Returns a clearly labelled mock evaluation for development/testing.
    NEVER used when a real Gemini API key is configured.
    """
    if not student_answer or not student_answer.strip():
        awarded = 0.0
        confidence = 1.0
    else:
        # Simple heuristic: 60 % of max marks for a non-empty answer
        awarded = round(max_marks * 0.6, 1)
        confidence = 0.5

    breakdown = []
    if rubric:
        for c in rubric:
            c_max = float(c.get("marks", 1))
            breakdown.append({
                "criterion": c.get("criterion", "Unnamed"),
                "marks_awarded": round(c_max * 0.6, 1),
                "max_marks": c_max,
                "comment": "⚠️ MOCK RESULT — configure GEMINI_API_KEY for real evaluation",
            })

    return {
        "marks_awarded": awarded,
        "confidence": confidence,
        "rubric_breakdown": breakdown,
        "strengths": "⚠️ MOCK RESULT — This is a placeholder, not a real AI evaluation.",
        "missing_concepts": ["Configure GEMINI_API_KEY to get real feedback"],
        "incorrect_info": [],
        "suggestions": "Set GEMINI_API_KEY in your .env file to enable AI evaluation.",
        "ai_explanation": f"⚠️ MOCK: Awarded {awarded}/{max_marks} marks. Real AI evaluation requires GEMINI_API_KEY.",
        "_is_mock": True,
    }


# ─── Main evaluation logic ────────────────────────────────────────────

def _parse_gemini_response(raw: str, max_marks: float) -> dict:
    """Parse and validate Gemini JSON response."""
    # Strip markdown code fences if present
    raw = raw.strip()
    if raw.startswith("```"):
        lines = raw.split("\n")
        raw = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"Gemini returned invalid JSON: {e}\nRaw: {raw[:300]}")

    # Hard clamp — AI must never exceed max marks
    awarded = float(data.get("marks_awarded", 0))
    awarded = max(0.0, min(awarded, max_marks))
    data["marks_awarded"] = round(awarded, 2)

    # Validate rubric breakdown marks too
    for c in data.get("rubric_breakdown", []):
        c_max = float(c.get("max_marks", max_marks))
        c_awarded = float(c.get("marks_awarded", 0))
        c["marks_awarded"] = round(max(0.0, min(c_awarded, c_max)), 2)

    # Ensure confidence is 0–1
    conf = float(data.get("confidence", 0.5))
    data["confidence"] = round(max(0.0, min(conf, 1.0)), 3)

    return data


class AIEvaluationService:

    @staticmethod
    def evaluate_answer(
        question_text: str,
        student_answer: str,
        model_answer: str,
        max_marks: float,
        rubric: Optional[list] = None,
        retries: int = 2,
    ) -> dict:
        """
        Evaluate a single student answer using Gemini.

        Returns a validated dict with marks, confidence, rubric_breakdown
        and feedback. Includes '_is_mock': True when using the mock evaluator.
        """
        model = _get_gemini_model()

        if model is None:
            return _mock_evaluate(question_text, student_answer, max_marks, rubric)

        prompt = EVAL_PROMPT_TEMPLATE.format(
            question_text=question_text,
            max_marks=max_marks,
            model_answer=model_answer,
            rubric=_build_rubric_text(rubric),
            student_answer=student_answer or "(blank)",
        )

        last_error = None
        for attempt in range(retries + 1):
            try:
                response = model.generate_content(prompt)
                raw = response.text
                return _parse_gemini_response(raw, max_marks)
            except Exception as e:
                last_error = e
                logger.warning(f"Gemini attempt {attempt + 1} failed: {e}")
                if attempt < retries:
                    time.sleep(2 ** attempt)  # exponential back-off

        # All retries exhausted — fall back to mock with error note
        logger.error(f"All Gemini retries failed: {last_error}")
        result = _mock_evaluate(question_text, student_answer, max_marks, rubric)
        result["_gemini_error"] = str(last_error)
        result["_is_mock"] = True
        return result

    @staticmethod
    def evaluate_full_sheet(
        questions: list,
        extracted_answers: dict,   # {question_id: text}
        answer_keys: dict,          # {question_id: AnswerKey model}
    ) -> dict:
        """
        Evaluate all questions in one answer sheet.

        Returns:
        {
          "question_results": {question_id: eval_dict},
          "total_awarded": float,
          "total_possible": float,
          "percentage": float,
          "avg_confidence": float,
          "is_mock": bool,
        }
        """
        results = {}
        total_awarded = 0.0
        total_possible = 0.0
        confidence_scores = []
        any_mock = False

        for q in questions:
            ak = answer_keys.get(q.id)
            if ak is None:
                logger.warning(f"No answer key for question {q.id} — skipping")
                continue

            student_text = extracted_answers.get(q.id, "")
            rubric = ak.marking_rubric if isinstance(ak.marking_rubric, list) else []

            eval_result = AIEvaluationService.evaluate_answer(
                question_text=q.question_text,
                student_answer=student_text,
                model_answer=ak.model_answer,
                max_marks=q.max_marks,
                rubric=rubric,
            )

            results[q.id] = eval_result
            total_awarded += eval_result.get("marks_awarded", 0)
            total_possible += q.max_marks
            confidence_scores.append(eval_result.get("confidence", 0))
            if eval_result.get("_is_mock"):
                any_mock = True

        avg_confidence = round(sum(confidence_scores) / len(confidence_scores), 3) if confidence_scores else 0.0
        percentage = round((total_awarded / total_possible) * 100, 2) if total_possible else 0.0

        return {
            "question_results": results,
            "total_awarded": round(total_awarded, 2),
            "total_possible": round(total_possible, 2),
            "percentage": percentage,
            "avg_confidence": avg_confidence,
            "is_mock": any_mock,
        }

