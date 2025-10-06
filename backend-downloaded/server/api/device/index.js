const express = require('express');

const authMiddleware = require('../../middleware/auth');
const licenseMiddleware = require('../../middleware/license');
const services = require('./device.service');

const router = express.Router();

router.get('/getDeviceKeyFigures', authMiddleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getDeviceKeyFigures);
router.get('/getDevices', authMiddleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getDevices);
router.get('/getDevice/:id', authMiddleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getDevice);
router.get('/discoverable', authMiddleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getDiscoverableDevice);
router.get('/sensorList/:id', authMiddleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.getDeviceSensorData);
router.get('/rediscoverDevices', authMiddleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.rediscoverDevices);
router.post('/insertDevice', authMiddleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.insertDevice);
router.post('/insertDevices', authMiddleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.insertDevices);
router.put('/updateDevice/:id', authMiddleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.updateDevice);
router.delete('/deleteDevice/:id', authMiddleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.deleteDevice);
router.delete('/deleteDevices', authMiddleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.deleteDevices);
router.post('/checkDeviceConnection', authMiddleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.checkDeviceConnection);
router.get('/export/csv', authMiddleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.exportDevicesCSV);
router.get('/export/json', authMiddleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.exportDevicesJSON);
router.post('/import', authMiddleware.verifyAuthorization, licenseMiddleware.verifyLicense, services.importDevices);

module.exports = router;