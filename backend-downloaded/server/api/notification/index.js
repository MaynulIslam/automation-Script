const express = require('express');
const middleware = require('../../middleware/auth');
const services = require('./notification.service');

const router = express.Router();

router.get('/getNotification/:id', middleware.verifyAuthorization, services.getNotification);
router.get('/getNotifications', middleware.verifyAuthorization, services.getNotifications);
router.post('/insertNotification', middleware.verifyAuthorization, services.insertNotification);
router.put('/updateNotification/:id', middleware.verifyAuthorization, services.updateNotification);
router.delete('/deleteNotification/:id', middleware.verifyAuthorization, services.deleteNotification);
router.get('/getUserNotifications/:userId', middleware.verifyAuthorization, services.getUserNotifications);
router.post('/markNotificationAsRead/:notificationId', middleware.verifyAuthorization, services.markNotificationAsRead);
router.post('/dismissNotification/:notificationId', middleware.verifyAuthorization, services.dismissNotification);

module.exports = router;