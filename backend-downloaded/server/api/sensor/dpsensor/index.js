const express = require('express');

const middleware = require('../../middleware/auth');
const services = require('./dpsensor.service');

const router = express.Router();

router.get('/getDpSensorData', middleware.verifyAuthorization, services.getDpSensorData);

module.exports = router;