const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const adminMiddleware = require('../middlewares/admin.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const liqpay = require('../middlewares/liqpay')

router.get('/all', authMiddleware, adminMiddleware, paymentController.getAllPayments);
router.post('/', paymentController.createPayment);
router.get('/:ticketId', paymentController.getPaymentStatus);
router.post('/liqpay', liqpay.generateLiqpayForm);


module.exports = router;
