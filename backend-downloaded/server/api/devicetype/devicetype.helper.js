const DatabaseHelper = require('../../util/databaseHelper');
const { DeviceType } = require('../../model');


const DeviceTypeHelper = new DatabaseHelper(DeviceType);

const insertDeviceType = async(data)=>{
  return await DeviceTypeHelper.create(data)
}

const insertMultipleDeviceType = async(data)=>{
  return await DeviceTypeHelper.bulkCreate(data)
}

const updateDeviceType = async(data)=>{
  return await DeviceTypeHelper.update(data)
}

const deleteDeviceType = async(id)=>{
  return await DeviceTypeHelper.delete(id)
}

const getDeviceType = async(id)=>{
  return await DeviceTypeHelper.findByPk(id);
}

const getDeviceTypes = async()=>{
  return await DeviceTypeHelper.findAll();
}

module.exports = {
  insertDeviceType,
  updateDeviceType,
  deleteDeviceType,
  getDeviceType,
  getDeviceTypes,
  insertMultipleDeviceType
}