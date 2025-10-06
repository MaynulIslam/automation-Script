const { GasSensorCalibrationData } = require('../../model');
const DatabaseHelper = require('../util/databaseHelper');

const GasCalSensorDataHelper = new DatabaseHelper(GasSensorCalibrationData);

const insertGasCalSensorData = async (data) => {
  return await GasCalSensorDataHelper.create(data);
};

const bulkInsertGasCalSensorData = async (data) => {
  return await GasCalSensorDataHelper.bulkCreate(data);
};

const updateGasCalSensorData = async (id, data) => {
  return await GasCalSensorDataHelper.update(id, data);
};

const deleteGasCalSensorData = async (id) => {
  return await GasCalSensorDataHelper.delete(id);
};

const getGasCalSensorData = async (id) => {
  return await GasCalSensorDataHelper.findByPk(id);
};

const getAllGasCalSensorData = async () => {
  return await GasCalSensorDataHelper.findAll();
};

const getAllGasCalSensorDataByFilters = async () => {
    return await GasCalSensorDataHelper.findAll();
};

module.exports = {
  insertGasCalSensorData,
  bulkInsertGasCalSensorData,
  updateGasCalSensorData,
  deleteGasCalSensorData,
  getGasCalSensorData,
  getAllGasCalSensorData
};
