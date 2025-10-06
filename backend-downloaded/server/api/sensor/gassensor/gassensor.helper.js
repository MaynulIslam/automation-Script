const DatabaseHelper = require('../../../util/databaseHelper');
const { GasSensorData } = require('../../../models/sensor-model');

const GasSensorDataHelper = new DatabaseHelper(GasSensorData);

const insertGasSensorData = async(data)=>{
  return await GasSensorDataHelper.create(data)
}

const insertMultipleGasSensorData = async(data)=>{
  return await GasSensorDataHelper.bulkCreate(data)
}

const updateGasSensorData = async(data)=>{
  return await GasSensorDataHelper.update(data)
}

const deleteGasSensorData = async(id)=>{
  return await GasSensorDataHelper.delete(id)
}

const getGasSensorData = async(id)=>{
  return await GasSensorDataHelper.findByPk(id);
}

const getAllGasSensorData = async()=>{
  return await GasSensorDataHelper.findAll();
}

module.exports = {
  insertGasSensorData,
  updateGasSensorData,
  deleteGasSensorData,
  getGasSensorData,
  getAllGasSensorData,
  insertMultipleGasSensorData
}