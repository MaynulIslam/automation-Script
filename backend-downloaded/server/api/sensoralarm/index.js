const express = require('express');

const middleware = require('../../middleware/auth');
const licenseMiddleware = require('../../middleware/license');
const services = require('./sensoralarm.service');

const router = express.Router();

router.get('/getSensorAlarmData', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getSensorAlarmData);
router.get('/getSensorAlarmDataByDevice/:device_id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getSensorAlarmDataByDevice);
router.get('/getSensorAlarmDataBySensor/:sensor_id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getSensorAlarmDataBySensor);
router.put('/updateSensorAlarm/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.updateSensorAlarm);
router.get('/getAlarmDataByCategory', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getAlarmDataByCategory);
router.get('/getAlarmReport', middleware.verifyAuthorization, services.getAlarmReport);
module.exports = router;
