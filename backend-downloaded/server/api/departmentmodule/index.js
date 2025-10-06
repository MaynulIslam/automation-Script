const express = require('express');
const middleware = require('../../middleware/auth');
const services = require('./departmentmodule.service');

const router = express.Router();

router.get('/getDepartmentModules/:departmentId', middleware.verifyAuthorization, services.getDepartmentModules);
router.get('/getModuleDepartments/:moduleId', middleware.verifyAuthorization, services.getModuleDepartments);
router.post('/assignModuleToDepartment', middleware.verifyAuthorization, services.assignModuleToDepartment);
router.post('/updateDepartmentModules/:departmentId', middleware.verifyAuthorization, services.updateDepartmentModules);
router.delete('/removeModuleFromDepartment/:departmentId/:moduleId', middleware.verifyAuthorization, services.removeModuleFromDepartment);

module.exports = router;