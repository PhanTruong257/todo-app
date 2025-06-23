const userService = require('./user.service');
const jwtUtil = require('../utils/jwt');

const getUserOrThrow = async (userId) => {
  const user = await userService.findUserById(userId);
  if (!user) throw new Error('User not found');
  return user;
};

const authService = {
  register: async ({ username, password }) => {
    const existingUser = await userService.findUserByUsername(username);
    if (existingUser) throw new Error('Username already exists');

    const user = await userService.createUser(username, password);
    return {
      status: 'success',
      message: 'User registered successfully',
      user: {
        username: user.username,
        id: user._id,
      },
    };
  },

  login: async ({ username, password }) => {
    const user = await userService.findUserByUsername(username);
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await userService.comparePassword(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const accessToken = jwtUtil.signToken({ userId: user._id, username: user.username });
    const refreshToken = jwtUtil.signRefreshToken({ userId: user._id, username: user.username });

    return {
      status: 'success',
      accessToken,
      refreshToken,
      username: user.username,
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

    const accessToken = jwtUtil.signToken({ userId: user._id, username: user.username });

    return {
      status: 'success',
      accessToken,
    };
  },
};

module.exports = authService;
