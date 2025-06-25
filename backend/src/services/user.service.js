const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  return user.save();
};

exports.findUserByUsername = (username) => {
  return User.findOne({ username });
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

// Thêm phương thức tìm user theo email
exports.findUserByEmail = (email) => {
  return User.findOne({ email });
};

// Thêm phương thức tạo user từ Google
exports.createGoogleUser = async (email, password, googleInfo) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username: email, // Sử dụng email làm username
    email,
    password: hashedPassword,
    googleId: googleInfo.googleId,
    name: googleInfo.name,
    isGoogleUser: true
  });
  return user.save();
};
