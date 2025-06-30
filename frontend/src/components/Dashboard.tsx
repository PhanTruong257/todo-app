// src/components/Dashboard.tsx
import React, { useState } from 'react';
import { Box, Typography, Button, AppBar, Toolbar, Chip } from '@mui/material';
import TodoForm from './TodoForm';
import TaskList from './TaskList';
import LoginForm from './LoginForm';
 import { useAuth } from '../hooks/useAuth';
import { useTask } from '../hooks/useTask';

const Dashboard: React.FC = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { addNewTask } = useTask();
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleToggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" color="primary" elevation={0} sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo App
          </Typography>
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Xin chào, {user}
              </Typography>
              <Button color="inherit" onClick={logout}>Đăng xuất</Button>
            </Box>
          ) : (
            <Button color="inherit" onClick={handleToggleLoginForm}>
              {showLoginForm ? 'Ẩn đăng nhập' : 'Đăng nhập'}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ maxWidth: 600, mx: 'auto', px: 2 }}>
        {/* Conditional Login Form */}
        {!isAuthenticated && showLoginForm && (<Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
          <LoginForm onLogin={(email, token) => {
            login(email, token);
            setShowLoginForm(false);
          }} />
        </Box>
        )}

        {/* Status Indicator */}
        {!isAuthenticated && (
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1">
              Chế độ tạm thời
            </Typography>
            <Chip
              label="Chưa đăng nhập"
              color="warning"
              size="small"
              sx={{ fontWeight: 'medium' }}
            />
          </Box>
        )}

        {/* Todo Form */}
        <TodoForm onAdd={addNewTask} />

        {/* Task List */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isAuthenticated ? 'Danh sách task của bạn' : 'Danh sách task tạm thời'}
          </Typography>
          <TaskList showActions={true} />
        </Box>

        {/* Message for unauthenticated users */}
        {!isAuthenticated && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, fontStyle: 'italic', fontSize: '0.85rem' }}
          >
            Lưu ý: Các task sẽ chỉ được lưu tạm thời và sẽ mất khi tải lại trang.
            Hãy đăng nhập để lưu task của bạn.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;