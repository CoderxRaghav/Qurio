import json
import re

with open("../outputs/questions.json", "r", encoding="utf-8") as f:
    questions = json.load(f)

for q in questions:
    text = q["question"].lower()

    # match = re.search(r'(\d+)\s*(marks|mark|m|\))', text)
    # if match:
    #     q["marks"] = int(match.group(1))
    # else:
    #     q["marks"] = None

    match = re.search(r'\(\s*(\d{1,2})\s*\)', text)

    if match:
        m = int(match.group(1))
        if m in [2, 7, 10]:
            q["marks"] = m
        else:
            q["marks"] = None

with open("../outputs/questions_with_marks.json", "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2)

print("Marks detection done")
