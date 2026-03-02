import { motion } from "framer-motion";
import { ArrowRight, Gauge, Lock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const MainDashboardPage = () => {
  return (
    <div className="-mx-6 -mt-4 space-y-10 pb-4 lg:-mx-8">
      <section className="relative overflow-hidden border-y border-cyan-500/20 bg-[radial-gradient(circle_at_20%_18%,rgba(14,178,208,0.2),transparent_40%),linear-gradient(140deg,#041723_8%,#062534_56%,#041e2b_100%)] px-6 pb-16 pt-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 flex w-full max-w-5xl flex-col gap-4 rounded-[32px] border border-cyan-400/25 bg-slate-950/65 px-4 py-3 shadow-[0_0_55px_rgba(9,151,177,0.16)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 text-lg font-extrabold text-slate-900">
                A
              </div>
              <p className="text-2xl font-bold text-slate-100 lg:text-3xl">AxisStudy AI</p>
            </div>
            <div className="flex items-center gap-4 self-start lg:self-auto">
              <Link
                to="/dashboard/upload"
                className="inline-flex items-center rounded-full bg-cyan-400 px-5 py-2.5 text-base font-bold text-slate-900 shadow-[0_8px_25px_rgba(34,211,238,0.35)] transition-transform hover:scale-[1.02] lg:px-7 lg:py-3 lg:text-lg"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/5 px-5 py-2 text-sm font-bold uppercase tracking-[0.14em] text-cyan-300">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                Powered by AxisStudy Intelligence
              </div>
              <h1 className="text-5xl font-black leading-[0.95] text-slate-100 md:text-6xl xl:text-7xl">
                Build Your
                <br />
                Academic <span className="text-cyan-300">Empire</span>
              </h1>
              <p className="max-w-xl text-xl leading-relaxed text-slate-300/85 md:text-2xl xl:text-3xl">
                Leverage next-gen AI to decode research, generate insights, and master your field with unparalleled speed.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/dashboard/upload"
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-7 py-4 text-xl font-bold text-slate-900 transition-transform hover:scale-[1.02] md:px-8 md:py-5 md:text-2xl"
                >
                  Start Researching <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[30px] border border-cyan-400/20 bg-gradient-to-br from-slate-900/80 to-cyan-950/45 p-6 shadow-[0_0_70px_rgba(16,165,185,0.16)]"
            >
              <div className="mb-5 flex items-center justify-between border-b border-cyan-500/15 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full bg-rose-400/85" />
                  <span className="h-3.5 w-3.5 rounded-full bg-amber-400/85" />
                  <span className="h-3.5 w-3.5 rounded-full bg-emerald-400/85" />
                </div>
                <div className="h-4 w-44 rounded-full bg-slate-700/60" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-[88px_1fr]">
                <div className="rounded-[22px] bg-slate-900/55 p-4">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-300">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="h-3 w-6 rounded bg-slate-500/70" />
                  <div className="mt-7 h-3 w-5 rounded bg-slate-500/70" />
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_190px]">
                    <div className="rounded-[24px] bg-gradient-to-br from-cyan-500/25 to-slate-900/45 p-5">
                      <div className="mb-7 h-3.5 w-40 rounded-full bg-slate-400/55" />
                      <div className="flex items-end gap-2">
                        {[36, 54, 80, 46].map((h, idx) => (
                          <span
                            key={h + idx}
                            style={{ height: `${h}px` }}
                            className={`w-full rounded-sm ${idx === 2 ? "bg-cyan-400" : "bg-cyan-400/55"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-center rounded-[24px] bg-cyan-500/14">
                      <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-cyan-400/65 text-5xl font-bold text-slate-100">
                        98%
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-cyan-900/30 p-5">
                    <div className="space-y-5">
                      <div className="flex items-center gap-4">
                        <span className="h-11 w-11 rounded-full bg-blue-400/45" />
                        <span className="h-3 w-full rounded-full bg-slate-400/35" />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="h-11 w-11 rounded-full bg-indigo-400/45" />
                        <span className="h-3 w-full rounded-full bg-slate-400/35" />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="h-11 w-11 rounded-full bg-cyan-400/45" />
                        <span className="h-3 w-full rounded-full bg-slate-400/35" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-[28px] border border-cyan-400/20 bg-[linear-gradient(120deg,rgba(5,20,30,0.95),rgba(7,32,43,0.92),rgba(9,37,49,0.9))] shadow-[0_0_70px_rgba(8,145,178,0.14)] lg:grid-cols-2">
          <div className="relative min-h-[460px] border-b border-cyan-500/15 p-6 lg:border-b-0 lg:border-r">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(34,211,238,0.28),transparent_52%)]" />
            <div className="relative h-full rounded-2xl border border-cyan-300/15 bg-[linear-gradient(150deg,rgba(4,16,25,0.9),rgba(2,12,21,0.95))] p-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(36,208,228,0.2),transparent_55%)]" />
              <div className="relative h-full w-full overflow-hidden rounded-xl border border-cyan-400/10 bg-[linear-gradient(160deg,rgba(7,32,46,0.22),rgba(4,19,29,0.32))]">
                <div className="absolute left-[6%] top-[22%] h-28 w-36 rounded-[52%_48%_42%_58%] border border-cyan-200/35 bg-cyan-300/10 blur-[0.2px]" />
                <div className="absolute left-[36%] top-[18%] h-40 w-52 rounded-[46%_54%_52%_48%] border border-cyan-200/30 bg-cyan-300/10" />
                <div className="absolute left-[68%] top-[24%] h-32 w-[6.5rem] rounded-[58%_42%_56%_44%] border border-cyan-200/30 bg-cyan-300/10" />
                <div className="absolute left-[40%] top-[58%] h-[8.5rem] w-[7.5rem] rounded-[62%_38%_45%_55%] border border-cyan-200/30 bg-cyan-300/10" />
                <div className="absolute left-[18%] top-[67%] h-20 w-24 rounded-[54%_46%_53%_47%] border border-cyan-200/25 bg-cyan-300/10" />
                <div className="absolute left-[74%] top-[71%] h-16 w-20 rounded-[60%_40%_52%_48%] border border-cyan-200/25 bg-cyan-300/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(153,246,228,0.15)_1px,transparent_1px)] [background-size:26px_26px] opacity-55" />
                <span className="absolute left-[65%] top-[42%] h-3.5 w-3.5 rounded-full bg-slate-50 shadow-[0_0_16px_rgba(255,255,255,0.8)]" />
              </div>
            </div>
          </div>

          <div className="p-8 lg:p-10">
            <h2 className="text-4xl font-bold text-slate-100 lg:text-5xl">Global Knowledge Graph</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300/85 md:text-xl lg:text-2xl">
              AxisStudy AI does not just read documents; it understands the world. Our knowledge graph connects researchers
              across continents, identifying collaboration opportunities before you even search for them.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-5 rounded-3xl border border-cyan-300/15 bg-cyan-900/20 px-5 py-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <Gauge className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-slate-100 lg:text-3xl">Real-time Indexing</p>
                  <p className="text-base text-slate-400 lg:text-2xl">Updates every 45 milliseconds</p>
                </div>
              </div>

              <div className="flex items-center gap-5 rounded-3xl border border-cyan-300/15 bg-cyan-900/20 px-5 py-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-slate-100 lg:text-3xl">Enterprise Grade Security</p>
                  <p className="text-base text-slate-400 lg:text-2xl">SOC2 Type II compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainDashboardPage;
