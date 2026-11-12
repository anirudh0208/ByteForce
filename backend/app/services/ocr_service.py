"""
OCR Service — extracts text from PDF and image answer sheets.

Supports:
  - PDF  → PyMuPDF (text layer first, then image-based fallback with Tesseract)
  - Image → Tesseract OCR (pytesseract) with Pillow pre-processing
  - Graceful fallback when Tesseract is not installed

Result includes per-page text, combined text, and an overall confidence score.
"""

import io
import logging
from pathlib import Path
from typing import Optional
import re

logger = logging.getLogger(__name__)


# ─── Optional dependency guards ──────────────────────────────────────

def _load_fitz():
    try:
        import fitz  # PyMuPDF
        return fitz
    except ImportError:
        logger.warning("PyMuPDF not installed — PDF text extraction unavailable")
        return None


def _load_pytesseract():
    try:
        import os
        import pytesseract
        from app.core.config import settings

        tesseract_cmd = getattr(settings, "TESSERACT_CMD", None)
        if tesseract_cmd:
            pytesseract.pytesseract.tesseract_cmd = tesseract_cmd
        else:
            # Probe default PATH first; if missing, check standard Windows install paths
            try:
                pytesseract.get_tesseract_version()
                return pytesseract
            except Exception:
                for candidate in (
                    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
                    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
                ):
                    if os.path.exists(candidate):
                        pytesseract.pytesseract.tesseract_cmd = candidate
                        break

        pytesseract.get_tesseract_version()
        return pytesseract
    except Exception:
        logger.warning("Tesseract not found — image OCR will return empty text")
        return None


def _load_pil():
    try:
        from PIL import Image, ImageFilter, ImageEnhance
        return Image, ImageFilter, ImageEnhance
    except ImportError:
        return None, None, None


# ─── Helpers ──────────────────────────────────────────────────────────

def _preprocess_image_for_ocr(image_path: str):
    """Return a contrast-enhanced greyscale PIL Image suitable for Tesseract."""
    Image, ImageFilter, ImageEnhance = _load_pil()
    if Image is None:
        return None
    img = Image.open(image_path).convert("L")          # greyscale
    img = ImageEnhance.Contrast(img).enhance(2.0)
    img = img.filter(ImageFilter.SHARPEN)
    return img


def _ocr_image_file(file_path: str) -> dict:
    pytesseract = _load_pytesseract()
    if pytesseract is None:
        return {"text": "", "confidence": 0.0, "method": "none"}

    img = _preprocess_image_for_ocr(file_path)
    if img is None:
        return {"text": "", "confidence": 0.0, "method": "none"}

    try:
        data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
        words = [w for w in data["text"] if w.strip()]
        confs = [c for c in data["conf"] if c != -1]
        avg_conf = (sum(confs) / len(confs) / 100) if confs else 0.0
        full_text = pytesseract.image_to_string(img)
        return {"text": full_text.strip(), "confidence": round(avg_conf, 3), "method": "tesseract"}
    except Exception as e:
        logger.error(f"Tesseract OCR failed for {file_path}: {e}")
        return {"text": "", "confidence": 0.0, "method": "none"}


def _extract_pdf_text(file_path: str) -> dict:
    fitz = _load_fitz()
    if fitz is None:
        return {"text": "", "confidence": 0.0, "pages": [], "method": "none"}

    pages = []
    total_chars = 0
    has_text_layer = False
    pytesseract_available = _load_pytesseract() is not None

    try:
        doc = fitz.open(file_path)
        for page_num, page in enumerate(doc):
            # Try native text layer first
            page_text = page.get_text("text").strip()
            if page_text and len(page_text) > 20:
                has_text_layer = True
                pages.append({"page": page_num + 1, "text": page_text, "method": "native"})
                total_chars += len(page_text)
            elif pytesseract_available:
                # Render page to image and OCR
                mat = fitz.Matrix(2, 2)   # 2x zoom for better OCR
                pix = page.get_pixmap(matrix=mat, alpha=False)
                Image, _, _ = _load_pil()
                if Image:
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    pytesseract = _load_pytesseract()
                    page_text = pytesseract.image_to_string(img) if pytesseract else ""
                    pages.append({"page": page_num + 1, "text": page_text.strip(), "method": "tesseract"})
                    total_chars += len(page_text)
            else:
                pages.append({"page": page_num + 1, "text": "", "method": "none"})

        combined = "\n\n".join(p["text"] for p in pages if p["text"])
        # Confidence heuristic: longer text = more confident
        confidence = min(total_chars / 500, 1.0) if total_chars else 0.0
        return {
            "text": combined,
            "confidence": round(confidence, 3),
            "pages": pages,
            "method": "native+tesseract" if not has_text_layer else "native",
        }
    except Exception as e:
        logger.error(f"PDF extraction failed for {file_path}: {e}")
        return {"text": "", "confidence": 0.0, "pages": [], "method": "error"}


