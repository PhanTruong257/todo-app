const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const jwtUtils = {
  signToken: (payload, expiresIn = '1h') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  },

  signRefreshToken: (payload, expiresIn = '7d') => {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn });
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  },

  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, REFRESH_SECRET);
    } catch (err) {
      return null;
    }
  }
};

module.exports = jwtUtils;
