const express = require('express');

const middleware = require('../../middleware/auth');
const licenseMiddleware = require('../../middleware/license');
const services = require('./organization.service');

const router = express.Router();

router.get('/getOrganization/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getOrganization);
router.get('/getAllOrganizations', middleware.verifyAuthorization, services.getAllOrganizations);
router.post('/insertOrganization', middleware.verifyAuthorization, services.insertOrganization);
router.put('/updateOrganization/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.updateOrganization);
router.delete('/deleteOrganization/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.deleteOrganization);
router.post('/testDbConnection', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.testDbConnection);
router.post('/selectOrganization', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.selectOrganization);

module.exports = router;