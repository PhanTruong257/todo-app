import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { updateUserHobbies } from '../services/auth';

const UpdateHobbiesForm: React.FC = () => {
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [replace, setReplace] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHobbies(e.target.value.split(','));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateUserHobbies(hobbies, replace);
    setMessage(res.message || 'Cập nhật thành công!');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ my: 2 }}>
      <Typography variant="h6">Cập nhật sở thích</Typography>
      <TextField
        fullWidth
        label="Sở thích (cách nhau bởi dấu phẩy)"
        onChange={handleChange}
        margin="normal"
      />
      <FormControlLabel
        control={<Checkbox checked={replace} onChange={e => setReplace(e.target.checked)} />}
        label="Thay thế toàn bộ sở thích"
      />
      <Button type="submit" variant="contained" color="primary">Cập nhật</Button>
      {message && <Typography color="success.main" sx={{ mt: 1 }}>{message}</Typography>}
    </Box>
  );
};

export default UpdateHobbiesForm;
