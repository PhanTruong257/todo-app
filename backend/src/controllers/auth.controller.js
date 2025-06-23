const AuthService = require('../services/auth.service');

class AuthController {
  register = async (req, res, next) => {
    try {
      console.log(`[P]::Register::`, req.body);
      const { username, password } = req.body;
      const result = await AuthService.register({ username, password });
      console.log(`[P]::Register::Result::`, result);

      return res.status(201).json(result);
    } catch (error) {
      console.error(`[P]::Register::Error::`, error);
      return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error',
      });
    }
  };

  login = async (req, res, next) => {
    try {
      console.log(`[P]::Login::`, req.body);
      const { username, password } = req.body;
      const result = await AuthService.login({ username, password });
      console.log(`[P]::Login::Result::`, result);

      return res.status(200).json(result);
    } catch (error) {
      console.error(`[P]::Login::Error::`, error);
      return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error',
      });
    }
  };
  updateUserHobbies = async (req, res, next) => {
    try {
      console.log(`[P]::UpdateUserHobbies::`, req.body);
      const userId = req.user.userId;
      const { hobbies } = req.body;
      const result = await AuthService.updateUserHobbies(userId, hobbies);
      console.log(`[P]::UpdateUserHobbies::Result::`, result);
      return res.status(200).json(result);
    } catch (error) {
      console.error(`[P]::UpdateUserHobbies::Error::`, error);
      return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error',
      });
    }
  };
  updateUserGender = async (req, res, next) => {
    try {
      console.log(`[P]::UpdateUserGender::`, req.body);
      const userId = req.user.userId;
      const { gender } = req.body;
      const result = await AuthService.updateUserGender(userId, gender);
      console.log(`[P]::UpdateUserGender::Result::`, result);
      return res.status(200).json(result);
    } catch (error) {
      console.error(`[P]::UpdateUserGender::Error::`, error);
      return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error',
      });
    }
  };
  changePassword = async (req, res, next) => {
    try {
      console.log(`[P]::ChangePassword::`, req.body);
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(userId, { currentPassword, newPassword });
      console.log(`[P]::ChangePassword::Result::`, result);
      return res.status(200).json(result);
    } catch (error) {
      console.error(`[P]::ChangePassword::Error::`, error);
      return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error',
      });
    }  };

  refreshToken = async (req, res, next) => {
    try {
      console.log(`[P]::RefreshToken::`, req.body);
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      console.log(`[P]::RefreshToken::Result::`, result);
      return res.status(200).json(result);
    } catch (error) {
      console.error(`[P]::RefreshToken::Error::`, error);
      return res.status(error.statusCode || 401).json({
        status: 'error',
        message: error.message || 'Token refresh failed',
      });
    }
  };
}

module.exports = new AuthController();
