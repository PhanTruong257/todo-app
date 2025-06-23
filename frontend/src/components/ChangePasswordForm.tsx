import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { changePassword } from '../services/auth';

const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!currentPassword || !newPassword) {
      setError('Vui lòng nhập đủ thông tin!');
      return;
    }
    const res = await changePassword(currentPassword, newPassword);
    if (res.status === 'success') {
      setMessage('Đổi mật khẩu thành công!');
    } else {
      setError(res.message || 'Đổi mật khẩu thất bại!');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ my: 2 }}>
      <Typography variant="h6">Đổi mật khẩu</Typography>
      <TextField
        fullWidth
        label="Mật khẩu hiện tại"
        type="password"
        value={currentPassword}
        onChange={e => setCurrentPassword(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Mật khẩu mới"
        type="password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">Đổi mật khẩu</Button>
      {message && <Typography color="success.main" sx={{ mt: 1 }}>{message}</Typography>}
      {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
    </Box>
  );
};

export default ChangePasswordForm;
