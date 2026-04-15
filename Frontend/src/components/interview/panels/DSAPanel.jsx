import React, { useState } from 'react';
import CodeEditor from '../../CodeEditor';
import TestCasePanel from '../../TestCasePanel';

const TABS = ['Editor', 'Test Cases'];

export default function DSAPanel({ question, sessionId, onSubmitResult }) {
  const [activeTab, setActiveTab] = useState('Editor');
  const [testResult, setTestResult] = useState(null);

  const handleResult = (result) => {
    setTestResult(result);
    setActiveTab('Test Cases');
    if (onSubmitResult) onSubmitResult(result);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Tab bar */}
      <div className="flex items-stretch h-10 border-b-2 border-black dark:border-white flex-shrink-0
                      bg-swiss-muted dark:bg-white/5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          const hasBadge = tab === 'Test Cases' && testResult;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-6 border-r-2 border-black dark:border-white
                          text-[10px] font-black uppercase tracking-widest transition-colors duration-150
                          ${isActive
                            ? 'bg-black dark:bg-white text-white dark:text-black'
                            : 'hover:bg-white dark:hover:bg-white/10'}`}
            >
              {tab}
              {hasBadge && (
                <span className={`text-[8px] font-black px-1.5 py-0.5 border
                  ${testResult.result === 'passed'
                    ? isActive ? 'border-white dark:border-black text-white dark:text-black' : 'border-black dark:border-white'
                    : 'border-swiss-accent text-swiss-accent'}`}>
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
            starterCode={question?.starter_code?.python || '# Write your solution here\n\ndef solution():\n    pass\n'}
            sessionId={sessionId}
            questionId={question?.id}
            onSubmitResult={handleResult}
          />
        )}
        {activeTab === 'Test Cases' && (
          <TestCasePanel result={testResult} loading={false} />
        )}
      </div>
    </div>
  );
}
