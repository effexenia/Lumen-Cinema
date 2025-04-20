/* eslint-disable no-unused-vars */
const db = require('../config/db');

exports.getStatistics = async (req, res) => {
  try {
    const [ticketCount] = await db.query('SELECT COUNT(*) AS total FROM tickets');
    const [revenue] = await db.query('SELECT SUM(amount) AS revenue FROM payments WHERE status = "completed"');
    const [userCount] = await db.query('SELECT COUNT(*) AS total FROM users');

    res.json({
      ticketCount: ticketCount[0].total,
      revenue: revenue[0].revenue,
      userCount: userCount[0].total
    });
  } catch (err) {
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
