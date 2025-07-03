import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, TextField, Button, Typography, Divider, Link, InputAdornment, IconButton, Paper, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { login, googleLogin } from '../services/auth';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();

  // Get the redirect location from state, default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.status === 'success' && res.accessToken) {
        authLogin(email, res.accessToken);
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Đăng nhập thất bại!');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi đăng nhập!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await googleLogin(credentialResponse.credential);
      if (res.status === 'success' && res.accessToken) {
        authLogin(res.email || 'Google User', res.accessToken);
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Đăng nhập Google thất bại!');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Đăng nhập Google thất bại!');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        px: 2
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            Đăng nhập
          </Typography>

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 1, textAlign: 'right' }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Quên mật khẩu?
            </Link>
          </Box>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Hoặc
            </Typography>
          </Divider>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Đăng nhập Google thất bại!')}
              theme="filled_blue"
              text="signin_with"
              shape="rectangular"
              locale="vi"
            />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Chưa có tài khoản?{' '}
              <Link component={RouterLink} to="/register" variant="body2">
                Đăng ký ngay
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
