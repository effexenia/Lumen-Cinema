/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { generateToken } = require('../utils/jwt');

// 👉 POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const user = { id: result.insertId, name, email, role: 'user' };
    const token = generateToken(user);

    res.cookie('token', token, { httpOnly: true }).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// 👉 POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true }).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 👉 POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out' });
};

// 👉 GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 👉 PUT /api/auth/profile
const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.user.id]);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 👉 PUT /api/auth/password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword
};
