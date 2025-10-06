const express = require('express');

const middleware = require('../../middleware/auth');
const services = require('./analytics.service');

const router = express.Router();

router.get('/getVigilanteAQSOverview', middleware.verifyAuthorization, services.getVigilanteAQSOverview);

module.exports = router;