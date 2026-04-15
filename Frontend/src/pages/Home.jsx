import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ArrowRight, Plus, Code2, Mic, BarChart3, Zap } from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────────────── */

const STATS = [
  { value: "2,400+", label: "Questions" },
  { value: "98%",    label: "Accuracy"  },
  { value: "12min",  label: "Avg. Session" },
  { value: "4.9★",   label: "Rating"    },
];

const FEATURES = [
  {
    num: "01",
    icon: <Mic size={20} strokeWidth={2} />,
    title: "Voice Interview",
    body: "Speak your answers aloud. AssemblyAI transcribes in real-time while our AI interviewer responds with natural follow-up questions.",
  },
  {
    num: "02",
    icon: <Code2 size={20} strokeWidth={2} />,
    title: "Live Code Execution",
    body: "Write, run, and submit code directly in the browser. Hidden test cases evaluate correctness without leaking solutions.",
  },
  {
    num: "03",
    icon: <BarChart3 size={20} strokeWidth={2} />,
    title: "Structured Feedback",
    body: "Every session ends with a scored report: approach quality, code correctness, communication clarity, and improvement areas.",
  },
  {
    num: "04",
    icon: <Zap size={20} strokeWidth={2} />,
    title: "Adaptive Difficulty",
    body: "Choose Easy, Medium, or Hard. The AI adjusts follow-up depth and evaluation criteria to match your target role.",
  },
];

const PROCESS_STEPS = [
  { n: "01", title: "Book a Slot",      body: "Pick a time that works. Slots are available 24/7 with instant confirmation." },
  { n: "02", title: "Configure",        body: "Select difficulty, question count, and whether you want voice or text mode." },
  { n: "03", title: "Interview",        body: "Face the AI interviewer. Answer questions, write code, defend your approach." },
  { n: "04", title: "Review & Improve", body: "Get your score, read the AI report, and track progress over time." },
];

const QUESTION_TYPES = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Binary Search",
  "Linked Lists",
  "Trees & Graphs",
  "Dynamic Programming",
  "System Design",
];

/* ─── Sub-components ────────────────────────────────────────────────────── */

function SectionLabel({ num, label }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
        {num}.
      </span>
      <span className="text-xs font-black uppercase tracking-widest text-black dark:text-white">
        {label}
      </span>
      <div className="flex-1 h-px bg-black dark:bg-white" />
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="group border-2 border-black dark:border-white p-8 bg-white dark:bg-black hover:bg-swiss-accent transition-colors duration-150 cursor-default">
      <div className="flex items-start justify-between">
        <span className="text-5xl font-black leading-none tracking-tighter group-hover:text-white transition-colors duration-150">
          {value}
        </span>
        <Plus
          size={16}
          strokeWidth={3}
          className="mt-1 group-hover:rotate-90 group-hover:text-white transition-all duration-200"
        />
      </div>
      <p className="mt-3 text-xs font-bold uppercase tracking-widest text-black/50 dark:text-white/50 group-hover:text-white/70 transition-colors duration-150">
        {label}
      </p>
    </div>
  );
}

function FeatureCard({ num, icon, title, body }) {
  return (
    <article className="group border-2 border-black dark:border-white p-8 bg-white dark:bg-black hover:bg-black dark:hover:bg-white transition-colors duration-150">
      <div className="flex items-center justify-between mb-6">
        <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
          {num}
        </span>
        <div className="w-9 h-9 border-2 border-black dark:border-white flex items-center justify-center group-hover:border-white dark:group-hover:border-black group-hover:text-white dark:group-hover:text-black transition-colors duration-150">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-black uppercase tracking-tight mb-3 group-hover:text-white dark:group-hover:text-black transition-colors duration-150">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-black/60 dark:text-white/60 group-hover:text-white/70 dark:group-hover:text-black/70 transition-colors duration-150">
        {body}
      </p>
    </article>
  );
}

