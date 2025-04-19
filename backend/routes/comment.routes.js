const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/movies/:id/comments', commentController.getCommentsByMovie);
router.post('/comments', authMiddleware, commentController.addComment);
router.put('/comments/:id', authMiddleware, commentController.updateComment);
router.delete('/comments/:id', authMiddleware, commentController.deleteComment);

module.exports = router;
