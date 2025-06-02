/* eslint-disable no-unused-vars */
const db = require('../config/db');

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
    const [revenue] = await db.query('SELECT SUM(amount) AS revenue FROM payments WHERE status = "completed"');
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
      WHERE status = 'completed' AND payment_time >= CURDATE() - INTERVAL 1 YEAR
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
      WHERE status = 'completed'
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
