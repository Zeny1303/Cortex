import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import InterviewNavbar from '../components/InterviewNavbar';
import VideoPanel from '../components/VideoPanel';
import AIInterviewerPanel from '../components/AIInterviewerPanel';
import CodeEditor from '../components/CodeEditor';

const InterviewRoom = () => {
  const { interviewId } = useParams();
  const location = useLocation();

  // Questions fetched in InterviewSetup and threaded via router state
  const questions = location.state?.questions || [];

  // Track which question index the user is currently on
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex] || null;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#0a0a0a] text-gray-300 font-sans overflow-hidden">
      <InterviewNavbar interviewId={interviewId} />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col lg:flex-row p-2 gap-2 overflow-hidden h-[calc(100vh-73px)]">

        {/* Left Side: AI Panel & Video (~40% width) */}
        <div className="w-full lg:w-5/12 flex flex-col gap-2 h-full min-h-0">

          {/* AI Interviewer Panel — receives live question */}
          <div className="flex-[3] min-h-0 rounded-xl overflow-hidden shadow-sm border border-gray-800 bg-[#1e1e1e]">
            <AIInterviewerPanel
              question={currentQuestion}
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </div>

          {/* Video Panel */}
          <div className="flex-[2] min-h-0 rounded-xl overflow-hidden shadow-sm border border-gray-800 bg-[#1e1e1e]">
            <VideoPanel />
          </div>
        </div>

        {/* Right Side: Code Editor (~60% width) */}
        <div className="w-full lg:w-7/12 h-full flex flex-col min-h-0">
          <div className="flex-1 border border-gray-800 rounded-xl overflow-hidden shadow-sm min-h-0 bg-[#1e1e1e] flex flex-col">
            <CodeEditor
              starterCode={currentQuestion?.starter_code?.python || '# Write your solution here\n'}
            />

            {/* Bottom Action Bar */}
            <div className="mt-auto flex flex-shrink-0 justify-between items-center bg-[#2d2d2d] px-4 py-3 border-t border-gray-800">
              {/* Question navigation */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-3 py-1.5 text-xs rounded-md border border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>
                <span className="text-xs text-gray-500">
                  {questions.length > 0
                    ? `Q${currentIndex + 1} / ${questions.length}`
                    : 'Loading...'}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1}
                  className="px-3 py-1.5 text-xs rounded-md border border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>

              {/* Submit */}
              <button className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-md font-medium hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-md flex items-center space-x-2 text-sm">
                <span>Submit</span>
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default InterviewRoom;
