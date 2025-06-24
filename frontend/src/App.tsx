// src/App.tsx
import React from 'react';
import { Box } from '@mui/material';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';

const AppContent: React.FC = () => {
  const { user, login } = useAuth();

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', my: 4 }}>
      {!user ? (
        <>
          <LoginForm onLogin={login} />
          <TaskList showActions={false} />
        </>
      ) : (
        <Dashboard />
      )}
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AuthProvider>
  );
};

export default App;