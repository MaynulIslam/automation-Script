const common = require('../../util/common');
const constant = require('../../util/constant');
const { SensorRegulation } = require('../../model');

// Get all sensor regulations (optionally filter by regulatory_body)
exports.getAllSensorRegulations = async (req, res) => {
  try {
    const { regulatory_body } = req.query;
    const where = regulatory_body ? { fk_regulatory_body_id: regulatory_body } : {};
    const regulations = await SensorRegulation.findAll({ where });
    if (!regulations) {
      return common.sendResponse(res, constant.requestMessages.SENSOR_REGULATION_NOT_FOUND, false, 404);
    }
    common.sendResponse(res, {
      success: true,
      regulations,
    }, true, 200);
  } catch (error) {
    console.error('Error retrieving sensor regulations:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_SENSOR_REGULATIONS, false, 500);
  }
};

// Get a single sensor regulation by ID
exports.getSensorRegulationById = async (req, res) => {
  try {
    const { id } = req.params;
    const regulation = await SensorRegulation.findByPk(id);
    if (!regulation) {
      return common.sendResponse(res, constant.requestMessages.SENSOR_REGULATION_NOT_FOUND, false, 404);
    }
    common.sendResponse(res, {
      success: true,
      regulation,
    }, true, 200);
  } catch (error) {
    console.error('Error retrieving sensor regulation:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_SENSOR_REGULATION, false, 500);
  }
};

// Create a new sensor regulation
exports.createSensorRegulation = async (req, res) => {
  try {
    const data = req.body;
    const newRegulation = await SensorRegulation.create(data);
    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.SENSOR_REGULATION_CREATED.message,
      regulation: newRegulation,
    }, true, 201);
  } catch (error) {
    console.error('Error creating sensor regulation:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_INSERT_SENSOR_REGULATION, false, 500);
  }
};

// Update a sensor regulation by ID
exports.updateSensorRegulation = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const regulation = await SensorRegulation.findByPk(id);
    if (!regulation) {
      return common.sendResponse(res, constant.requestMessages.SENSOR_REGULATION_NOT_FOUND, false, 404);
    }
    await regulation.update(data);
    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.SENSOR_REGULATION_UPDATED.message,
      regulation,
    }, true, 200);
  } catch (error) {
    console.error('Error updating sensor regulation:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_UPDATE_SENSOR_REGULATION, false, 500);
  }
};

// Delete a sensor regulation by ID
exports.deleteSensorRegulation = async (req, res) => {
  try {
    const { id } = req.params;
    const regulation = await SensorRegulation.findByPk(id);
    if (!regulation) {
      return common.sendResponse(res, constant.requestMessages.SENSOR_REGULATION_NOT_FOUND, false, 404);
    }
    await regulation.destroy();
    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.SENSOR_REGULATION_DELETED.message,
    }, true, 200);
  } catch (error) {
    console.error('Error deleting sensor regulation:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_DELETE_SENSOR_REGULATION, false, 500);
  }
}; 