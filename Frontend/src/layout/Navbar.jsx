import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const userInitials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
    : 'U';

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate('/login');
  };

  return (
    <header className={`h-16 flex items-center justify-between px-6 border-b transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#121212] border-[#2d2d2d] text-white' 
        : 'bg-white border-gray-200 text-gray-800'
    }`}>
      
      {/* Search Input */}
      <div className="flex-1 max-w-xl">
        <div className={`relative flex items-center rounded-xl p-2 ${
          isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-100'
        }`}>
          <svg className={`w-5 h-5 ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Search..." 
            className={`w-full bg-transparent border-none outline-none px-3 text-sm flex-1 ${
              isDarkMode ? 'text-gray-200 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'
            }`}
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 ml-6 relative">
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

        {/* Bell Icon */}
        <button className={`p-2 rounded-full transition-colors relative ${
          isDarkMode ? 'hover:bg-[#1e1e1e] text-gray-400' : 'hover:bg-gray-50 text-gray-500'
        }`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white bg-indigo-600`}>
              {userInitials}
            </div>
            <svg className={`w-4 h-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className={`absolute right-0 mt-3 w-48 rounded-xl shadow-lg border py-2 z-50 ${
              isDarkMode ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-100'
            }`}>
              <button 
                onClick={() => {
                  setShowProfileDropdown(false);
                  navigate('/profile');
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                isDarkMode ? 'text-gray-300 hover:bg-[#2d2d2d]' : 'text-gray-700 hover:bg-gray-50'
              }`}>Profile</button>
              <button 
                onClick={() => {
                  setShowProfileDropdown(false);
                  navigate('/my-interviews');
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                isDarkMode ? 'text-gray-300 hover:bg-[#2d2d2d]' : 'text-gray-700 hover:bg-gray-50'
              }`}>My Interviews</button>
              <div className={`h-px my-1 ${isDarkMode ? 'bg-[#2d2d2d]' : 'bg-gray-100'}`}></div>
              <button 
                onClick={handleLogout}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                isDarkMode ? 'text-red-400 hover:bg-[#2d2d2d]' : 'text-red-600 hover:bg-red-50'
              }`}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
