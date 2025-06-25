const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true }, // Added email field
  password: { type: String, required: true },
  hobbies: { type: [String], default: [] },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },

  // Google user information
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String },
  isGoogleUser: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
