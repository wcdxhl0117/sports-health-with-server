const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

// 公开路由
router.get('/', postController.getAllPosts);
router.get('/:postId', postController.getPostById);
router.get('/user/:userId', postController.getUserPosts);
router.get('/:postId/comments', postController.getPostComments);

// 需要登录的路由
router.use(authMiddleware);

// 帖子管理
router.post('/', postController.createPost);
router.post('/:postId/like', postController.likePost);

// 评论管理
router.post('/:postId/comments', postController.addComment);
router.post('/comments/:commentId/like', postController.likeComment);

module.exports = router; 