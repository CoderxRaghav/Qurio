import json

questions = []

with open("../outputs/questions_raw.txt", "r", encoding="utf-8") as f:
    for idx, line in enumerate(f, start=1):
        q = line.strip()
        if q:
            questions.append({
                "id": idx,
                "question": q,
                "marks": None,          # next step me fill hoga
                "year": None,
                "subject": None,
                "university": "AKTU"
            })

with open("../outputs/questions.json", "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2)

print("Structured questions:", len(questions))
