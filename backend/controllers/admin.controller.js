/* eslint-disable no-unused-vars */
const db = require('../config/db');
const bcrypt = require('bcrypt');

// exports.getStatistics = async (req, res) => {
//   try {
//     const [ticketCount] = await db.query('SELECT COUNT(*) AS total FROM tickets');
//     const [revenue] = await db.query('SELECT SUM(amount) AS revenue FROM payments WHERE status = "completed"');
//     const [userCount] = await db.query('SELECT COUNT(*) AS total FROM users');

//     res.json({
//       ticketCount: ticketCount[0].total,
//       revenue: revenue[0].revenue,
//       userCount: userCount[0].total
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Помилка при отриманні статистики' });
//   }
// };
exports.getStatistics = async (req, res) => {
  try {
    // Загальні цифри
    const [ticketCount] = await db.query('SELECT COUNT(*) AS total FROM tickets');
    const [revenue] = await db.query('SELECT SUM(amount) AS revenue FROM payments WHERE status = "paid"');
    const [userCount] = await db.query('SELECT COUNT(*) AS total FROM users');

    // 1. Кількість користувачів по днях (останній місяць)
    const [usersByDay] = await db.query(`
      SELECT DATE(created_at) AS date, COUNT(*) AS count
      FROM users
      WHERE created_at >= CURDATE() - INTERVAL 30 DAY
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    // 2. Кількість проданих квитків по днях (останній місяць)
    const [ticketsByDay] = await db.query(`
      SELECT DATE(booked_at) AS date, COUNT(*) AS count
      FROM tickets
      WHERE booked_at >= CURDATE() - INTERVAL 30 DAY
      GROUP BY DATE(booked_at)
      ORDER BY DATE(booked_at)
    `);

    // 3. Дохід по місяцях (останній рік)
    const [revenueByMonth] = await db.query(`
      SELECT DATE_FORMAT(payment_time, '%Y-%m') AS month, SUM(amount) AS total
      FROM payments
      WHERE status = 'paid' AND payment_time >= CURDATE() - INTERVAL 1 YEAR
      GROUP BY month
      ORDER BY month
    `);

    // 4. Розподіл квитків по жанрах фільмів
    const [ticketsByGenre] = await db.query(`
      SELECT g.name AS genre, COUNT(t.id) AS count
      FROM tickets t
      JOIN sessions s ON t.session_id = s.id  
      JOIN movies m ON s.movie_id = m.id    
      JOIN movie_genres mg ON m.id = mg.movie_id
      JOIN genres g ON mg.genre_id = g.id
      GROUP BY g.name
      ORDER BY count DESC
      LIMIT 10;
    `);

    // 5. Середня ціна квитка
    const [avgTicketPrice] = await db.query(`
      SELECT AVG(amount) AS avgPrice
      FROM payments
      WHERE status = 'paid'
    `);

    res.json({
      ticketCount: ticketCount[0].total,
      revenue: revenue[0].revenue,
      userCount: userCount[0].total,
      usersByDay,
      ticketsByDay,
      revenueByMonth,
      ticketsByGenre,
      avgTicketPrice: avgTicketPrice[0].avgPrice,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при отриманні статистики' });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні списку користувачів' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'Користувача видалено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при видаленні користувача' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, dob, role, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Імʼя, email і пароль обовʼязкові' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (name, email, phone, dob, role, password, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [name, email, phone, dob, role, hashedPassword]
    );

    const [userRows] = await db.query('SELECT id, name, email, phone, dob, role, created_at FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json(userRows[0]); // не повертаємо пароль
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при створенні користувача' });
  }
};

// Оновлення користувача
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, phone, dob, role } = req.body;

    await db.query(
      'UPDATE users SET name = ?, email = ?, phone = ?, dob = ?, role = ? WHERE id = ?',
      [name, email, phone, dob, role, userId]
    );

    const [userRows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    res.json(userRows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при оновленні користувача' });
  }
};