import pytesseract
from PIL import Image
import os
os.environ["TESSDATA_PREFIX"] = r"C:\Program Files\Tesseract-OCR\tessdata"

# import pytesseract

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

img = Image.open(r"C:\Projects\ai-question-paper-maker\data\raw_papers\test_imag.webp")

text = pytesseract.image_to_string(img, lang="eng")

# step 1 print - file's raw data
# print(text)
with open("../outputs/ocr_output.txt", "w", encoding="utf-8") as f:
    f.write(text)

