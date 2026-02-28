import ollama
from rag_helper import retrieve_context

MODEL_NAME = "gemma3:4b"
DEFAULT_MARKS = 7   # change to 2 if needed

def generate_answer(question, marks):
    context = retrieve_context(question)

    if marks == 2:
        instruction = "Answer in 2–3 lines only."
    else:
        instruction = "Write a structured 7-mark exam answer with headings."

    prompt = f"""
You are an AKTU exam assistant.
Use ONLY the given context.
Do not add out-of-syllabus content.

Context:
{context}

Question:
{question}

{instruction}
"""

    response = ollama.generate(
        model=MODEL_NAME,
        prompt=prompt
    )

    return response["response"].strip()


questions = []

with open("../outputs/generated_question_paper.txt", "r", encoding="utf-8") as f:
    for line in f:
        if line.startswith("Q"):
            q = line.split(".", 1)[1].split("[")[0].strip()
            questions.append(q)

with open("../outputs/answers.txt", "w", encoding="utf-8") as f:
    for i, q in enumerate(questions, start=1):
        f.write(f"Q{i}. {q} ({DEFAULT_MARKS} marks)\n")
        f.write(generate_answer(q, DEFAULT_MARKS))
        f.write("\n\n")

print("RAG-based answers generated successfully")
