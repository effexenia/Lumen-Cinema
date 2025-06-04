const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.get('/search', movieController.searchMovies);
router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.post('/', authMiddleware, adminMiddleware, movieController.createMovie);
router.put('/:id', authMiddleware, adminMiddleware, movieController.updateMovie);
router.delete('/:id', authMiddleware, adminMiddleware, movieController.deleteMovie);

module.exports = router;
