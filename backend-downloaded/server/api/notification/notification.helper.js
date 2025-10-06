const { Notification, UserNotification, User } = require('../../model');

const insertNotification = async (data) => {
  return await Notification.create(data);
};

const updateNotification = async (data) => {
  return await Notification.update(data, { where: { id: data.id } });
};

const deleteNotification = async (id) => {
  return await Notification.destroy({ where: { id } });
};

const getNotification = async (id) => {
  return await Notification.findByPk(id);
};

const getNotifications = async () => {
  return await Notification.findAll();
};

const getUserNotifications = async (userId) => {
  return await UserNotification.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Notification,
        attributes: ['id', 'title', 'message', 'notification_type', 'priority', 'created_at', 'scheduled_at', 'expires_at']
      }
    ]
  });
};

const markNotificationAsRead = async (userId, notificationId) => {
  return await UserNotification.update({
    is_read: true,
    read_at: new Date()
  }, {
    where: { 
      user_id: userId, 
      notification_id: notificationId 
    }
  });
};

const dismissNotification = async (userId, notificationId) => {
  return await UserNotification.update({
    is_dismissed: true,
    dismissed_at: new Date()
  }, {
    where: { 
      user_id: userId, 
      notification_id: notificationId 
    }
  });
};

const createUserNotification = async (userId, notificationId) => {
  return await UserNotification.create({
    user_id: userId,
    notification_id: notificationId,
    is_read: false,
    is_dismissed: false
  });
};

module.exports = {
  insertNotification,
  updateNotification,
  deleteNotification,
  getNotification,
  getNotifications,
  getUserNotifications,
  markNotificationAsRead,
  dismissNotification,
  createUserNotification
};