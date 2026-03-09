import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Countdown = () => {
  const [isDarkMode] = useState(false); // Can be linked to global state if needed
  const [count, setCount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (count === 0) {
      // Temporary static ID for the demo flow
      navigate('/interview/session/demo-1234');
      return;
    }

    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [count, navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center font-sans transition-colors duration-300 ${
      isDarkMode ? 'bg-[#121212]' : 'bg-indigo-600'
    }`}>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-indigo-100 mb-8 opacity-90 tracking-wide uppercase text-sm">
          Starting Interview In
        </h2>
        
        <div className="relative flex justify-center items-center">
          {/* Pulsing rings */}
          <div className="absolute w-48 h-48 bg-white opacity-10 rounded-full animate-ping"></div>
          <div className="absolute w-64 h-64 bg-white opacity-5 rounded-full animate-pulse"></div>
          
          {/* Number Display */}
          <div className="relative z-10 w-40 h-40 rounded-full bg-white flex items-center justify-center shadow-2xl">
            <span className="text-7xl font-extrabold text-indigo-600 tabular-nums tracking-tighter">
              {count}
            </span>
          </div>
        </div>

        <p className="mt-12 text-indigo-100 font-medium opacity-80 text-lg">
          Take a deep breath. You got this.
        </p>
      </div>
    </div>
  );
};

export default Countdown;
