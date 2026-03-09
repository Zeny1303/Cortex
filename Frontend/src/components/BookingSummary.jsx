import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookingSummary = ({ difficulty, selectedPack, isDarkMode, toggleTheme, interviewId, onConfirm }) => {
  const navigate = useNavigate();
  return (
    <div className={`p-6 rounded-2xl shadow-sm border ${
      isDarkMode 
        ? 'bg-[#1e1e1e] border-[#2d2d2d]' 
        : 'bg-white border-gray-100'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Summary
        </h2>
      </div>
      
      <div className="space-y-4 mb-8">
        <div className={`flex justify-between pb-4 border-b ${isDarkMode ? 'border-[#2d2d2d]' : 'border-gray-100'}`}>
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Difficulty Selected</span>
          <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{difficulty}</span>
        </div>
        
        <div className={`flex justify-between pb-4 border-b ${isDarkMode ? 'border-[#2d2d2d]' : 'border-gray-100'}`}>
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Package</span>
          <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedPack?.title}</span>
        </div>

        <div className={`flex justify-between pb-4 border-b ${isDarkMode ? 'border-[#2d2d2d]' : 'border-gray-100'}`}>
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Number of Questions</span>
          <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedPack?.questions} x Coding</span>
        </div>
        
        <div className="flex justify-between pt-2 mb-2">
          <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Estimate</span>
          <span className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-indigo-700'}`}>₹{selectedPack?.price}</span>
        </div>

        {interviewId && (
          <div className={`mt-4 p-4 rounded-xl border ${isDarkMode ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100'}`}>
            <p className={`text-sm mb-1 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Your Interview ID</p>
            <p className={`text-xl font-mono font-bold tracking-wider ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{interviewId}</p>
          </div>
        )}
      </div>
      
      {!interviewId ? (
        <button 
          onClick={onConfirm}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-bold text-lg shadow-md transition-all transform hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-500/50"
        >
          Confirm Booking
        </button>
      ) : (
        <button 
          onClick={() => navigate('/interview/setup', { state: { interviewId, difficulty, pack: selectedPack?.title, questions: selectedPack?.questions, duration: '45 Minutes' } })}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-lg shadow-md transition-all transform hover:-translate-y-0.5 focus:ring-4 focus:emerald-500/50"
        >
          Proceed to Setup
        </button>
      )}
      
      <p className={`text-center mt-4 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Secure payment processing. You can cancel anytime.
      </p>
    </div>
  );
};

export default BookingSummary;
