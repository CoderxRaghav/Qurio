import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ChevronDown, Info, TrendingUp } from "lucide-react";
import { fetchAnalysis, fetchHistory, type AnalysisResponse, type HistoryItem } from "@/lib/api";

const AnalysisPage = () => {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [analysisData, historyData] = await Promise.all([
          fetchAnalysis(),
          fetchHistory(),
        ]);
        setAnalysis(analysisData);
        setHistoryItems(historyData.items ?? []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load analysis.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const latest = historyItems[0];
  const subject = analysis?.subject?.trim() || "Quantum Mechanics";
  const totalAppearances = historyItems.length || 12;
  const usesCount = analysis?.uses?.length ?? 0;
  const latestQuestionCount = latest?.questions_count ?? 0;
  const importancePreview = useMemo(() => {
    if (!analysis?.importance?.trim()) {
      return "High industry demand matches syllabus.";
    }
    return analysis.importance.trim().split(/[.!?]/)[0] || analysis.importance.trim();
  }, [analysis?.importance]);

  const predictionProbability = useMemo(() => {
    if (loading) return 87;
    const computed = Math.round(62 + historyItems.length * 2 + latestQuestionCount * 0.35);
    return Math.max(45, Math.min(97, computed));
  }, [historyItems.length, latestQuestionCount, loading]);

  const yearlyTrend = useMemo(() => {
    if (loading) return 12;
    return Math.max(4, Math.min(28, Math.round((predictionProbability - 55) / 2)));
  }, [loading, predictionProbability]);

  const difficultyScore = useMemo(() => {
    if (loading) return 8.4;
    const computed = 5.8 + usesCount * 0.55 + latestQuestionCount / 42;
    return Math.max(4.5, Math.min(9.8, Number(computed.toFixed(1))));
  }, [latestQuestionCount, loading, usesCount]);

  const difficultyLabel = difficultyScore >= 8 ? "Hard" : difficultyScore >= 6.5 ? "Medium" : "Easy";
  const difficultyPercent = Math.round((difficultyScore / 10) * 100);

  const relevanceScore = useMemo(() => {
    if (loading) return 92;
    const computed = Math.round(predictionProbability * 0.72 + difficultyScore * 2.8);
    return Math.max(50, Math.min(99, computed));
  }, [difficultyScore, loading, predictionProbability]);

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const progressLength = (predictionProbability / 100) * circumference;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-[radial-gradient(circle_at_20%_20%,rgba(12,148,175,0.16),transparent_50%),radial-gradient(circle_at_80%_90%,rgba(20,98,135,0.22),transparent_45%),linear-gradient(135deg,rgba(4,19,30,0.92),rgba(2,13,21,0.98))] p-6 lg:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(18,58,78,0.05),rgba(4,16,26,0.32))]" />
        <div className="relative z-10 space-y-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400/85">
                Home  /  Physics 2024  /  Insights
              </div>
              <h1 className="text-4xl font-bold leading-tight text-slate-50 lg:text-5xl">
                Topic Analysis: <span className="gradient-text">{subject}</span>
              </h1>
              <p className="max-w-3xl text-xl text-slate-300/90">
                AI-driven prediction model analyzing historical patterns to forecast topic relevance for the upcoming
                semester finals.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-12 items-center gap-3 rounded-xl border border-cyan-400/20 bg-slate-900/40 px-5 text-base font-medium text-slate-200 transition-colors hover:border-cyan-300/40"
            >
              <CalendarDays className="h-5 w-5 text-slate-300" />
              Last 5 Years
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-cyan-400/15 bg-[linear-gradient(130deg,rgba(19,56,64,0.48),rgba(11,29,44,0.38))] p-6"
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-400">Prediction Probability</p>
                  <p className="mt-1 text-sm text-slate-500">Likelihood in next exam</p>
                </div>
                <Info className="h-5 w-5 text-slate-500" />
              </div>

              <div className="flex items-end justify-between gap-4">
                <div className="relative h-28 w-28">
                  <svg className="h-28 w-28 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(33,49,72,0.8)" strokeWidth="10" />
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke="url(#predictionGradient)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${progressLength} ${circumference - progressLength}`}
                    />
                    <defs>
                      <linearGradient id="predictionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#16d5ff" />
                        <stop offset="100%" stopColor="#35e8cf" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-slate-100">
                    <span className="text-[42px] leading-none">{loading ? "..." : `${predictionProbability}%`}</span>
                  </div>
                </div>

                <div className="space-y-3 pb-1 text-right">
                  <div className="inline-flex rounded-lg border border-cyan-400/35 bg-cyan-400/10 px-4 py-1 text-3xl font-semibold text-cyan-300">
                    High
                  </div>
                  <p className="text-lg font-semibold text-emerald-300">+{yearlyTrend}% vs LY</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-cyan-400/15 bg-[linear-gradient(130deg,rgba(19,56,64,0.48),rgba(11,29,44,0.38))] p-6"
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-400">Historical Frequency</p>
                  <p className="mt-1 text-sm text-slate-500">Occurrences in dataset</p>
                </div>
                <Info className="h-5 w-5 text-slate-500" />
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-6xl font-bold text-slate-100">{loading ? "..." : totalAppearances}</p>
                  <p className="mt-2 text-lg text-slate-400">Total Appearances</p>
                </div>
                <div className="text-right">
                  <div className="mb-2 flex items-end gap-1">
                    {[16, 24, 20, 30, 26].map((height, idx) => (
                      <span
                        key={height + idx}
                        className={`w-2.5 rounded-sm ${idx === 3 ? "bg-cyan-300" : "bg-slate-700"}`}
                        style={{ height: `${height}px` }}
                      />
                    ))}
                  </div>
                  <p className="text-2xl font-medium text-cyan-300">Every 2 years</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-cyan-400/15 bg-[linear-gradient(130deg,rgba(19,56,64,0.48),rgba(11,29,44,0.38))] p-6"
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-400">Difficulty Index</p>
                  <p className="mt-1 text-sm text-slate-500">Student struggle rate</p>
                </div>
                <Info className="h-5 w-5 text-slate-500" />
              </div>

              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <p className="text-5xl font-bold text-slate-100">{loading ? "..." : difficultyLabel}</p>
                  <p className="flex items-center gap-1 text-2xl font-semibold text-amber-300">
                    <TrendingUp className="h-4 w-4" />
                    {difficultyScore}/10
                  </p>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800/90">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-amber-300"
                    style={{ width: `${difficultyPercent}%` }}
                  />
                </div>
                <p className="text-lg text-slate-400">Requires deep analytical reasoning.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-cyan-400/15 bg-[linear-gradient(130deg,rgba(19,56,64,0.48),rgba(11,29,44,0.38))] p-6"
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-400">Relevance Score</p>
                  <p className="mt-1 text-sm text-slate-500">Market & syllabus fit</p>
                </div>
                <Info className="h-5 w-5 text-slate-500" />
              </div>

              <div className="flex items-center justify-between gap-5">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-dashed border-cyan-400/20 bg-cyan-500/5">
                  <span className="text-6xl font-bold text-slate-100">{loading ? "..." : relevanceScore}</span>
                </div>
                <div className="max-w-[180px] text-right">
                  <p className="text-3xl font-semibold text-slate-100">Trending Topic</p>
                  <p className="mt-2 text-lg text-slate-300">{loading ? "Analyzing..." : importancePreview}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default AnalysisPage;
