const express = require('express');
const router = express.Router();
const authController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/profile/:id', authMiddleware, authController.getProfile);
router.put('/profile/:id', authMiddleware, authController.updateProfile);
router.delete('/delete/:id', authMiddleware, authController.deleteUser);
router.put('/profile/:id', authMiddleware, upload.single('avatar'), authController.updateProfile);


module.exports = router;
