const DatabaseHelper = require('../../util/databaseHelper');
const { SensorType } = require('../../model');
const { QueryTypes } = require('sequelize');
const sequelize = require('../../config/database');

const sensorTypeHelper = new DatabaseHelper(SensorType);

const insertSensorType = async(data)=>{
  return await sensorTypeHelper.create(data)
}

const insertBulkSensorType = async(data)=>{
  return await sensorTypeHelper.bulkCreate(data)
}

const updateSensorType = async(id, data)=>{
  return await sensorTypeHelper.update(id, data)
}

const deleteSensorType = async(id)=>{
  return await sensorTypeHelper.delete(id)
}

const getSensorType = async(id)=>{
  return await sensorTypeHelper.findByPk(id);
}

const getAllSensorType = async()=>{
  return await sensorTypeHelper.findAll();
}

module.exports = {
    insertSensorType,
    updateSensorType,
    deleteSensorType,
    getSensorType,
    getAllSensorType,
    insertBulkSensorType
}