const express = require('express');

const middleware = require('../../middleware/auth');
const services = require('./userorganization.service');

const router = express.Router();

router.get('/getUserOrganization/:id', middleware.verifyAuthorization, services.getUserOrganization);
router.get('/getAllUserOrganizations', middleware.verifyAuthorization, services.getAllUserOrganizations);
router.post('/insertUserOrganization', services.insertUserOrganization);
router.put('/updateUserOrganization/:id', middleware.verifyAuthorization, services.updateUserOrganization);
router.delete('/deleteUserOrganization/:id', middleware.verifyAuthorization, services.deleteUserOrganization);

module.exports = router;
