const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genre.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.get('/', genreController.getGenres);
router.post('/', authMiddleware, adminMiddleware, genreController.createGenre);
router.put('/:id', authMiddleware, adminMiddleware, genreController.updateGenre);
router.delete('/:id', authMiddleware, adminMiddleware, genreController.deleteGenre);

module.exports = router;
