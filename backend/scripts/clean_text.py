import re

# read OCR text
with open("../outputs/ocr_output.txt", "r", encoding="utf-8") as f:
    text = f.read()

# basic cleaning
text = re.sub(r'[^\x00-\x7F]+', ' ', text)   # non-ASCII remove
text = re.sub(r'\s+', ' ', text)            # extra spaces
text = text.strip()

# save cleaned text
with open("../outputs/clean_text.txt", "w", encoding="utf-8") as f:
    f.write(text)

print("Cleaning done")
