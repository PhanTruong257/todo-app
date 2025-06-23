/**
 * File index.js trong thư mục routes
 * Đăng ký tất cả các route của ứng dụng
 */

const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth.routes');
const taskRoutes = require('./task.routes');

// Đăng ký routes
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;
