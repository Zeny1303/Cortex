import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingNavbar from '../layout/BookingNavbar';
import { useTheme } from '../context/ThemeContext';

const PermissionCheck = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  // Simulated states for permissions
  const [camStatus, setCamStatus] = useState('checking'); // checking, ok, error
  const [micStatus, setMicStatus] = useState('checking');

  // Simulate permission check on mount
  React.useEffect(() => {
    const timer1 = setTimeout(() => setCamStatus('ok'), 1500);
    const timer2 = setTimeout(() => setMicStatus('ok'), 2500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  const allClear = camStatus === 'ok' && micStatus === 'ok';

  const StatusIcon = ({ status }) => {
    if (status === 'checking') return <svg className="w-6 h-6 text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
    if (status === 'ok') return <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
    return <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
      <BookingNavbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className={`max-w-xl w-full p-10 rounded-3xl shadow-lg border text-center ${
          isDarkMode ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-white border-gray-100'
        }`}>
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
            isDarkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
          }`}>
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          </div>
          
          <h2 className={`text-3xl font-extrabold mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            System Check
          </h2>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Please allow access to your camera and microphone so the AI Interviewer can see and hear you.
          </p>

          <div className="space-y-4 mb-10">
            {/* Camera Check */}
            <div className={`flex items-center justify-between p-5 rounded-2xl border ${isDarkMode ? 'bg-[#212121] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-[#2d2d2d] text-gray-300' : 'bg-white text-gray-700 shadow-sm'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div className="text-left">
                  <p className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Camera</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {camStatus === 'checking' ? 'Requesting access...' : camStatus === 'ok' ? 'Connected successfully' : 'Access denied'}
                  </p>
                </div>
              </div>
              <StatusIcon status={camStatus} />
            </div>

            {/* Mic Check */}
            <div className={`flex items-center justify-between p-5 rounded-2xl border ${isDarkMode ? 'bg-[#212121] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-[#2d2d2d] text-gray-300' : 'bg-white text-gray-700 shadow-sm'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                </div>
                <div className="text-left">
                  <p className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Microphone</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {micStatus === 'checking' ? 'Requesting access...' : micStatus === 'ok' ? 'Connected successfully' : 'Access denied'}
                  </p>
                </div>
              </div>
              <StatusIcon status={micStatus} />
            </div>
          </div>

          <button 
            onClick={() => navigate('/interview/countdown')}
            disabled={!allClear}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-transform ${
              !allClear 
                ? (isDarkMode ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                : (isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 transform hover:-translate-y-0.5' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 transform hover:-translate-y-0.5')
            }`}
          >
            {allClear ? 'Continue' : 'Checking...'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionCheck;
