import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#0f1115] text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Navbar */}
      <nav className={`px-6 md:px-12 py-6 flex justify-between items-center ${isDarkMode ? 'bg-[#0f1115]/80 border-b border-gray-800' : 'bg-white/80 border-b border-gray-200'} backdrop-blur-md sticky top-0 z-50`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
            A
          </div>
          <span className="font-extrabold text-xl tracking-tight">AI Interview</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          <div className="hidden md:flex gap-2">
            <button 
              onClick={() => navigate('/login')}
              className={`px-5 py-2 rounded-lg font-semibold transition-colors ${
                isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              Log in
            </button>
            <button 
              onClick={() => navigate('/signup')} 
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
            >
              Sign up free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 lg:py-32 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 max-w-4xl leading-tight">
          Master your next interview with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">AI precision</span>.
        </h1>
        
        <p className={`text-xl md:text-2xl mb-12 max-w-2xl font-light ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Practice real-world technical and behavioral questions in a fully immersive mock interview environment. Get instant, actionable feedback.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <button 
            onClick={() => navigate('/signup')} 
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            Start Practicing Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
          <button 
            onClick={() => navigate('/login')} 
            className={`px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all flex items-center justify-center ${
              isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Member Login
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left w-full mt-10">
          {[
            {
              title: "Realistic AI Avatars",
              desc: "Talk to human-like AI interviewers that adapt to your responses in real-time.",
              icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            },
            {
              title: "Comprehensive Code Editor",
              desc: "Solve algorithmic challenges directly in the browser with our integrated IDE.",
              icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            },
            {
              title: "Detailed Analytics",
              desc: "Receive an immediate, structured breakdown of your performance after every session.",
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            }
          ].map((feature, idx) => (
            <div key={idx} className={`p-8 rounded-3xl border transition-colors ${
              isDarkMode ? 'bg-[#1a1d24] border-gray-800' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon}></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-12 border-t mt-auto ${isDarkMode ? 'bg-[#0f1115] border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="font-bold tracking-tight">AI Interview Platform</span>
          </div>
          
          <div className={`flex flex-wrap items-center justify-center gap-6 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <a href="mailto:snehakashyap9920@gmail.com" className="hover:text-indigo-500 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
              snehakashyap9920@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/sneha-kashyap1309" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              LinkedIn
            </a>
            <a href="https://github.com/Zeny1303" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub.com/Zeny1303
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
