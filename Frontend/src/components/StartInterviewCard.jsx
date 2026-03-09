import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartInterviewCard = ({ isDarkMode }) => {
  const navigate = useNavigate();

  return (
    <div className={`p-8 rounded-2xl shadow-sm border transition-colors duration-300 flex flex-col md:flex-row items-center justify-between gap-6 ${
      isDarkMode 
        ? 'bg-gradient-to-r from-indigo-900/40 to-blue-900/40 border-indigo-500/30' 
        : 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100'
    }`}>
      <div>
        <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-indigo-900'}`}>
          Start Your Next Interview
        </h3>
        <p className={`${isDarkMode ? 'text-indigo-200/' : 'text-indigo-700/80'} text-sm max-w-md`}>
          Practice a technical interview with AI. Choose your difficulty, question pack, and get real-time feedback.
        </p>
      </div>
      
      <button 
        onClick={() => navigate('/interview/setup')}
        className={`px-8 py-3 rounded-xl font-bold whitespace-nowrap shadow-md transition-all transform hover:-translate-y-0.5 ${
          isDarkMode 
            ? 'bg-indigo-500 text-white hover:bg-indigo-400' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        Start Interview
      </button>
    </div>
  );
};

export default StartInterviewCard;
