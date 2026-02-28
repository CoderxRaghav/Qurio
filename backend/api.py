# from fastapi import FastAPI
# import subprocess
# import os
#
# app = FastAPI()
#
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
#
# def run_script(script_name):
#     subprocess.run(
#         ["python", os.path.join(BASE_DIR, script_name)],
#         check=True
#     )
#
# @app.get("/")
# def root():
#     return {"status": "API running"}
#
# @app.post("/generate")
# def generate():
#     # run your existing pipeline (ONLY what you already built)
#     run_script("build_rag_corpus.py")
#     run_script("generate_answers.py")
#
#     return {
#         "message": "Generation completed",
#         "output_file": "outputs/answers.txt"
#     }


from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import subprocess
import os
import shutil
import sys
import json
import re
from datetime import datetime
from urllib import request as urlrequest
from urllib import error as urlerror


app = FastAPI()

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, "../data/raw_papers"))
# OUTPUT_DIR = os.path.abspath(os.path.join(BASE_DIR, "../outputs"))

#CORS BLOCK
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:8081",
        "http://127.0.0.1:8081",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    # Accept any localhost/127.0.0.1 dev port (Vite may auto-increment ports).
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data", "raw_papers")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")
HISTORY_FILE = os.path.join(OUTPUT_DIR, "history.json")
ANALYSIS_FILE = os.path.join(OUTPUT_DIR, "analysis.json")
OLLAMA_MODEL = "gemma3:4b"

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


# def run_script(script_name):
#     subprocess.run(
#         ["python", os.path.join(BASE_DIR, script_name)],
#         check=True
#     )

def run_script(script_name):
    result = subprocess.run(
        [sys.executable, script_name],
        cwd=SCRIPTS_DIR,
        check=True,
        capture_output=True,
        text=True,
    )
    return {
        "script": script_name,
        "stdout": result.stdout.strip(),
        "stderr": result.stderr.strip(),
        "returncode": result.returncode,
    }


def clear_outputs():
    for name in [
        "ocr_output.txt",
        "clean_text.txt",
        "lines.txt",
        "questions_raw.txt",
        "questions.json",
        "questions_with_marks.json",
        "question_frequency.txt",
        "important_questions.txt",
        "generated_question_paper.txt",
        "rag_corpus.txt",
        "answers.txt",
    ]:
        path = os.path.join(OUTPUT_DIR, name)
        if os.path.exists(path):
            os.remove(path)


def clear_uploaded_papers():
    if not os.path.exists(DATA_DIR):
        return

    for name in os.listdir(DATA_DIR):
        path = os.path.join(DATA_DIR, name)
        if os.path.isfile(path):
            os.remove(path)


def read_file_if_exists(path):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return ""


def collect_outputs():
    files = {}
    if not os.path.exists(OUTPUT_DIR):
        return files

    for name in sorted(os.listdir(OUTPUT_DIR)):
        path = os.path.join(OUTPUT_DIR, name)
        if os.path.isfile(path) and name.lower().endswith((".txt", ".json")):
            files[name] = read_file_if_exists(path)
    return files


