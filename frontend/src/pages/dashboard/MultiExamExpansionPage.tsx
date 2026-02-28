import { motion } from "framer-motion";
import { Plane } from "lucide-react";

const EXAMS = ["AKTU", "RGPV", "SPPU", "GATE", "CBSE", "JEE"];

const MultiExamExpansionPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Multi-Exam Expansion Layer</h1>
        <p className="text-muted-foreground mt-1">AxisStudy is becoming exam-agnostic.</p>
      </div>

      <section className="relative overflow-hidden rounded-3xl glass-panel border border-primary/20 p-6 md:p-10 min-h-[420px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.14),transparent_42%),radial-gradient(circle_at_85%_80%,rgba(14,116,144,0.2),transparent_40%)]" />

        <motion.div
          aria-hidden="true"
          className="absolute top-12 left-[-12%] text-cyan-300/80"
          initial={{ x: "-10vw", y: 0, rotate: -6 }}
          animate={{ x: "115vw", y: [-6, 4, -3, 5, -6], rotate: [-6, -2, 1, -2, -6] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        >
          <Plane className="w-10 h-10 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
        </motion.div>

        <div className="absolute top-24 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />
        <div className="absolute top-44 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />

        <div className="relative z-10 flex min-h-[340px] flex-col justify-center gap-8">
          <div className="inline-flex w-fit items-center rounded-full border border-cyan-300/35 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
            Coming Soon
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-100">
              Next stop: <span className="gradient-text">Every Major Exam</span>
            </h2>
            <p className="text-lg text-slate-300/90">Our team is working on this feature.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {EXAMS.map((exam) => (
              <span
                key={exam}
                className="rounded-full border border-cyan-300/25 bg-slate-900/55 px-4 py-2 text-sm font-semibold text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
              >
                {exam}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MultiExamExpansionPage;
