import React, { useState } from 'react';
import { PenLine, List, GitBranch } from 'lucide-react';

const SECTIONS = [
  { id: 'requirements', label: 'Requirements', placeholder: 'Functional requirements:\n- \n\nNon-functional requirements:\n- Scale: \n- Latency: \n- Availability: ' },
  { id: 'hld',          label: 'High-Level Design', placeholder: 'Describe your high-level architecture:\n\nComponents:\n- \n\nData flow:\n1. ' },
  { id: 'data',         label: 'Data Model', placeholder: 'Define your data models / schema:\n\nEntities:\n- \n\nRelationships:\n- ' },
  { id: 'scale',        label: 'Scale & Trade-offs', placeholder: 'How does your design scale?\n\nBottlenecks:\n- \n\nTrade-offs:\n- ' },
];

export default function SystemDesignPanel({ question }) {
  const [activeSection, setActiveSection] = useState('requirements');
  const [notes, setNotes] = useState({
    requirements: '',
    hld: '',
    data: '',
    scale: '',
  });

  const current = SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Section tabs */}
      <div className="flex items-stretch h-10 border-b-2 border-black dark:border-white flex-shrink-0
                      bg-swiss-muted dark:bg-white/5 overflow-x-auto">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center px-5 border-r-2 border-black dark:border-white flex-shrink-0
                        text-[10px] font-black uppercase tracking-widest transition-colors duration-150
                        ${activeSection === s.id
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'hover:bg-white dark:hover:bg-white/10'}`}
          >
            <span className="text-swiss-accent mr-1.5">0{i + 1}.</span>
            {s.label}
            {notes[s.id] && (
              <span className="ml-2 w-1.5 h-1.5 bg-swiss-accent rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Hint banner */}
      <div className="flex items-center gap-3 px-4 py-2 border-b-2 border-black dark:border-white
                      bg-swiss-muted dark:bg-white/5 flex-shrink-0">
        <PenLine size={11} strokeWidth={2.5} className="text-black/40 dark:text-white/40 flex-shrink-0" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">
          Think out loud — write your design notes here. The AI interviewer will ask follow-up questions.
        </p>
      </div>

      {/* Notes area */}
      <div className="flex-1 min-h-0 relative">
        <textarea
          key={activeSection}
          value={notes[activeSection]}
          onChange={e => setNotes(prev => ({ ...prev, [activeSection]: e.target.value }))}
          placeholder={current?.placeholder}
          className="w-full h-full p-5 text-sm font-mono bg-white dark:bg-black
                     text-black dark:text-white
                     placeholder:text-black/15 dark:placeholder:text-white/15
                     resize-none focus:outline-none leading-relaxed"
        />
      </div>

      {/* Progress footer */}
      <div className="flex items-center gap-4 px-4 py-2.5 border-t-2 border-black dark:border-white
                      bg-swiss-muted dark:bg-white/5 flex-shrink-0">
        <span className="text-[9px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">
          Progress
        </span>
        <div className="flex gap-1.5">
          {SECTIONS.map(s => (
            <div
              key={s.id}
              className={`h-1.5 w-8 border border-black dark:border-white transition-colors duration-150
                ${notes[s.id] ? 'bg-black dark:bg-white' : 'bg-transparent'}`}
            />
          ))}
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-black/30 dark:text-white/30 ml-auto">
          {Object.values(notes).filter(Boolean).length}/{SECTIONS.length} sections
        </span>
      </div>
    </div>
  );
}
