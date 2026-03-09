import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getMe();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth initialization failed", error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const userData = await authService.getMe();
    setUser(userData);
    return data;
  };

  const signup = async (name, email, password) => {
    return await authService.signup(name, email, password);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {!loading ? children : (
        <div className="h-screen w-screen flex items-center justify-center bg-[#0f1115]">
          <div className="w-8 h-8 rounded-full border-4 border-t-indigo-500 border-indigo-900 animate-spin"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
