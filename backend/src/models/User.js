const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Email làm trường đăng nhập chính
  password: { type: String, required: true },
  hobbies: { type: [String], default: [] },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },

  // Google user information
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String }, // Tên hiển thị
  isGoogleUser: { type: Boolean, default: false },

  // Reset password fields
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
