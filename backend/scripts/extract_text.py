import pdfplumber
import os

RAW_DIR = "../data/raw_papers"
OUT_FILE = "../outputs/ocr_output.txt"

# overwrite old data
with open(OUT_FILE, "w", encoding="utf-8") as out:
    for file in os.listdir(RAW_DIR):
        if file.lower().endswith(".pdf"):
            pdf_path = os.path.join(RAW_DIR, file)
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        out.write(text + "\n")

print("PDF text extraction done")
