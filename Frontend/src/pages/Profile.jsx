import React, { useState, useEffect } from 'react';
import Sidebar from '../layout/Sidebar';
import Navbar from '../layout/Navbar';
import StatsCard from '../components/StatsCard'; // We'll reuse the StatsCard we have
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  // Dummy logic for form
  const [formData, setFormData] = useState({
    fullName: 'Alex Walker',
    email: 'alex@example.com',
    username: 'alexw',
    bio: 'Software Engineer passionate about frontend development and AI.'
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setFormData(prev => ({
          ...prev,
          fullName: user.name || prev.fullName,
          email: user.email || prev.email,
        }));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
  };

  const recentInterviews = [
    { id: 'INT-34291', role: 'Software Engineer', difficulty: 'Medium', score: 85, date: 'Mar 8, 2026' },
    { id: 'INT-81923', role: 'Frontend Dev', difficulty: 'Easy', score: 92, date: 'Mar 5, 2026' },
    { id: 'INT-55102', role: 'Backend Dev', difficulty: 'Hard', score: 78, date: 'Feb 28, 2026' },
  ];

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#FAFAFA]'}`}>
      <Sidebar isDarkMode={isDarkMode} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 md:px-10 lg:px-12">
          <div className="max-w-5xl mx-auto space-y-8 pb-12">
            
            {/* Top Section: Profile Header */}
            <div className={`p-8 rounded-2xl shadow-sm border flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-colors ${
              isDarkMode ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-100'
            }`}>
              <div className="relative">
                <div className={`w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold font-mono shadow-md ${
                  isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'
                }`}>
                  {formData.fullName.charAt(0)}
                </div>
                <button className={`absolute bottom-0 right-0 p-2 rounded-full shadow-lg border ${
                  isDarkMode ? 'bg-[#2d2d2d] border-[#3d3d3d] text-gray-300 hover:bg-[#3d3d3d]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className={`text-3xl font-extrabold tracking-tight mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formData.fullName}
                </h1>
                <p className={`text-lg mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formData.email}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                  <span className={`px-3 py-1 rounded-full font-medium ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                    Active Plan: Pro
                  </span>
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>Joined Feb 2026</span>
                </div>
              </div>
              <button className={`mt-4 sm:mt-0 px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all text-sm ${
                isDarkMode ? 'bg-[#2d2d2d] text-white hover:bg-[#3d3d3d] border border-[#3d3d3d]' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}>
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Section 1: Personal Information */}
              <div className={`lg:col-span-1 p-6 rounded-2xl shadow-sm border transition-colors ${
                isDarkMode ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-100'
              }`}>
                <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Personal Information</h2>
                <form onSubmit={handleSave} className="space-y-4 text-sm">
                  <div>
                    <label className={`block font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${
                        isDarkMode ? 'bg-[#121212] border-[#333] text-white focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${
                        isDarkMode ? 'bg-[#121212] border-[#333] text-white focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
                    <input 
                      type="text" 
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${
                        isDarkMode ? 'bg-[#121212] border-[#333] text-white focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bio</label>
                    <textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows="4"
                      className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-colors resize-none ${
                        isDarkMode ? 'bg-[#121212] border-[#333] text-white focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    ></textarea>
                  </div>
                  <button type="submit" className={`w-full py-3 mt-4 rounded-xl font-bold shadow-md transition-transform transform hover:-translate-y-0.5 ${
                    isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}>
                    Save Changes
                  </button>
                </form>
              </div>

              {/* Right Column: Stats and Recent Interivews */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Section 2: Interview Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StatsCard title="Total Interviews" value="15" isDarkMode={isDarkMode} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>} />
                  <StatsCard title="Average Score" value="92%" isDarkMode={isDarkMode} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>} />
                  <StatsCard title="Best Score" value="98%" isDarkMode={isDarkMode} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>} />
                  <StatsCard title="Practice Streak" value="4 Days" isDarkMode={isDarkMode} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>} />
                </div>

                {/* Section 3: Recent Interviews Table */}
                <div className={`overflow-hidden rounded-2xl shadow-sm border transition-colors ${
                  isDarkMode ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-100'
                }`}>
                  <div className={`px-6 py-5 border-b ${isDarkMode ? 'border-[#2d2d2d]' : 'border-gray-100'}`}>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                      Recent Interviews
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className={`text-xs uppercase ${isDarkMode ? 'bg-[#161616] text-gray-500' : 'bg-gray-50 text-gray-500'}`}>
                        <tr>
                          <th className="px-6 py-4 font-medium">ID</th>
                          <th className="px-6 py-4 font-medium">Role</th>
                          <th className="px-6 py-4 font-medium">Difficulty</th>
                          <th className="px-6 py-4 font-medium">Score</th>
                          <th className="px-6 py-4 font-medium">Date</th>
                          <th className="px-6 py-4 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDarkMode ? 'divide-[#2d2d2d]' : 'divide-gray-100'}`}>
                        {recentInterviews.map((item) => (
                          <tr key={item.id} className={`transition-colors hover:bg-opacity-50 ${isDarkMode ? 'hover:bg-[#2d2d2d]' : 'hover:bg-gray-50'}`}>
                            <td className={`px-6 py-4 font-mono text-xs font-semibold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{item.id}</td>
                            <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{item.role}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                item.difficulty === 'Easy' ? (isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-700')
                                : item.difficulty === 'Medium' ? (isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700')
                                : (isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-700')
                              }`}>{item.difficulty}</span>
                            </td>
                            <td className={`px-6 py-4 font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{item.score}%</td>
                            <td className={`px-6 py-4 text-gray-500 ${isDarkMode ? 'text-gray-400' : ''}`}>{item.date}</td>
                            <td className="px-6 py-4">
                              <button className={`text-sm font-semibold transition-colors ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
                                View Report
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