def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def read_json(path, default):
    if not os.path.exists(path):
        return default
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def extract_subject_from_text(text):
    if not text:
        return "Unknown Subject"

    pattern = re.search(
        r"THEORY EXAMINATION\s+\d{4}-\d{2}\s+(.+?)\s+TIME\s*:",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if pattern:
        subject = re.sub(r"\s+", " ", pattern.group(1)).strip(" -:\n\t")
        if subject:
            return subject.title()

    for line in text.splitlines():
        line_clean = re.sub(r"\s+", " ", line).strip()
        if len(line_clean) > 8 and any(k in line_clean.lower() for k in ["programming", "mathematics", "physics", "chemistry", "engineering"]):
            return line_clean.title()

    return "Unknown Subject"


def parse_llm_json(text):
    try:
        return json.loads(text)
    except Exception:
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(text[start:end + 1])
            except Exception:
                return None
    return None


def normalize_question_type(raw_type):
    value = str(raw_type or "").strip().lower()
    if value in {"mcq", "short", "long", "mixed"}:
        return value
    return "mixed"


def difficulty_label_from_percent(difficulty):
    if difficulty <= 35:
        return "Easy"
    if difficulty <= 70:
        return "Medium"
    return "Hard"


def call_ollama_subject_analysis(clean_text, questions_text):
    clean_excerpt = (clean_text or "")[:2500]
    questions_excerpt = (questions_text or "")[:1200]
    prompt = f"""
You are an academic analyzer. Extract the main subject and explain why it matters.
Return STRICT JSON only with keys:
- subject (string)
- importance (string, 2-4 sentences)
- uses (array of 3 to 5 concise strings)

Context from uploaded question paper:
{clean_excerpt}

Predicted question paper:
{questions_excerpt}
"""

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "format": "json",
    }
    data = json.dumps(payload).encode("utf-8")
    req = urlrequest.Request(
        "http://127.0.0.1:11434/api/generate",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urlrequest.urlopen(req, timeout=90) as resp:
        body = json.loads(resp.read().decode("utf-8"))
        llm_json = parse_llm_json(body.get("response", ""))
        if not isinstance(llm_json, dict):
            raise ValueError("Invalid JSON returned by model")
        return llm_json


def call_ollama_topic_generation(subject, difficulty_label, count, question_type):
    prompt = f"""
You are AxisStudy AI, an expert question paper generator.
Return STRICT JSON only with keys:
- subject (string)
- difficulty_label (Easy|Medium|Hard)
- paper (string)
- rationale (string, 1-2 sentences)

Generate a complete question paper for:
- Subject/Topic: {subject}
- Difficulty: {difficulty_label}
- Number of questions: {count}
- Question type: {question_type}

Rules:
- Number questions as Q1., Q2., ... exactly up to {count}.
- If question type is mcq: include options A), B), C), D) for each question.
- If short: concise answer-style prompts.
- If long: descriptive and analytical prompts.
- If mixed: combine mcq, short, and long proportionally.
- Keep wording clean and academic.
"""

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "format": "json",
    }
    data = json.dumps(payload).encode("utf-8")
    req = urlrequest.Request(
        "http://127.0.0.1:11434/api/generate",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urlrequest.urlopen(req, timeout=120) as resp:
        body = json.loads(resp.read().decode("utf-8"))
        llm_json = parse_llm_json(body.get("response", ""))
        if not isinstance(llm_json, dict):
            raise ValueError("Invalid JSON returned by model")
        paper = str(llm_json.get("paper", "")).strip()
        if not paper:
            raise ValueError("Model returned empty paper")
        return llm_json


def build_fallback_question(subject, index, qtype, difficulty_label):
    difficulty_hint = {
        "Easy": "basic understanding",
        "Medium": "applied understanding",
        "Hard": "advanced analysis",
    }.get(difficulty_label, "applied understanding")

    if qtype == "mcq":
        stem = f"Q{index}. In {subject}, which option best reflects {difficulty_hint} of core concepts?"
        options = [
            "A) Foundational principle with direct definition",
            "B) Conceptual application in a practical scenario",
            "C) Analytical interpretation with constraints",
            "D) Strategic optimization across multiple factors",
        ]
        return "\n".join([stem] + options)

    if qtype == "short":
        return f"Q{index}. Explain a {difficulty_hint} concept from {subject} with one relevant example."

    if qtype == "long":
        return f"Q{index}. Critically evaluate a major theme in {subject}, discussing assumptions, trade-offs, and real-world implications."

    mixed_cycle = ["mcq", "short", "long"]
    return build_fallback_question(subject, index, mixed_cycle[(index - 1) % len(mixed_cycle)], difficulty_label)


def build_fallback_topic_paper(subject, difficulty_label, count, question_type):
    lines = [f"AxisStudy AI Question Paper", f"Subject/Topic: {subject}", f"Difficulty: {difficulty_label}", ""]
    for idx in range(1, count + 1):
        lines.append(build_fallback_question(subject, idx, question_type, difficulty_label))
        lines.append("")
    return "\n".join(lines).strip()


def build_topic_analysis(subject, difficulty, count, question_type):
    difficulty_label = difficulty_label_from_percent(difficulty)
    normalized_type = normalize_question_type(question_type)
    type_label_map = {
        "mcq": "MCQ",
        "short": "Short Answer",
        "long": "Long Answer",
        "mixed": "Mixed",
    }
    return {
        "subject": subject,
        "difficulty": difficulty,
        "difficulty_label": difficulty_label,
        "question_count": count,
        "question_type": normalized_type,
        "question_type_label": type_label_map[normalized_type],
        "model": OLLAMA_MODEL,
        "source": "topic-config",
        "generated_at": datetime.utcnow().isoformat() + "Z",
    }


def build_subject_analysis(clean_text, questions_text):
    subject_fallback = extract_subject_from_text(clean_text)
    analysis = {
        "subject": subject_fallback,
        "importance": f"{subject_fallback} builds core exam and practical problem-solving skills.",
        "uses": [
            "Supports higher studies and technical interviews",
            "Improves analytical and implementation ability",
            "Used in real software and engineering workflows",
        ],
        "model": OLLAMA_MODEL,
        "source": "fallback",
        "generated_at": datetime.utcnow().isoformat() + "Z",
    }

    try:
        llm_result = call_ollama_subject_analysis(clean_text, questions_text)
        subject = str(llm_result.get("subject", "")).strip() or subject_fallback
        importance = str(llm_result.get("importance", "")).strip() or analysis["importance"]
        uses_raw = llm_result.get("uses", analysis["uses"])
        uses = [str(x).strip() for x in uses_raw if str(x).strip()] if isinstance(uses_raw, list) else analysis["uses"]
        if not uses:
            uses = analysis["uses"]

        analysis.update({
            "subject": subject,
            "importance": importance,
            "uses": uses[:5],
            "source": "llm",
        })
    except (urlerror.URLError, TimeoutError, ValueError, json.JSONDecodeError):
        pass

    return analysis


def count_generated_questions(questions_text):
    return len(re.findall(r"(?m)^Q\d+\.", questions_text or ""))


def append_history_entry(subject, questions_text):
    history = read_json(HISTORY_FILE, [])
    uploaded_files = sorted([name for name in os.listdir(DATA_DIR) if os.path.isfile(os.path.join(DATA_DIR, name))])
    entry = {
        "id": int(datetime.utcnow().timestamp() * 1000),
        "created_at": datetime.utcnow().isoformat() + "Z",
        "subject": subject,
        "uploaded_files": uploaded_files,
        "questions_count": count_generated_questions(questions_text),
        "preview": (questions_text or "").splitlines()[:2],
    }
    history.insert(0, entry)
    write_json(HISTORY_FILE, history[:100])


class TopicGenerationRequest(BaseModel):
    subject: str = Field(..., min_length=2, max_length=150)
    difficulty: int = Field(50, ge=10, le=100)
    count: int = Field(20, ge=5, le=100)
    type: str = Field("mixed")


class AskRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=1000)
    marks: int = Field(..., ge=2, le=10)


