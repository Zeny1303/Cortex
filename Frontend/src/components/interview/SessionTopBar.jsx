import React from 'react';
import { Square, AlertTriangle } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

/**
 * Shared top bar for all interview session types.
 * Props:
 *   interviewId   {string}
 *   type          {string}  — dsa | frontend | backend | system
 *   timerDisplay  {string}
 *   isWarning     {bool}
 *   isExpired     {bool}
 *   violations    {number}
 *   maxViolations {number}
 *   aiStatus      {string}  — 'AI Ready' | 'Listening' | 'Processing' | 'Speaking'
 *   ending        {bool}
 *   onEnd         {fn}
 */
export default function SessionTopBar({
  interviewId,
  type,
  timerDisplay,
  isWarning,
  isExpired,
  violations,
  maxViolations,
  aiStatus = 'AI Ready',
  ending,
  onEnd,
}) {
  const TYPE_LABELS = {
    dsa:      'DSA',
    frontend: 'Frontend',
    backend:  'Backend',
    system:   'System Design',
  };

  const statusColor = {
    'AI Ready':   'text-black/40 dark:text-white/40',
    'Listening':  'text-black dark:text-white',
    'Processing': 'text-swiss-accent',
    'Speaking':   'text-swiss-accent',
  }[aiStatus] || 'text-black/40 dark:text-white/40';

  return (
    <nav className="flex items-stretch h-11 border-b-2 border-black dark:border-white flex-shrink-0 bg-white dark:bg-black">

      {/* Brand */}
      <div className="flex items-center px-4 border-r-2 border-black dark:border-white">
        <span className="font-black text-[10px] uppercase tracking-widest">CORTEX</span>
      </div>

      {/* Type badge */}
      <div className="flex items-center px-4 border-r-2 border-black dark:border-white gap-2">
        <span className="text-[9px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">Type</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-swiss-accent">
          {TYPE_LABELS[type] || type}
        </span>
      </div>

      {/* Session ID */}
      <div className="flex items-center px-4 border-r-2 border-black dark:border-white gap-1.5">
        <span className="text-[9px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">Session</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-swiss-accent font-mono">
          {interviewId || 'DEMO'}
        </span>
      </div>

      {/* AI Status */}
      <div className="hidden sm:flex items-center px-4 border-r-2 border-black dark:border-white gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${
          aiStatus === 'AI Ready' ? 'bg-black/20 dark:bg-white/20' : 'bg-swiss-accent animate-pulse'
        }`} />
        <span className={`text-[9px] font-black uppercase tracking-widest ${statusColor}`}>
          {aiStatus}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Violations */}
      {violations > 0 && (
        <div className="flex items-center gap-1.5 px-4 border-l-2 border-black dark:border-white bg-swiss-accent/10">
          <AlertTriangle size={10} strokeWidth={2.5} className="text-swiss-accent" />
          <span className="text-[9px] font-black uppercase tracking-widest text-swiss-accent">
            {violations}/{maxViolations} Warnings
          </span>
        </div>
      )}

      {/* Timer */}
      <div className={`flex items-center gap-2 px-4 border-l-2 border-black dark:border-white
                       ${isWarning ? 'bg-swiss-accent' : ''}`}>
        <span className={`text-xs font-black font-mono tracking-widest
                          ${isWarning ? 'text-white' : isExpired ? 'text-swiss-accent' : 'text-black dark:text-white'}`}>
          {timerDisplay}
        </span>
      </div>

      {/* Theme toggle */}
      <ThemeToggle variant="minimal" />

      {/* End interview */}
      <button
        onClick={onEnd}
        disabled={ending}
        className="flex items-center gap-2 px-5 border-l-2 border-black dark:border-white
                   text-[10px] font-black uppercase tracking-widest
                   hover:bg-swiss-accent hover:text-white
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors duration-150"
      >
        {ending
          ? <div className="w-3 h-3 border-2 border-current border-t-transparent animate-spin" />
          : <Square size={11} strokeWidth={3} />}
        End
      </button>
    </nav>
  );
}
