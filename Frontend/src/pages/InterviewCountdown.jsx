import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function InterviewCountdown() {
  const [count, setCount] = useState(5);
  const navigate    = useNavigate();
  const location    = useLocation();
  const interviewId = location.state?.interviewId || `INT-${Math.floor(Math.random() * 90000) + 10000}`;
  const questions   = location.state?.questions   || [];
  const sessionId   = location.state?.sessionId   || null;

  // 🚨 VALIDATION: Redirect if critical data is missing
  useEffect(() => {
    if (!sessionId || !questions || questions.length === 0) {
      console.error('❌ Missing sessionId or questions in InterviewCountdown');
      alert('Session data is missing. Redirecting to setup...');
      navigate('/interview/setup', { replace: true });
    }
  }, [sessionId, questions, navigate]);

  useEffect(() => {
    if (count === 0) {
      navigate(`/interview/session/${interviewId}`, {
        replace: true,
        state: { questions, sessionId },
      });
      return;
    }
    const t = setInterval(() => setCount((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [count, navigate, interviewId, questions, sessionId]);

  /* Progress bar width: 5→0 maps to 100%→0% */
  const progressPct = (count / 5) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col swiss-noise relative">

      {/* Top bar */}
      <div className="border-b-2 border-black dark:border-white flex items-stretch h-14 bg-white dark:bg-black">
        <div className="flex items-center px-6 border-r-2 border-black dark:border-white">
          <span className="font-black text-sm uppercase tracking-widest">CORTEX</span>
        </div>
        {/* Step strip */}
        {['Setup', 'Permissions', 'Countdown', 'Interview'].map((s, i) => (
          <div key={s}
            className={`flex items-center px-5 border-r-2 border-black dark:border-white text-[10px] font-black uppercase tracking-widest
              ${i === 2 ? 'bg-black dark:bg-white text-white dark:text-black' : i < 2 ? 'bg-swiss-muted dark:bg-white/5 text-black/40 dark:text-white/40' : 'bg-white dark:bg-black text-black/20 dark:text-white/20'}`}>
            <span className={`mr-2 ${i === 2 ? 'text-swiss-accent' : ''}`}>
              {String(i + 1).padStart(2, '0')}.
            </span>
            {s}
          </div>
        ))}
        <div className="ml-auto">
          <ThemeToggle variant="minimal" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-swiss-muted dark:bg-white/5 border-b-2 border-black dark:border-white">
        <div
          className="h-full bg-black dark:bg-white transition-all duration-1000 ease-linear"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Main */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">

        {/* Left: big number */}
        <div className="lg:col-span-7 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white
                        flex flex-col items-start justify-between p-6 lg:p-16 swiss-grid-pattern">

          <div>
            <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
              03. Countdown
            </span>
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40">
              Interview begins in
            </p>
          </div>

          {/* Giant number */}
          <div className="my-auto py-12 w-full">
            <div
              key={count}
              className="font-black tracking-tighter leading-none select-none
                         text-[clamp(8rem,25vw,18rem)]
                         swiss-reveal swiss-reveal-1"
            >
              {count}
            </div>
            {/* Horizontal rule under number */}
            <div className="h-1 bg-black dark:bg-white mt-4 w-full" />
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30">
            Do not refresh the page.
          </p>
        </div>

        {/* Right: session info */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex-1 p-6 lg:p-16 swiss-dots bg-swiss-muted dark:bg-white/5 flex flex-col justify-between">

            <div>
              <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
                Session
              </span>
              <div className="mt-4 border-2 border-black dark:border-white bg-white dark:bg-black">
                {[
                  ['Interview ID', interviewId],
                  ['Questions',    questions.length > 0 ? `${questions.length} loaded` : 'Loading...'],
                  ['Status',       count > 0 ? 'Preparing...' : 'Launching'],
                ].map(([k, v], i, arr) => (
                  <div key={k}
                    className={`flex justify-between items-center px-5 py-4
                      ${i < arr.length - 1 ? 'border-b-2 border-black dark:border-white' : ''}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">{k}</span>
                    <span className={`text-xs font-black uppercase tracking-widest
                      ${k === 'Interview ID' ? 'text-swiss-accent' : 'text-black dark:text-white'}`}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tick marks */}
            <div className="mt-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-black/30 dark:text-white/30 mb-3">
                Elapsed
              </p>
              <div className="flex gap-2">
                {[5, 4, 3, 2, 1].map((n) => (
                  <div key={n}
                    className={`flex-1 h-2 border-2 border-black dark:border-white transition-colors duration-500
                      ${count < n ? 'bg-black dark:bg-white' : 'bg-white dark:bg-black'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
