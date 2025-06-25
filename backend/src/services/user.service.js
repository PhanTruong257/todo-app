const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createUser = async (email, password, name) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    password: hashedPassword,
    name: name || email.split('@')[0] // Sử dụng phần trước @ làm tên mặc định nếu không có tên
  });
  return user.save();
};

exports.findUserByEmail = (email) => {
  return User.findOne({ email });
};

exports.findUserById = (userId) => {
  return User.findById(userId);
};

exports.comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

exports.updateUserHobbies = async (userId, hobbies) => {
  return User.findByIdAndUpdate(
    userId,
    { hobbies },
    { new: true, select: '-password' }
  );
};

exports.updateUserGender = async (userId, gender) => {
  return User.findByIdAndUpdate(
    userId,
    { gender },
    { new: true, select: '-password' }
  );
};

exports.changePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return User.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { new: true, select: '-password' }
  );
};

// Thêm phương thức tạo user từ Google
exports.createGoogleUser = async (email, password, googleInfo) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    password: hashedPassword,
    googleId: googleInfo.googleId,
    name: googleInfo.name,
    isGoogleUser: true
  });
  return user.save();
};

// Đặt token đặt lại mật khẩu
exports.setPasswordResetToken = async (email) => {
  // Tạo token ngẫu nhiên
  const token = require('crypto').randomBytes(32).toString('hex');
  // Thời gian hết hạn: 15 phút
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  return User.findOneAndUpdate(
    { email },
    {
      resetPasswordToken: token,
      resetPasswordExpires: expires
    },
    { new: true }
  );
};

// Tìm người dùng bằng token đặt lại mật khẩu
exports.findUserByResetToken = (token) => {
  return User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });
};

// Đặt lại mật khẩu và xóa token
exports.resetPassword = async (token, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  return User.findOneAndUpdate(
    {
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined
    },
    { new: true, select: '-password' }
  );
};
