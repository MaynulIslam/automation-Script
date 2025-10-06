const express = require('express');

const middleware = require('../../middleware/auth');
const services = require('./report.service');

const router = express.Router();


router.get('/getAlarmReport', middleware.verifyAuthorization, services.getAlarmReport);
router.get('/getAlarmTrends', middleware.verifyAuthorization, services.getAlarmTrends);
module.exports = router;
