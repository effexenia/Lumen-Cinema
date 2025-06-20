/* eslint-disable no-unused-vars */
const db = require('../config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPayment = async (req, res) => {
  try {
    const { ticket_id, amount, session_id } = req.body;
    const paymentId = `PAY-${Math.floor(Math.random() * 1000000)}`;
    const status = 'pending';

    await db.query(
      'INSERT INTO payments (ticket_id, order_id, amount, status, session_id) VALUES (?, ?, ?, ?, ?)',
      [ticket_id, paymentId, amount, status, session_id]
    );
    res.status(201).json({ paymentId });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при створенні оплати' });
  }
};
exports.confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.body;

    // 1. Отримуємо ID квитків, які відповідають session_id
    const [tickets] = await db.query(
      'SELECT id FROM tickets WHERE session_id = ?',
      [session_id]
    );

    if (!tickets.length) {
      return res.status(404).json({ message: 'Квитки з таким session_id не знайдено' });
    }

    const ticketIds = tickets.map(t => t.id); 

    // 2. Оновлюємо статуси оплат для всіх відповідних квитків
    await db.query(
      `UPDATE payments
       SET status = 'paid'
       WHERE ticket_id IN (${ticketIds.map(() => '?').join(',')})`,
      ticketIds
    );

    res.status(200).json({ message: 'Оплата успішно підтверджена' });
  } catch (err) {
    console.error('Ошибка при подтверждении оплаты:', err);
    res.status(500).json({ 
      message: 'Помилка при підтвердженні оплати',
      error: err.message
    });
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
// exports.createStripeSession = async (req, res) => {
//   try {
//     const { amount, session_id, selectedSeats } = req.body;
    

//     if (!amount || !session_id || !selectedSeats) {
//       return res.status(400).json({ 
//         message: 'Missing required parameters' 
//       });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [{
//         price_data: {
//           currency: 'uah',
//           product_data: {
//             name: 'Квитки у кіно',
//           },
//           unit_amount: Math.round(amount * 100),
//         },
//         quantity: 1,
//       }],
//       mode: 'payment',
//       success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment-success?session_id=${session_id}&seats=${encodeURIComponent(JSON.stringify(selectedSeats))}`,
//       cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment-cancel`,
//     });
    
//     res.json({ url: session.url });
//   } catch (err) {
//     console.error('Stripe error:', err);
//     res.status(500).json({ 
//       message: 'Payment failed',
//       error: err.message 
//     });
//   }
// };
exports.createStripeSession = async (req, res) => {
  try {
    const { amount, session_id, selectedSeats, ticket_ids } = req.body;

    if (!amount || !session_id || !selectedSeats || !ticket_ids) {
      return res.status(400).json({ 
        message: 'Missing required parameters' 
      });
    }

    // 1. Створюємо записи в таблиці payments
    const status = 'pending';
    const payment_time = new Date();

    for (const ticketId of ticket_ids) {
      await db.query(
        'INSERT INTO payments (ticket_id, amount, status, payment_time) VALUES (?, ?, ?, ?)',
        [ticketId,amount, status, payment_time]
      );
    }

    // 2. Створюємо Stripe-сесію
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