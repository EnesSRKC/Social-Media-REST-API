const express = require('express');
const router = express.Router();

//Middlewares
const checkAuth = require('../middleware/check-auth');

//Controllers
const PostController = require('../controllers/posts');

//Routers
router.get('/', PostController.posts_get_all);
router.post('/', checkAuth, PostController.posts_create_post);
router.get('/:postId', PostController.posts_get_post);
router.patch('/:postId', checkAuth, PostController.posts_update_post);
router.delete('/:postId', checkAuth, PostController.posts_delete_post);

module.exports = router;