import React from 'react';
import { useNavigate } from 'react-router-dom';

const InterviewNavbar = ({ interviewId }) => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-[#1e1e1e] border-b border-[#2d2d2d] select-none">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-md flex items-center justify-center shadow-sm">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-gray-200 tracking-tight leading-tight">Technical Interview</h1>
          <span className="text-xs text-gray-500 font-mono">Interview ID: {interviewId || 'Demo'}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-gray-300 bg-[#2d2d2d] border border-[#3e3e42] px-3 py-1.5 rounded-md font-mono text-sm font-medium">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>45:00</span>
        </div>
        
        <button 
          onClick={() => navigate('/interview/completed')}
          className="flex items-center space-x-1.5 px-4 py-1.5 bg-[#2d2d2d] text-rose-400 hover:bg-[#3e3e42] hover:text-rose-300 border border-[#3e3e42] hover:border-rose-900/50 rounded-md text-sm font-medium transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>End Interview</span>
        </button>
      </div>
    </nav>
  );
};

export default InterviewNavbar;
