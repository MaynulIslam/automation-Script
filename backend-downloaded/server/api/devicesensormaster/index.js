const express = require('express');

const middleware = require('../../middleware/auth');
const services = require('./devicesensormaster.service');

const router = express.Router();

router.get('/getSensorInfo', middleware.verifyAuthorization,  services.getDeviceSensorData);
router.get('/getSensorList', middleware.verifyAuthorization, services.getSensorList);

module.exports = router;