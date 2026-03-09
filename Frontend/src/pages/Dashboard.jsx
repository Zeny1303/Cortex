import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import Navbar from '../layout/Navbar';
import StatsCard from '../components/StatsCard';
import StartInterviewCard from '../components/StartInterviewCard';
import EvaluationTable from '../components/EvaluationTable';
import LeaderboardTable from '../components/LeaderboardTable';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState('overview'); // overview, leaderboard, evaluations
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#FAFAFA]'}`}>
      
      {/* Left Sidebar Layout */}
      <Sidebar isDarkMode={isDarkMode} activeView={activeView} setActiveView={setActiveView} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        
        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 md:px-10 lg:px-12">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {activeView === 'overview' && (
              <>
                {/* Section 1: Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                  <div>
                    <h1 className={`text-3xl font-extrabold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Welcome back{user && user.name ? `, ${user.name.split(' ')[0]}` : ''}!
                    </h1>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Track your mock interview progress and step up your coding skills.
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/booking')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-md transition-all transform hover:-translate-y-0.5 ${
                      isDarkMode 
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Book AI Interview
                  </button>
                </div>
                
                {/* Section 2: Performance Overview Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard 
                    title="Total Interviews" 
                    value="15" 
                    isDarkMode={isDarkMode}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>} 
                  />
                  <StatsCard 
                    title="Average Score" 
                    value="92%" 
                    isDarkMode={isDarkMode}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>} 
                  />
                  <StatsCard 
                    title="Best Score" 
                    value="98%" 
                    isDarkMode={isDarkMode}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>} 
                  />
                  <StatsCard 
                    title="Practice Streak" 
                    value="4 Days" 
                    isDarkMode={isDarkMode}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>} 
                  />
                </div>

                {/* Section 3: Start Interview CTA Card */}
                <div>
                  <StartInterviewCard isDarkMode={isDarkMode} />
                </div>

                {/* Lower Section: Tables Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                  
                  {/* Section 4: Evaluation Reports Table */}
                  <EvaluationTable isDarkMode={isDarkMode} onViewAll={() => setActiveView('evaluations')} />

                  {/* Section 5: Leaderboard Table */}
                  <LeaderboardTable isDarkMode={isDarkMode} onViewAll={() => setActiveView('leaderboard')} />

                </div>
              </>
            )}

            {activeView === 'leaderboard' && (
              <div className="space-y-6 pb-12">
                <button 
                  onClick={() => setActiveView('overview')}
                  className={`flex items-center gap-2 font-semibold text-sm transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  Back to Dashboard
                </button>
                <LeaderboardTable isDarkMode={isDarkMode} isFullPage={true} />
              </div>
            )}

            {activeView === 'evaluations' && (
              <div className="space-y-6 pb-12">
                <button 
                  onClick={() => setActiveView('overview')}
                  className={`flex items-center gap-2 font-semibold text-sm transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  Back to Dashboard
                </button>
                <EvaluationTable isDarkMode={isDarkMode} isFullPage={true} />
              </div>
            )}

          </div>
        </main>
      </div>
      
    </div>
  );
};

export default Dashboard;
