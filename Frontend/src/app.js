import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import InterviewBooking from './pages/InterviewBooking';
import InterviewRoom from './pages/InterviewRoom';
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
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/booking" element={<InterviewBooking />} />
            <Route path="/interview/setup" element={<InterviewSetup />} />
            <Route path="/interview/permissions" element={<InterviewPermissions />} />
            <Route path="/interview/countdown" element={<InterviewCountdown />} />
            <Route path="/interview/session/:interviewId" element={<InterviewRoom />} />
            <Route path="/interview/completed" element={<InterviewCompletion />} />
            <Route path="/my-interviews" element={<MyInterviews />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
