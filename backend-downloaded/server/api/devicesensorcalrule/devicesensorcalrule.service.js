const deviceSensorCalRuleDAL = require('./devicesensorcalrule.helper'); // Update with the correct path
const common = require('../../util/common');
const constant = require('../../util/constant');

exports.getDeviceSensorCalRule = async (req, res) => {
  try {
    const { id } = req.params;
    const deviceSensorCalRule = await deviceSensorCalRuleDAL.getDeviceSensorCalRule(id);
    if (!deviceSensorCalRule) {
      return common.sendResponse(res, constant.requestMessages.RULE_NOT_FOUND, false, 404);
    }
    common.sendResponse(res, deviceSensorCalRule, true, 200);
  } catch (error) {
    console.error('Error retrieving device sensor calibration rule:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_RULE, false, 500);
  }
};

exports.getDeviceSensorCalRules = async (req, res) => {
  try {
    const deviceSensorCalRules = await deviceSensorCalRuleDAL.getDeviceSensorCalRules();
    common.sendResponse(res, deviceSensorCalRules, true, 200);
  } catch (error) {
    console.error('Error retrieving device sensor calibration rules:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_RULES, false, 500);
  }
};

exports.insertDeviceSensorCalRule = async (req, res) => {
  try {
    const { DeviceId, SensorTypeId, CalRuleId, status } = req.body;
    const newDeviceSensorCalRule = await deviceSensorCalRuleDAL.insertDeviceSensorCalRule({ DeviceId, SensorTypeId, CalRuleId, status });
    common.sendResponse(res, newDeviceSensorCalRule, true, 201, constant.requestMessages.CREATED_RULE_SUCCESSFULLY);
  } catch (error) {
    console.error('Error inserting device sensor calibration rule:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_INSERT_RULE, false, 500);
  }
};

exports.updateDeviceSensorCalRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeviceId, SensorTypeId, CalRuleId, status } = req.body;

    let deviceSensorCalRule = await deviceSensorCalRuleDAL.getDeviceSensorCalRule(id);

    if (!deviceSensorCalRule) {
      return common.sendResponse(res, constant.requestMessages.RULE_NOT_FOUND, false, 404);
    }

    deviceSensorCalRule = deviceSensorCalRule.get();
    deviceSensorCalRule.DeviceId = DeviceId;
    deviceSensorCalRule.SensorTypeId = SensorTypeId;
    deviceSensorCalRule.CalRuleId = CalRuleId;
    deviceSensorCalRule.status = status;

    await deviceSensorCalRuleDAL.updateDeviceSensorCalRule(deviceSensorCalRule.id, deviceSensorCalRule);

    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.RULE_UPDATED_SUCCESSFULLY,
      deviceSensorCalRule,
    }, true, 200);
  } catch (error) {
    console.error('Error updating device sensor calibration rule:', error);
    common.sendResponse(res, constant.requestMessages.ERROR_RULE_UPDATE, false, 500);
  }
};

exports.deleteDeviceSensorCalRule = async (req, res) => {
  try {
    const { id } = req.params;

    const deviceSensorCalRule = await deviceSensorCalRuleDAL.getDeviceSensorCalRule(id);

    if (!deviceSensorCalRule) {
      return common.sendResponse(res, constant.requestMessages.RULE_NOT_FOUND, false, 404);
    }

    await deviceSensorCalRuleDAL.deleteDeviceSensorCalRule(id);

    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.RULE_DELETED_SUCCESSFULLY,
    }, true, 200);
  } catch (error) {
    console.error('Error deleting device sensor calibration rule:', error);
    common.sendResponse(res, constant.requestMessages.ERROR_RULE_DELETE, false, 500);
  }
};
