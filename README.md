# Terms & Conditions Risk Analyzer

A web-based NLP tool that analyzes Terms & Conditions documents and identifies risky clauses.

## Features

- Upload text, PDF, or image
- Extract text using OCR
- Detect risks (liability, payment, etc.)
- Highlight risky keywords
- Generate risk summary
- Download report

## Tech Stack

- Backend: FastAPI
- NLP: NLTK
- OCR: Tesseract
- Frontend: HTML, CSS, JavaScript

## How to Run

```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

Open frontend/index.html in browser.

## Future Improvements

- Semantic similarity detection
- PDF report export
- Dashboard UI
