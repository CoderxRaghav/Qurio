import { FormEvent, useState } from "react";
import { Loader2, MessageSquareText } from "lucide-react";
import { askQurio } from "@/lib/api";

// Representative marks values used by backend to choose answer structure.
const MARK_OPTIONS = [
  { label: "2-3 Marks (Short Answer)", value: 3 },
  { label: "5 Marks (Medium Answer)", value: 5 },
  { label: "7-10 Marks (Long Answer)", value: 10 },
];

const AskQurioAI = () => {
  const [question, setQuestion] = useState("");
  const [marks, setMarks] = useState<number>(MARK_OPTIONS[0].value);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setError("Please type a question before asking Qurio.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer("");

    try {
      const response = await askQurio({ question: trimmedQuestion, marks });
      setAnswer(response.answer.trim());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get response from Ask Qurio AI.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Ask Qurio AI</h1>
        <p className="text-muted-foreground mt-1">Get exam-oriented doubt solutions based on your selected marks pattern.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 space-y-5">
        <div className="space-y-2">
          <label htmlFor="qurio-question" className="text-sm font-medium text-foreground">
            Your Question
          </label>
          <textarea
            id="qurio-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Type your doubt here..."
            className="input-glass min-h-[220px] w-full rounded-xl px-4 py-3 text-sm resize-y"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="qurio-marks" className="text-sm font-medium text-foreground">
            Answer Type
          </label>
          <select
            id="qurio-marks"
            value={marks}
            onChange={(event) => setMarks(Number(event.target.value))}
            className="input-glass h-11 w-full rounded-xl px-3 text-sm"
            disabled={loading}
          >
            {MARK_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-slate-900 text-slate-100">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn-neon px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquareText className="w-4 h-4" />}
          {loading ? "Asking Qurio..." : "Ask Qurio"}
        </button>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>

      {(loading || answer) && (
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Response</h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {marks} Marks Format
            </span>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Generating exam-oriented answer...
            </div>
          ) : (
            <pre className="text-sm whitespace-pre-wrap break-words">{answer}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default AskQurioAI;
