const express = require('express');
const middleware = require('../../middleware/auth');
const services = require('./userdepartment.service');

const router = express.Router();

router.get('/getUserDepartments/:userId', middleware.verifyAuthorization, services.getUserDepartments);
router.get('/getDepartmentUsers/:departmentId', middleware.verifyAuthorization, services.getDepartmentUsers);
router.post('/assignUserToDepartment', middleware.verifyAuthorization, services.assignUserToDepartment);
router.post('/updateUserDepartments/:userId', middleware.verifyAuthorization, services.updateUserDepartments);
router.delete('/removeUserFromDepartment/:userId/:departmentId', middleware.verifyAuthorization, services.removeUserFromDepartment);
router.post('/setPrimaryDepartment/:userId/:departmentId', middleware.verifyAuthorization, services.setPrimaryDepartment);

module.exports = router;