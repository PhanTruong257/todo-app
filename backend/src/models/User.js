const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hobbies: { type: [String], default: [] },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
