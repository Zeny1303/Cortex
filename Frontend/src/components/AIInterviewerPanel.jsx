import React from 'react';

// Difficulty badge colors
const DIFFICULTY_COLORS = {
  easy:   'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  medium: 'text-yellow-400  bg-yellow-500/10  border-yellow-500/30',
  hard:   'text-red-400     bg-red-500/10     border-red-500/30',
};

const AIInterviewerPanel = ({
  question       = null,
  currentIndex   = 0,
  totalQuestions = 0,
  onNext,
  onPrev,
}) => {
  const difficultyClass =
    DIFFICULTY_COLORS[question?.difficulty] || DIFFICULTY_COLORS.medium;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#1e1e1e]">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="px-5 py-3 border-b border-[#3e3e42] bg-[#2d2d2d] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-md bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#2d2d2d]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-200 text-sm">AI Interviewer</h3>
            <p className="text-xs text-emerald-400 font-medium flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              Listening...
            </p>
          </div>
        </div>

        {/* Question counter badge */}
        {totalQuestions > 0 && (
          <span className="text-xs text-gray-500 bg-[#3c3c3c] px-2 py-1 rounded-md">
            Q{currentIndex + 1}/{totalQuestions}
          </span>
        )}
      </div>

      {/* ── Question Display Area ───────────────────────── */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">

        {/* No question loaded yet */}
        {!question && (
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded bg-gradient-to-tr from-emerald-600 to-teal-500 flex-shrink-0 flex items-center justify-center mt-0.5">
              <span className="text-white text-[10px] font-bold">AI</span>
            </div>
            <div className="flex-1 bg-[#2d2d2d] border border-[#3e3e42] rounded-lg rounded-tl-sm p-3 shadow-sm">
              <p className="text-gray-400 text-sm leading-relaxed animate-pulse">
                Loading your question...
              </p>
            </div>
          </div>
        )}

        {/* Live question from API */}
        {question && (
          <>
            {/* AI intro bubble */}
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded bg-gradient-to-tr from-emerald-600 to-teal-500 flex-shrink-0 flex items-center justify-center mt-0.5">
                <span className="text-white text-[10px] font-bold">AI</span>
              </div>
              <div className="flex-1 bg-[#2d2d2d] border border-[#3e3e42] rounded-lg rounded-tl-sm p-3 shadow-sm">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Here's your next coding challenge. Take your time to read and understand the problem before coding.
                </p>
              </div>
            </div>

            {/* Question card */}
            <div className="bg-[#252525] border border-[#3e3e42] rounded-xl p-4 space-y-3">

              {/* Title + difficulty + tags */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-gray-100 font-bold text-base leading-tight">
                  {question.title}
                </h2>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${difficultyClass} flex-shrink-0 capitalize`}>
                  {question.difficulty}
                </span>
              </div>

              {/* Tags */}
              {question.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[#3c3c3c] text-gray-400 border border-[#4e4e4e]"
                    >
                      {tag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {question.description}
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Input Area (chat) ─────────────────────────── */}
      <div className="p-3 border-t border-[#3e3e42] bg-[#1e1e1e] flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Type a message or ask a hint..."
            className="w-full bg-[#2d2d2d] border border-[#3e3e42] text-gray-200 text-sm rounded-md pl-3 pr-10 py-2 focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-500"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
};

export default AIInterviewerPanel;
