import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import LoginForm from './components/LoginForm';
import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { Task } from './types/task';
import { fetchTasks, addTask, deleteTask } from './services/task';

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(() => localStorage.getItem('user'));
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (user) {
      // Fetch tasks từ backend theo user
      fetchTasks().then(setTasks);
    }
  }, [user]);

  const handleLogin = (username: string, token: string) => {
    setUser(username);
    localStorage.setItem('user', username);
    // token sẽ được lưu trữ trong hàm login
    // fetchTasks().then(setTasks);
  };

  const handleAddTask = (title: string) => {
    if (!user) {
      setTasks(prev => [...prev, { id: Date.now().toString(), title }]);
    } else {
      // Gọi API để thêm task và cập nhật lại danh sách
      addTask(title).then(newTask => {
        if (newTask) {
          setTasks(prev => [...prev, newTask]);
        }
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setTasks([]);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', my: 4 }}>
      {!user ? (
        <>
          <LoginForm onLogin={handleLogin} />
          <Typography variant="h6" sx={{ mt: 4 }}>Danh sách task (tạm thời, không lưu):</Typography>
          <List>
            {tasks.map(task => (
              <ListItem key={task.id}><ListItemText primary={task.title} /></ListItem>
            ))}
          </List>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" color="primary">Xin chào, {user}!</Typography>
            <Button variant="outlined" color="secondary" onClick={handleLogout}>Đăng xuất</Button>
          </Box>
          <TodoForm onAdd={handleAddTask} />
          <Typography variant="h6" sx={{ mt: 2 }}>Danh sách task:</Typography>
          <List>
            {tasks.map(task => (
              <ListItem key={task.id}><ListItemText primary={task.title} /></ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default App;
