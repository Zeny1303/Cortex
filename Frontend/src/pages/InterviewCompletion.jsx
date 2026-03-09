import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingNavbar from '../layout/BookingNavbar'; // Reuse the navbar style
import { useTheme } from '../context/ThemeContext';

const InterviewCompletion = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
      <BookingNavbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className={`max-w-xl w-full p-12 rounded-3xl shadow-lg border text-center ${
          isDarkMode ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-white border-gray-100'
        }`}>
          
          <div className="relative inline-block mb-10">
            {/* Celebration backdrop bloom */}
            <div className={`absolute inset-0 rounded-full blur-xl opacity-50 ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-300'}`}></div>
            
            <div className={`relative w-24 h-24 mx-auto rounded-2xl flex items-center justify-center rotate-3 transform shadow-xl border ${
              isDarkMode ? 'bg-gradient-to-tr from-indigo-900 to-indigo-700 border-indigo-500/30 text-white' : 'bg-gradient-to-tr from-indigo-500 to-indigo-600 border-indigo-300 text-white'
            }`}>
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
          </div>
          
          <h2 className={`text-4xl font-black mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Interview Completed
          </h2>
          
          <p className={`text-xl font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Thank you for completing your interview.
          </p>
          
          <p className={`text-md mb-10 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Your evaluation is now available on your dashboard.
          </p>

          <button 
            onClick={() => navigate('/dashboard')}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-transform transform hover:-translate-y-0.5 ${
              isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
            }`}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCompletion;
