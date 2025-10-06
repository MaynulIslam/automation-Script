const DatabaseHelper = require('../../../util/databaseHelper');
const { AirflowSensorData } = require('../../../models/sensor-model/airflowsensordata');

const AirflowSensorDataHelper = new DatabaseHelper(AirflowSensorData);

const insertAirflowSensorData = async(data)=>{
  return await AirflowSensorDataHelper.create(data)
}

const insertMultipleAirflowSensorData = async(data)=>{
  return await AirflowSensorDataHelper.bulkCreate(data)
}

const updateAirflowSensorData = async(data)=>{
  return await AirflowSensorDataHelper.update(data)
}

const deleteAirflowSensorData = async(id)=>{
  return await AirflowSensorDataHelper.delete(id)
}

const getAirflowSensorData = async(id)=>{
  return await AirflowSensorDataHelper.findByPk(id);
}

const getAllAirflowSensorData = async()=>{
  return await AirflowSensorDataHelper.findAll();
}

module.exports = {
  insertAirflowSensorData,
  updateAirflowSensorData,
  deleteAirflowSensorData,
  getAirflowSensorData,
  getAllAirflowSensorData,
  insertMultipleAirflowSensorData
}