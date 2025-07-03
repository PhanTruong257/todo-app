import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, Paper } from '@mui/material';
import { forgotPassword } from '../services/auth';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email) {
            setError('Vui lòng nhập địa chỉ email');
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('Đang gửi yêu cầu đặt lại mật khẩu cho email:', email);
            const res = await forgotPassword(email);
            console.log('Kết quả từ server:', res);

            if (res.status === 'success') {
                setMessage(res.message || 'Email đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
            } else {
                setError(res.message || 'Có lỗi xảy ra khi gửi email đặt lại mật khẩu.');
            }
        } catch (err) {
            console.error('Lỗi khi gửi yêu cầu:', err);
            setError(`Không thể kết nối đến máy chủ. ${err instanceof Error ? err.message : 'Vui lòng thử lại sau.'}`);
        } finally {
            setIsSubmitting(false);
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
                    <Typography variant="h5" align="center" color="primary" gutterBottom>
                        Quên mật khẩu
                    </Typography>

                    <Typography variant="body2" align="center" sx={{ mb: 3 }}>
                        Nhập email của bạn để nhận liên kết đặt lại mật khẩu
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

                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
                    </Button>

                    <Button
                        variant="text"
                        color="secondary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/login')}
                    >
                        Quay lại đăng nhập
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default ForgotPasswordPage;
