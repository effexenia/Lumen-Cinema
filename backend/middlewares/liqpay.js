const crypto = require('crypto');
const db = require('../config/db');

exports.generateLiqpayForm = async (req, res) => {
  try {
    const { amount, ticketIds } = req.body;

    // Валідація даних
    if (!amount || !ticketIds || !Array.isArray(ticketIds)) {
      return res.status(400).json({ error: 'Некоректні дані запиту' });
    }

    const public_key = process.env.LIQPAY_PUBLIC_KEY;
    const private_key = process.env.LIQPAY_PRIVATE_KEY;

    const order_id = `ORDER-${Date.now()}`;
    const payment = {
      public_key,
      version: 3,
      action: 'pay',
      amount,
      currency: 'UAH',
      description: 'Оплата квитків в кіно',
      order_id,
      result_url: 'http://localhost:3000/confirmation',
      server_url: 'http://localhost:5000/api/payments/liqpay-callback',
    };

    const data = Buffer.from(JSON.stringify(payment)).toString('base64');
    const signature = crypto.createHash('sha1')
      .update(private_key + data + private_key)
      .digest('base64');

    for (const ticketId of ticketIds) {
      await db.query(`
        INSERT INTO payments (id, amount, status) 
        VALUES (?, ?, ?)
      `, [ticketId, amount, 'pending']);
    }

    res.json({ 
      success: true,
      data, 
      signature,
      order_id
    });

  } catch (err) {
    console.error('Помилка LiqPay:', err);
    res.status(500).json({ 
      success: false,
      error: 'Помилка обробки платежу',
      details: err.message 
    });
  }
};