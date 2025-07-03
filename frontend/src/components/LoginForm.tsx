import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Divider, Link,InputAdornment, IconButton  } from '@mui/material';
import { register, login, googleLogin } from '../services/auth';
import { GoogleLogin } from '@react-oauth/google';
import ForgotPasswordForm from './ForgotPasswordForm';
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface LoginFormProps {
  onLogin: (email: string, token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    try {
      if (isRegister) {
        const res = await register(email, password);
        if (res.status === 'success') {
          setSuccess('Đăng ký thành công! Bạn có thể đăng nhập.');
          setIsRegister(false);
        } else {
          setError(res.message || 'Đăng ký thất bại!');
        }
      } else {
        const res = await login(email, password);
        if (res.status === 'success' && res.accessToken) {
          onLogin(email, res.accessToken);
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
        // Sử dụng email từ response
        onLogin(res.email || 'Google User', res.accessToken);
      } else {
        setError(res.message || 'Đăng nhập Google thất bại!');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Đăng nhập Google thất bại!');
    }
  };
  return (
    <Box sx={{ maxWidth: 350, mx: 'auto', my: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      {showForgotPassword ? (
        <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h5" align="center" color="primary" gutterBottom>
            {isRegister ? 'Đăng ký' : 'Đăng nhập'}
          </Typography>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Mật khẩu"
            type={showPassword ? "text" : "password"} // 👈 Toggle this
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {!isRegister && (
            <Box sx={{ mt: 1, textAlign: 'right' }}>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotPassword(true);
                }}
              >
                Quên mật khẩu?
              </Link>
            </Box>
          )}

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
      )}
    </Box>
  );
};

export default LoginForm;
