/* eslint-disable no-unused-vars */
const db = require('../db');

exports.getRatingByMovie = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT AVG(rating) AS average_rating FROM ratings WHERE movie_id = ?', [req.params.id]);
    res.json({ average_rating: rows[0].average_rating || 0 });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні рейтингу' });
  }
};

exports.addOrUpdateRating = async (req, res) => {
  try {
    const { movie_id, rating } = req.body;
    const [existing] = await db.query('SELECT * FROM ratings WHERE user_id = ? AND movie_id = ?', [req.user.id, movie_id]);

    if (existing.length > 0) {
      await db.query('UPDATE ratings SET rating = ? WHERE id = ?', [rating, existing[0].id]);
    } else {
      await db.query('INSERT INTO ratings (user_id, movie_id, rating) VALUES (?, ?, ?)', [req.user.id, movie_id, rating]);
    }

    res.json({ message: 'Рейтинг оновлено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при додаванні чи оновленні рейтингу' });
  }
};

exports.getUserRating = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ratings WHERE user_id = ? AND movie_id = ?', [req.user.id, req.params.movieId]);
    res.json({ rating: rows.length ? rows[0].rating : null });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні оцінки' });
  }
};
