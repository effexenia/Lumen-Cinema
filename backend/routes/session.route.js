const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.get('/', sessionController.getSessions);
router.get('/:id', sessionController.getSessionById);
router.post('/', authMiddleware, adminMiddleware, sessionController.createSession);
router.put('/:id', authMiddleware, adminMiddleware, sessionController.updateSession);
router.delete('/:id', authMiddleware, adminMiddleware, sessionController.deleteSession);

module.exports = router;
