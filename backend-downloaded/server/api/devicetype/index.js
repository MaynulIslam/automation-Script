const express = require('express');

const middleware = require('../../middleware/auth');
const licenseMiddleware = require('../../middleware/license');
const services = require('./devicetype.service');

const router = express.Router();

router.get('/getDeviceType/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getDeviceType);
router.get('/getDeviceTypes', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getDeviceTypes);
router.post('/insertDeviceType', services.insertDeviceType);
router.put('/updateDeviceType/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.updateDeviceType);
router.delete('/deleteDeviceType/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.deleteDeviceType);

module.exports = router;