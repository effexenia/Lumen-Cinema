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
        m.bannerImg,
        m.trailer_url,
        m.language,
        m.country,
        m.studio,
        m.duration_minutes,
        m.release_date,
        m.created_at,
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
      id: row.id,
      title: row.title,
      description: row.description,
      summary: row.summary,
      posterImg: row.posterImg,
      bannerImg: row.bannerImg,
      trailer_url: row.trailer_url,
      language: row.language,
      country: row.country,
      studio: row.studio,
      duration_minutes: row.duration_minutes,
      release_date: row.release_date,
      created_at: row.created_at,
      genres: row.genres ? row.genres.split(',').map(name => ({ name })) : [],
      averageRating: parseFloat(row.averageRating),
    }));

    res.json(movies);
  } catch (err) {
    console.error('Error in getAllMovies:', err);
    res.status(500).json({
      message: 'Помилка при отриманні фільмів',
      error: err.message,
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
      summary,
      genres = [],
    } = req.body;



    const [result] = await pool.query(
      `INSERT INTO movies 
        (title, description, duration_minutes, release_date, posterImg, trailer_url, bannerImg, language, country, studio, summary) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, duration_minutes, release_date, posterImg, trailer_url, bannerImg, language, country, studio, summary]
    );

    const movieId = result.insertId;

    if (Array.isArray(genres) && genres.length > 0) {
      const genreValues = genres.map((genreId) => [movieId, genreId]);
      await pool.query(
        'INSERT INTO movie_genres (movie_id, genre_id) VALUES ?',
        [genreValues]
      );
    }
    res.status(201).json({ message: 'Фільм додано', id: movieId });
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
      summary,
      genres = [],
    } = req.body;

    const movieId = req.params.id;


    await pool.query(
      `UPDATE movies 
       SET title = ?, description = ?, duration_minutes = ?, release_date = ?, posterImg = ?, trailer_url = ?, bannerImg = ?, language = ?, country = ?, studio = ?, summary = ?
       WHERE id = ?`,
      [
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
        summary,
        movieId,
      ]
    );

    // Оновлення жанрів
    await pool.query('DELETE FROM movie_genres WHERE movie_id = ?', [movieId]);

    if (Array.isArray(genres) && genres.length > 0) {
      const genreValues = genres.map((genreId) => [movieId, genreId]);
      await pool.query(
        'INSERT INTO movie_genres (movie_id, genre_id) VALUES ?',
        [genreValues]
      );
    }

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
      return res.status(200).json([]); 
    }

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