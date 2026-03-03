import { motion } from "framer-motion";
import { ArrowRight, Gauge, Sparkles } from "lucide-react";
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
                <svg
                  viewBox="0 0 800 460"
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full opacity-90"
                >
                  <defs>
                    <linearGradient id="continentFill" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(56,189,248,0.26)" />
                      <stop offset="100%" stopColor="rgba(34,211,238,0.08)" />
                    </linearGradient>
                    <linearGradient id="routeStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(125,211,252,0.12)" />
                      <stop offset="50%" stopColor="rgba(56,189,248,0.7)" />
                      <stop offset="100%" stopColor="rgba(125,211,252,0.12)" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M84 176 L150 142 L248 156 L280 185 L244 219 L168 228 L110 211 Z"
                    fill="url(#continentFill)"
                    stroke="rgba(125,211,252,0.45)"
                    strokeWidth="2"
                  />
                  <path
                    d="M302 154 L372 124 L482 140 L548 180 L520 224 L444 245 L348 230 L292 192 Z"
                    fill="url(#continentFill)"
                    stroke="rgba(125,211,252,0.45)"
                    strokeWidth="2"
                  />
                  <path
                    d="M571 170 L632 146 L706 158 L732 196 L702 228 L646 239 L584 220 Z"
                    fill="url(#continentFill)"
                    stroke="rgba(125,211,252,0.45)"
                    strokeWidth="2"
                  />
                  <path
                    d="M352 280 L408 270 L440 302 L436 354 L392 376 L342 360 L326 316 Z"
                    fill="url(#continentFill)"
                    stroke="rgba(125,211,252,0.42)"
                    strokeWidth="2"
                  />
                  <path
                    d="M642 314 L684 301 L722 322 L716 356 L682 373 L642 359 L626 335 Z"
                    fill="url(#continentFill)"
                    stroke="rgba(125,211,252,0.4)"
                    strokeWidth="2"
                  />

                  <path
                    d="M190 194 C278 142 370 146 452 190"
                    fill="none"
                    stroke="url(#routeStroke)"
                    strokeWidth="2.4"
                    strokeDasharray="6 7"
                  />
                  <path
                    d="M452 192 C533 147 607 155 666 196"
                    fill="none"
                    stroke="url(#routeStroke)"
                    strokeWidth="2.4"
                    strokeDasharray="6 7"
                  />
                  <path
                    d="M404 196 C402 236 396 274 384 322"
                    fill="none"
                    stroke="url(#routeStroke)"
                    strokeWidth="2.4"
                    strokeDasharray="6 7"
                  />
                  <path
                    d="M520 228 C590 252 636 288 666 338"
                    fill="none"
                    stroke="url(#routeStroke)"
                    strokeWidth="2.4"
                    strokeDasharray="6 7"
                  />
                </svg>

                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(153,246,228,0.15)_1px,transparent_1px)] [background-size:26px_26px] opacity-55" />
                <span className="absolute left-[22%] top-[41%] h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_14px_rgba(103,232,249,0.95)]" />
                <span className="absolute left-[48%] top-[40%] h-3.5 w-3.5 rounded-full bg-slate-50 shadow-[0_0_16px_rgba(255,255,255,0.85)]" />
                <span className="absolute left-[70%] top-[42%] h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_14px_rgba(103,232,249,0.95)]" />
                <span className="absolute left-[45%] top-[70%] h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(125,211,252,0.95)]" />
                <span className="absolute left-[72%] top-[76%] h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(125,211,252,0.95)]" />
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainDashboardPage;
