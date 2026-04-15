import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Zap, Shield, Star } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import {
  useBooking,
  INTERVIEW_TYPES,
  DIFFICULTIES,
  DIFF_META,
  PACKS,
} from '../context/BookingContext';

const PACK_ICONS = {
  starter:  <Zap    size={18} strokeWidth={2.5} />,
  standard: <Star   size={18} strokeWidth={2.5} />,
  pro:      <Shield size={18} strokeWidth={2.5} />,
};

function SectionLabel({ num, label }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">{num}.</span>
      <span className="text-xs font-black uppercase tracking-widest text-black dark:text-white">{label}</span>
      <div className="flex-1 h-px bg-black dark:bg-white" />
    </div>
  );
}

export default function InterviewBooking() {
  const navigate = useNavigate();
  const { booking, setDifficulty, setPack } = useBooking();
  const [confirmed, setConfirmed] = useState(false);
  const [interviewId, setInterviewId] = useState('');

  // Guard: if no type selected, redirect to step 1
  useEffect(() => {
    if (!booking.type) {
      navigate('/select-type', { replace: true });
    }
  }, [booking.type, navigate]);

  const selectedType = INTERVIEW_TYPES.find(t => t.id === booking.type);

  const handleConfirm = () => {
    const id = `INT-${Math.floor(10000 + Math.random() * 90000)}`;
    setInterviewId(id);
    setConfirmed(true);
  };

  if (!booking.type) return null; // prevent flash before redirect

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white swiss-noise relative flex flex-col">

      {/* Top bar */}
      <div className="border-b-2 border-black dark:border-white flex items-stretch h-14 sticky top-0 bg-white dark:bg-black z-40">
        <a href="/"
          className="flex items-center px-6 border-r-2 border-black dark:border-white
                     font-black text-sm uppercase tracking-widest
                     hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black
                     transition-colors duration-150">
          CORTEX
        </a>

        {/* Step breadcrumb */}
        <div className="flex items-stretch overflow-x-auto">
          {['Type', 'Configure', 'Confirm'].map((s, i) => (
            <div key={s}
              className={`flex items-center px-5 border-r-2 border-black dark:border-white
                          text-[10px] font-black uppercase tracking-widest
                          ${i === 1
                            ? 'bg-black dark:bg-white text-white dark:text-black'
                            : i === 0
                              ? 'bg-swiss-muted dark:bg-white/5 text-black/40 dark:text-white/40'
                              : 'bg-white dark:bg-black text-black/20 dark:text-white/20'}`}>
              <span className={`mr-2 ${i === 1 ? 'text-swiss-accent' : ''}`}>
                {String(i + 1).padStart(2, '0')}.
              </span>
              {s}
            </div>
          ))}
        </div>

        <div className="ml-auto flex items-stretch">
          <button
            onClick={() => navigate('/select-type')}
            className="flex items-center px-6 border-l-2 border-black dark:border-white
                       text-xs font-black uppercase tracking-widest
                       hover:bg-swiss-muted dark:hover:bg-white/10 transition-colors duration-150"
          >
            ← Back
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Page header */}
      <div className="border-b-2 border-black dark:border-white px-6 lg:px-12 py-8 swiss-grid-pattern bg-swiss-muted dark:bg-white/5">
        <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
          Step 02 / 03 — {selectedType?.label}
        </span>
        <h1 className="mt-2 font-black uppercase tracking-tighter leading-none text-[clamp(2.5rem,6vw,5rem)]">
          CONFIGURE<br />YOUR SESSION.
        </h1>
      </div>

      {/* Main grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">

        {/* Left: config */}
        <div className="lg:col-span-8 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white">

          {/* Difficulty */}
          <div className="border-b-2 border-black dark:border-white p-6 lg:p-10">
            <SectionLabel num="01" label="Select Difficulty" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-2 border-black dark:border-white">
              {DIFFICULTIES.map((d, i) => {
                const active = booking.difficulty === d;
                return (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`
                      relative flex flex-col items-start p-6 text-left transition-colors duration-150
                      ${i < 2 ? 'border-b-2 sm:border-b-0 sm:border-r-2 border-black dark:border-white' : ''}
                      ${active
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'bg-white dark:bg-black text-black dark:text-white hover:bg-swiss-muted dark:hover:bg-white/10'}
                    `}
                  >
                    {active && (
                      <div className="absolute top-3 right-3">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                    <span className={`text-xs font-black uppercase tracking-widest mb-2
                      ${active ? 'text-swiss-accent' : 'text-black/40 dark:text-white/40'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base font-black uppercase tracking-tight">{d}</span>
                    <span className={`mt-1 text-xs leading-relaxed
                      ${active ? 'text-white/60 dark:text-black/60' : 'text-black/40 dark:text-white/40'}`}>
                      {DIFF_META[d].desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pack */}
          <div className="p-6 lg:p-10">
            <SectionLabel num="02" label="Choose a Pack" />
            <div className="space-y-0 border-2 border-black dark:border-white">
              {PACKS.map((pack, i) => {
                const active = booking.pack.id === pack.id;
                return (
                  <button
                    key={pack.id}
                    onClick={() => setPack(pack)}
                    className={`
                      w-full flex items-center justify-between p-6 text-left transition-colors duration-150
                      ${i < PACKS.length - 1 ? 'border-b-2 border-black dark:border-white' : ''}
                      ${active
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'bg-white dark:bg-black text-black dark:text-white hover:bg-swiss-muted dark:hover:bg-white/10'}
                    `}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-10 h-10 border-2 flex items-center justify-center flex-shrink-0
                        ${active ? 'border-white dark:border-black' : 'border-black dark:border-white'}`}>
                        {PACK_ICONS[pack.id]}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black uppercase tracking-tight">{pack.title}</span>
                          {pack.popular && (
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-swiss-accent text-white">
                              Popular
                            </span>
                          )}
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-widest
                          ${active ? 'text-white/60 dark:text-black/60' : 'text-black/40 dark:text-white/40'}`}>
                          {pack.questions} Questions
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-black tracking-tighter">${pack.price}</span>
                      {active && <Check size={16} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-14">
            {!confirmed ? (
              <div className="p-6 lg:p-8 swiss-dots bg-swiss-muted dark:bg-white/5 border-b-2 border-black dark:border-white">
                <SectionLabel num="03" label="Summary" />
                <div className="space-y-0 border-2 border-black dark:border-white bg-white dark:bg-black mb-6">
                  {[
                    ['Type',       selectedType?.label ?? '—'],
                    ['Difficulty', booking.difficulty],
                    ['Pack',       booking.pack.title],
                    ['Questions',  `${booking.pack.questions} questions`],
                    ['Price',      `$${booking.pack.price}`],
                  ].map(([k, v], i, arr) => (
                    <div key={k}
                      className={`flex justify-between items-center px-5 py-4
                        ${i < arr.length - 1 ? 'border-b-2 border-black dark:border-white' : ''}`}>
                      <span className="text-xs font-black uppercase tracking-widest text-black/40 dark:text-white/40">{k}</span>
                      <span className={`text-sm font-black uppercase tracking-tight
                        ${k === 'Type' ? 'text-swiss-accent' : ''}`}>
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleConfirm}
                  className="w-full h-14 flex items-center justify-between px-5
                             bg-black dark:bg-white text-white dark:text-black text-sm font-black uppercase tracking-widest
                             border-2 border-black dark:border-white
                             hover:bg-swiss-accent hover:border-swiss-accent
                             dark:hover:bg-swiss-accent dark:hover:border-swiss-accent dark:hover:text-white
                             transition-colors duration-150"
                >
                  <span>Confirm Booking</span>
                  <ArrowRight size={16} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <div className="p-6 lg:p-8 bg-black text-white border-b-2 border-black dark:border-white">
                <div className="w-10 h-10 border-2 border-swiss-accent flex items-center justify-center mb-6">
                  <Check size={18} strokeWidth={3} className="text-swiss-accent" />
                </div>
                <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">Confirmed</span>
                <h3 className="mt-2 text-2xl font-black uppercase tracking-tighter">BOOKING<br />CONFIRMED</h3>
                <div className="mt-6 border-2 border-white/20 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Interview ID</p>
                  <p className="font-black text-lg tracking-widest text-swiss-accent">{interviewId}</p>
                </div>
                <div className="mt-4 space-y-0 border-2 border-white/20">
                  {[
                    ['Type',       selectedType?.label],
                    ['Difficulty', booking.difficulty],
                    ['Pack',       booking.pack.title],
                    ['Questions',  `${booking.pack.questions}`],
                  ].map(([k, v], i, arr) => (
                    <div key={k} className={`flex justify-between px-4 py-3 ${i < arr.length - 1 ? 'border-b border-white/10' : ''}`}>
                      <span className="text-xs font-bold uppercase tracking-widest text-white/40">{k}</span>
                      <span className="text-xs font-black uppercase tracking-widest">{v}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/interview/session')}
                  className="mt-6 w-full h-14 flex items-center justify-between px-5
                             bg-swiss-accent text-white text-sm font-black uppercase tracking-widest
                             border-2 border-swiss-accent
                             hover:bg-white hover:text-black hover:border-white
                             transition-colors duration-150"
                >
                  <span>Start Interview</span>
                  <ArrowRight size={16} strokeWidth={3} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
