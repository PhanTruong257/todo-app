// src/components/TodoForm.tsx
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

interface TodoFormProps {
  onAdd: (title: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title);
      setTitle('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
      <TextField
        fullWidth
        size="small"
        label="Nhập task mới"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="outlined"
      />
      <Button type="submit" variant="contained" color="primary">Thêm</Button>
    </Box>
  );
};

export default TodoForm;