function ProcessStep({ n, title, body, isLast }) {
  return (
    <div className="flex gap-6">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-2 border-black dark:border-white flex items-center justify-center flex-shrink-0">
          <span className="text-swiss-accent text-xs font-black">{n}</span>
        </div>
        {!isLast && <div className="flex-1 w-px bg-black dark:bg-white mt-2" />}
      </div>
      {/* Content */}
      <div className="pb-10">
        <h3 className="text-base font-black uppercase tracking-tight mb-1">{title}</h3>
        <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-x-hidden relative swiss-noise flex flex-col">
      <Navbar />

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="min-h-screen border-b-2 border-black dark:border-white flex flex-col pt-14">

        {/* Top rule */}
        <div className="border-b-2 border-black dark:border-white px-6 lg:px-12 py-3 flex items-center gap-4">
          <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
            AI Interview Platform
          </span>
          <div className="w-2 h-2 bg-swiss-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40">
            v2.0 — Now with Voice Mode
          </span>
        </div>

        {/* Main hero grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">

          {/* Left: headline */}
          <div className="lg:col-span-8 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white
                          flex flex-col justify-end p-6 lg:p-12 swiss-grid-pattern">
            <p className="swiss-reveal swiss-reveal-1 text-xs font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-6">
              Turn Panic Into Performance
            </p>

            <h1 className="swiss-reveal swiss-reveal-2 font-black uppercase leading-none tracking-tighter
                           text-[clamp(3.5rem,10vw,10rem)]">
              MASTER<br />
              <span className="text-swiss-accent">THE</span><br />
              INTERVIEW.
            </h1>

            <div className="swiss-reveal swiss-reveal-3 mt-10 flex flex-col sm:flex-row gap-0">
              <button
                onClick={() => navigate("/interview/setup")}
                className="flex items-center justify-center gap-3 h-14 px-10
                           bg-black dark:bg-white text-white dark:text-black text-sm font-black uppercase tracking-widest
                           border-2 border-black dark:border-white
                           hover:bg-swiss-accent hover:border-swiss-accent
                           dark:hover:bg-swiss-accent dark:hover:border-swiss-accent dark:hover:text-white
                           transition-colors duration-150"
              >
                Start Interview
                <ArrowRight size={16} strokeWidth={3} />
              </button>
              <button
                onClick={() => navigate("/select-type")}
                className="flex items-center justify-center gap-3 h-14 px-10
                           bg-white dark:bg-black text-black dark:text-white text-sm font-black uppercase tracking-widest
                           border-2 border-black dark:border-white border-l-0 sm:border-l-0
                           hover:bg-swiss-muted dark:hover:bg-white/10
                           transition-colors duration-150"
              >
                Book a Slot
              </button>
            </div>
          </div>

          {/* Right: geometric composition + stats */}
          <div className="lg:col-span-4 flex flex-col">

            {/* Bauhaus composition */}
            <div className="flex-1 relative overflow-hidden swiss-dots bg-swiss-muted dark:bg-white/5 border-b-2 border-black dark:border-white min-h-[240px]">
              {/* Large circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                              w-48 h-48 rounded-full border-4 border-black dark:border-white" />
              {/* Red filled square */}
              <div className="absolute top-8 right-8 w-16 h-16 bg-swiss-accent" />
              {/* Horizontal rule */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black dark:bg-white" />
              {/* Vertical rule */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black dark:bg-white" />
              {/* Small dot */}
              <div className="absolute bottom-10 left-10 w-6 h-6 bg-black dark:bg-white rounded-full" />
              {/* Label */}
              <span className="absolute bottom-4 right-4 text-[10px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">
                Cortex / 2025
              </span>
            </div>

            {/* Stats 2×2 */}
            <div className="grid grid-cols-2">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`
                    group p-6 border-black dark:border-white cursor-default
                    hover:bg-swiss-accent transition-colors duration-150
                    ${i % 2 === 0 ? "border-r-2" : ""}
                    ${i < 2 ? "border-b-2" : ""}
                    ${i === 0 ? "border-t-2" : ""}
                  `}
                >
                  <div className="text-3xl font-black tracking-tighter leading-none group-hover:text-white transition-colors duration-150">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 group-hover:text-white/70 transition-colors duration-150">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          01. WHAT IS CORTEX
      ══════════════════════════════════════════════════════ */}
      <section id="features" className="border-b-2 border-black dark:border-white">
        <div className="grid grid-cols-1 lg:grid-cols-12">

          {/* Sticky label column */}
          <div className="lg:col-span-4 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white
                          p-6 lg:p-12 swiss-diagonal bg-swiss-muted dark:bg-white/5">
            <SectionLabel num="01" label="System" />
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none">
              WHAT IS<br />CORTEX?
            </h2>
            <div className="mt-8 w-12 h-1 bg-swiss-accent" />
          </div>

          {/* Content */}
          <div className="lg:col-span-8 p-6 lg:p-12">
            <p className="text-lg lg:text-xl leading-relaxed text-black/70 dark:text-white/70 max-w-2xl">
              Cortex is an AI-powered interview preparation platform built to simulate
              real technical interviews — not passive problem solving. You practice under
              pressure, defend your approach, and receive structured feedback that
              actually improves your performance.
            </p>
            <p className="mt-6 text-lg lg:text-xl leading-relaxed text-black/70 dark:text-white/70 max-w-2xl">
              From curated question sets like Blind 75 to live mock sessions with voice
              interaction and performance analytics, Cortex identifies your weaknesses
              and builds the confidence that shows up on interview day.
            </p>

            {/* Inline stat row */}
            <div className="mt-12 flex flex-wrap gap-0 border-t-2 border-black dark:border-white pt-8">
              {[
                ["Blind 75", "Included"],
                ["LeetCode-style", "Execution"],
                ["AI Feedback", "Every Session"],
              ].map(([title, sub]) => (
                <div key={title} className="pr-10 mr-10 border-r-2 border-black dark:border-white last:border-r-0 last:mr-0 mb-4">
                  <div className="text-sm font-black uppercase tracking-tight">{title}</div>
                  <div className="text-xs text-black/40 dark:text-white/40 font-bold uppercase tracking-widest mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          02. FEATURES
      ══════════════════════════════════════════════════════ */}
      <section id="method" className="border-b-2 border-black dark:border-white p-6 lg:p-12">
        <SectionLabel num="02" label="Features" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-black dark:border-white">
          {FEATURES.map((f, i) => (
            <div
              key={f.num}
              className={`${i < FEATURES.length - 1 ? "border-r-0 sm:border-r-2 border-b-2 sm:border-b-0 border-black dark:border-white" : ""}`}
            >
              <FeatureCard {...f} />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          03. PROCESS
      ══════════════════════════════════════════════════════ */}
      <section className="border-b-2 border-black dark:border-white">
        <div className="grid grid-cols-1 lg:grid-cols-12">

          {/* Process steps */}
          <div className="lg:col-span-7 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white p-6 lg:p-12">
            <SectionLabel num="03" label="Method" />
            <div className="mt-2">
              {PROCESS_STEPS.map((step, i) => (
                <ProcessStep
                  key={step.n}
                  {...step}
                  isLast={i === PROCESS_STEPS.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Question types sidebar */}
          <div className="lg:col-span-5 p-6 lg:p-12 swiss-dots bg-swiss-muted dark:bg-white/5">
            <SectionLabel num="03b" label="Question Bank" />
            <ul className="space-y-0 border-t-2 border-black dark:border-white">
              {QUESTION_TYPES.map((q) => (
                <li
                  key={q}
                  className="group flex items-center justify-between
                             border-b-2 border-black dark:border-white py-4
                             hover:bg-black hover:text-white
                             dark:hover:bg-white dark:hover:text-black
                             px-2 -mx-2 transition-colors duration-150 cursor-default"
                >
                  <span className="text-sm font-bold uppercase tracking-wide group-hover:text-white dark:group-hover:text-black transition-colors duration-150">
                    {q}
                  </span>
                  <ArrowRight
                    size={14}
                    strokeWidth={3}
                    className="text-black/30 dark:text-white/30 group-hover:text-swiss-accent transition-colors duration-150"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          04. CTA BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="border-b-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black p-6 lg:p-12 swiss-grid-pattern">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
              04. Start Now
            </span>
            <h2 className="mt-4 font-black uppercase tracking-tighter leading-none
                           text-[clamp(3rem,8vw,7rem)] text-white dark:text-black">
              READY TO<br />
              <span className="text-swiss-accent">PERFORM?</span>
            </h2>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-3">
            <button
              onClick={() => navigate("/interview/setup")}
              className="flex items-center justify-between h-14 px-8
                         bg-swiss-accent text-white text-sm font-black uppercase tracking-widest
                         border-2 border-swiss-accent
                         hover:bg-white hover:text-black hover:border-white
                         dark:hover:bg-black dark:hover:text-white dark:hover:border-black
                         transition-colors duration-150"
            >
              Start Interview
              <ArrowRight size={16} strokeWidth={3} />
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center justify-between h-14 px-8
                         bg-transparent text-white dark:text-black text-sm font-black uppercase tracking-widest
                         border-2 border-white dark:border-black
                         hover:bg-white hover:text-black
                         dark:hover:bg-black dark:hover:text-white
                         transition-colors duration-150"
            >
              Create Account
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer className="border-t-2 border-black dark:border-white">
        <div className="grid grid-cols-1 lg:grid-cols-12">

          {/* Brand */}
          <div className="lg:col-span-4 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white p-6 lg:p-10">
            <div className="text-2xl font-black uppercase tracking-widest">CORTEX</div>
            <p className="mt-3 text-xs text-black/50 dark:text-white/50 leading-relaxed max-w-xs">
              AI-powered mock interview platform. Practice. Perform. Prevail.
            </p>
          </div>

          {/* Links */}
          <div className="lg:col-span-4 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white p-6 lg:p-10">
            <div className="text-xs font-black uppercase tracking-widest mb-4 text-black/40 dark:text-white/40">Platform</div>
            {["Dashboard", "Interview Setup", "Question Bank", "My Interviews"].map((l) => (
              <div key={l} className="text-sm font-bold uppercase tracking-wide py-1.5 hover:text-swiss-accent cursor-pointer transition-colors duration-150">
                {l}
              </div>
            ))}
          </div>

          {/* Legal */}
          <div className="lg:col-span-4 p-6 lg:p-10">
            <div className="text-xs font-black uppercase tracking-widest mb-4 text-black/40 dark:text-white/40">Legal</div>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <div key={l} className="text-sm font-bold uppercase tracking-wide py-1.5 hover:text-swiss-accent cursor-pointer transition-colors duration-150">
                {l}
              </div>
            ))}
            <div className="mt-8 text-xs text-black/30 dark:text-white/30 font-bold uppercase tracking-widest">
              © 2025 Cortex
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
