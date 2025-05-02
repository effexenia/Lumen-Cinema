/* eslint-disable no-unused-vars */
const db = require('../config/db');

exports.getCommentsByMovie = async (req, res) => {
  console.log(`Fetching comments for movie ID: ${req.params.id}`);
  try {
    const [rows] = await db.query(
      `SELECT comments.id, comments.user_id, comments.movie_id, comments.content, comments.created_at, users.name
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.movie_id = ?`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при отриманні коментарів' });
  }
};


exports.addComment = async (req, res) => {
  try {
    const { movie_id, content } = req.body;
    await db.query('INSERT INTO comments (user_id, movie_id, content) VALUES (?, ?, ?)', [req.user.id, movie_id, content]);
    res.status(201).json({ message: 'Коментар додано' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при додаванні коментаря' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const [rows] = await db.query('SELECT * FROM comments WHERE id = ?', [req.params.id]);

    if (rows.length === 0 || rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Немає доступу до редагування цього коментаря' });
    }

    await db.query('UPDATE comments SET content = ? WHERE id = ?', [content, req.params.id]);
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
