/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { generateToken } = require('../utils/jwt');

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, dob, phone, avatar_url } = req.body;

  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, dob, phone, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, dob, phone, avatar_url]
    );

    const user = { 
      id: result.insertId, 
      name, 
      email, 
      dob,
      phone,
      role: 'user',
      avatar_url,
    };
    const token = generateToken(user);

    res.cookie('token', token, { httpOnly: true }).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true }).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        dob: user.dob,
        phone: user.phone,
        role: user.role,
        avatar_url: user.avatar_url
      },
      token 
    });
    
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out' });
};

// GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, dob, phone, avatar_url, created_at FROM users WHERE id = ?', 
      [req.user.id]
    );
    const user = users[0];
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, dob, phone } = req.body;
    const userId = req.params.id;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    let avatar_url = req.body.avatar_url; // Default to existing avatar

    // If new file uploaded, use its path
    if (req.file) {
      avatar_url = `/uploads/${req.file.filename}`;
    }

    const formattedDob = dob ? new Date(dob).toISOString().split('T')[0] : null;

    await pool.query(
      'UPDATE users SET name = ?, email = ?, dob = ?, phone = ?, avatar_url = ? WHERE id = ?',
      [name, email, formattedDob, phone, avatar_url, userId]
    );

    res.json({ 
      message: 'Profile updated', 
      avatar_url,
      user: {
        id: userId,
        name,
        email,
        dob: formattedDob,
        phone,
        avatar_url
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// PUT /api/auth/password
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


// DELETE /api/auth/delete
const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or already deleted' });
    }

    res.clearCookie('token').json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};



module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  deleteUser,
};