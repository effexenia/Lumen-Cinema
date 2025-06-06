const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const adminMiddleware = require('../middlewares/admin.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/statistics',authMiddleware, adminMiddleware, adminController.getStatistics);
router.get('/users', authMiddleware, adminMiddleware, adminController.getUsers);
router.delete('/users/:id',authMiddleware, adminMiddleware, adminController.deleteUser);
router.post('/users', authMiddleware, adminMiddleware, adminController.createUser);
router.put('/users/:id', authMiddleware, adminMiddleware, adminController.updateUser);

module.exports = router;
