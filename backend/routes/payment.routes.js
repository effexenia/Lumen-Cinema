const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const adminMiddleware = require('../middlewares/admin.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/all', authMiddleware, adminMiddleware, paymentController.getAllPayments);
router.post('/', paymentController.createPayment);
router.get('/:ticketId', paymentController.getPaymentStatus);
router.post('/stripe-session', paymentController.createStripeSession);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);


module.exports = router;
