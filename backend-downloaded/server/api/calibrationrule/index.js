const express = require('express');

const middleware = require('../../middleware/auth');
const licenseMiddleware = require('../../middleware/license');
const services = require('./calibrationrule.service');

const router = express.Router();

router.get('/getCalibrationRules', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getCalibrationRules);
router.get('/getCalibrationRule/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getCalibrationRule);
router.post('/insertCalibrationRule', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.insertCalibrationRule);
router.put('/updateCalibrationRule/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.updateCalibrationRule);
router.delete('/deleteCalibrationRule/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.deleteCalibrationRule);

module.exports = router;