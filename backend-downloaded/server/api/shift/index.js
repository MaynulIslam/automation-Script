const express = require('express');
const middleware = require('../../middleware/auth');
const router = express.Router();
const shiftService = require('./shift.service');

router.get('/getAllShifts', middleware.verifyAuthorization, shiftService.getAllShifts);
router.get('/getShift/:id', middleware.verifyAuthorization, shiftService.getShiftById);
router.post('/insertShift', middleware.verifyAuthorization, shiftService.insertShift);
router.put('/updateShift/:id', middleware.verifyAuthorization, shiftService.updateShift);
router.delete('/deleteShift/:id', middleware.verifyAuthorization, shiftService.deleteShift);

module.exports = router; 