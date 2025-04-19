/* eslint-disable no-unused-vars */
const db = require('../db');

exports.createPayment = async (req, res) => {
  try {
    const { ticket_id, amount } = req.body;
    // ініціація платежу (можливо, використовуючи зовнішній API для процесора)
    const paymentId = `PAY-${Math.floor(Math.random() * 1000000)}`;
    const status = 'pending'; // статус на початку

    await db.query(
      'INSERT INTO payments (ticket_id, payment_id, amount, status) VALUES (?, ?, ?, ?)',
      [ticket_id, paymentId, amount, status]
    );
    res.status(201).json({ paymentId });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при створенні оплати' });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM payments WHERE ticket_id = ?', [req.params.ticketId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Оплату не знайдено' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні статусу оплати' });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM payments');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні списку оплат' });
  }
};
