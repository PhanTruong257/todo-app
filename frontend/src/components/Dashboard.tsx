// src/components/Dashboard.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import TodoForm from './TodoForm';
import TaskList from './TaskList';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { addNewTask } = useTask();

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" color="primary">Xin chào, {user}!</Typography>
        <Button variant="outlined" color="secondary" onClick={logout}>Đăng xuất</Button>
      </Box>
      <TodoForm onAdd={addNewTask} />
      <Typography variant="h6" sx={{ mt: 2 }}>Danh sách task:</Typography>
      <TaskList />
    </>
  );
};

export default Dashboard;