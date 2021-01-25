const express = require('express');
const router = express.Router();

//Middlewares
const fileUpload = require('../middleware/file-upload');

//Controllers
const LoginController = require('../controllers/login');

//Routers
router.post('/signup', fileUpload.single('userImage'), LoginController.login_signup);
router.post('/signin', LoginController.login_signin);


module.exports = router;