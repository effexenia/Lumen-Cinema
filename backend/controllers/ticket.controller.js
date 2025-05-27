/* eslint-disable no-unused-vars */
const db = require('../config/db');

exports.getMyTickets = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
         t.id AS ticket_id,
         t.seat_row,
         t.seat_col,
         t.booked_at,
         s.start_time,
         s.price,
         m.title AS movie,
         h.name AS hall
       FROM tickets t
       JOIN sessions s ON t.session_id = s.id
       JOIN movies m ON s.movie_id = m.id
       JOIN halls h ON s.hall_id = h.id
       WHERE t.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при отриманні квитків' });
  }
};


exports.bookTicket = async (req, res) => {
  try {
    const { session_id, seat_number } = req.body;

    // перевірка на зайнятість місця
    const [existing] = await db.query(
      'SELECT * FROM tickets WHERE session_id = ? AND seat_number = ?',
      [session_id, seat_number]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Місце вже зайняте' });
    }

    await db.query(
      'INSERT INTO tickets (user_id, session_id, seat_number) VALUES (?, ?, ?)',
      [req.user.id, session_id, seat_number]
    );

    res.status(201).json({ message: 'Квиток заброньовано' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при бронюванні квитка' });
  }
};

exports.cancelTicket = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tickets WHERE id = ?', [req.params.id]);
    const ticket = rows[0];

    if (!ticket || ticket.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Немає доступу до цього квитка' });
    }

    await db.query('DELETE FROM tickets WHERE id = ?', [req.params.id]);
    res.json({ message: 'Квиток скасовано' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при скасуванні квитка' });
  }
};

exports.getSessionSeats = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT seat_number FROM tickets WHERE session_id = ?',
      [req.params.sessionId]
    );
    res.json(rows.map(r => r.seat_number));
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні місць' });
  }
};
