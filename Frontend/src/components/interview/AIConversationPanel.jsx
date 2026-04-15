import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Cpu, Wifi, WifiOff, ChevronDown } from 'lucide-react';

const AI_STATES = {
  idle:       { label: 'AI Ready',    color: 'text-black/40 dark:text-white/40' },
  listening:  { label: 'Listening',   color: 'text-black dark:text-white' },
  processing: { label: 'Processing',  color: 'text-swiss-accent' },
  speaking:   { label: 'Speaking',    color: 'text-swiss-accent' },
};

function Waveform({ active }) {
  return (
    <div className="flex items-center gap-0.5 h-4">
      {[3, 6, 9, 5, 11, 7, 4, 8, 6, 3].map((h, i) => (
        <div
          key={i}
          className={`w-0.5 bg-current transition-all duration-150 ${active ? 'opacity-100' : 'opacity-20'}`}
          style={{
            height: active ? `${h * 1.8}px` : '3px',
            animation: active ? `waveBar 0.8s ease-in-out ${i * 70}ms infinite alternate` : 'none',
          }}
        />
      ))}
      <style>{`@keyframes waveBar { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }`}</style>
    </div>
  );
}

const DIFF_BADGE = {
  easy:   'bg-swiss-muted dark:bg-white/10 text-black dark:text-white border-black dark:border-white',
  medium: 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white',
  hard:   'bg-swiss-accent text-white border-swiss-accent',
};

/**
 * AIConversationPanel — left panel for all interview types.
 * Props:
 *   question     {object}   — current question
 *   questionIdx  {number}
 *   totalQ       {number}
 *   type         {string}   — dsa | frontend | backend | system
 *   onAiStatus   {fn}       — reports aiStatus string up to parent
 *   sessionId    {string}
 *   phase        {string}   — 'greeting' | 'question' | 'followup'
 *   onPhaseChange {fn}
 */
