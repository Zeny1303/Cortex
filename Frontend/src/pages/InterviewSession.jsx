import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Code2, X } from 'lucide-react';

import { useBooking } from '../context/BookingContext';
import { useUsage } from '../context/UsageContext';
import { CameraProvider, useCameraContext } from '../context/CameraContext';
import { useInterviewTimer } from '../hooks/useInterviewTimer';
import { useViolationTracker } from '../hooks/useViolationTracker';
import { getQuestionsForSession } from '../data/mockQuestions';
import { endInterview } from '../services/interviewService';

import SessionTopBar from '../components/interview/SessionTopBar';
import FloatingCamera from '../components/interview/FloatingCamera';
import AIConversationPanel from '../components/interview/AIConversationPanel';
import DSAPanel from '../components/interview/panels/DSAPanel';
import FrontendPanel from '../components/interview/panels/FrontendPanel';
import BackendPanel from '../components/interview/panels/BackendPanel';
import SystemDesignPanel from '../components/interview/panels/SystemDesignPanel';

/* ─── Right panel per type ─────────────────────────────── */
function RightPanel({ type, question, sessionId, onSubmitResult }) {
  switch (type) {
    case 'dsa':      return <DSAPanel question={question} sessionId={sessionId} onSubmitResult={onSubmitResult} />;
    case 'frontend': return <FrontendPanel question={question} />;
    case 'backend':  return <BackendPanel question={question} />;
    case 'system':   return <SystemDesignPanel question={question} />;
    default:         return <DSAPanel question={question} sessionId={sessionId} onSubmitResult={onSubmitResult} />;
  }
}

/* ─── Editor visibility defaults ──────────────────────── */
const EDITOR_DEFAULT_OPEN = { dsa: true, frontend: false, backend: false, system: false };

export default function InterviewSession() {
  return (
    <CameraProvider>
      <InterviewSessionInner />
    </CameraProvider>
  );
}

