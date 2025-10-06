// license.route.js
const express = require('express');

const middleware = require('../../middleware/auth');
const licenseService = require('./license.service');
const uploadLicenseService = require('./update.license.service');
const router = express.Router();

router.post('/activateLicense', middleware.verifyAuthorization, licenseService.activateLicense);
router.post('/validateLicense', middleware.verifyAuthorization, licenseService.validateLicense);
router.post('/getHostId', middleware.verifyAuthorization, licenseService.getHostId);
router.get('/getHostInfo', middleware.verifyAuthorization, licenseService.getHostInfo);
router.post('/saveLicense', middleware.verifyAuthorization, licenseService.saveLicense);
router.post('/removeLicense/:id', middleware.verifyAuthorization, licenseService.removeLicense);
router.post('/uploadLicense', middleware.verifyAuthorization, uploadLicenseService.uploadLicense);
router.post('/getActiveLicense', middleware.verifyAuthorization, licenseService.getActiveLicense)

module.exports = router;