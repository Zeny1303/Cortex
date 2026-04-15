import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// SVG Icons
const Icons = {
  Dashboard: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>,
  BookInterview: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
  StartInterview: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  Reports: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
  Leaderboard: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v8l9-11h-7z"></path></svg>, // Used lightning as fallback
  Settings: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
};

const Sidebar = ({ isDarkMode, activeView, setActiveView }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', view: 'overview', icon: Icons.Dashboard },
    { name: 'Book AI Interview', path: '/select-type', icon: Icons.BookInterview },
    { name: 'Start Interview', path: '/interview/setup', icon: Icons.StartInterview },
    { name: 'Evaluation Reports', path: '#reports', view: 'evaluations', icon: Icons.Reports },
    { name: 'Leaderboard', path: '#leaderboard', view: 'leaderboard', icon: Icons.Leaderboard },
    { name: 'Settings', path: '/settings', icon: Icons.Settings },
  ];

  return (
    <div className={`w-64 flex-shrink-0 border-r flex flex-col transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#121212] border-[#2d2d2d] text-white' 
        : 'bg-white border-gray-200 text-gray-800'
    }`}>
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-transparent">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight">AI Interview</span>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActivePath = location.pathname === item.path && item.path !== '/dashboard';
          const isActiveView = activeView && item.view === activeView;
          const isActive = isActivePath || isActiveView || (location.pathname === '/dashboard' && item.path === '/dashboard' && activeView === 'overview');
          return (
            <button
              key={item.name}
              onClick={() => {
                if (item.path.startsWith('/') && item.path !== '/dashboard') {
                  navigate(item.path);
                } else if (setActiveView && item.view) {
                  setActiveView(item.view);
                } else if (item.path === '/dashboard') {
                   // if on another page navigate, else just set view
                   if (location.pathname !== '/dashboard') navigate('/dashboard');
                   else if (setActiveView) setActiveView('overview');
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                isActive
                  ? isDarkMode
                    ? 'bg-indigo-600/10 text-indigo-400'
                    : 'bg-indigo-50 text-indigo-700'
                  : isDarkMode
                    ? 'hover:bg-[#1e1e1e] text-gray-400 hover:text-gray-200'
                    : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className={isActive ? (isDarkMode ? 'text-indigo-400' : 'text-indigo-700') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
                <item.icon />
              </span>
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
