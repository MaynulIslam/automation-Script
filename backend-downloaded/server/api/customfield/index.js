const express = require('express');

const middleware = require('../../middleware/auth');
const licenseMiddleware = require('../../middleware/license');
const services = require('./customfield.service');

const router = express.Router();

router.get('/getCustomFields', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getAllCustomField);
router.get('/customField/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getCustomField);
router.post('/insertCustomField', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.insertCustomField);
router.put('/updateCustomField/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.updateCustomField);
router.delete('/deleteCustomField/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.deleteCustomField);

module.exports = router;