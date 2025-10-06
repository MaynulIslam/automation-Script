const express = require('express');

const middleware = require('../../middleware/auth');
const licenseMiddleware = require('../../middleware/license');
const services = require('./alarmreport.service');

const router = express.Router();

router.get('/getAlarmCategoryReport', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getAlarmCategoryReport);
router.get('/getAlarmSummaryByCategory', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getAlarmSummaryByCategory);



module.exports = router; 