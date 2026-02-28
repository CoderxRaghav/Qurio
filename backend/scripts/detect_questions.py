question_keywords = [
    "define", "explain", "describe", "what is", "why", "how",
    "discuss", "compare", "differentiate", "write", "draw"
]

questions = []

with open("../outputs/lines.txt", "r", encoding="utf-8") as f:
    for line in f:
        q = line.strip()
        l = q.lower()

        # quality filters
        if len(q) < 25:
            continue

        if any(k in l for k in question_keywords):
            questions.append(q)

with open("../outputs/questions_raw.txt", "w", encoding="utf-8") as f:
    for q in questions:
        f.write(q + "\n")

print("Questions found:", len(questions))
