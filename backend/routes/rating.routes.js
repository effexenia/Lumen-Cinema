const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/movies/:id/rating', ratingController.getRatingByMovie);
router.post('/ratings', authMiddleware, ratingController.addOrUpdateRating);
router.get('/ratings/my/:movieId', authMiddleware, ratingController.getUserRating);

module.exports = router;
