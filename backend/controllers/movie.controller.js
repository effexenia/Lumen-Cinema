/* eslint-disable no-unused-vars */
const pool = require('../config/db.js');
const { validationResult } = require('express-validator');

exports.getAllMovies = async (req, res) => {
  try {
    const { genre, search, sort } = req.query;
    let query = `
      SELECT 
        m.id, 
        m.title, 
        m.description, 
        m.summary, 
        m.posterImg, 
        m.release_date, 
        m.bannerImg,
        GROUP_CONCAT(DISTINCT g.name) AS genres,
        IFNULL(AVG(r.rating), 0) AS averageRating
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      LEFT JOIN ratings r ON m.id = r.movie_id
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

    query += ' GROUP BY m.id';

    if (sort === 'date') {
      query += ' ORDER BY m.release_date DESC';
    } else if (sort === 'title') {
      query += ' ORDER BY m.title ASC';
    } else if (sort === 'rating') {
      query += ' ORDER BY averageRating DESC';
    }

    const [rows] = await pool.query(query, params);
    
    const movies = rows.map(row => ({
      ...row,
      genres: row.genres ? row.genres.split(',').map(name => ({ name })) : [],
      averageRating: parseFloat(row.averageRating)
    }));

    res.json(movies);
  } catch (err) {
    console.error('Error in getAllMovies:', err);
    res.status(500).json({ 
      message: 'Помилка при отриманні фільмів',
      error: err.message 
    });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movieQuery = `
      SELECT m.*, 
        GROUP_CONCAT(g.name) AS genres,
        AVG(r.rating) AS averageRating
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      LEFT JOIN ratings r ON m.id = r.movie_id
      WHERE m.id = ?
      GROUP BY m.id
    `;
    
    const [rows] = await pool.query(movieQuery, [req.params.id]);
    
    if (!rows.length) return res.status(404).json({ message: 'Фільм не знайдено' });
    
    const movie = {
      ...rows[0],
      genres: rows[0].genres 
        ? rows[0].genres.split(',').map(name => ({ name })) 
        : [],
      averageRating: rows[0].averageRating ? parseFloat(rows[0].averageRating) : null
    };
    
    res.json(movie);
  } catch (err) {
    console.error('Помилка при отриманні фільму:', err);
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
