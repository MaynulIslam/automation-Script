const express = require('express');
const middleware = require('../../middleware/auth');
const router = express.Router();
const sensorRegulationService = require('./sensorregulation.service');

router.get('/getAllSensorRegulations', middleware.verifyAuthorization, sensorRegulationService.getAllSensorRegulations);
router.get('/getSensorRegulationById/:id', middleware.verifyAuthorization, sensorRegulationService.getSensorRegulationById);
router.post('/createSensorRegulation', middleware.verifyAuthorization, sensorRegulationService.createSensorRegulation);
router.put('/updateSensorRegulation/:id', middleware.verifyAuthorization, sensorRegulationService.updateSensorRegulation);
router.delete('/deleteSensorRegulation/:id', middleware.verifyAuthorization, sensorRegulationService.deleteSensorRegulation);

module.exports = router;