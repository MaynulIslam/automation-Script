const express = require('express');
const middleware = require('../../middleware/auth');
const router = express.Router();
const regulatoryBodyService = require('./regulatorybody.service');

router.get('/getAllRegulatoryBodies', middleware.verifyAuthorization, regulatoryBodyService.getAllRegulatoryBodies);
router.get('/getRegulatoryBodyById/:id', middleware.verifyAuthorization, regulatoryBodyService.getRegulatoryBodyById);
router.post('/createRegulatoryBody', middleware.verifyAuthorization, regulatoryBodyService.createRegulatoryBody);
router.put('/updateRegulatoryBody/:id', middleware.verifyAuthorization, regulatoryBodyService.updateRegulatoryBody);
router.delete('/deleteRegulatoryBody/:id', middleware.verifyAuthorization, regulatoryBodyService.deleteRegulatoryBody);

module.exports = router;
