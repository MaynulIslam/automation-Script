const DatabaseHelper = require('../../../util/databaseHelper');
const { RhSensorData } = require('../../../models/sensor-model');

const RhSensorDataHelper = new DatabaseHelper(RhSensorData);

const insertRhSensorData = async(data)=>{
  return await RhSensorDataHelper.create(data)
}

const insertMultipleRhSensorData = async(data)=>{
  return await RhSensorDataHelper.bulkCreate(data)
}

const updateRhSensorData = async(data)=>{
  return await RhSensorDataHelper.update(data)
}

const deleteRhSensorData = async(id)=>{
  return await RhSensorDataHelper.delete(id)
}

const getRhSensorData = async(id)=>{
  return await RhSensorDataHelper.findByPk(id);
}

const getAllRhSensorData = async()=>{
  return await RhSensorDataHelper.findAll();
}

module.exports = {
  insertRhSensorData,
  updateRhSensorData,
  deleteRhSensorData,
  getRhSensorData,
  getAllRhSensorData,
  insertMultipleRhSensorData
}