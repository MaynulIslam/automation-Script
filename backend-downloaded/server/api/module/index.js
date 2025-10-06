const express = require('express');
const middleware = require('../../middleware/auth');
const services = require('./module.service');

const router = express.Router();

router.get('/getModule/:id', middleware.verifyAuthorization, services.getModule);
router.get('/getAllModules', middleware.verifyAuthorization, services.getAllModules);
router.post('/insertModule', services.insertModule);
router.put('/updateModule/:id', middleware.verifyAuthorization, services.updateModule);
router.delete('/deleteModule/:id', middleware.verifyAuthorization, services.deleteModule);
router.get('/getUserModules/:userId', middleware.verifyAuthorization, services.getUserModules);
router.post('/updateUserModules/:userId', middleware.verifyAuthorization, services.updateUserModules);

module.exports = router;
