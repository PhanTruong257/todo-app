const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/google', authController.googleLogin); // Thêm route mới

// Protected routes
router.post('/update-hobbies', authMiddleware, authController.updateUserHobbies);
router.post('/update-gender', authMiddleware, authController.updateUserGender);
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;