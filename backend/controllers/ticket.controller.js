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
         t.status,
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
    const { session_id, seats, user_id } = req.body;
    const ticketIds = [];

    for (const seat of seats) {
      const { row, seat: col } = seat;

      const [existing] = await db.query(
        'SELECT * FROM tickets WHERE session_id = ? AND seat_row = ? AND seat_col = ?',
        [session_id, row, col]
      );

      if (existing.length > 0) {
        return res.status(409).json({ message: `Місце ${row} ряд, ${col} місце вже зайняте` });
      }

      const [result] = await db.query(`
        INSERT INTO tickets (user_id, session_id, seat_row, seat_col, status, booked_at) 
        VALUES (?, ?, ?, ?, 'booked', NOW())
      `, [user_id, session_id, row, col]);

      ticketIds.push(result.insertId);
    }

    res.status(201).json({ message: 'Квитки заброньовано', ticketIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при бронюванні квитка' });
  }
};


exports.deleteTicket = async (req, res) => {
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

exports.cancelTicket = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tickets WHERE id = ?', [req.params.id]);
    const ticket = rows[0];

    if (!ticket || ticket.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Немає доступу до цього квитка' });
    }

    await db.query('UPDATE tickets SET status = ? WHERE id = ?', ['cancelled', req.params.id]);
    res.json({ message: 'Квиток скасовано' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при скасуванні квитка' });
  }
};

exports.getSessionSeats = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT seat_row, seat_col, status FROM tickets 
      WHERE session_id = ? 
      AND (
        status = 'paid' OR 
        (status = 'booked' AND TIMESTAMPDIFF(MINUTE, booked_at, NOW()) < 10)
      )`,
      [req.params.sessionId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні місць' });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { session_id, selectedSeats } = req.body;
    
    if (!session_id || !selectedSeats) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    for (const seat of selectedSeats) {
      await db.query(
        `UPDATE tickets SET status = 'paid' 
         WHERE session_id = ? AND seat_row = ? AND seat_col = ?`,
        [session_id, seat.row, seat.seat]
      );
    }

    res.status(200).json({ message: 'Tickets updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating tickets' });
  }
};