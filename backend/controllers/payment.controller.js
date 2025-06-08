/* eslint-disable no-unused-vars */
const db = require('../config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPayment = async (req, res) => {
  try {
    const { ticket_id, amount } = req.body;
    // ініціація платежу (можливо, використовуючи зовнішній API для процесора)
    const paymentId = `PAY-${Math.floor(Math.random() * 1000000)}`;
    const status = 'pending'; // статус на початку

    await db.query(
      'INSERT INTO payments (ticket_id, order_id, amount, status) VALUES (?, ?, ?, ?)',
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
exports.createStripeSession = async (req, res) => {
  try {
    const { amount, session_id, selectedSeats } = req.body;

    if (!amount || !session_id || !selectedSeats) {
      return res.status(400).json({ 
        message: 'Missing required parameters' 
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'uah',
          product_data: {
            name: 'Квитки у кіно',
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment-success?session_id=${session_id}&seats=${encodeURIComponent(JSON.stringify(selectedSeats))}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment-cancel`,
    });
    
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ 
      message: 'Payment failed',
      error: err.message 
    });
  }
};

exports.handleStripeWebhook = async (req, res) => {
  console.log('Webhook received:', req.body);
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      const { session_id, selectedSeats } = session.metadata;
      const seats = JSON.parse(selectedSeats);
      
      for (const seat of seats) {
        await db.query(
          `UPDATE tickets SET status = 'paid' 
           WHERE session_id = ? AND seat_row = ? AND seat_col = ?`,
          [session_id, seat.row, seat.seat]
        );
      }
      console.log('Tickets status updated to paid');
    } catch (err) {
      console.error('Error updating tickets:', err);
    }
  }

  res.json({ received: true });
};