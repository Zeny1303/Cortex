import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BookingProvider } from './context/BookingContext';
import { UsageProvider } from './context/UsageContext';
import Dashboard from './pages/Dashboard';
import SelectType from './pages/SelectType';
import Pricing from './pages/Pricing';
import InterviewRoom from './pages/InterviewRoom';
import InterviewSession from './pages/InterviewSession';
import InterviewSetup from './pages/InterviewSetup';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import InterviewPermissions from './pages/InterviewPermissions';
import InterviewCountdown from './pages/InterviewCountdown';
import InterviewCompletion from './pages/InterviewCompletion';
import Home from './pages/Home';
import Auth from './pages/Auth';
import MyInterviews from './pages/MyInterviews';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UsageProvider>
          <BookingProvider>
            <Router>
              <div className="App min-h-screen flex flex-col bg-white dark:bg-black">
                <Routes>
                  <Route path="/"                               element={<Home />} />
                  <Route path="/login"                          element={<Auth />} />
                  <Route path="/signup"                         element={<Auth />} />
                  <Route path="/dashboard"                      element={<Dashboard />} />
                  <Route path="/profile"                        element={<Profile />} />
                  <Route path="/settings"                       element={<Settings />} />
                  {/* Booking flow: type → pricing → session */}
                  <Route path="/select-type"                    element={<SelectType />} />
                  <Route path="/pricing"                        element={<Pricing />} />
                  {/* Legacy /booking redirect */}
                  <Route path="/booking"                        element={<Navigate to="/select-type" replace />} />
                  {/* Interview session (new multi-type) */}
                  <Route path="/interview/session"              element={<InterviewSession />} />
                  {/* Legacy DSA flow */}
                  <Route path="/interview/setup"                element={<InterviewSetup />} />
                  <Route path="/interview/permissions"          element={<InterviewPermissions />} />
                  <Route path="/interview/countdown"            element={<InterviewCountdown />} />
                  <Route path="/interview/session/:interviewId" element={<InterviewRoom />} />
                  <Route path="/interview/completed"            element={<InterviewCompletion />} />
                  <Route path="/my-interviews"                  element={<MyInterviews />} />
                </Routes>
              </div>
            </Router>
          </BookingProvider>
        </UsageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