def load_syllabus_context():
    # Ground answers with existing pipeline outputs so responses stay exam/syllabus focused.
    context_files = [
        "rag_corpus.txt",
        "clean_text.txt",
        "generated_question_paper.txt",
    ]
    chunks = []
    for name in context_files:
        text = read_file_if_exists(os.path.join(OUTPUT_DIR, name)).strip()
        if text:
            chunks.append(text[:900])
    return "\n\n".join(chunks)[:2200]


def answer_token_budget(marks):
    if marks <= 3:
        return 120
    if marks == 5:
        return 220
    return 420


def mark_instruction(marks):
    if marks <= 3:
        return (
            "Answer as a short-answer response. Keep it concise, definition-style, and exam-oriented. "
            "Use 3-4 crisp points or 2-4 short lines."
        )
    if marks == 5:
        return (
            "Answer as a medium-answer response. Provide a structured explanation in 4-6 bullet points, "
            "with clear technical wording and one brief example when relevant."
        )
    if marks >= 7:
        return (
            "Answer as a long-answer response with these headings:\n"
            "1) Introduction\n"
            "2) Explanation\n"
            "3) Diagram Suggestion (if applicable)\n"
            "4) Conclusion\n"
            "Keep it detailed, exam-oriented, and within syllabus boundaries."
        )
    return (
        "Answer as a long-answer response with these headings:\n"
        "1) Core Explanation\n"
        "2) Key Points\n"
        "3) Summary\n"
        "Keep it exam-oriented and concise."
    )


