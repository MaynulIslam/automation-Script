const express = require('express');

const middleware = require('../../middleware/auth');
const services = require('./rhsensor.service');

const router = express.Router();

router.get('/getRhSensorData', middleware.verifyAuthorization, services.getRhSensorData);

module.exports = router;