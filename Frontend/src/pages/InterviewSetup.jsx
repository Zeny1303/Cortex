import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BookingNavbar from '../layout/BookingNavbar';
import { useTheme } from '../context/ThemeContext';

const InterviewSetup = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const [interviewId, setInterviewId] = useState(state.interviewId || '');

  useEffect(() => {
    if (!state.interviewId) {
      setInterviewId(`INT-${Math.floor(Math.random() * 90000) + 10000}`);
    }
  }, [state.interviewId]);

  const details = {
    difficulty: state.difficulty || "Medium",
    pack: state.pack || "Standard Pack",
    questions: state.questions || 3,
    duration: state.duration || "45 Minutes"
  };

  const handleContinue = () => {
    navigate('/interview/permissions', { state: { interviewId } });
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
      <BookingNavbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className={`max-w-2xl w-full p-10 rounded-3xl shadow-lg border text-center ${
          isDarkMode ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-white border-gray-100'
        }`}>
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
            isDarkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
          }`}>
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          </div>
          
          <h2 className={`text-3xl font-extrabold mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Interview Setup
          </h2>
          <p className={`text-sm tracking-wide font-mono mb-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
            ID: {interviewId || 'Loading...'}
          </p>

          <div className={`text-left p-8 rounded-2xl mb-8 border ${isDarkMode ? 'bg-[#212121] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`font-bold mb-6 text-xl border-b pb-2 ${isDarkMode ? 'text-gray-200 border-[#3d3d3d]' : 'text-gray-800 border-gray-200'}`}>
              Session Details
            </h3>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Difficulty</p>
                <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{details.difficulty}</p>
              </div>
              <div>
                <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Question Pack</p>
                <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{details.pack}</p>
              </div>
              <div>
                <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Number of Questions</p>
                <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{details.questions}</p>
              </div>
              <div>
                <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Estimated Duration</p>
                <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{details.duration}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleContinue}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-transform transform hover:-translate-y-0.5 ${
              isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
