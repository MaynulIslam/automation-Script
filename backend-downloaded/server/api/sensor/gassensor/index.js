const express = require('express');

const middleware = require('../../../middleware/auth');
const services = require('./gassensor.service');

const router = express.Router();

router.get('/getGasSensorData', middleware.verifyAuthorization, services.getGasSensorData);

module.exports = router;