import React, { useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Square, AlertTriangle } from 'lucide-react';

import AIInterviewerPanel from '../components/AIInterviewerPanel';
import VideoPanel         from '../components/VideoPanel';
import CodeEditor         from '../components/CodeEditor';
import TestCasePanel      from '../components/TestCasePanel';
import ThemeToggle        from '../components/ThemeToggle';
import { useInterviewTimer } from '../hooks/useInterviewTimer';
import { endInterview }      from '../services/interviewService';

/* ─── Right-panel tab bar ───────────────────────────────── */
const TABS = ['Editor', 'Test Cases'];

export default function InterviewRoom() {
  console.log("NEW INTERVIEW ROOM LOADED");
  const { interviewId } = useParams();
  const location        = useLocation();
  const navigate        = useNavigate();

  /* Questions come from InterviewSetup via router state */
  const questions  = location.state?.questions  || [];
  const sessionId  = location.state?.sessionId  || null;

  console.log('InterviewRoom state:', { questions: questions.length, sessionId, interviewId });

  // 🚨 CRITICAL VALIDATION: Block if sessionId or questions are missing
  const [criticalError, setCriticalError] = React.useState(null);

  React.useEffect(() => {
    if (!sessionId) {
      console.error('❌ CRITICAL: Session ID is missing!');
      setCriticalError('Session ID is missing. Please restart the interview from setup.');
    } else if (!questions || questions.length === 0) {
      console.error('❌ CRITICAL: No questions loaded!');
      setCriticalError('Questions failed to load. Please restart the interview from setup.');
    }
  }, [sessionId, questions]);

  const [idx, setIdx]             = useState(0);
  const [activeTab, setActiveTab] = useState('Editor');
  const [testResult, setTestResult] = useState(null);   // CodeSubmitResponse
  const [submitting, setSubmitting] = useState(false);
  const [ending, setEnding]         = useState(false);
  const [endError, setEndError]     = useState('');

  const current = questions[idx] || null;

  const { display: timerDisplay, isWarning, isExpired } = useInterviewTimer(45 * 60);

  const handlePrev = () => setIdx((i) => Math.max(0, i - 1));
  const handleNext = () => {
    setIdx((i) => Math.min(questions.length - 1, i + 1));
    setTestResult(null);
  };

  /* Called by CodeEditor after a successful submit */
  const handleSubmitResult = useCallback((result) => {
    setTestResult(result);
    setActiveTab('Test Cases');
    setSubmitting(false);
  }, []);

  /* End interview — call backend then navigate to completion */
  const handleEnd = async () => {
    if (!window.confirm('End the interview? Your progress will be saved.')) return;
    setEnding(true);
    setEndError('');
    try {
      let report = null;
      if (sessionId) {
        report = await endInterview(sessionId);
      }
      navigate('/interview/completed', { state: { report } });
    } catch (err) {
      setEndError(err.message);
      setEnding(false);
    }
  };

  // 🚨 Show critical error screen if validation fails
  if (criticalError) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-black text-black dark:text-white">
        <div className="max-w-md border-2 border-swiss-accent p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={24} strokeWidth={2.5} className="text-swiss-accent" />
            <h2 className="text-lg font-black uppercase tracking-tight">Critical Error</h2>
          </div>
          <p className="text-sm mb-6 text-black/70 dark:text-white/70">{criticalError}</p>
          <button
            onClick={() => navigate('/interview/setup')}
            className="w-full h-12 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest
                       border-2 border-black dark:border-white hover:bg-swiss-accent hover:border-swiss-accent
                       dark:hover:bg-swiss-accent dark:hover:text-white
                       transition-colors duration-150"
          >
            Return to Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-white dark:bg-black text-black dark:text-white overflow-hidden">

      {/* ══════════════════════════════════════════════════
          TOP NAV BAR
      ══════════════════════════════════════════════════ */}
      <nav className="flex items-stretch h-11 border-b-2 border-black dark:border-white flex-shrink-0 bg-white dark:bg-black">

        {/* Brand */}
        <div className="flex items-center px-4 border-r-2 border-black dark:border-white">
          <span className="font-black text-[10px] uppercase tracking-widest">CORTEX</span>
        </div>

        {/* Session ID */}
        <div className="flex items-center px-4 border-r-2 border-black dark:border-white gap-1.5">
          <span className="text-[9px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">
            Session
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest text-swiss-accent">
            {interviewId || 'DEMO'}
          </span>
        </div>

        {/* Question navigation */}
        <div className="flex items-center px-4 gap-2 border-r-2 border-black dark:border-white">
          <button
            onClick={handlePrev}
            disabled={idx === 0}
            className="w-6 h-6 border-2 border-black dark:border-white flex items-center justify-center
                       hover:bg-black hover:text-white
                       dark:hover:bg-white dark:hover:text-black
                       disabled:opacity-20 disabled:cursor-not-allowed
                       transition-colors duration-150"
            aria-label="Previous question"
          >
            <ChevronLeft size={12} strokeWidth={3} />
          </button>

          {/* Question dots */}
          <div className="flex items-center gap-1">
            {questions.length > 0
              ? questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setIdx(i); setTestResult(null); }}
                    className={`w-5 h-5 border-2 border-black dark:border-white text-[8px] font-black
                                transition-colors duration-150
                                ${i === idx 
                                  ? 'bg-black dark:bg-white text-white dark:text-black' 
                                  : 'bg-white dark:bg-black hover:bg-swiss-muted dark:hover:bg-white/10'}`}
                  >
                    {i + 1}
                  </button>
                ))
              : <span className="text-[9px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">—</span>
            }
          </div>

          <button
            onClick={handleNext}
            disabled={idx === questions.length - 1 || questions.length === 0}
            className="w-6 h-6 border-2 border-black dark:border-white flex items-center justify-center
                       hover:bg-black hover:text-white
                       dark:hover:bg-white dark:hover:text-black
                       disabled:opacity-20 disabled:cursor-not-allowed
                       transition-colors duration-150"
            aria-label="Next question"
          >
            <ChevronRight size={12} strokeWidth={3} />
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Timer */}
        <div className={`flex items-center gap-2 px-4 border-l-2 border-black dark:border-white
                         ${isWarning ? 'bg-swiss-accent text-white' : ''}`}>
          <span className={`text-xs font-black font-mono tracking-widest
                            ${isWarning ? 'text-white' : isExpired ? 'text-swiss-accent' : 'text-black dark:text-white'}`}>
            {timerDisplay}
          </span>
        </div>

        {/* Theme toggle */}
        <ThemeToggle variant="minimal" />

        {/* End interview */}
        <button
          onClick={handleEnd}
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

      {/* End error */}
      {endError && (
        <div className="flex items-center gap-2 px-5 py-2 bg-swiss-accent text-white
                        text-[10px] font-black uppercase tracking-widest flex-shrink-0">
          <AlertTriangle size={11} strokeWidth={2.5} />
          {endError}
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MAIN LAYOUT  —  Left 40% | Right 60%
      ══════════════════════════════════════════════════ */}
      <main className="flex-1 flex overflow-hidden min-h-0">

        {/* ── LEFT COLUMN: AI panel (flex-[3]) + Video (flex-[2]) ── */}
        <div className="w-[40%] flex-shrink-0 flex flex-col border-r-2 border-black dark:border-white min-h-0">

          {/* AI Interviewer Panel */}
          <div className="flex-[3] min-h-0 border-b-2 border-black dark:border-white overflow-hidden">
            <AIInterviewerPanel
              question={current}
              currentIndex={idx}
              totalQuestions={questions.length}
              sessionId={sessionId}
            />
          </div>

          {/* Camera feed */}
          <div className="flex-[2] min-h-0 overflow-hidden">
            <VideoPanel />
          </div>
        </div>

        {/* ── RIGHT COLUMN: Tab bar + Editor/TestCases ── */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

          {/* Tab bar */}
          <div className="flex items-stretch h-10 border-b-2 border-black dark:border-white flex-shrink-0 bg-swiss-muted dark:bg-white/5">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              const hasBadge = tab === 'Test Cases' && testResult;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-6 border-r-2 border-black dark:border-white
                              text-[10px] font-black uppercase tracking-widest
                              transition-colors duration-150
                              ${isActive 
                                ? 'bg-black dark:bg-white text-white dark:text-black' 
                                : 'bg-swiss-muted dark:bg-white/5 hover:bg-white dark:hover:bg-white/10'}`}
                >
                  {tab}
                  {hasBadge && (
                    <span className={`text-[8px] font-black px-1.5 py-0.5 border
                      ${testResult.result === 'passed'
                        ? isActive ? 'border-white dark:border-black text-white dark:text-black' : 'border-black dark:border-white text-black dark:text-white'
                        : isActive ? 'border-swiss-accent text-swiss-accent' : 'border-swiss-accent text-swiss-accent'}`}>
                      {testResult.passed_tests}/{testResult.total_tests}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Panel content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {activeTab === 'Editor' && (
              <CodeEditor
                starterCode={current?.starter_code?.python || '# Write your solution here\n\ndef solution():\n    pass\n'}
                sessionId={sessionId}
                questionId={current?.question_id}
                onSubmitResult={handleSubmitResult}
              />
            )}
            {activeTab === 'Test Cases' && (
              <TestCasePanel result={testResult} loading={submitting} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
