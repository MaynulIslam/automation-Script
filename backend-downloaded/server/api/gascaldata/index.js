const express = require('express');

const middleware = require('../../middleware/auth');
const router = express.Router();
const gasCalService = require('./gascaldata.service');

router.post('/getSensorCalData', middleware.verifyAuthorization, gasCalService.getSensorCalData)

module.exports = router;