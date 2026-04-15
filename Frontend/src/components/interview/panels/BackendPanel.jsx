import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Send, Loader } from 'lucide-react';

const STARTER_PYTHON = `# Backend Engineering Challenge
# Write your solution, API design, or pseudocode below.
# Think out loud — explain your approach as you code.

from typing import Optional, List, Dict

# Example: Rate Limiter
class Solution:
    def __init__(self):
        # Initialize your data structures
        pass
    
    def solve(self):
        # Your implementation here
        pass
`;

export default function BackendPanel({ question }) {
  const [code, setCode]         = useState(question?.starter_code?.python || STARTER_PYTHON);
  const [notes, setNotes]       = useState('');
  const [tab, setTab]           = useState('code'); // code | notes
  const [running, setRunning]   = useState(false);
  const [output, setOutput]     = useState(null);

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => {
      setOutput({ text: '✓ Code looks good. Walk the interviewer through your logic.', ok: true });
      setRunning(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Toolbar */}
      <div className="flex items-stretch h-10 border-b-2 border-black dark:border-white flex-shrink-0
                      bg-swiss-muted dark:bg-white/5">
        {['code', 'notes'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center px-6 border-r-2 border-black dark:border-white
                        text-[10px] font-black uppercase tracking-widest transition-colors duration-150
                        ${tab === t
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'hover:bg-white dark:hover:bg-white/10'}`}
          >
            {t === 'code' ? 'Code / Pseudocode' : 'Design Notes'}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-2 px-5 border-l-2 border-black dark:border-white
                     text-[10px] font-black uppercase tracking-widest
                     hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black
                     disabled:opacity-40 transition-colors duration-150"
        >
          {running ? <Loader size={11} className="animate-spin" /> : <Send size={11} strokeWidth={2.5} />}
          Review
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 flex flex-col">
        {tab === 'code' ? (
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language="python"
              theme="vs"
              value={code}
              onChange={val => setCode(val ?? '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineHeight: 20,
                padding: { top: 10 },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                fontFamily: "'JetBrains Mono', Consolas, monospace",
              }}
            />
          </div>
        ) : (
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Jot down your design decisions, trade-offs, and architecture notes here..."
            className="flex-1 p-4 text-sm font-mono bg-white dark:bg-black text-black dark:text-white
                       placeholder:text-black/20 dark:placeholder:text-white/20
                       resize-none focus:outline-none leading-relaxed"
          />
        )}

        {/* Output */}
        {output && (
          <div className={`flex-shrink-0 border-t-2 border-black dark:border-white px-4 py-3
                           ${output.ok ? 'bg-swiss-muted dark:bg-white/5' : 'bg-swiss-accent/10'}`}>
            <p className={`text-xs font-bold ${output.ok ? 'text-black/60 dark:text-white/60' : 'text-swiss-accent'}`}>
              {output.text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
