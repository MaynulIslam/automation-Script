const Sequelize = require('sequelize');
const { Op } = Sequelize;
const DatabaseHelper = require('../../util/databaseHelper');
const { Device } = require('../../model');

const deviceHelper = new DatabaseHelper(Device);

const bulkInsertDevice = async (data) => {
  return await deviceHelper.bulkCreate(data);
};

const insertDevice = async (data) => {
  return await deviceHelper.create(data);
};

const updateDevice = async (device_id, data) => {
  return await deviceHelper.update(device_id, data);
};

const deleteDevice = async (device_id) => {
  return await deviceHelper.delete(device_id);
};

const deleteDevices = async (device_ids) => {
  return await deviceHelper.deleteAll(device_ids);
};

const getDevice = async (device_id) => {
  return await deviceHelper.findByPk(device_id);
};

const getDevices = async () => {
  return await deviceHelper.findByCriteria({
    where: {
      id: {
        [Op.ne]: 0,
      }
    },
    order: [
      ['device_priority', 'ASC']  // Order by device_priority in ascending order
    ]
  });
};

module.exports = {
  bulkInsertDevice,
  insertDevice,
  updateDevice,
  deleteDevice,
  deleteDevices,
  getDevice,
  getDevices,
};
