const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const adminMiddleware = require('../middlewares/admin.middleware');

router.get('/statistics', adminMiddleware, adminController.getStatistics);
router.get('/users', adminMiddleware, adminController.getUsers);
router.delete('/users/:id', adminMiddleware, adminController.deleteUser);

module.exports = router;
