const AuthService = require('../services/auth.service');

class AuthController {
  register = async (req, res, next) => {
    try {
      console.log(`[P]::Register::`, req.body);
      const { email, password, name } = req.body;
      const result = await AuthService.register({ email, password, name });
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
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
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
    }
  };

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

  googleLogin = async (req, res, next) => {
    try {
      console.log(`[P]::GoogleLogin::`, req.body);
      const { credential } = req.body;
      const result = await AuthService.googleLogin(credential);
      console.log(`[P]::GoogleLogin::Result::`, result);

      return res.status(200).json(result);
    } catch (error) {
      console.error(`[P]::GoogleLogin::Error::`, error);
      return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error',
      });
    }
  };

  // Xử lý quên mật khẩu
  forgotPassword = async (req, res, next) => {
    try {
      console.log(`[P]::ForgotPassword::`, req.body);
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          status: 'error',
          message: 'Email là bắt buộc'
        });
      }

      const result = await AuthService.forgotPassword(email);
      console.log(`[P]::ForgotPassword::Result::`, result);

      return res.status(200).json(result);
    } catch (error) {
      console.error(`[P]::ForgotPassword::Error::`, error);
      return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error',
      });
    }
  };

  // Kiểm tra token hợp lệ
  verifyResetToken = async (req, res, next) => {
    try {
      console.log(`[P]::VerifyResetToken::`, req.body);
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          status: 'error',
          message: 'Token là bắt buộc'
        });
      }

      const result = await AuthService.verifyResetToken(token);
      console.log(`[P]::VerifyResetToken::Result::`, result);

      return res.status(200).json(result);
    } catch (error) {
      console.error(`[P]::VerifyResetToken::Error::`, error);
      return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error',
      });
    }
  };

  // Đặt lại mật khẩu
  resetPassword = async (req, res, next) => {
    try {
      console.log(`[P]::ResetPassword::`, req.body);
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          status: 'error',
          message: 'Token và mật khẩu mới là bắt buộc'
        });
      }

      const result = await AuthService.resetPassword(token, newPassword);
      console.log(`[P]::ResetPassword::Result::`, result);

      return res.status(200).json(result);
    } catch (error) {
      console.error(`[P]::ResetPassword::Error::`, error);
      return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error',
      });
    }
  };
}

module.exports = new AuthController();
