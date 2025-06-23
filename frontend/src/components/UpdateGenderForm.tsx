import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { updateUserGender } from '../services/auth';

const UpdateGenderForm: React.FC = () => {
  const [gender, setGender] = useState('');
  const [message, setMessage] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateUserGender(gender);
    setMessage(res.message || 'Cập nhật thành công!');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ my: 2 }}>
      <Typography variant="h6">Cập nhật giới tính</Typography>
      <TextField
        fullWidth
        label="Giới tính"
        value={gender}
        onChange={e => setGender(e.target.value)}
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">Cập nhật</Button>
      {message && <Typography color="success.main" sx={{ mt: 1 }}>{message}</Typography>}
    </Box>
  );
};

export default UpdateGenderForm;
