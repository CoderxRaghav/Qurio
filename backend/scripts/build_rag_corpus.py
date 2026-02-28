INPUT_FILES = [
    "../outputs/questions_raw.txt",
    "../outputs/important_questions.txt",
    "../outputs/generated_question_paper.txt"
]

OUTPUT_FILE = "../outputs/rag_corpus.txt"

seen = set()
lines = []

for file in INPUT_FILES:
    try:
        with open(file, "r", encoding="utf-8") as f:
            for line in f:
                text = line.strip()
                if len(text) > 20 and text not in seen:
                    seen.add(text)
                    lines.append(text)
    except FileNotFoundError:
        pass

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    for l in lines:
        f.write(l + "\n")

print("RAG corpus auto-generated:", len(lines), "entries")
