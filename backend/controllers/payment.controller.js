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
    const { ticketIds, amount } = req.body;

    // Валідація вхідних даних
    if (!ticketIds || !ticketIds.length || !amount) {
      return res.status(400).json({ 
        message: 'Відсутні обов\'язкові параметри: ticketIds або amount' 
      });
    }

    console.log('Creating Stripe session with:', { ticketIds, amount });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'uah',
          product_data: {
            name: 'Квитки у кіно',
            description: `Квитки: ${ticketIds.join(', ')}`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        ticket_ids: ticketIds.join(','),
      }
    });

    console.log('Stripe session created:', session.id);
    
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    res.status(500).json({ 
      message: 'Не вдалося створити Stripe-сесію',
      error: err.message 
    });
  }
};