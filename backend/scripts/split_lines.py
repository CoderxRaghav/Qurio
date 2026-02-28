# read cleaned text
with open("../outputs/clean_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

# split into lines using common separators
lines = []
for part in text.split('.'):
    line = part.strip()
    if len(line) > 10:   # very small junk ignore
        lines.append(line)

# save lines
with open("../outputs/lines.txt", "w", encoding="utf-8") as f:
    for line in lines:
        f.write(line + "\n")

print("Lines created:", len(lines))
