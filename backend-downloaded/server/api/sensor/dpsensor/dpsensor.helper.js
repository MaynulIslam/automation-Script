const DatabaseHelper = require('../../../util/databaseHelper');
const { DpSensorData } = require('../../../models/sensor-model');

const DpSensorDataHelper = new DatabaseHelper(DpSensorData);

const insertDpSensorData = async(data)=>{
  return await DpSensorDataHelper.create(data)
}

const insertMultipleDpSensorData = async(data)=>{
  return await DpSensorDataHelper.bulkCreate(data)
}

const updateDpSensorData = async(data)=>{
  return await DpSensorDataHelper.update(data)
}

const deleteDpSensorData = async(id)=>{
  return await DpSensorDataHelper.delete(id)
}

const getDpSensorData = async(id)=>{
  return await DpSensorDataHelper.findByPk(id);
}

const getAllDpSensorData = async()=>{
  return await DpSensorDataHelper.findAll();
}

module.exports = {
  insertDpSensorData,
  updateDpSensorData,
  deleteDpSensorData,
  getDpSensorData,
  getAllDpSensorData,
  insertMultipleDpSensorData
}