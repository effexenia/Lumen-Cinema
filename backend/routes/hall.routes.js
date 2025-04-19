const express = require('express');
const router = express.Router();
const hallController = require('../controllers/hall.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.get('/', hallController.getHalls);
router.post('/', authMiddleware, adminMiddleware, hallController.createHall);
router.put('/:id', authMiddleware, adminMiddleware, hallController.updateHall);
router.delete('/:id', authMiddleware, adminMiddleware, hallController.deleteHall);

module.exports = router;
