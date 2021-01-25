const express = require('express');
const router = express.Router();

//Middlewares
const checkAuth = require('../middleware/check-auth'); //Checks authentication of users
const fileUpload = require('../middleware/file-upload'); //Multer package


//Controllers
const UserController = require('../controllers/users');

//Handle incoming GET requests to /users
router.get('/', UserController.users_get_all);
//Handle incoming GET requests to /users/search with query called q
router.get('/search', UserController.users_search_user);
//Handle incoming POST requests with user name parameter to /users/:username
router.get('/:username', UserController.users_get_user);
//Handle incoming PATCH requests with userId parameter to /users/:userId
router.patch('/:userId', checkAuth, fileUpload.single('userImage'), UserController.users_update_user);
//Handle incoming DELETE requests with userId parameter to /users/:userId
router.delete('/:userId', checkAuth, UserController.users_delete_user);

module.exports = router;