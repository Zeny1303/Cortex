import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsage } from '../context/UsageContext';

/**
 * Compact usage indicator — drop into any navbar.
 * Shows free credits remaining OR subscription usage.
 */
export default function UsageBadge() {
  const navigate = useNavigate();
  const { usageLabel, canStartInterview } = useUsage();

  return (
    <button
      onClick={() => navigate('/pricing')}
      className={`flex items-center gap-2 px-4 h-full border-l-2 border-black dark:border-white
                  text-[10px] font-black uppercase tracking-widest
                  transition-colors duration-150
                  ${canStartInterview
                    ? 'hover:bg-swiss-muted dark:hover:bg-white/10'
                    : 'bg-swiss-accent/10 text-swiss-accent hover:bg-swiss-accent hover:text-white'}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0
        ${canStartInterview ? 'bg-black dark:bg-white' : 'bg-swiss-accent animate-pulse'}`} />
      {usageLabel}
    </button>
  );
}
