// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirect from './components/AuthRedirect';
import ResetPasswordForm from './components/ResetPasswordForm';

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      <Router>
        <AuthProvider>
          <TaskProvider>
            <Routes>
              {/* Public routes - redirect to dashboard if already authenticated */}
              <Route
                path="/login"
                element={
                  <AuthRedirect>
                    <LoginPage />
                  </AuthRedirect>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthRedirect>
                    <RegisterPage />
                  </AuthRedirect>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <AuthRedirect>
                    <ForgotPasswordPage />
                  </AuthRedirect>
                }
              />
              <Route path="/reset-password" element={<ResetPasswordForm />} />

               <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Catch all route - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </TaskProvider>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;