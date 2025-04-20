/* eslint-disable no-unused-vars */
const db = require('../config/db');

exports.getSessions = async (req, res) => {
  try {
    const { movieId, date } = req.query;
    let query = 'SELECT * FROM sessions WHERE 1=1';
    const params = [];

    if (movieId) {
      query += ' AND movie_id = ?';
      params.push(movieId);
    }

    if (date) {
      query += ' AND DATE(start_time) = ?';
      params.push(date);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні сеансів' });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sessions WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Сеанс не знайдено' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні сеансу' });
  }
};

exports.createSession = async (req, res) => {
  try {
    const { movie_id, hall_id, start_time, price } = req.body;
    await db.query(
      'INSERT INTO sessions (movie_id, hall_id, start_time, price) VALUES (?, ?, ?, ?)',
      [movie_id, hall_id, start_time, price]
    );
    res.status(201).json({ message: 'Сеанс створено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при створенні сеансу' });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const { movie_id, hall_id, start_time, price } = req.body;
    await db.query(
      'UPDATE sessions SET movie_id = ?, hall_id = ?, start_time = ?, price = ? WHERE id = ?',
      [movie_id, hall_id, start_time, price, req.params.id]
    );
    res.json({ message: 'Сеанс оновлено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при оновленні сеансу' });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    await db.query('DELETE FROM sessions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Сеанс видалено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при видаленні сеансу' });
  }
};
