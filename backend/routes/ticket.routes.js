const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/my', authMiddleware, ticketController.getMyTickets);
router.post('/book', authMiddleware, ticketController.bookTicket);
router.post('/update-ticket-status', ticketController.updateTicketStatus);
router.delete('/:id', authMiddleware, ticketController.cancelTicket);
router.get('/session/:sessionId', ticketController.getSessionSeats);

module.exports = router;
