import React, { useState, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { executeCode } from '../services/interviewService';

const LANGUAGES = [
  { value: 'python',     label: 'Python'     },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'cpp',        label: 'C++'        },
  { value: 'java',       label: 'Java'       },
];

const DEFAULT_CODE = {
  python:     '# Write your solution here\n\ndef solution():\n    pass\n',
  javascript: 'var solution = function() {\n    \n};\n',
  cpp:        '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n};\n',
  java:       'class Solution {\n    // Write your solution here\n}\n',
};

/**
 * CodeEditor
 * Props:
 *   starterCode  {string}   — python starter from question
 *   sessionId    {string}   — for submit-code endpoint
 *   questionId   {string}   — for submit-code endpoint
 *   onSubmitResult {fn}     — called with CodeSubmitResponse
 */
export default function CodeEditor({ starterCode, sessionId, questionId, onSubmitResult }) {
  const [language, setLanguage]       = useState('python');
  const [code, setCode]               = useState(starterCode || DEFAULT_CODE.python);
  const [runOutput, setRunOutput]     = useState(null);   // { output, error, execution_time_ms }
  const [running, setRunning]         = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const editorRef = useRef(null);

  // When language changes, reset to default unless we have a starter
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (lang === 'python' && starterCode) {
      setCode(starterCode);
    } else {
      setCode(DEFAULT_CODE[lang]);
    }
    setRunOutput(null);
  };

  const getCurrentCode = () => {
    return editorRef.current?.getValue() ?? code;
  };

  const handleRun = useCallback(async () => {
    const currentCode = getCurrentCode();
    if (!currentCode.trim()) return;
    setRunning(true);
    setConsoleOpen(true);
    setRunOutput(null);
    try {
      const result = await executeCode(language, currentCode);
      setRunOutput(result);
    } catch (err) {
      setRunOutput({ output: null, error: err.message, execution_time_ms: 0 });
    } finally {
      setRunning(false);
    }
  }, [language]);

  const handleSubmit = useCallback(async () => {
    if (!sessionId) return;
    const currentCode = getCurrentCode();
    if (!currentCode.trim()) return;
    setSubmitting(true);
    setConsoleOpen(true);
    try {
      const { submitCode } = await import('../services/interviewService');
      const result = await submitCode(sessionId, currentCode);
      if (onSubmitResult) onSubmitResult(result);
      // Show a summary in the console too
      setRunOutput({
        output: `Submitted — ${result.passed_tests}/${result.total_tests} tests passed`,
        error: result.result === 'error' ? result.feedback : null,
        execution_time_ms: 0,
      });
    } catch (err) {
      setRunOutput({ output: null, error: err.message, execution_time_ms: 0 });
    } finally {
      setSubmitting(false);
    }
  }, [sessionId, onSubmitResult]);

  const consoleLines = runOutput
    ? [
        runOutput.output && `${runOutput.output}`,
        runOutput.error  && `Error: ${runOutput.error}`,
        runOutput.execution_time_ms > 0 && `Executed in ${runOutput.execution_time_ms.toFixed(1)}ms`,
      ].filter(Boolean)
    : [];

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">

      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="flex items-stretch h-10 border-b-2 border-black bg-swiss-muted flex-shrink-0 select-none">

        {/* Label */}
        <div className="flex items-center px-4 border-r-2 border-black">
          <span className="text-[10px] font-black uppercase tracking-widest text-black/60">
            Editor
          </span>
        </div>

        {/* Language selector */}
        <div className="relative border-r-2 border-black">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="h-full appearance-none bg-transparent px-4 pr-8
                       text-[10px] font-black uppercase tracking-widest
                       focus:outline-none cursor-pointer hover:bg-black hover:text-white
                       transition-colors duration-150"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <ChevronDown size={10} strokeWidth={3} />
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Run button */}
        <button
          onClick={handleRun}
          disabled={running || submitting}
          className="flex items-center gap-2 px-5 border-l-2 border-black
                     text-[10px] font-black uppercase tracking-widest
                     hover:bg-black hover:text-white
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors duration-150"
          title="Run code (no test cases)"
        >
          {running
            ? <Loader size={11} strokeWidth={2.5} className="animate-spin" />
            : <Play size={11} strokeWidth={2.5} />}
          Run
        </button>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={running || submitting || !sessionId}
          className="flex items-center gap-2 px-5 border-l-2 border-black
                     bg-black text-white text-[10px] font-black uppercase tracking-widest
                     hover:bg-swiss-accent hover:border-swiss-accent
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors duration-150"
          title={sessionId ? 'Submit against hidden test cases' : 'No active session'}
        >
          {submitting
            ? <Loader size={11} strokeWidth={2.5} className="animate-spin" />
            : <Send size={11} strokeWidth={2.5} />}
          Submit
        </button>
      </div>

      {/* ── Monaco Editor ───────────────────────────────── */}
      <div className="flex-1 min-h-0 relative">
        <Editor
          height="100%"
          language={language}
          theme="vs"
          value={code}
          onChange={(val) => setCode(val ?? '')}
          onMount={(editor) => { editorRef.current = editor; }}
          options={{
            minimap:                    { enabled: false },
            fontSize:                   14,
            lineHeight:                 22,
            padding:                    { top: 12, bottom: 12 },
            scrollBeyondLastLine:       false,
            smoothScrolling:            true,
            cursorBlinking:             'smooth',
            cursorSmoothCaretAnimation: 'on',
            formatOnPaste:              true,
            fontFamily:                 "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            renderLineHighlight:        'line',
            lineNumbers:                'on',
            folding:                    true,
            wordWrap:                   'on',
            tabSize:                    4,
            automaticLayout:            true,
          }}
        />
      </div>

      {/* ── Output console ──────────────────────────────── */}
      <div className={`flex-shrink-0 border-t-2 border-black transition-all duration-200
                       ${consoleOpen ? 'h-32' : 'h-9'}`}>

        {/* Console header / toggle */}
        <button
          onClick={() => setConsoleOpen((p) => !p)}
          className="w-full flex items-center justify-between px-4 h-9
                     bg-swiss-muted border-b-2 border-black
                     text-[10px] font-black uppercase tracking-widest
                     hover:bg-black hover:text-white transition-colors duration-150"
        >
          <span className="flex items-center gap-2">
            <span>Output</span>
            {runOutput?.error && (
              <span className="text-swiss-accent">— Error</span>
            )}
            {runOutput?.output && !runOutput?.error && (
              <span className="text-black/40">— Done</span>
            )}
          </span>
          {consoleOpen
            ? <ChevronDown size={11} strokeWidth={3} />
            : <ChevronUp size={11} strokeWidth={3} />}
        </button>

        {/* Console body */}
        {consoleOpen && (
          <div className="h-[calc(100%-2.25rem)] overflow-y-auto bg-white px-4 py-3
                          font-mono text-xs leading-relaxed">
            {running || submitting ? (
              <span className="text-black/40 animate-pulse">Running...</span>
            ) : consoleLines.length > 0 ? (
              consoleLines.map((line, i) => (
                <div key={i}
                  className={line.startsWith('Error:') ? 'text-swiss-accent' : 'text-black'}>
                  {line}
                </div>
              ))
            ) : (
              <span className="text-black/30">
                Press Run to execute your code, or Submit to test against hidden cases.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
