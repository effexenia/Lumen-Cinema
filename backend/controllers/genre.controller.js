/* eslint-disable no-unused-vars */
const db = require('../db');

exports.getGenres = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM genres');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні жанрів' });
  }
};

exports.createGenre = async (req, res) => {
  try {
    const { name } = req.body;
    await db.query('INSERT INTO genres (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Жанр додано' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при додаванні жанру' });
  }
};

exports.updateGenre = async (req, res) => {
  try {
    const { name } = req.body;
    await db.query('UPDATE genres SET name = ? WHERE id = ?', [name, req.params.id]);
    res.json({ message: 'Жанр оновлено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при оновленні жанру' });
  }
};

exports.deleteGenre = async (req, res) => {
  try {
    await db.query('DELETE FROM genres WHERE id = ?', [req.params.id]);
    res.json({ message: 'Жанр видалено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при видаленні жанру' });
  }
};
