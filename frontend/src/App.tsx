// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import ResetPasswordForm from './components/ResetPasswordForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <Routes>
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            <Route path="/forgot-password" element={<Box sx={{ p: 2 }}><ForgotPasswordForm onBack={() => window.location.href = '/'} /></Box>} />
            <Route path="/*" element={<Dashboard />} />
          </Routes>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;