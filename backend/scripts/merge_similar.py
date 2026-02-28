import re
from collections import defaultdict

STOP_WORDS = [
    "explain", "describe", "define", "what is", "working of",
    "write", "draw", "and", "the", "of"
]

def normalize_core(q):
    q = q.lower()
    for w in STOP_WORDS:
        q = q.replace(w, "")
    q = re.sub(r'[^a-z0-9\s]', '', q)
    q = re.sub(r'\s+', ' ', q)
    return q.strip()

groups = defaultdict(list)

with open("../outputs/question_frequency.txt", "r", encoding="utf-8") as f:
    for line in f:
        if "::" not in line:
            continue
        count, question = line.split("::", 1)
        core = normalize_core(question)
        groups[core].append((int(count.strip()), question.strip()))

# save merged result
with open("../outputs/important_questions.txt", "w", encoding="utf-8") as f:
    for core, items in groups.items():
        total = sum(i[0] for i in items)
        rep_question = items[0][1]
        f.write(f"{total} :: {rep_question}\n")

print("Similar questions merged")
