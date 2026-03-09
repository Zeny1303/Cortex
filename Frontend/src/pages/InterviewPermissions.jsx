import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BookingNavbar from '../layout/BookingNavbar';
import { useTheme } from '../context/ThemeContext';

const InterviewPermissions = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const interviewId = location.state?.interviewId || `INT-${Math.floor(Math.random() * 90000) + 10000}`;

  const [camStatus, setCamStatus] = useState('pending'); // pending, ok, error
  const [micStatus, setMicStatus] = useState('pending');
  const [netStatus, setNetStatus] = useState('pending');

  // Check network automatically
  useEffect(() => {
    let mounted = true;
    setTimeout(() => {
      if (mounted) {
        if (navigator.onLine) setNetStatus('ok');
        else setNetStatus('error');
      }
    }, 1000);
    return () => { mounted = false; };
  }, []);

  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (stream) {
        setCamStatus('ok');
        // Stop stream after testing
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setCamStatus('error');
    }
  };

  const requestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (stream) {
        setMicStatus('ok');
        // Stop stream after testing
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.error("Mic access denied", err);
      setMicStatus('error');
    }
  };

  const allClear = camStatus === 'ok' && micStatus === 'ok' && netStatus === 'ok';

  const StatusIcon = ({ status }) => {
    if (status === 'pending') return <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-400 opacity-50"></div>;
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
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          
          <h2 className={`text-3xl font-extrabold mb-8 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Prepare for Your Interview
          </h2>

          <div className="space-y-4 mb-10">
            {/* Camera Check */}
            <div className={`flex items-center justify-between p-5 rounded-2xl border ${isDarkMode ? 'bg-[#212121] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-[#2d2d2d] text-gray-300' : 'bg-white text-gray-700 shadow-sm'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div className="text-left flex-1 min-w-0 pr-4">
                  <p className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Camera access</p>
                  {camStatus === 'pending' ? (
                    <button onClick={requestCamera} className="text-indigo-500 hover:text-indigo-600 text-sm font-semibold mt-1 transition-colors">Enable Camera</button>
                  ) : (
                    <p className={`text-sm truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {camStatus === 'ok' ? 'Connected successfully' : 'Access denied'}
                    </p>
                  )}
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
                <div className="text-left flex-1 min-w-0 pr-4">
                  <p className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Microphone access</p>
                  {micStatus === 'pending' ? (
                    <button onClick={requestMic} className="text-indigo-500 hover:text-indigo-600 text-sm font-semibold mt-1 transition-colors">Enable Microphone</button>
                  ) : (
                    <p className={`text-sm truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {micStatus === 'ok' ? 'Connected successfully' : 'Access denied'}
                    </p>
                  )}
                </div>
              </div>
              <StatusIcon status={micStatus} />
            </div>

            {/* Network Check */}
            <div className={`flex items-center justify-between p-5 rounded-2xl border ${isDarkMode ? 'bg-[#212121] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-[#2d2d2d] text-gray-300' : 'bg-white text-gray-700 shadow-sm'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
                </div>
                <div className="text-left">
                  <p className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Stable internet connection</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {netStatus === 'pending' ? 'Checking connection...' : netStatus === 'ok' ? 'Connection stable' : 'Offline'}
                  </p>
                </div>
              </div>
              <StatusIcon status={netStatus} />
            </div>
          </div>

          <button 
            onClick={() => navigate('/interview/countdown', { state: { interviewId } })}
            disabled={!allClear}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-transform ${
              !allClear 
                ? (isDarkMode ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                : (isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 transform hover:-translate-y-0.5' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 transform hover:-translate-y-0.5')
            }`}
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewPermissions;
