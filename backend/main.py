from fastapi import FastAPI, UploadFile, File, Form
import shutil
import os

from backend.services.pdf_parser import extract_text_from_pdf
from backend.services.ocr import extract_text_from_image
from backend.services.text_processor import process_text

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"

@app.post("/analyze-text")
async def analyze_text(text: str = Form(...)):
    return process_text(text)


@app.post("/analyze-file")
async def analyze_file(file: UploadFile = File(...)):
    filepath = os.path.join(UPLOAD_DIR, file.filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(filepath)

    elif file.filename.endswith((".png", ".jpg", ".jpeg")):
        text = extract_text_from_image(filepath)

    else:
        return {"error": "Unsupported file type"}

    return process_text(text)