# ─── Question segmentation ────────────────────────────────────────────

def _segment_by_questions(full_text: str, num_questions: int) -> dict[int, str]:
    """
    Attempts to split OCR text into per-question segments.

    Heuristic: looks for patterns like "Q1", "1.", "Question 1", etc.
    Falls back to dividing evenly.
    """
    if not full_text.strip():
        return {i + 1: "" for i in range(num_questions)}

    # Build flexible regex for question headers
    pattern = re.compile(
        r'(?:^|\n)\s*(?:Q(?:uestion)?\.?\s*(\d+)|(\d+)\s*[.):]\s)',
        re.IGNORECASE | re.MULTILINE
    )
    matches = list(pattern.finditer(full_text))

    if len(matches) >= 2:
        segments = {}
        for idx, match in enumerate(matches):
            q_num_str = match.group(1) or match.group(2)
            try:
                q_num = int(q_num_str)
            except (ValueError, TypeError):
                continue
            start = match.end()
            end = matches[idx + 1].start() if idx + 1 < len(matches) else len(full_text)
            segments[q_num] = full_text[start:end].strip()
        return segments
    else:
        # Even split fallback
        lines = full_text.split("\n")
        chunk = max(1, len(lines) // max(num_questions, 1))
        return {
            i + 1: "\n".join(lines[i * chunk: (i + 1) * chunk]).strip()
            for i in range(num_questions)
        }


# ─── Public API ───────────────────────────────────────────────────────

class OCRService:

    @staticmethod
    def extract_text(file_path: str) -> dict:
        """
        Extract text from a PDF or image file.

        Returns:
            {
              "text": str,            # full extracted text
              "confidence": float,    # 0–1
              "pages": list,          # per-page breakdown (PDF only)
              "method": str,          # native / tesseract / none
            }
        """
        path = Path(file_path)
        suffix = path.suffix.lower()

        if suffix == ".pdf":
            return _extract_pdf_text(file_path)
        elif suffix in {".png", ".jpg", ".jpeg", ".webp", ".tiff", ".bmp"}:
            result = _ocr_image_file(file_path)
            return {**result, "pages": [{"page": 1, "text": result["text"], "method": result["method"]}]}
        else:
            logger.error(f"Unsupported file type for OCR: {suffix}")
            return {"text": "", "confidence": 0.0, "pages": [], "method": "unsupported"}

    @staticmethod
    def extract_and_segment(file_path: str, questions: list) -> dict:
        """
        Extract text and attempt to segment by question.

        Returns:
            {
              "full_text": str,
              "confidence": float,
              "method": str,
              "needs_review": bool,
              "segments": {question_id: extracted_text},
            }
        """
        result = OCRService.extract_text(file_path)
        full_text = result.get("text", "")
        confidence = result.get("confidence", 0.0)
        needs_review = confidence < 0.5 or not full_text.strip()

        num_questions = len(questions)
        raw_segments = _segment_by_questions(full_text, num_questions)

        # Map to question IDs
        segments = {}
        for idx, q in enumerate(questions):
            q_num = q.order if hasattr(q, "order") else idx + 1
            segments[q.id] = raw_segments.get(q_num, "")

        return {
            "full_text": full_text,
            "confidence": confidence,
            "method": result.get("method", "none"),
            "needs_review": needs_review,
            "segments": segments,
        }

