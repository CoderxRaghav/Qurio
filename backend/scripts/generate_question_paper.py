questions = []

# read important questions with frequency
with open("../outputs/important_questions.txt", "r", encoding="utf-8") as f:
    for line in f:
        if "::" in line:
            count, q = line.split("::", 1)
            questions.append((int(count.strip()), q.strip()))

# sort by repetition (high to low)
questions.sort(reverse=True, key=lambda x: x[0])

with open("../outputs/generated_question_paper.txt", "w", encoding="utf-8") as f:
    f.write("PREDICTED QUESTION PAPER (Priority Based)\n\n")
    qno = 1
    for count, q in questions:
        f.write(f"Q{qno}. {q}   [Repeated {count} times]\n\n")
        qno += 1

print("Question paper generated")
