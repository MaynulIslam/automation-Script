const express = require('express');

const middleware = require('../../middleware/auth');
const licenseMiddleware = require('../../middleware/license');
const services = require('./devicesensorcalrule.service');

const router = express.Router();

router.get('/getDeviceSensorCalRules', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getDeviceSensorCalRules);
router.get('/getDeviceSensorCalRule/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getDeviceSensorCalRule);
router.post('/insertDeviceSensorCalRule', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.insertDeviceSensorCalRule);
router.put('/updateDeviceSensorCalRule/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.updateDeviceSensorCalRule);
router.delete('/deleteDeviceSensorCalRule/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.deleteDeviceSensorCalRule);

module.exports = router;