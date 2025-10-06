const express = require('express');

const services = require('./update.service');

const router = express.Router();

router.post('/softwareUpdate', services.softwareUpdateService);

module.exports = router;