import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useBooking, INTERVIEW_TYPES } from '../context/BookingContext';

export default function SelectType() {
  const navigate = useNavigate();
  const { booking, setType } = useBooking();

  const handleSelect = (typeId) => {
    setType(typeId);
  };

  const handleContinue = () => {
    if (!booking.type) return;
    navigate('/pricing');
  };

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
                          ${i === 0
                            ? 'bg-black dark:bg-white text-white dark:text-black'
                            : 'bg-white dark:bg-black text-black/20 dark:text-white/20'}`}>
              <span className={`mr-2 ${i === 0 ? 'text-swiss-accent' : ''}`}>
                {String(i + 1).padStart(2, '0')}.
              </span>
              {s}
            </div>
          ))}
        </div>

        <div className="ml-auto flex items-stretch">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center px-6 border-l-2 border-black dark:border-white
                       text-xs font-black uppercase tracking-widest
                       hover:bg-swiss-muted dark:hover:bg-white/10 transition-colors duration-150"
          >
            ← Dashboard
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Page header */}
      <div className="border-b-2 border-black dark:border-white px-6 lg:px-12 py-8 swiss-grid-pattern bg-swiss-muted dark:bg-white/5">
        <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
          Step 01 / 03
        </span>
        <h1 className="mt-2 font-black uppercase tracking-tighter leading-none text-[clamp(2.5rem,6vw,5rem)]">
          SELECT<br />INTERVIEW TYPE.
        </h1>
      </div>

      {/* Main grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">

        {/* Left: type cards */}
        <div className="lg:col-span-8 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white p-6 lg:p-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">01.</span>
            <span className="text-xs font-black uppercase tracking-widest">Choose Your Focus Area</span>
            <div className="flex-1 h-px bg-black dark:bg-white" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-2 border-black dark:border-white">
            {INTERVIEW_TYPES.map((type, i) => {
              const active = booking.type === type.id;
              const isRight = i % 2 === 1;
              const isBottom = i >= INTERVIEW_TYPES.length - 2;
              return (
                <button
                  key={type.id}
                  onClick={() => handleSelect(type.id)}
                  className={`
                    relative flex flex-col items-start p-8 text-left transition-all duration-150
                    ${!isRight ? 'border-b-2 sm:border-b-0 sm:border-r-2 border-black dark:border-white' : ''}
                    ${!isBottom ? 'border-b-2 border-black dark:border-white' : ''}
                    ${active
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'bg-white dark:bg-black text-black dark:text-white hover:bg-swiss-muted dark:hover:bg-white/10'}
                  `}
                >
                  {active && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-swiss-accent flex items-center justify-center">
                      <Check size={13} strokeWidth={3} className="text-white" />
                    </div>
                  )}
                  <span className={`text-xs font-black uppercase tracking-widest mb-3
                    ${active ? 'text-swiss-accent' : 'text-black/30 dark:text-white/30'}`}>
                    {type.num}
                  </span>
                  <span className="text-xl font-black uppercase tracking-tight leading-tight mb-2">
                    {type.label}
                  </span>
                  <span className={`text-xs leading-relaxed font-bold uppercase tracking-wide
                    ${active ? 'text-white/60 dark:text-black/60' : 'text-black/40 dark:text-white/40'}`}>
                    {type.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: CTA */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="flex-1 p-6 lg:p-10 swiss-dots bg-swiss-muted dark:bg-white/5 flex flex-col justify-between">
            <div>
              <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
                02. Selected
              </span>

              {booking.type ? (
                <div className="mt-6 border-2 border-black dark:border-white bg-white dark:bg-black">
                  <div className="px-5 py-4 border-b-2 border-black dark:border-white">
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-1">
                      Interview Type
                    </p>
                    <p className="text-lg font-black uppercase tracking-tight">
                      {INTERVIEW_TYPES.find(t => t.id === booking.type)?.label}
                    </p>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-black/50 dark:text-white/50 leading-relaxed">
                      {INTERVIEW_TYPES.find(t => t.id === booking.type)?.desc}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-6 text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 leading-relaxed">
                  Select an interview type to continue to difficulty and pack selection.
                </p>
              )}
            </div>

            <button
              onClick={handleContinue}
              disabled={!booking.type}
              className="mt-10 w-full h-14 flex items-center justify-between px-6
                         bg-black dark:bg-white text-white dark:text-black
                         text-xs font-black uppercase tracking-widest
                         border-2 border-black dark:border-white
                         hover:bg-swiss-accent hover:border-swiss-accent
                         dark:hover:bg-swiss-accent dark:hover:border-swiss-accent dark:hover:text-white
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-colors duration-150"
            >
              <span>Continue to Access</span>
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
