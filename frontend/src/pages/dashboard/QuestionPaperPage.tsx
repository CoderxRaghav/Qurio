import { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { fetchResults } from "@/lib/api";

interface ParsedQuestion {
  number: string;
  text: string;
}

const parseQuestionPaper = (raw: string) => {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const headerLines: string[] = [];
  const questions: ParsedQuestion[] = [];
  let currentQuestion = "";

  for (const line of lines) {
    if (/^Q\d+\./i.test(line)) {
      if (currentQuestion) {
        const match = currentQuestion.match(/^Q(\d+)\.\s*(.*)$/i);
        if (match) {
          questions.push({
            number: match[1],
            text: match[2].replace(/\s+/g, " ").trim(),
          });
        }
      }
      currentQuestion = line;
      continue;
    }

    if (currentQuestion) {
      currentQuestion = `${currentQuestion} ${line}`;
    } else {
      headerLines.push(line);
    }
  }

  if (currentQuestion) {
    const match = currentQuestion.match(/^Q(\d+)\.\s*(.*)$/i);
    if (match) {
      questions.push({
        number: match[1],
        text: match[2].replace(/\s+/g, " ").trim(),
      });
    }
  }

  return {
    title: headerLines[0] || "Predicted Question Paper",
    subtitle: headerLines.slice(1).join(" "),
    questions,
  };
};

const QuestionPaperPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState("");
  const parsed = useMemo(() => parseQuestionPaper(questions), [questions]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchResults();
        setQuestions((result.questions ?? result.text ?? "").trim());
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load results.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Question Paper</h1>
        <p className="text-muted-foreground mt-1">Generated output from your latest processing run</p>
      </div>

      <div className="glass-panel rounded-xl p-6">
        {loading ? (
          <div className="text-center text-muted-foreground py-10">
            <FileText className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Loading predicted question paper...</p>
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : questions ? (
          <div
            className="rounded-2xl border border-slate-300 bg-white p-5 md:p-8 text-slate-900 shadow-[0_18px_48px_rgba(0,0,0,0.22)]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            <div className="border-b border-slate-300 pb-4 mb-6">
              <h2 className="text-xl md:text-2xl font-bold tracking-wide uppercase">{parsed.title}</h2>
              {parsed.subtitle ? <p className="mt-2 text-sm md:text-base text-slate-700 font-semibold">{parsed.subtitle}</p> : null}
            </div>

            {parsed.questions.length > 0 ? (
              <div className="space-y-4 md:space-y-5">
                {parsed.questions.map((item) => (
                  <div key={item.number} className="rounded-xl border border-slate-200 bg-slate-50 px-4 md:px-5 py-4">
                    <p className="text-base md:text-[1.08rem] leading-8 font-bold">
                      <span className="mr-2">Q{item.number}.</span>
                      <span>{item.text}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="text-base leading-8 font-bold whitespace-pre-wrap break-words">{questions}</pre>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <FileText className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No predicted question paper available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPaperPage;
