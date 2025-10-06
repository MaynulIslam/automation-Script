const common = require('../../util/common');
const constant = require('../../util/constant');
const notificationDAL = require('./notification.helper');

exports.getNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationDAL.getNotification(id);
    if (!notification) {
      return common.sendResponse(res, constant.requestMessages.NOTIFICATION_NOT_FOUND, false, 404);
    }
    common.sendResponse(res, notification, true, 200);
  } catch (error) {
    console.error('Error retrieving notification:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_NOTIFICATION, false, 500);
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await notificationDAL.getNotifications();
    if (!notifications || notifications.length === 0) {
      return common.sendResponse(res, constant.requestMessages.NO_NOTIFICATIONS_FOUND, false, 404);
    }
    common.sendResponse(res, notifications, true, 200);
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_NOTIFICATIONS, false, 500);
  }
};

exports.insertNotification = async (req, res) => {
  try {
    const { 
      title, 
      message, 
      notification_type = 'INFO', 
      priority = 'MEDIUM', 
      scheduled_at,
      expires_at,
      status = 1,
      user_ids = []
    } = req.body;

    // Validate required fields
    if (!title || !message) {
      return common.sendResponse(res, { message: 'Title and message are required fields.' }, false, 400);
    }

    const created_by = req.user ? req.user.id : 1; // Default to admin user if no user context

    const newNotification = await notificationDAL.insertNotification({
      title,
      message,
      notification_type,
      priority,
      created_by,
      scheduled_at,
      expires_at,
      status
    });

    // If user_ids are provided, create user notifications
    if (user_ids && user_ids.length > 0) {
      for (const userId of user_ids) {
        await notificationDAL.createUserNotification(userId, newNotification.id);
      }
    }

    common.sendResponse(res, newNotification, true, 201, constant.requestMessages.NOTIFICATION_CREATED_SUCCESSFULLY);
  } catch (error) {
    console.error('Error inserting notification:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_INSERT_NOTIFICATION, false, 500);
  }
};

exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, notification_type, priority, scheduled_at, expires_at, status } = req.body;

    const notification = await notificationDAL.getNotification(id);
    if (!notification) {
      return common.sendResponse(res, constant.requestMessages.NOTIFICATION_NOT_FOUND, false, 404);
    }

    const updatedNotification = await notificationDAL.updateNotification({
      id,
      title,
      message,
      notification_type,
      priority,
      scheduled_at,
      expires_at,
      status
    });

    common.sendResponse(res, updatedNotification, true, 200, constant.requestMessages.NOTIFICATION_UPDATED_SUCCESSFULLY);
  } catch (error) {
    console.error('Error updating notification:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_UPDATE_NOTIFICATION, false, 500);
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await notificationDAL.getNotification(id);
    if (!notification) {
      return common.sendResponse(res, constant.requestMessages.NOTIFICATION_NOT_FOUND, false, 404);
    }

    await notificationDAL.deleteNotification(id);
    common.sendResponse(res, constant.requestMessages.NOTIFICATION_DELETED_SUCCESSFULLY, true, 200);
  } catch (error) {
    console.error('Error deleting notification:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_DELETE_NOTIFICATION, false, 500);
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await notificationDAL.getUserNotifications(userId);
    
    common.sendResponse(res, notifications || [], true, 200);
  } catch (error) {
    console.error('Error retrieving user notifications:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_USER_NOTIFICATIONS, false, 500);
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user ? req.user.id : req.body.userId;

    if (!userId) {
      return common.sendResponse(res, constant.requestMessages.USER_ID_REQUIRED, false, 400);
    }

    await notificationDAL.markNotificationAsRead(userId, notificationId);
    common.sendResponse(res, constant.requestMessages.NOTIFICATION_MARKED_AS_READ, true, 200);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_MARK_NOTIFICATION_AS_READ, false, 500);
  }
};

exports.dismissNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user ? req.user.id : req.body.userId;

    if (!userId) {
      return common.sendResponse(res, constant.requestMessages.USER_ID_REQUIRED, false, 400);
    }

    await notificationDAL.dismissNotification(userId, notificationId);
    common.sendResponse(res, constant.requestMessages.NOTIFICATION_DISMISSED, true, 200);
  } catch (error) {
    console.error('Error dismissing notification:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_DISMISS_NOTIFICATION, false, 500);
  }
};