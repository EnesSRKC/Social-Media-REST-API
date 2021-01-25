const express = require('express');
const router = express.Router();

//Middlewares
const checkAuth = require('../middleware/check-auth');

//Controllers
const MessageController = require('../controllers/messages');

//Routers
router.get('/', MessageController.messages_get_all);
router.get('/:username', MessageController.messages_get_message);
router.post('/', checkAuth, MessageController.messages_create_message);
router.patch('/:messageId', checkAuth, MessageController.messages_add_message);

module.exports = router;