def call_ollama_ask_answer(question, marks, syllabus_context):
    prompt = f"""
You are AxisStudy AI, an exam-focused doubt solver.
Rules:
- Keep the answer strictly within syllabus context.
- Avoid fluff and avoid off-topic expansion.
- Use clean academic language suitable for university exams.
- Return plain text only.

Syllabus context:
{syllabus_context or "No uploaded context available. Stay within standard university syllabus assumptions."}

Question:
{question}

Marks:
{marks}

Answer format instruction:
{mark_instruction(marks)}
"""

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "keep_alive": "20m",
        "options": {
            "temperature": 0.2,
            "top_p": 0.9,
            "num_predict": answer_token_budget(marks),
        },
    }
    data = json.dumps(payload).encode("utf-8")
    req = urlrequest.Request(
        "http://127.0.0.1:11434/api/generate",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urlrequest.urlopen(req, timeout=75) as resp:
        body = json.loads(resp.read().decode("utf-8"))
        answer = str(body.get("response", "")).strip()
        if not answer:
            raise ValueError("Model returned empty answer")
        return answer


@app.get("/")
def root():
    return {"status": "API running"}


@app.post("/ask")
def ask_qurio(payload: AskRequest):
    question = re.sub(r"\s+", " ", payload.question).strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question is required.")

    syllabus_context = load_syllabus_context()

    source = "llm"
    try:
        answer = call_ollama_ask_answer(question, payload.marks, syllabus_context)
    except (urlerror.URLError, TimeoutError, OSError, ValueError, json.JSONDecodeError):
        # Retry once without syllabus context to reduce latency for ad-hoc doubts.
        try:
            answer = call_ollama_ask_answer(question, payload.marks, "")
            source = "llm-fallback"
        except (urlerror.URLError, TimeoutError, OSError, ValueError, json.JSONDecodeError) as exc:
            raise HTTPException(
                status_code=503,
                detail="Unable to generate answer right now. Ensure Ollama is running at http://127.0.0.1:11434.",
            ) from exc

    return {
        "question": question,
        "marks": payload.marks,
        "answer": answer,
        "source": source,
    }


@app.post("/upload")
async def upload(file: UploadFile = File(...), replace: bool = False):
    if replace:
        clear_uploaded_papers()

    file_path = os.path.join(DATA_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"message": "File uploaded", "filename": file.filename}


@app.post("/generate")
def generate():
    pipeline_scripts = [
        "extract_text.py",
        "clean_text.py",
        "split_lines.py",
        "detect_questions.py",
        "structure_questions.py",
        "detect_marks.py",
        "frequency_counter.py",
        "merge_similar.py",
        "concept_grouping.py",
        "generate_question_paper.py",
        "build_rag_corpus.py",
    ]
    optional_scripts = ["generate_answers.py"]
    script_logs = []
    warnings = []

    clear_outputs()

    try:
        for script in pipeline_scripts:
            script_logs.append(run_script(script))
    except subprocess.CalledProcessError as exc:
        script_name = exc.cmd[-1] if isinstance(exc.cmd, list) and exc.cmd else "unknown"
        raise HTTPException(
            status_code=500,
            detail={
                "message": f"Pipeline failed at {script_name}",
                "stdout": (exc.stdout or "").strip(),
                "stderr": (exc.stderr or "").strip(),
            },
        ) from exc

    for script in optional_scripts:
        try:
            script_logs.append(run_script(script))
        except subprocess.CalledProcessError as exc:
            script_name = exc.cmd[-1] if isinstance(exc.cmd, list) and exc.cmd else script
            warnings.append({
                "script": script_name,
                "message": "Script failed, continuing with generated questions.",
                "stdout": (exc.stdout or "").strip(),
                "stderr": (exc.stderr or "").strip(),
            })

    questions_text = read_file_if_exists(os.path.join(OUTPUT_DIR, "generated_question_paper.txt"))
    answers_text = read_file_if_exists(os.path.join(OUTPUT_DIR, "answers.txt"))
    clean_text = read_file_if_exists(os.path.join(OUTPUT_DIR, "clean_text.txt"))
    output_files = collect_outputs()
    analysis = build_subject_analysis(clean_text, questions_text)
    write_json(ANALYSIS_FILE, analysis)
    append_history_entry(analysis.get("subject", "Unknown Subject"), questions_text)

    return {
        "message": "Generation completed",
        "output_file": "outputs/generated_question_paper.txt",
        "output_files": output_files,
        "questions": questions_text,
        "answers": answers_text,
        "analysis": analysis,
        "warnings": warnings,
        "logs": script_logs,
    }


@app.post("/generate/topic")
def generate_topic_paper(payload: TopicGenerationRequest):
    subject = re.sub(r"\s+", " ", payload.subject).strip()
    if not subject:
        raise HTTPException(status_code=400, detail="Subject / Topic is required.")

    question_type = normalize_question_type(payload.type)
    difficulty_label = difficulty_label_from_percent(payload.difficulty)
    analysis = build_topic_analysis(subject, payload.difficulty, payload.count, question_type)

    questions_text = ""
    llm_rationale = ""
    source = "fallback"

    try:
        llm_result = call_ollama_topic_generation(subject, difficulty_label, payload.count, question_type)
        questions_text = str(llm_result.get("paper", "")).strip()
        llm_rationale = str(llm_result.get("rationale", "")).strip()
        llm_subject = str(llm_result.get("subject", "")).strip()
        llm_difficulty = str(llm_result.get("difficulty_label", "")).strip()
        if llm_subject:
            analysis["subject"] = llm_subject
        if llm_difficulty in {"Easy", "Medium", "Hard"}:
            analysis["difficulty_label"] = llm_difficulty
        source = "llm"
    except (urlerror.URLError, TimeoutError, ValueError, json.JSONDecodeError):
        questions_text = build_fallback_topic_paper(subject, difficulty_label, payload.count, question_type)

    analysis["source"] = source
    if llm_rationale:
        analysis["rationale"] = llm_rationale

    return {
        "message": "Topic-based paper generation completed",
        "mode": "topic-config",
        "questions": questions_text,
        "analysis": analysis,
    }


@app.get("/results")
def results():
    questions_text = read_file_if_exists(os.path.join(OUTPUT_DIR, "generated_question_paper.txt"))
    answers_text = read_file_if_exists(os.path.join(OUTPUT_DIR, "answers.txt"))
    output_files = collect_outputs()

    return {
        "text": questions_text,
        "questions": questions_text,
        "answers": answers_text,
        "output_files": output_files,
    }


@app.get("/analysis")
def analysis():
    data = read_json(ANALYSIS_FILE, {})
    if data:
        return data

    clean_text = read_file_if_exists(os.path.join(OUTPUT_DIR, "clean_text.txt"))
    questions_text = read_file_if_exists(os.path.join(OUTPUT_DIR, "generated_question_paper.txt"))
    if not clean_text and not questions_text:
        return {
            "subject": "",
            "importance": "",
            "uses": [],
            "model": OLLAMA_MODEL,
            "source": "empty",
            "generated_at": "",
        }

    data = build_subject_analysis(clean_text, questions_text)
    write_json(ANALYSIS_FILE, data)
    return data


@app.get("/history")
def history():
    return {"items": read_json(HISTORY_FILE, [])}
