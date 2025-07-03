// src/components/Dashboard.tsx
import React from 'react';
import { Box, Typography, Button, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TodoForm from './TodoForm';
import TaskList from './TaskList';
import { useAuth } from '../hooks/useAuth';
import { useTask } from '../hooks/useTask';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { addNewTask } = useTask();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" color="primary" elevation={0} sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo App
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Xin chào, {user}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ maxWidth: 600, mx: 'auto', px: 2 }}>
        {/* Todo Form */}
        <TodoForm onAdd={addNewTask} />

        {/* Task List */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Danh sách task của bạn
          </Typography>
          <TaskList showActions={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;