function InterviewSessionInner() {
  const navigate = useNavigate();
  const { booking, setSessionId: storeSessionId, setInterviewId: storeInterviewId } = useBooking();
  const { canStartInterview, deductInterview } = useUsage();

  // Guard: redirect if no type selected
  useEffect(() => {
    if (!booking.type) {
      navigate('/select-type', { replace: true });
      return;
    }
    // Guard: redirect if no credits
    if (!canStartInterview) {
      navigate('/pricing', { replace: true });
    }
  }, [booking.type, navigate]);

  const { type, difficulty, pack, sessionId: storedSessionId } = booking;

  // Generate a local interview ID if none from backend
  const [interviewId] = useState(
    () => storedSessionId || `INT-${Math.floor(10000 + Math.random() * 90000)}`
  );

  // Load questions from mock bank
  const [questions] = useState(
    () => getQuestionsForSession(type, difficulty, pack?.questions || 2)
  );
  const [questionIdx, setQuestionIdx] = useState(0);
  const current = questions[questionIdx] || null;

  // Interview phase: greeting → question → followup
  const [phase, setPhase] = useState('greeting');

  // Editor panel visibility
  const [editorOpen, setEditorOpen] = useState(EDITOR_DEFAULT_OPEN[type] ?? false);

  // AI status string (reported up from AIConversationPanel)
  const [aiStatus, setAiStatus] = useState('AI Ready');

  // Timer
  const { display: timerDisplay, isWarning, isExpired } = useInterviewTimer(45 * 60);

  // Camera/mic state (for violation tracking) — from shared CameraContext
  const { camOn, micOn } = useCameraContext();

  // Ending state
  const [ending, setEnding]   = useState(false);
  const [endError, setEndError] = useState('');
  const [forceEndMsg, setForceEndMsg] = useState('');

  // Violation tracker
  const handleForceEnd = useCallback((msg) => {
    setForceEndMsg(msg);
    setTimeout(() => navigate('/interview/completed', { state: { report: null } }), 2000);
  }, [navigate]);

  const { violations, warning, maxViolations } = useViolationTracker({
    camOn,
    micOn,
    onForceEnd: handleForceEnd,
  });

  // Phase change: when entering 'question', advance to first question
  const handlePhaseChange = (newPhase) => {
    setPhase(newPhase);
  };

  // End interview
  const handleEnd = async () => {
    if (!window.confirm('End the interview? Your progress will be saved.')) return;
    setEnding(true);
    setEndError('');
    try {
      let report = null;
      if (storedSessionId) {
        report = await endInterview(storedSessionId);
      }
      deductInterview(); // deduct one credit on completion
      navigate('/interview/completed', { state: { report } });
    } catch (err) {
      setEndError(err.message);
      setEnding(false);
    }
  };

  if (!type) return null; // prevent flash before redirect

  return (
    <div className="h-screen w-full flex flex-col bg-white dark:bg-black text-black dark:text-white overflow-hidden">

      {/* Top bar */}
      <SessionTopBar
        interviewId={interviewId}
        type={type}
        timerDisplay={timerDisplay}
        isWarning={isWarning}
        isExpired={isExpired}
        violations={violations}
        maxViolations={maxViolations}
        aiStatus={aiStatus}
        ending={ending}
        onEnd={handleEnd}
      />

      {/* Violation warning toast */}
      {warning && (
        <div className="flex items-center justify-between px-5 py-2.5
                        bg-swiss-accent text-white flex-shrink-0
                        text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <AlertTriangle size={12} strokeWidth={2.5} />
            {warning.message}
          </div>
          <span className="text-white/60">{violations}/{maxViolations} warnings</span>
        </div>
      )}

      {/* Force-end message */}
      {forceEndMsg && (
        <div className="flex items-center gap-2 px-5 py-2.5 bg-black text-white flex-shrink-0
                        text-[10px] font-black uppercase tracking-widest">
          <AlertTriangle size={12} strokeWidth={2.5} className="text-swiss-accent" />
          {forceEndMsg}
        </div>
      )}

      {/* End error */}
      {endError && (
        <div className="flex items-center gap-2 px-5 py-2 bg-swiss-accent text-white flex-shrink-0
                        text-[10px] font-black uppercase tracking-widest">
          <AlertTriangle size={11} strokeWidth={2.5} />
          {endError}
        </div>
      )}

      {/* Main layout */}
      <main className="flex-1 flex overflow-hidden min-h-0">

        {/* ── LEFT: AI Conversation Panel ── */}
        <div className={`flex-shrink-0 flex flex-col border-r-2 border-black dark:border-white min-h-0
                         transition-all duration-300
                         ${editorOpen ? 'w-[38%]' : 'w-full'}`}>
          <AIConversationPanel
            question={phase !== 'greeting' ? current : null}
            questionIdx={questionIdx}
            totalQ={questions.length}
            type={type}
            onAiStatus={setAiStatus}
            sessionId={storedSessionId}
            phase={phase}
            onPhaseChange={handlePhaseChange}
          />
        </div>

        {/* ── RIGHT: Type-specific editor panel ── */}
        {editorOpen && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Question nav bar */}
            {questions.length > 1 && phase !== 'greeting' && (
              <div className="flex items-center gap-2 px-4 h-9 border-b-2 border-black dark:border-white
                              flex-shrink-0 bg-swiss-muted dark:bg-white/5">
                <span className="text-[9px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">
                  Question
                </span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setQuestionIdx(i)}
                      className={`w-5 h-5 border-2 border-black dark:border-white text-[8px] font-black
                                  transition-colors duration-150
                                  ${i === questionIdx
                                    ? 'bg-black dark:bg-white text-white dark:text-black'
                                    : 'hover:bg-swiss-muted dark:hover:bg-white/10'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex-1 min-h-0 overflow-hidden">
              <RightPanel
                type={type}
                question={current}
                sessionId={storedSessionId}
                onSubmitResult={() => {}}
              />
            </div>
          </div>
        )}
      </main>

      {/* ── Editor toggle button (bottom-left, above camera) ── */}
      {phase !== 'greeting' && (
        <button
          onClick={() => setEditorOpen(p => !p)}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 h-9
                     border-2 border-black dark:border-white
                     bg-white dark:bg-black text-black dark:text-white
                     text-[10px] font-black uppercase tracking-widest
                     hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black
                     shadow-lg transition-colors duration-150"
        >
          {editorOpen ? <X size={12} strokeWidth={2.5} /> : <Code2 size={12} strokeWidth={2.5} />}
          {editorOpen ? 'Close Editor' : 'Open Editor'}
        </button>
      )}

      {/* ── Floating camera ── */}
      <FloatingCamera />
    </div>
  );
}
