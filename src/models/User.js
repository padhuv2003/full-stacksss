const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'hr', 'manager', 'employee'], default: 'employee' },
  refreshToken: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
