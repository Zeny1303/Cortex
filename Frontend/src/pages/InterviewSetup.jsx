import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchRandomQuestions } from '../services/questionService';
import { ArrowRight } from 'lucide-react';
import { API_URL } from '../config';
import ThemeToggle from '../components/ThemeToggle';

/* Shared top-bar used across the interview flow */
function FlowBar({ step, label }) {
  const steps = ['Setup', 'Permissions', 'Countdown', 'Interview'];
  return (
    <div className="border-b-2 border-black dark:border-white flex items-stretch h-14 bg-white dark:bg-black sticky top-0 z-40">
      <a href="/"
        className="flex items-center px-6 border-r-2 border-black dark:border-white
                   font-black text-sm uppercase tracking-widest
                   hover:bg-black hover:text-white
                   dark:hover:bg-white dark:hover:text-black
                   transition-colors duration-150">
        CORTEX
      </a>
      {/* Step breadcrumb */}
      <div className="flex items-stretch overflow-x-auto">
        {steps.map((s, i) => {
          const done    = i < step;
          const current = i === step;
          return (
            <div key={s}
              className={`flex items-center px-5 border-r-2 border-black dark:border-white text-[10px] font-black uppercase tracking-widest
                ${current ? 'bg-black dark:bg-white text-white dark:text-black' : done ? 'bg-swiss-muted dark:bg-white/5 text-black/40 dark:text-white/40' : 'bg-white dark:bg-black text-black/20 dark:text-white/20'}`}>
              <span className={`mr-2 ${current ? 'text-swiss-accent' : ''}`}>
                {String(i + 1).padStart(2, '0')}.
              </span>
              {s}
            </div>
          );
        })}
      </div>
      <div className="ml-auto">
        <ThemeToggle variant="minimal" />
      </div>
    </div>
  );
}

export default function InterviewSetup() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const state     = location.state || {};

  const [interviewId, setInterviewId] = useState(state.interviewId || '');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  useEffect(() => {
    if (!state.interviewId) {
      setInterviewId(`INT-${Math.floor(Math.random() * 90000) + 10000}`);
    }
  }, [state.interviewId]);

  const details = {
    difficulty: state.difficulty || 'Medium',
    pack:       state.pack       || 'Standard Pack',
    questions:  state.questions  || 2,
    duration:   state.duration   || '45 Minutes',
  };

  const handleContinue = async () => {
    setLoading(true);
    setError('');
    
    try {
      // 🔒 STEP 1: Enforce Authentication
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to start an interview.');
        setLoading(false);
        return;
      }

      // 🎯 STEP 2: Create backend session (this validates auth + creates sessionId)
      const sessionRes = await fetch(`${API_URL}/api/interview/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          difficulty:     details.difficulty.toLowerCase(),
          question_count: Number(details.questions),
        }),
      });

      if (!sessionRes.ok) {
        const err = await sessionRes.json().catch(() => ({}));
        // Handle specific auth errors
        if (sessionRes.status === 401) {
          setError('Authentication failed. Please login again.');
          localStorage.removeItem('token'); // Clear invalid token
        } else {
          setError(err.detail || `Session creation failed (${sessionRes.status})`);
        }
        setLoading(false);
        return;
      }

      const sessionData = await sessionRes.json();
      console.log('✅ SESSION CREATED:', sessionData);
      
      // 🚨 CRITICAL: Validate sessionId exists
      const sessionId = sessionData.session_id;
      if (!sessionId) {
        throw new Error('Server did not return a valid session ID');
      }

      // 📚 STEP 3: Fetch full question objects from the SAME backend
      // (ensures questions are sourced from the session's question pool)
      const fetchedQuestions = await fetchRandomQuestions(
        details.difficulty.toLowerCase(),
        Number(details.questions)
      );
      console.log('✅ QUESTIONS FETCHED:', fetchedQuestions);

      // 🚨 CRITICAL: Validate questions were fetched
      if (!fetchedQuestions || fetchedQuestions.length === 0) {
        throw new Error('Failed to load questions from server');
      }

      // ✅ All validations passed — proceed to next step
      navigate('/interview/permissions', {
        state: {
          ...details,
          interviewId,
          sessionId,           // ← guaranteed to be valid
          questions: fetchedQuestions,   // ← guaranteed to have data
        },
      });
    } catch (err) {
      console.error('❌ handleContinue error:', err);
      setError(err.message || 'Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const rows = [
    ['Difficulty',   details.difficulty],
    ['Pack',         details.pack],
    ['Questions',    String(details.questions)],
    ['Duration',     details.duration],
    ['Interview ID', interviewId || '—'],
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white swiss-noise relative flex flex-col">
      <FlowBar step={0} />

      {/* Page header */}
      <div className="border-b-2 border-black dark:border-white px-6 lg:px-16 py-10 swiss-grid-pattern bg-swiss-muted dark:bg-white/5">
        <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
          01. Setup
        </span>
        <h1 className="mt-2 font-black uppercase tracking-tighter leading-none
                       text-[clamp(2.5rem,6vw,5rem)]">
          SESSION<br />DETAILS.
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">

        {/* Left: details table */}
        <div className="lg:col-span-7 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white p-6 lg:p-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">02.</span>
            <span className="text-xs font-black uppercase tracking-widest">Confirm Configuration</span>
            <div className="flex-1 h-px bg-black dark:bg-white" />
          </div>

          <div className="border-2 border-black dark:border-white">
            {rows.map(([k, v], i) => (
              <div key={k}
                className={`flex items-center justify-between px-6 py-5
                  ${i < rows.length - 1 ? 'border-b-2 border-black dark:border-white' : ''}
                  hover:bg-swiss-muted dark:hover:bg-white/10 transition-colors duration-150`}>
                <span className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">{k}</span>
                <span className={`text-sm font-black uppercase tracking-tight
                  ${k === 'Interview ID' ? 'text-swiss-accent font-mono' : 'text-black dark:text-white'}`}>
                  {v}
                </span>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 border-2 border-swiss-accent px-5 py-4 bg-swiss-accent/5">
              <p className="text-xs font-black uppercase tracking-widest text-swiss-accent">
                ⚠ {error}
              </p>
            </div>
          )}
        </div>

        {/* Right: CTA */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex-1 p-6 lg:p-16 swiss-dots bg-swiss-muted dark:bg-white/5 flex flex-col justify-between">
            <div>
              <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
                03. Ready?
              </span>
              <p className="mt-4 text-sm leading-relaxed text-black/60 dark:text-white/60 max-w-xs">
                Questions will be fetched from the server based on your selected difficulty.
                Your camera and microphone will be checked on the next step.
              </p>
            </div>

            <div className="mt-10 space-y-0">
              <button
                onClick={handleContinue}
                disabled={loading}
                className="w-full h-14 flex items-center justify-between px-6
                           bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest
                           border-2 border-black dark:border-white
                           hover:bg-swiss-accent hover:border-swiss-accent
                           dark:hover:bg-swiss-accent dark:hover:border-swiss-accent dark:hover:text-white
                           disabled:opacity-40 disabled:cursor-not-allowed
                           transition-colors duration-150"
              >
                <span>{loading ? 'Loading Questions...' : 'Continue'}</span>
                {loading
                  ? <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent animate-spin" />
                  : <ArrowRight size={16} strokeWidth={3} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
