const express = require('express');
const middleware = require('../../middleware/auth');
const router = express.Router();
const countryService = require('./country.service');

// GET /api/country/getAllCountries - get all countries
router.get('/getAllCountries', middleware.verifyAuthorization, countryService.getAllCountries);

module.exports = router; 