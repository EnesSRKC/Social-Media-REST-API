const express = require('express');
const router = express.Router();


//Controller
const tagController = require('../controllers/tags');

//Routers
router.get('/', tagController.tags_get_all);


module.exports = router;