export default function AIConversationPanel({
  question,
  questionIdx = 0,
  totalQ = 0,
  type = 'dsa',
  onAiStatus,
  sessionId,
  phase = 'greeting',
  onPhaseChange,
}) {
  const [aiState, setAiState]       = useState('idle');
  const [transcript, setTranscript] = useState([]);
  const [followUpIdx, setFollowUpIdx] = useState(0);
  const transcriptRef = useRef(null);

  // Simulate AI greeting on mount
  useEffect(() => {
    const greetings = {
      dsa:      "Hello! I'm your AI interviewer today. We'll be working through some data structures and algorithms problems. Take your time to think out loud — I'm interested in your problem-solving process, not just the final answer. Ready to begin?",
      frontend: "Hi there! I'm your AI interviewer. Today we'll explore your frontend engineering skills — from React patterns to CSS layout and browser APIs. Feel free to ask clarifying questions. Shall we start?",
      backend:  "Welcome! I'll be your AI interviewer for this backend engineering session. We'll cover API design, databases, and system internals. Think out loud and walk me through your reasoning. Ready?",
      system:   "Good to meet you! I'm your AI interviewer for this system design session. There are no perfect answers here — I want to understand how you think about scale, trade-offs, and architecture. Let's dive in.",
    };

    const timer = setTimeout(() => {
      setAiState('speaking');
      setTranscript([{ role: 'ai', text: greetings[type] || greetings.dsa, ts: Date.now() }]);
      if (onAiStatus) onAiStatus('Speaking');
      setTimeout(() => {
        setAiState('idle');
        if (onAiStatus) onAiStatus('AI Ready');
      }, 2500);
    }, 800);

    return () => clearTimeout(timer);
  }, [type]); // eslint-disable-line

  // When question changes, add it to transcript
  useEffect(() => {
    if (!question || phase === 'greeting') return;
    setTranscript(prev => {
      const alreadyAdded = prev.some(m => m.questionId === question.id);
      if (alreadyAdded) return prev;
      return [...prev, {
        role: 'ai',
        text: `Here's your ${questionIdx > 0 ? 'next ' : ''}question: "${question.title}". Read through it carefully, then walk me through your approach before writing any code.`,
        questionId: question.id,
        ts: Date.now(),
      }];
    });
    setFollowUpIdx(0);
  }, [question?.id, phase]); // eslint-disable-line

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const handleAskFollowUp = () => {
    if (!question?.followUps?.length) return;
    const followUp = question.followUps[followUpIdx % question.followUps.length];
    setTranscript(prev => [...prev, { role: 'ai', text: followUp, ts: Date.now() }]);
    setFollowUpIdx(i => i + 1);
    setAiState('speaking');
    if (onAiStatus) onAiStatus('Speaking');
    setTimeout(() => {
      setAiState('idle');
      if (onAiStatus) onAiStatus('AI Ready');
    }, 1500);
  };

  const handleUserResponse = (text) => {
    if (!text.trim()) return;
    setTranscript(prev => [...prev, { role: 'user', text, ts: Date.now() }]);
    // Simulate AI processing
    setAiState('processing');
    if (onAiStatus) onAiStatus('Processing');
    setTimeout(() => {
      setAiState('idle');
      if (onAiStatus) onAiStatus('AI Ready');
    }, 1200);
  };

  const stateInfo = AI_STATES[aiState];
  const diffKey = question?.difficulty?.toLowerCase() || 'medium';

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5
                      border-b-2 border-black dark:border-white bg-swiss-muted dark:bg-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-black dark:bg-white text-white dark:text-black
                          flex items-center justify-center text-[9px] font-black flex-shrink-0">
            AI
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest leading-none text-black dark:text-white">
              AI Interviewer
            </p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mt-0.5">
              Cortex Intelligence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Waveform active={aiState === 'listening' || aiState === 'speaking'} />
          <span className={`text-[9px] font-black uppercase tracking-widest ${stateInfo.color}`}>
            {stateInfo.label}
          </span>
        </div>
      </div>

      {/* Transcript */}
      <div ref={transcriptRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {transcript.map((msg, i) => (
          <div key={i} className={`flex gap-2 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-5 h-5 flex items-center justify-center text-[8px] font-black flex-shrink-0 mt-0.5
              ${msg.role === 'ai'
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'bg-swiss-accent text-white'}`}>
              {msg.role === 'ai' ? 'AI' : 'U'}
            </div>
            <div className={`max-w-[85%] border-2 p-3 text-xs leading-relaxed
              ${msg.role === 'ai'
                ? 'border-black dark:border-white bg-swiss-muted dark:bg-white/5 text-black/80 dark:text-white/80'
                : 'border-swiss-accent bg-swiss-accent/5 text-black dark:text-white'}`}>
              {msg.text}
            </div>
          </div>
        ))}

        {aiState === 'processing' && (
          <div className="flex gap-2 items-start">
            <div className="w-5 h-5 bg-black dark:bg-white text-white dark:text-black
                            flex items-center justify-center text-[8px] font-black flex-shrink-0">AI</div>
            <div className="border-2 border-black dark:border-white bg-swiss-muted dark:bg-white/5 p-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-black/40 dark:bg-white/40 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Question card (when in question phase) */}
      {question && phase !== 'greeting' && (
        <div className="border-t-2 border-black dark:border-white flex-shrink-0 max-h-[45%] overflow-y-auto">
          <div className="px-4 py-3 border-b-2 border-black dark:border-white bg-swiss-muted dark:bg-white/5
                          flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
              Current Question
            </span>
            <div className="flex items-center gap-2">
              {totalQ > 1 && (
                <span className="text-[9px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">
                  {questionIdx + 1}/{totalQ}
                </span>
              )}
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-2 ${DIFF_BADGE[diffKey]}`}>
                {question.difficulty}
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-sm font-black uppercase tracking-tight mb-2 text-black dark:text-white">
              {question.title}
            </h3>
            {question.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {question.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-black uppercase tracking-widest
                                             bg-swiss-muted dark:bg-white/10 border border-black/20 dark:border-white/20
                                             px-2 py-0.5 text-black/60 dark:text-white/60">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs leading-relaxed text-black/70 dark:text-white/70 whitespace-pre-wrap">
              {question.description}
            </p>
          </div>
        </div>
      )}

      {/* Action bar */}
      <div className="border-t-2 border-black dark:border-white flex-shrink-0 flex">
        {phase === 'greeting' && onPhaseChange && (
          <button
            onClick={() => onPhaseChange('question')}
            className="flex-1 h-10 flex items-center justify-center gap-2
                       bg-black dark:bg-white text-white dark:text-black
                       text-[10px] font-black uppercase tracking-widest
                       hover:bg-swiss-accent transition-colors duration-150"
          >
            <Mic size={11} strokeWidth={2.5} />
            Start Interview
          </button>
        )}
        {phase !== 'greeting' && question?.followUps?.length > 0 && (
          <button
            onClick={handleAskFollowUp}
            disabled={followUpIdx >= question.followUps.length}
            className="flex-1 h-10 flex items-center justify-center gap-2
                       border-r-2 border-black dark:border-white
                       text-[10px] font-black uppercase tracking-widest
                       hover:bg-swiss-muted dark:hover:bg-white/10
                       disabled:opacity-30 disabled:cursor-not-allowed
                       transition-colors duration-150"
          >
            <ChevronDown size={11} strokeWidth={2.5} />
            Follow-up ({Math.min(followUpIdx, question.followUps.length)}/{question.followUps.length})
          </button>
        )}
        {phase !== 'greeting' && (
          <TextInput onSubmit={handleUserResponse} />
        )}
      </div>
    </div>
  );
}

function TextInput({ onSubmit }) {
  const [val, setVal] = useState('');
  const handle = (e) => {
    e.preventDefault();
    if (!val.trim()) return;
    onSubmit(val.trim());
    setVal('');
  };
  return (
    <form onSubmit={handle} className="flex flex-1 min-w-0">
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder="Type your response..."
        className="flex-1 min-w-0 px-3 text-xs bg-transparent
                   placeholder:text-black/20 dark:placeholder:text-white/20
                   text-black dark:text-white focus:outline-none"
      />
      <button
        type="submit"
        disabled={!val.trim()}
        className="px-4 h-10 text-[10px] font-black uppercase tracking-widest
                   bg-black dark:bg-white text-white dark:text-black
                   hover:bg-swiss-accent transition-colors duration-150
                   disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </form>
  );
}
