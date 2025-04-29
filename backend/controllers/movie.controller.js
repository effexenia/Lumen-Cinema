/* eslint-disable no-unused-vars */
const pool = require('../config/db.js');
const { validationResult } = require('express-validator');

exports.getAllMovies = async (req, res) => {
  try {
    const { genre, search, sort } = req.query;
    let query = `
      SELECT m.id, m.title, m.description, m.posterImg, m.release_date, m.bannerImg,
        GROUP_CONCAT(g.name) AS genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE 1=1
    `;
    const params = [];

    if (genre) {
      query += ' AND g.id = ?';
      params.push(genre);
    }

    if (search) {
      query += ' AND m.title LIKE ?';
      params.push(`%${search}%`);
    }

    if (sort === 'date') {
      query += ' ORDER BY m.release_date DESC';
    } else if (sort === 'title') {
      query += ' ORDER BY m.title ASC';
    }

    query += ' GROUP BY m.id'; // Группируем по фильму

    const [rows] = await pool.query(query, params);
    // Парсим строку с жанрами в массив
    const movies = rows.map(row => ({
      ...row,
      genres: row.genres ? row.genres.split(',').map(name => ({ name })) : []
    }));

    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні фільмів' });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Фільм не знайдено' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні фільму' });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const { title, description, release_date, genre_id, duration } = req.body;
    await pool.query(
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
    await pool.query(
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
    await pool.query('DELETE FROM movies WHERE id = ?', [req.params.id]);
    res.json({ message: 'Фільм видалено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при видаленні фільму' });
  }
};
