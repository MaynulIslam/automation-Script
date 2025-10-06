const DatabaseHelper = require('../../util/databaseHelper');
const Sequelize = require('sequelize');
const { CalRule, DeviceSensorCalRule, Device, SensorType, DeviceSensorMaster } = require('../../model');
const sequelize = require('../../config/database');

const analyticsHelper = new DatabaseHelper(CalRule);

const getGasSensorDiagData = async(data) => {
    return await analyticsHelper.create(data);
}

module.exports = {
    getGasSensorDiagData
}