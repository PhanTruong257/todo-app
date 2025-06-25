// src/App.tsx
import React from 'react';
import { Box } from '@mui/material';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <Dashboard />
      </TaskProvider>
    </AuthProvider>
  );
};

export default App;