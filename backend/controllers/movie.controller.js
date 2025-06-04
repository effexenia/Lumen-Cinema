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
        m.trailer_url,
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
    // Запрос для фильма
    const [movieRows] = await pool.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (!movieRows.length) return res.status(404).json({ message: 'Фільм не знайдено' });
    
    // Запрос для рейтинга
    const [ratingRows] = await pool.query('SELECT AVG(rating) AS averageRating FROM ratings WHERE movie_id = ?', [req.params.id]);
    
    // Запрос для жанров
    const [genreRows] = await pool.query(`
      SELECT g.id, g.name 
      FROM genres g
      JOIN movie_genres mg ON g.id = mg.genre_id
      WHERE mg.movie_id = ?
    `, [req.params.id]);
    
    const movie = {
      ...movieRows[0],
      genres: genreRows,
      averageRating: ratingRows[0].averageRating ? parseFloat(ratingRows[0].averageRating) : null
    };
    
    res.json(movie);
  } catch (err) {
    console.error('Помилка при отриманні фільму:', err);
    res.status(500).json({ message: 'Помилка при отриманні фільму' });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      duration_minutes,
      release_date,
      posterImg,
      trailer_url,
      bannerImg,
      language,
      country,
      studio,
      summary
    } = req.body;

    await pool.query(
      `INSERT INTO movies 
        (title, description, duration_minutes, release_date, posterImg, trailer_url, bannerImg, language, country, studio, summary) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, duration_minutes, release_date, posterImg, trailer_url, bannerImg, language, country, studio, summary]
    );

    res.status(201).json({ message: 'Фільм додано' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при додаванні фільму' });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      duration_minutes,
      release_date,
      posterImg,
      trailer_url,
      bannerImg,
      language,
      country,
      studio,
      summary
    } = req.body;

    await pool.query(
      `UPDATE movies 
       SET title = ?, description = ?, duration_minutes = ?, release_date = ?, posterImg = ?, trailer_url = ?, bannerImg = ?, language = ?, country = ?, studio = ?, summary = ?
       WHERE id = ?`,
      [title, description, duration_minutes, release_date, posterImg, trailer_url, bannerImg, language, country, studio, summary, req.params.id]
    );

    res.json({ message: 'Фільм оновлено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при оновленні фільму' });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    await pool.query('DELETE FROM movies WHERE id = ?', [req.params.id]);
    res.json({ message: 'Фільм видалено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при видаленні фільму' });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
console.log('Пошуковий запит:', query);
    if (!query || query.trim().length < 2) {
      return res.status(200).json([]); // Повертаємо пустий масив замість помилки
    }

    // Решта вашого коду залишається без змін
    const searchQuery = query.replace(/[а-яА-ЯёЁ]/g, (char) => {
      const translitMap = { 'а': 'a', 'б': 'b', 'в': 'v', /* ... */ };
      return `${char}|${translitMap[char.toLowerCase()] || char}`;
    });

    const [rows] = await pool.query(
      `SELECT 
        id, title, posterImg, release_date
      FROM movies
      WHERE 
        title LIKE ? COLLATE utf8mb4_unicode_ci
        OR title LIKE ? COLLATE utf8mb4_unicode_ci
      ORDER BY release_date DESC
      LIMIT 10`,
      [`%${query}%`, `%${searchQuery}%`]
    );

    res.json(rows || []);
  } catch (err) {
    console.error('Помилка пошуку:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};