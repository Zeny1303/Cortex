import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        await signup(formData.name, formData.email, formData.password);
        await login(formData.email, formData.password);
        navigate('/dashboard');
      }
    } catch (error) {
      // Improved error rendering avoiding object [object Object] alert if raw response passed loosely
      alert(error.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f1115]' : 'bg-gray-50'}`}>
      
      {/* Background Orbs for Glassmorphism Effect */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
      
      {/* Theme Toggle Navbar (Minimal) */}
      <div className="absolute top-0 right-0 p-6 z-50">
        <button 
          onClick={toggleTheme}
          className={`p-3 rounded-full backdrop-blur-md shadow-lg transition-transform hover:scale-110 ${isDarkMode ? 'bg-white/10 border border-white/20 text-white' : 'bg-gray-900/10 border border-gray-900/20 text-gray-900'}`}
        >
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>
      </div>

      <div className="absolute top-0 left-0 p-6 z-50">
        <button onClick={() => navigate('/')} className={`flex items-center gap-3 transition-opacity hover:opacity-80 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">A</div>
          <span className="font-extrabold text-xl tracking-tight hidden sm:block">AI Interview</span>
        </button>
      </div>

      {/* Glassmorphism Auth Card */}
      <div className={`relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-xl border ${
        isDarkMode 
          ? 'bg-white/5 border-white/10 shadow-black/50' 
          : 'bg-white/40 border-white/60 shadow-indigo-900/10'
      }`}>
        
        <div className="text-center mb-10">
          <h2 className={`text-3xl font-extrabold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isLogin ? 'Enter your details to access your dashboard.' : 'Sign up to start your mock interviews.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {!isLogin && (
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                placeholder="Alex Walker"
                className={`w-full px-5 py-3 rounded-xl outline-none backdrop-blur-md transition-all border focus:ring-2 focus:ring-indigo-500 ${
                  isDarkMode 
                    ? 'bg-black/20 border-white/10 text-white placeholder-gray-500 focus:bg-black/40' 
                    : 'bg-white/50 border-white/50 text-gray-900 placeholder-gray-400 focus:bg-white/80'
                }`}
              />
            </div>
          )}

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="alex@example.com"
              className={`w-full px-5 py-3 rounded-xl outline-none backdrop-blur-md transition-all border focus:ring-2 focus:ring-indigo-500 ${
                isDarkMode 
                  ? 'bg-black/20 border-white/10 text-white placeholder-gray-500 focus:bg-black/40' 
                  : 'bg-white/50 border-white/50 text-gray-900 placeholder-gray-400 focus:bg-white/80'
              }`}
            />
          </div>

          <div>
            <label className={`flex justify-between text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span>Password</span>
              {isLogin && <a href="#" className="text-indigo-500 hover:text-indigo-400 font-medium">Forgot?</a>}
            </label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className={`w-full px-5 py-3 rounded-xl outline-none backdrop-blur-md transition-all border focus:ring-2 focus:ring-indigo-500 ${
                isDarkMode 
                  ? 'bg-black/20 border-white/10 text-white placeholder-gray-500 focus:bg-black/40' 
                  : 'bg-white/50 border-white/50 text-gray-900 placeholder-gray-400 focus:bg-white/80'
              }`}
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>

        </form>

        <div className="mt-8 text-center">
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-bold text-indigo-500 hover:text-indigo-400 transition-colors"
            >
              {isLogin ? 'Sign up for free' : 'Sign in instead'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Auth;
