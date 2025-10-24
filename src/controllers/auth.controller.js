const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { ACCESS_TOKEN_EXPIRES_IN = '15m', REFRESH_TOKEN_EXPIRES_IN = '7d', BCRYPT_SALT_ROUNDS = 12 } = process.env;

const signAccessToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
const signRefreshToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, +BCRYPT_SALT_ROUNDS);
    const user = await User.create({ name, email, password: hashed, role });
    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    res.json({ accessToken, refreshToken });
  } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' });
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) return res.status(401).json({ message: 'Invalid refresh token' });
    const newAccess = signAccessToken(user);
    const newRefresh = signRefreshToken(user);
    user.refreshToken = newRefresh;
    await user.save();
    res.json({ accessToken: newAccess, refreshToken: newRefresh });
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' });
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (user) { user.refreshToken = null; await user.save(); }
    res.json({ message: 'Logged out' });
  } catch (err) { next(err); }
};

