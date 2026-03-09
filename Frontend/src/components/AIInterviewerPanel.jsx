import React from 'react';

const AIInterviewerPanel = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#1e1e1e]">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[#3e3e42] bg-[#2d2d2d] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-md bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#2d2d2d]"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-200 text-sm">AI Interviewer</h3>
            <p className="text-xs text-emerald-400 font-medium flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Listening...
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
            <button className="text-gray-400 hover:text-gray-200 p-1 rounded hover:bg-[#3c3c3c] transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
        </div>
      </div>

      {/* Transcript Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* AI Message */}
        <div className="flex items-start space-x-3">
          <div className="w-7 h-7 rounded bg-gradient-to-tr from-emerald-600 to-teal-500 flex-shrink-0 flex items-center justify-center mt-0.5">
            <span className="text-white text-[10px] font-bold">AI</span>
          </div>
          <div className="flex-1 bg-[#2d2d2d] border border-[#3e3e42] rounded-lg rounded-tl-sm p-3 shadow-sm">
            <p className="text-gray-300 text-sm leading-relaxed">
              Hello! Welcome to your technical interview. Let's start with a coding challenge. Can you write a function to find the maximum sum of a contiguous subarray?
            </p>
          </div>
        </div>

        {/* Candidate Message */}
        <div className="flex items-start flex-row-reverse">
          <div className="w-7 h-7 rounded bg-[#3e3e42] flex-shrink-0 flex items-center justify-center mt-0.5 ml-3">
            <span className="text-gray-300 text-[10px] font-bold">YOU</span>
          </div>
          <div className="flex-1 bg-[#25302a] border border-[#2d4036] rounded-lg rounded-tr-sm p-3 shadow-sm">
            <p className="text-gray-200 text-sm leading-relaxed">
              Sure, I think I can use Kadane's algorithm for that. I'll define a local maximum and a global maximum, iterating through the array.
            </p>
          </div>
        </div>

        {/* AI Message */}
        <div className="flex items-start space-x-3">
          <div className="w-7 h-7 rounded bg-gradient-to-tr from-emerald-600 to-teal-500 flex-shrink-0 flex items-center justify-center mt-0.5">
            <span className="text-white text-[10px] font-bold">AI</span>
          </div>
          <div className="flex-1 bg-[#2d2d2d] border border-[#3e3e42] rounded-lg rounded-tl-sm p-3 shadow-sm">
            <p className="text-gray-300 text-sm leading-relaxed">
              That sounds like an excellent approach. Kadane's algorithm will give us an O(n) time complexity. Go ahead and implement it in the editor.
            </p>
          </div>
        </div>
      </div>
      
      {/* Input Area (Mock) */}
      <div className="p-3 border-t border-[#3e3e42] bg-[#1e1e1e]">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="w-full bg-[#2d2d2d] border border-[#3e3e42] text-gray-200 text-sm rounded-md pl-3 pr-10 py-2 focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-500"
            readOnly
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
