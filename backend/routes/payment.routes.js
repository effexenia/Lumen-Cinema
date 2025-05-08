const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const adminMiddleware = require('../middlewares/admin.middleware');
const liqpay = require('../middlewares/liqpay')

router.post('/', paymentController.createPayment);
router.get('/:ticketId', paymentController.getPaymentStatus);
router.get('/all', adminMiddleware, paymentController.getAllPayments);
router.post('/liqpay', liqpay.generateLiqpayForm);


module.exports = router;
