const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/google', authController.googleLogin); // Route đăng nhập bằng Google
router.post('/forgot-password', authController.forgotPassword); // Route quên mật khẩu
router.post('/verify-reset-token', authController.verifyResetToken); // Route kiểm tra token
router.post('/reset-password', authController.resetPassword); // Route đặt lại mật khẩu

// Protected routes
router.post('/update-hobbies', authMiddleware, authController.updateUserHobbies);
router.post('/update-gender', authMiddleware, authController.updateUserGender);
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;