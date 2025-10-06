const express = require('express');
const middleware = require('../../middleware/auth');
const services = require('./department.service');

const router = express.Router();

router.get('/getDepartment/:id', middleware.verifyAuthorization, services.getDepartment);
router.get('/getDepartments', middleware.verifyAuthorization, services.getDepartments);
router.post('/insertDepartment', middleware.verifyAuthorization, services.insertDepartment);
router.put('/updateDepartment/:id', middleware.verifyAuthorization, services.updateDepartment);
router.delete('/deleteDepartment/:id', middleware.verifyAuthorization, services.deleteDepartment);

module.exports = router;