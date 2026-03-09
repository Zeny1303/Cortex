import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const InterviewCountdown = () => {
  const [isDarkMode] = useState(true); // Always dark for dramatic countdown effect
  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();
  const interviewId = location.state?.interviewId || `INT-${Math.floor(Math.random() * 90000) + 10000}`;
  const questions   = location.state?.questions   || [];

  useEffect(() => {
    if (count === 0) {
      navigate(`/interview/session/${interviewId}`, {
        replace: true,
        state: { questions },   // ← pass questions into room
      });
      return;
    }

    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [count, navigate, interviewId]);

  return (
    <div className={`min-h-screen flex items-center justify-center font-sans transition-colors duration-300 bg-[#0f1115]`}>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-indigo-200 mb-12 opacity-80 tracking-widest uppercase text-sm">
          Your interview will begin shortly.
        </h2>
        
        <div className="relative flex justify-center items-center">
          {/* Animated background rings */}
          <div className="absolute w-64 h-64 border border-indigo-500/30 rounded-full animate-ping"></div>
          <div className="absolute w-80 h-80 border-2 border-indigo-500/10 rounded-full animate-pulse"></div>
          
          {/* Number Display */}
          <div className="relative z-10 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-900 to-[#0f1115] border border-[#2d2d2d] flex items-center justify-center shadow-[0_0_60px_rgba(99,102,241,0.2)]">
            <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tabular-nums">
              {count}
            </span>
          </div>
        </div>

        <p className="mt-16 text-gray-400 font-medium opacity-80 text-lg">
          Please do not refresh the page.
        </p>
      </div>
    </div>
  );
};

export default InterviewCountdown;
