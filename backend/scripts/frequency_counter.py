import re
from collections import defaultdict

def normalize(q):
    q = q.lower()
    q = re.sub(r'[^a-z0-9\s]', '', q)
    q = re.sub(r'\s+', ' ', q)
    return q.strip()

freq = defaultdict(int)
original_map = {}

with open("../outputs/questions_raw.txt", "r", encoding="utf-8") as f:
    for line in f:
        q = line.strip()
        if not q:
            continue

        norm = normalize(q)
        freq[norm] += 1

        # store one original version
        if norm not in original_map:
            original_map[norm] = q

# save frequency result
with open("../outputs/question_frequency.txt", "w", encoding="utf-8") as f:
    for norm_q, count in sorted(freq.items(), key=lambda x: x[1], reverse=True):
        f.write(f"{count} :: {original_map[norm_q]}\n")

print("Frequency counting done")
