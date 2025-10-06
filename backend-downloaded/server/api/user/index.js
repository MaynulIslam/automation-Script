const express = require('express');

const middleware = require('../../middleware/auth');
const services = require('./user.service');

const router = express.Router();

router.get('/getUser/:id', middleware.verifyAuthorization, services.getUser);
router.get('/getUsers', middleware.verifyAuthorization, services.getUsers);
router.post('/insertUser', services.insertUser);
router.post('/login', services.login);
router.put('/updateUser/:id', middleware.verifyAuthorization, services.updateUser);
router.delete('/deleteUser/:id', middleware.verifyAuthorization, services.deleteUser);
router.post('/verifyAccessToken', services.verifyAccessToken);

module.exports = router;