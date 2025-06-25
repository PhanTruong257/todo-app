const userService = require('./user.service');
const jwtUtil = require('../utils/jwt');
const jwt = require('jsonwebtoken');


const getUserOrThrow = async (userId) => {
  const user = await userService.findUserById(userId);
  if (!user) throw new Error('User not found');
  return user;
};

const authService = {
  register: async ({ email, password, name }) => {
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) throw new Error('Email already exists');

    const user = await userService.createUser(email, password, name);
    return {
      status: 'success',
      message: 'User registered successfully',
      user: {
        email: user.email,
        name: user.name || email.split('@')[0],
        id: user._id,
      },
    };
  },

  login: async ({ email, password }) => {
    const user = await userService.findUserByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await userService.comparePassword(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const accessToken = jwtUtil.signToken({ userId: user._id, email: user.email });
    const refreshToken = jwtUtil.signRefreshToken({ userId: user._id, email: user.email });

    return {
      status: 'success',
      accessToken,
      refreshToken,
      email: user.email,
      name: user.name || user.email.split('@')[0],
    };
  },

  updateUserHobbies: async (userId, hobbies) => {
    const user = await getUserOrThrow(userId);
    const updatedUser = await userService.updateUserHobbies(userId, hobbies);

    return {
      status: 'success',
      message: 'Hobbies updated successfully',
      user: updatedUser,
    };
  },

  updateUserGender: async (userId, gender) => {
    const user = await getUserOrThrow(userId);
    const updatedUser = await userService.updateUserGender(userId, gender);

    return {
      status: 'success',
      message: 'Gender updated successfully',
      user: updatedUser,
    };
  },

  changePassword: async (userId, { currentPassword, newPassword }) => {
    const user = await getUserOrThrow(userId);

    const isMatch = await userService.comparePassword(currentPassword, user.password);
    if (!isMatch) throw new Error('Current password is incorrect');

    await userService.changePassword(userId, newPassword);

    return {
      status: 'success',
      message: 'Password changed successfully',
    };
  },
  refreshToken: async (refreshToken) => {
    if (!refreshToken) throw new Error('Refresh token is required');

    const decoded = jwtUtil.verifyRefreshToken(refreshToken);
    if (!decoded) throw new Error('Invalid or expired refresh token');

    const user = await getUserOrThrow(decoded.userId);

    const accessToken = jwtUtil.signToken({ userId: user._id, email: user.email });

    return {
      status: 'success',
      accessToken,
    };
  },

  googleLogin: async (credential) => {
    try {
      // Giải mã JWT credential từ Google
      const decoded = jwt.decode(credential);
      if (!decoded) throw new Error('Invalid Google credential');

      const { email, sub, name } = decoded;

      // Tìm hoặc tạo user từ thông tin Google
      let user = await userService.findUserByEmail(email);

      if (!user) {
        // Nếu không tìm thấy user, tạo mới
        // Tạo password ngẫu nhiên (người dùng sẽ không cần dùng)
        const randomPassword = Math.random().toString(36).slice(-8);
        user = await userService.createGoogleUser(email, randomPassword, {
          googleId: sub,
          name: name
        });
      }      // Tạo token như thông thường
      const accessToken = jwtUtil.signToken({ userId: user._id, email: user.email });
      const refreshToken = jwtUtil.signRefreshToken({ userId: user._id, email: user.email });

      return {
        status: 'success',
        accessToken,
        refreshToken,
        email: user.email,
        name: user.name || user.email.split('@')[0],
      };
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },
  // Xử lý quên mật khẩu
  forgotPassword: async (email) => {
    try {
      const user = await userService.findUserByEmail(email);
      if (!user) throw new Error('Email không tồn tại trong hệ thống');

      // Nếu là tài khoản Google, không cho phép đặt lại mật khẩu qua email
      if (user.isGoogleUser) {
        throw new Error('Tài khoản này đăng nhập bằng Google. Vui lòng sử dụng tính năng đăng nhập với Google.');
      }

      // Tạo token đặt lại mật khẩu
      const updatedUser = await userService.setPasswordResetToken(email);

      // Gửi email đặt lại mật khẩu
      const emailUtil = require('../utils/email');
      await emailUtil.sendPasswordResetEmail(
        email,
        updatedUser.resetPasswordToken,
        updatedUser.name || email.split('@')[0]
      );

      return {
        status: 'success',
        message: 'Email đặt lại mật khẩu đã được gửi!'
      };
    } catch (error) {
      console.error('Forgot password service error:', error);
      // Chuyển lỗi lên để controller xử lý
      throw error;
    }
  },

  // Kiểm tra token hợp lệ
  verifyResetToken: async (token) => {
    const user = await userService.findUserByResetToken(token);
    if (!user) throw new Error('Token không hợp lệ hoặc đã hết hạn');

    return {
      status: 'success',
      email: user.email
    };
  },

  // Đặt lại mật khẩu với token
  resetPassword: async (token, newPassword) => {
    const user = await userService.resetPassword(token, newPassword);
    if (!user) throw new Error('Token không hợp lệ hoặc đã hết hạn');

    return {
      status: 'success',
      message: 'Mật khẩu đã được đặt lại thành công!'
    };
  },
};

module.exports = authService;
