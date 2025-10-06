const express = require('express');

const middleware = require('../../middleware/auth');
const services = require('./airflowsensor.service');

const router = express.Router();

router.get('/getAirflowSensorData', middleware.verifyAuthorization, services.getAirflowSensorData);

module.exports = router;