import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Divider } from '@mui/material';
import { register, login,googleLogin } from '../services/auth';
import { GoogleLogin } from '@react-oauth/google';

interface LoginFormProps {
  onLogin: (username: string, token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    try {
      if (isRegister) {
        const res = await register(username, password);
        if (res.status === 'success') {
          setSuccess('Đăng ký thành công! Bạn có thể đăng nhập.');
          setIsRegister(false);
        } else {
          setError(res.message || 'Đăng ký thất bại!');
        }
      } else {
        const res = await login(username, password);
        if (res.status === 'success' && res.accessToken) {
          onLogin(username, res.accessToken);
        } else {
          setError(res.message || 'Đăng nhập thất bại!');
        }
      }
    } catch (err) {
      setError('Có lỗi xảy ra!');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      console.log('Google credential:', credentialResponse);
      // Gọi API backend để xác thực token Google
      const res = await googleLogin(credentialResponse.credential);
      if (res.status === 'success' && res.accessToken) {
        // Sử dụng email hoặc username từ response
        onLogin(res.username || 'Google User', res.accessToken);
      } else {
        setError(res.message || 'Đăng nhập Google thất bại!');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Đăng nhập Google thất bại!');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 350, mx: 'auto', my: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h5" align="center" color="primary" gutterBottom>
        {isRegister ? 'Đăng ký' : 'Đăng nhập'}
      </Typography>
      <TextField
        fullWidth
        label="Tên đăng nhập"
        value={username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Mật khẩu"
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        margin="normal"
      />
      {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      {success && <Typography color="success.main" sx={{ mt: 1 }}>{success}</Typography>}
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} >
        {isRegister ? 'Đăng ký' : 'Đăng nhập'}
      </Button>

      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Hoặc
        </Typography>
      </Divider>

      {/* Nút đăng nhập Google tùy chỉnh */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
        
          onError={() => setError('Đăng nhập Google thất bại!')}
          theme="filled_blue"
          text="signin_with"
          shape="rectangular"
          locale="vi"
          useOneTap
        />
      </Box>

      <Button
        variant="text"
        color="secondary"
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => {
          setIsRegister(!isRegister);
          setError('');
          setSuccess('');
        }}
      >
        {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
      </Button>
    </Box>
  );
};

export default LoginForm;
