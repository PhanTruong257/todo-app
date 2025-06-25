import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { verifyResetToken, resetPassword } from '../services/auth';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPasswordForm: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Lấy token từ query parameter
        const params = new URLSearchParams(location.search);
        const resetToken = params.get('token');

        if (!resetToken) {
            setError('Token không hợp lệ hoặc đã hết hạn');
            setIsVerifying(false);
            return;
        }

        setToken(resetToken);

        // Xác minh token
        const verifyToken = async () => {
            try {
                const res = await verifyResetToken(resetToken);
                if (res.status === 'success') {
                    setIsTokenValid(true);
                } else {
                    setError(res.message || 'Token không hợp lệ hoặc đã hết hạn');
                }
            } catch (err) {
                setError('Không thể xác minh token. Vui lòng thử lại.');
                console.error(err);
            } finally {
                setIsVerifying(false);
            }
        };

        verifyToken();
    }, [location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!newPassword || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await resetPassword(token, newPassword);
            if (res.status === 'success') {
                setMessage(res.message || 'Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập ngay bây giờ.');
                // Tự động chuyển hướng sau 3 giây
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(res.message || 'Có lỗi xảy ra khi đặt lại mật khẩu.');
            }
        } catch (err) {
            setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isVerifying) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>
                    Đang xác minh token...
                </Typography>
            </Box>
        );
    }

    if (!isTokenValid) {
        return (
            <Box sx={{ maxWidth: 350, mx: 'auto', my: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || 'Token không hợp lệ hoặc đã hết hạn'}
                </Alert>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => navigate('/forgot-password')}
                >
                    Yêu cầu liên kết mới
                </Button>
            </Box>
        );
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 350, mx: 'auto', my: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="h5" align="center" color="primary" gutterBottom>
                Đặt lại mật khẩu
            </Typography>

            <TextField
                fullWidth
                label="Mật khẩu mới"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="normal"
                required
            />

            <TextField
                fullWidth
                label="Xác nhận mật khẩu"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                required
            />

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </Button>
        </Box>
    );
};

export default ResetPasswordForm;
