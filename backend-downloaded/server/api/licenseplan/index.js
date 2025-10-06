// license.route.js
const express = require('express');

const middleware = require('../../middleware/auth');
const licenseMiddleware = require('../../middleware/license');
const licensePlanService = require('./licenseplan.service');

const router = express.Router();

router.post('/addLicensePlan', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, licensePlanService.addLicensePlan);
router.put('/updateLicensePlan/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, licensePlanService.updateLicensePlan);
router.delete('/deleteLicensePlan/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, licensePlanService.deleteLicensePlan);
router.get('/getLicensePlan/:id', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, licensePlanService.getLicensePlan);
router.get('/getAllLicensePlans', middleware.verifyAuthorization, licenseMiddleware.verifyLicense, licensePlanService.getAllLicensePlans);

module.exports = router;