/* eslint-disable no-unused-vars */
const db = require('../db');

exports.getCommentsByMovie = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM comments WHERE movie_id = ?', [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні коментарів' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { movie_id, text } = req.body;
    await db.query('INSERT INTO comments (user_id, movie_id, text) VALUES (?, ?, ?)', [req.user.id, movie_id, text]);
    res.status(201).json({ message: 'Коментар додано' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при додаванні коментаря' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const [rows] = await db.query('SELECT * FROM comments WHERE id = ?', [req.params.id]);

    if (rows.length === 0 || rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Немає доступу до редагування цього коментаря' });
    }

    await db.query('UPDATE comments SET text = ? WHERE id = ?', [text, req.params.id]);
    res.json({ message: 'Коментар оновлено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при оновленні коментаря' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM comments WHERE id = ?', [req.params.id]);

    if (rows.length === 0 || rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Немає доступу до видалення цього коментаря' });
    }

    await db.query('DELETE FROM comments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Коментар видалено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при видаленні коментаря' });
  }
};
