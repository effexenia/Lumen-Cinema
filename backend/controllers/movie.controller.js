/* eslint-disable no-unused-vars */
const db = require('../db');
const { validationResult } = require('express-validator');

exports.getAllMovies = async (req, res) => {
  try {
    const { genre, search, sort } = req.query;
    let query = 'SELECT * FROM movies WHERE 1=1';
    const params = [];

    if (genre) {
      query += ' AND genre_id = ?';
      params.push(genre);
    }

    if (search) {
      query += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }

    if (sort === 'date') {
      query += ' ORDER BY release_date DESC';
    } else if (sort === 'title') {
      query += ' ORDER BY title ASC';
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні фільмів' });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Фільм не знайдено' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні фільму' });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const { title, description, release_date, genre_id, duration } = req.body;
    await db.query(
      'INSERT INTO movies (title, description, release_date, genre_id, duration) VALUES (?, ?, ?, ?, ?)',
      [title, description, release_date, genre_id, duration]
    );
    res.status(201).json({ message: 'Фільм додано' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при додаванні фільму' });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const { title, description, release_date, genre_id, duration } = req.body;
    await db.query(
      'UPDATE movies SET title = ?, description = ?, release_date = ?, genre_id = ?, duration = ? WHERE id = ?',
      [title, description, release_date, genre_id, duration, req.params.id]
    );
    res.json({ message: 'Фільм оновлено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при оновленні фільму' });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    await db.query('DELETE FROM movies WHERE id = ?', [req.params.id]);
    res.json({ message: 'Фільм видалено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при видаленні фільму' });
  }
};
