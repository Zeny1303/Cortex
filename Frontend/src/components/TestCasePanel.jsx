import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * TestCasePanel
 * Props:
 *   result  {object|null}  — CodeSubmitResponse from backend
 *     { result, passed_tests, failed_tests, total_tests, feedback, results[] }
 *   loading {boolean}
 */
export default function TestCasePanel({ result, loading }) {
  const [expanded, setExpanded] = useState(null); // index of expanded test

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-black border-t-swiss-accent animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-black/40">
            Running test cases...
          </span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <span className="text-[10px] font-black uppercase tracking-widest text-black/30">
          Submit your code to see test results
        </span>
      </div>
    );
  }

  const { result: verdict, passed_tests, failed_tests, total_tests, feedback, results = [] } = result;

  const VERDICT_STYLE = {
    passed:  { bg: 'bg-black',         text: 'text-white',        label: 'All Tests Passed' },
    partial: { bg: 'bg-swiss-muted',   text: 'text-black',        label: 'Partial Pass'     },
    failed:  { bg: 'bg-swiss-accent',  text: 'text-white',        label: 'Tests Failed'     },
    error:   { bg: 'bg-swiss-accent',  text: 'text-white',        label: 'Runtime Error'    },
  };

  const vs = VERDICT_STYLE[verdict] || VERDICT_STYLE.error;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">

      {/* Summary bar */}
      <div className={`flex items-center justify-between px-5 py-3 flex-shrink-0 ${vs.bg}`}>
        <div className="flex items-center gap-3">
          {verdict === 'passed'
            ? <CheckCircle size={14} strokeWidth={2.5} className={vs.text} />
            : verdict === 'error'
            ? <AlertCircle size={14} strokeWidth={2.5} className={vs.text} />
            : <XCircle size={14} strokeWidth={2.5} className={vs.text} />}
          <span className={`text-xs font-black uppercase tracking-widest ${vs.text}`}>
            {vs.label}
          </span>
        </div>
        <span className={`text-xs font-black tracking-widest ${vs.text}`}>
          {passed_tests} / {total_tests} passed
        </span>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="px-5 py-3 border-b-2 border-black bg-swiss-muted flex-shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/60 leading-relaxed">
            {feedback}
          </p>
        </div>
      )}

      {/* Test case list */}
      <div className="flex-1 overflow-y-auto">
        {results.length === 0 && verdict === 'error' && (
          <div className="px-5 py-4">
            <p className="text-xs font-bold text-swiss-accent leading-relaxed">
              {feedback || 'An error occurred before test cases could run.'}
            </p>
          </div>
        )}

        {results.map((tc, i) => {
          const isOpen = expanded === i;
          return (
            <div key={i} className="border-b-2 border-black last:border-b-0">
              {/* Row header */}
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className={`w-full flex items-center justify-between px-5 py-3
                            text-left transition-colors duration-150
                            ${tc.passed ? 'hover:bg-swiss-muted' : 'hover:bg-swiss-accent/5'}`}
              >
                <div className="flex items-center gap-3">
                  {tc.passed
                    ? <CheckCircle size={13} strokeWidth={2.5} className="text-black flex-shrink-0" />
                    : <XCircle    size={13} strokeWidth={2.5} className="text-swiss-accent flex-shrink-0" />}
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Test {tc.test_index}
                  </span>
                  {tc.error && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-swiss-accent">
                      — {tc.error.split(':')[0]}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest
                    ${tc.passed ? 'text-black' : 'text-swiss-accent'}`}>
                    {tc.passed ? 'Pass' : 'Fail'}
                  </span>
                  {isOpen
                    ? <ChevronUp   size={11} strokeWidth={3} className="text-black/40" />
                    : <ChevronDown size={11} strokeWidth={3} className="text-black/40" />}
                </div>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t-2 border-black bg-swiss-muted px-5 py-4 space-y-3">
                  {[
                    ['Input',    tc.input],
                    ['Expected', tc.expected],
                    ['Actual',   tc.actual !== null && tc.actual !== undefined
                                   ? String(tc.actual)
                                   : tc.error || '—'],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <span className="text-[9px] font-black uppercase tracking-widest text-black/40">
                        {label}
                      </span>
                      <pre className={`mt-1 text-xs font-mono leading-relaxed whitespace-pre-wrap
                        ${label === 'Actual' && !tc.passed ? 'text-swiss-accent' : 'text-black'}`}>
                        {String(val)}
                      </pre>
                    </div>
                  ))}
                  {tc.error && (
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-swiss-accent">
                        Error
                      </span>
                      <pre className="mt-1 text-xs font-mono text-swiss-accent whitespace-pre-wrap">
                        {tc.error}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
