import re
from collections import defaultdict

STOP_WORDS = {
    "explain", "define", "describe", "write", "draw", "working",
    "difference", "between", "and", "or", "of", "the", "with",
    "what", "why", "how", "give"
}

def extract_keywords(q):
    q = q.lower()
    q = re.sub(r'[^a-z0-9\s]', '', q)
    words = q.split()
    keywords = [w for w in words if w not in STOP_WORDS and len(w) > 2]
    return set(keywords)

groups = defaultdict(list)

with open("../outputs/questions_raw.txt", "r", encoding="utf-8") as f:
    for line in f:
        q = line.strip()
        if not q:
            continue
        key = frozenset(extract_keywords(q))
        groups[key].append(q)

with open("../outputs/important_questions.txt", "w", encoding="utf-8") as f:
    for key, qs in groups.items():
        f.write(f"{len(qs)} :: {qs[0]}\n")

print("Concept grouping done")
import re
from collections import defaultdict

STOP_WORDS = {
    "explain", "define", "describe", "write", "draw", "working",
    "difference", "between", "and", "or", "of", "the", "with",
    "what", "why", "how", "give"
}

def extract_keywords(q):
    q = q.lower()
    q = re.sub(r'[^a-z0-9\s]', '', q)
    words = q.split()
    keywords = [w for w in words if w not in STOP_WORDS and len(w) > 2]
    return set(keywords)

# groups = defaultdict(list)
#
# with open("../outputs/questions_raw.txt", "r", encoding="utf-8") as f:
#     for line in f:
#         q = line.strip()
#         if not q:
#             continue
#         key = frozenset(extract_keywords(q))
#         groups[key].append(q)
#
# with open("../outputs/important_questions.txt", "w", encoding="utf-8") as f:
#     for key, qs in groups.items():
#         f.write(f"{len(qs)} :: {qs[0]}\n")
#
# print("Concept grouping done")
groups = []

def is_similar(set1, set2):
    return len(set1.intersection(set2)) >= 2

with open("../outputs/questions_raw.txt", "r", encoding="utf-8") as f:
    for line in f:
        q = line.strip()
        if not q:
            continue
        kw = extract_keywords(q)

        placed = False
        for g in groups:
            if is_similar(kw, g["keywords"]):
                g["questions"].append(q)
                g["keywords"] |= kw
                placed = True
                break

        if not placed:
            groups.append({
                "keywords": set(kw),
                "questions": [q]
            })

with open("../outputs/important_questions.txt", "w", encoding="utf-8") as f:
    for g in groups:
        f.write(f"{len(g['questions'])} :: {g['questions'][0]}\n")
print("Concept grouping done")