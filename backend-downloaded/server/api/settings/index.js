const express = require('express');

const middleware = require('../../middleware/auth');
const licenseMiddleware = require('../../middleware/license');
const services = require('./settings.service');
const smtpService = require('./smtp.service');

const router = express.Router();

router.get('/getSettings', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getAllSettings);
router.get('/getSystemInfo', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getSystemInfo);
router.get('/getSettings/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getSettings);
router.post('/insertSettings', services.insertSettings);
router.put('/updateSettings/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.updateSettings);
// router.put('/updateNetworkSettings/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.updateNetworkSettings); 
router.delete('/deleteSettings/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.deleteSettings);

// SMTP routes
router.post('/test-smtp', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, smtpService.testSmtpConnection);
router.post('/test-smtp/send', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, smtpService.sendTestEmail);

module.exports = router;