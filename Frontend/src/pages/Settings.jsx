import React, { useState } from 'react';
import Sidebar from '../layout/Sidebar';
import Navbar from '../layout/Navbar';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const [accountData, setAccountData] = useState({
    fullName: 'Alex Walker',
    email: 'alex@example.com',
    username: 'alexw',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    emailNotifications: true,
    leaderboardVisibility: true,
  });

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#FAFAFA]'}`}>
      <Sidebar isDarkMode={isDarkMode} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 md:px-10 lg:px-12">
          <div className="max-w-4xl mx-auto space-y-8 pb-12">
            
            <div className="mb-8">
              <h1 className={`text-3xl font-extrabold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Settings
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Manage your account structure and preferences.
              </p>
            </div>

            {/* Section 1: Account Settings */}
            <div className={`p-6 sm:p-8 rounded-2xl shadow-sm border transition-colors ${
              isDarkMode ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-100'
            }`}>
              <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Account Settings</h2>
              <form className="space-y-5 text-sm max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={`block font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                    <input 
                      type="text" 
                      value={accountData.fullName}
                      onChange={(e) => setAccountData({...accountData, fullName: e.target.value})}
                      className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${isDarkMode ? 'bg-[#121212] border-[#333] text-white focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label className={`block font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
                    <input 
                      type="text" 
                      value={accountData.username}
                      onChange={(e) => setAccountData({...accountData, username: e.target.value})}
                      className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${isDarkMode ? 'bg-[#121212] border-[#333] text-white focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                  <input 
                    type="email" 
                    value={accountData.email}
                    onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${isDarkMode ? 'bg-[#121212] border-[#333] text-white focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
                <button type="submit" className={`px-6 py-2.5 rounded-xl font-bold shadow-sm transition-transform transform hover:-translate-y-0.5 mt-2 ${
                  isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}>
                  Save Changes
                </button>
              </form>
            </div>

            {/* Section 2: Security Settings */}
            <div className={`p-6 sm:p-8 rounded-2xl shadow-sm border transition-colors ${
              isDarkMode ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-100'
            }`}>
              <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Security Settings</h2>
              <form className="space-y-5 text-sm max-w-2xl">
                <div>
                  <label className={`block font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Password</label>
                  <input 
                    type="password" 
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${isDarkMode ? 'bg-[#121212] border-[#333] text-white focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={`block font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
                    <input 
                      type="password" 
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                      className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${isDarkMode ? 'bg-[#121212] border-[#333] text-white focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label className={`block font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
                    <input 
                      type="password" 
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                      className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${isDarkMode ? 'bg-[#121212] border-[#333] text-white focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    />
                  </div>
                </div>
                <button type="submit" className={`px-6 py-2.5 rounded-xl font-bold border shadow-sm transition-all focus:ring-2 focus:ring-gray-300 mt-2 ${
                  isDarkMode ? 'bg-[#2d2d2d] border-[#3d3d3d] text-white hover:bg-[#3d3d3d]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>
                  Update Password
                </button>
              </form>
            </div>

            {/* Section 3: Preferences */}
            <div className={`p-6 sm:p-8 rounded-2xl shadow-sm border transition-colors ${
              isDarkMode ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-100'
            }`}>
              <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Preferences</h2>
              <div className="space-y-6 max-w-2xl">
                
                {/* Toggle: Dark Mode */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Dark Mode</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Adjust the appearance of the application.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setPreferences({...preferences, darkMode: !preferences.darkMode});
                      toggleTheme();
                    }}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Toggle: Email Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Email Notifications</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive reports and updates via email.</p>
                  </div>
                  <button 
                    onClick={() => setPreferences({...preferences, emailNotifications: !preferences.emailNotifications})}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${preferences.emailNotifications ? 'bg-indigo-600' : (isDarkMode ? 'bg-[#333]' : 'bg-gray-200')}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${preferences.emailNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Toggle: Leaderboard Visibility */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Leaderboard Visibility</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Show my progress on the platform leaderboard.</p>
                  </div>
                  <button 
                    onClick={() => setPreferences({...preferences, leaderboardVisibility: !preferences.leaderboardVisibility})}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${preferences.leaderboardVisibility ? 'bg-indigo-600' : (isDarkMode ? 'bg-[#333]' : 'bg-gray-200')}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${preferences.leaderboardVisibility ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

              </div>
            </div>

            {/* Section 4: Danger Zone */}
            <div className={`p-6 sm:p-8 rounded-2xl shadow-sm border transition-colors ${
              isDarkMode ? 'bg-red-900/10 border-red-900/30' : 'bg-red-50 border-red-100'
            }`}>
              <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>Danger Zone</h2>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-red-300/70' : 'text-red-600/80'}`}>
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button className={`px-6 py-2.5 rounded-xl font-bold shadow-sm transition-transform transform hover:-translate-y-0.5 ${
                isDarkMode ? 'bg-red-600/20 text-red-500 hover:bg-red-600/30 border border-red-900/50' : 'bg-white text-red-600 hover:bg-red-50 border border-red-200'
              }`}>
                Delete Account
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
