const express = require('express');
const router = express.Router();

//Middlewares
const checkAuth = require('../middleware/check-auth');

//Controllers
const organizationController = require('../controllers/organizations');

//Routers
router.get('/', organizationController.organizations_get_all);
router.get('/:userId', organizationController.organizations_get_user_organizations);
router.patch('/:orgId', organizationController.organizations_update_organization);
router.post('/', checkAuth, organizationController.organizations_create);


module.exports = router;