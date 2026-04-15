import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, RotateCcw, LayoutDashboard } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

/* Mock fallback (only for safety) */
const MOCK_REPORT = {
  score: 87,
  questions: 3,
  duration: '38 min',
  difficulty: 'Medium',
  breakdown: [
    { label: 'Problem Solving', score: 90 },
    { label: 'Code Quality', score: 85 },
    { label: 'Communication', score: 88 },
    { label: 'Time Management', score: 82 },
  ],
  strengths: [
    'Clean variable naming',
    'Correct edge case handling',
    'Explained approach clearly',
  ],
  improvements: [
    'Optimise time complexity',
    'Consider space trade-offs',
    'Speak through each step',
  ],
};

/* Section Label */
function SectionLabel({ num, label }) {
  return (
    <div className="flex items-center gap-3 mb-6">
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

export default function InterviewCompletion() {
  const navigate = useNavigate();
  const location = useLocation();

  const raw = location.state?.report;

  if (!raw) {
    console.warn('No report found. Falling back to mock data.');
  }

  // Defensive merge � backend may return partial data; always guarantee arrays exist
  const data = {
    ...MOCK_REPORT,
    ...raw,
    breakdown:    Array.isArray(raw?.breakdown)    ? raw.breakdown    : MOCK_REPORT.breakdown,
    strengths:    Array.isArray(raw?.strengths)    ? raw.strengths    : MOCK_REPORT.strengths,
    improvements: Array.isArray(raw?.improvements) ? raw.improvements : MOCK_REPORT.improvements,
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white swiss-noise flex flex-col">

      {/* Top Bar */}
      <div className="border-b-2 border-black dark:border-white flex items-stretch h-14 bg-white dark:bg-black sticky top-0 z-40">
        <a
          href="/"
          className="flex items-center px-6 border-r-2 border-black dark:border-white font-black text-sm uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-150"
        >
          CORTEX
        </a>

        <div className="flex items-center px-6">
          <span className="text-xs font-black uppercase tracking-widest text-black/40 dark:text-white/40">
            / Interview Complete
          </span>
        </div>

        <div className="ml-auto flex items-stretch">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 px-6 border-l-2 border-black dark:border-white text-xs font-black uppercase tracking-widest hover:bg-swiss-muted dark:hover:bg-white/10 transition-colors duration-150"
          >
            Dashboard →
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b-2 border-black dark:border-white grid grid-cols-1 lg:grid-cols-12">

        {/* Left */}
        <div className="lg:col-span-8 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white px-6 lg:px-16 py-12 swiss-grid-pattern">
          <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
            Session Complete
          </span>

          <h1 className="mt-3 font-black uppercase tracking-tighter leading-none text-[clamp(3rem,8vw,7rem)]">
            INTERVIEW <br />
            <span className="text-swiss-accent">DONE.</span>
          </h1>

          <p className="mt-6 text-sm text-black/60 dark:text-white/60 max-w-md leading-relaxed">
            Your evaluation is ready. Review your score, read the AI feedback,
            and identify the areas to sharpen before your next session.
          </p>
        </div>

        {/* Right (Score) */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center p-10 swiss-dots bg-swiss-muted dark:bg-white/5 border-b-2 border-black dark:border-white">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">
              Final Score
            </span>

            <div className="text-[6rem] font-black tracking-tighter leading-none">
              {data.score}
            </div>

            <div className="text-xs font-black uppercase tracking-widest text-black/40 dark:text-white/40">
              / 100
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-3 border-t-2 border-black dark:border-white">
            {[
              ['Questions', data.questions],
              ['Duration', data.duration],
              ['Level', data.difficulty],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={`px-4 py-4 ${
                  i < 2 ? 'border-r-2 border-black dark:border-white' : ''
                }`}
              >
                <div className="text-lg font-black tracking-tighter">{v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mt-0.5">
                  {k}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 border-b-2 border-black dark:border-white">

        {/* Left */}
        <div className="lg:col-span-8 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white p-6 lg:p-12">

          {/* Breakdown */}
          <SectionLabel num="01" label="Score Breakdown" />

          <div className="border-2 border-black dark:border-white mb-10">
            {data.breakdown.map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center gap-6 px-6 py-5 ${
                  i < data.breakdown.length - 1
                    ? 'border-b-2 border-black dark:border-white'
                    : ''
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 w-36">
                  {item.label}
                </span>

                <div className="flex-1 h-2 bg-swiss-muted dark:bg-white/10 relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-black dark:bg-white transition-all duration-700"
                    style={{ width: `${item.score}%` }}
                  />
                </div>

                <span className="text-sm font-black w-10 text-right">
                  {item.score}
                </span>
              </div>
            ))}
          </div>

          {/* Strengths + Improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border-2 border-black dark:border-white">

            {/* Strengths */}
            <div className="border-b-2 sm:border-b-0 sm:border-r-2 border-black dark:border-white">
              <div className="px-6 py-4 border-b-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black">
                ✓ Strengths
              </div>

              <ul className="divide-y-2 divide-black dark:divide-white">
                {data.strengths.map((s) => (
                  <li key={s} className="px-6 py-4 text-xs font-bold">
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div>
              <div className="px-6 py-4 border-b-2 border-black dark:border-white bg-swiss-accent text-white">
                ↑ Improve
              </div>

              <ul className="divide-y-2 divide-black dark:divide-white">
                {data.improvements.map((s) => (
                  <li key={s} className="px-6 py-4 text-xs font-bold">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="lg:col-span-4 p-6 lg:p-12 swiss-dots bg-swiss-muted dark:bg-white/5 flex flex-col justify-between">
          <div>
            <SectionLabel num="02" label="Next Steps" />

            <p className="text-sm text-black/60 dark:text-white/60">
              Review your report, then book another session to keep improving.
              Consistency is the only path to performance.
            </p>
          </div>

          <div className="mt-10">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full h-14 flex items-center justify-between px-6 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase border-2 border-black dark:border-white hover:bg-swiss-accent transition"
            >
              <span className="flex items-center gap-3">
                <LayoutDashboard size={14} />
                Dashboard
              </span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => navigate('/select-type')}
              className="w-full h-14 flex items-center justify-between px-6 bg-white dark:bg-black text-black dark:text-white text-xs font-black uppercase border-2 border-black dark:border-white border-t-0 hover:bg-swiss-muted transition"
            >
              <span className="flex items-center gap-3">
                <RotateCcw size={14} />
                Retry
              </span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
