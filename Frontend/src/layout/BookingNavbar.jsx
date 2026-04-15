import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingNavbar = ({ isDarkMode, toggleTheme }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className={`h-16 flex items-center justify-between px-6 lg:px-10 border-b transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#1a1a1a] border-[#2d2d2d] text-white' 
        : 'bg-white border-gray-200 text-gray-800'
    }`}>
      
      {/* Left: Brand & Nav Links */}
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight hidden sm:block">AI Interview</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className={`text-sm font-semibold transition-colors ${
            isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
          }`}>Dashboard</button>
          <button onClick={() => navigate('/select-type')} className={`text-sm font-semibold transition-colors ${
            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`}>Book Interview</button>
          <button className={`text-sm font-semibold transition-colors ${
            isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
          }`}>Leaderboard</button>
        </div>
      </div>

      {/* Right: Actions & User Profile */}
      <div className="flex items-center gap-4 relative">
        {/* Day / Night Toggle */}
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${
            isDarkMode 
              ? 'bg-[#2d2d2d] text-yellow-500 hover:bg-[#3e3e42]' 
              : 'bg-gray-100 text-indigo-600 hover:bg-gray-200'
          }`}
          title="Toggle Theme"
        >
          {isDarkMode ? (
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
             </svg>
          ) : (
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
             </svg>
          )}
        </button>

        {/* User Profile */}
        <div className="relative flex items-center gap-3 border-l pl-4 border-opacity-30 border-gray-400">
          <div className="hidden sm:block text-right">
            <p className={`text-sm font-bold leading-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Alex Walker</p>
          </div>
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-1 focus:outline-none"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white bg-indigo-600`}>
              AW
            </div>
            <svg className={`w-4 h-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className={`absolute right-0 top-full mt-3 w-48 rounded-xl shadow-lg border py-2 z-50 ${
              isDarkMode ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-100'
            }`}>
              <button className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                isDarkMode ? 'text-gray-300 hover:bg-[#2d2d2d]' : 'text-gray-700 hover:bg-gray-50'
              }`}>Profile</button>
              <button className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                isDarkMode ? 'text-gray-300 hover:bg-[#2d2d2d]' : 'text-gray-700 hover:bg-gray-50'
              }`}>My Interviews</button>
              <div className={`h-px my-1 ${isDarkMode ? 'bg-[#2d2d2d]' : 'bg-gray-100'}`}></div>
              <button 
                onClick={() => {
                  setShowProfileDropdown(false);
                  navigate('/login');
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                isDarkMode ? 'text-red-400 hover:bg-[#2d2d2d]' : 'text-red-600 hover:bg-red-50'
              }`}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BookingNavbar;
