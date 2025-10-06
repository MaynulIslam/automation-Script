const calibrationRuleDAL = require('./calibrationrule.helper'); // Update with the correct path
const common = require('../../util/common');
const constant = require('../../util/constant');
const deviceSensorCalRuleDAL = require('../devicesensorcalrule/devicesensorcalrule.helper');

exports.getCalibrationRule = async (req, res) => {
  try {
    const { id } = req.params;
    const calibrationRule = await calibrationRuleDAL.getCalibrationRule(id);
    if (!calibrationRule) {
      return common.sendResponse(res, constant.requestMessages.RULE_NOT_FOUND, false, 404);
    }
    common.sendResponse(res, calibrationRule, true, 200);
  } catch (error) {
    console.error('Error retrieving calibration rule:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_RULE, false, 500);
  }
};

exports.getCalibrationRules = async (req, res) => {
  try {
    // const filterCriteria = { rule_status: 1 };
    let filterCriteria = {};

    if (req.query.rule_type) {
      filterCriteria.rule_type = req.query.rule_type;
    }

    const calibrationRules = await calibrationRuleDAL.getCalibrationRules(filterCriteria);
    common.sendResponse(res, calibrationRules, true, 200);
  } catch (error) {
    console.error('Error retrieving calibration rules:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_RULES, false, 500);
  }
};

exports.insertCalibrationRule = async (req, res) => {
  try {
    const { rule_name, rule_type, interval, rule_status, device_ids, sensor_ids, sensor_device_ids } = req.body;

    // Check for existing rules based on type
    if (rule_type === 2 && device_ids?.length > 0) {
      for (const device_id of device_ids) {
        const device_sensor_filter = { DeviceId: device_id, SensorTypeId: 0, status: 1 };
        const calibration_rules = await calibrationRuleDAL.getCalibrationRules({ rule_type: 2 }, device_sensor_filter);

        const ruleExists = calibration_rules.some(rule =>
          rule.dataValues.DeviceSensorCalRules?.some(deviceRule =>
            deviceRule.dataValues.DeviceId === device_id
          )
        );

        if (ruleExists) {
          return common.sendResponse(res, constant.requestMessages.DEVICE_CALIBRATION_RULES_ALREADY_EXIST, false, 500);
        }
      }
    }

    if (rule_type === 3 && sensor_device_ids?.length > 0) {
      for (const sensor_device_id of sensor_device_ids) {
        const device_sensor_filter = { serial_number: sensor_device_id.serial_number, status: 1 };
        const calibration_rules = await calibrationRuleDAL.getCalibrationRules({ rule_type: 3 }, device_sensor_filter);

        const ruleExists = calibration_rules.some(rule =>
          rule.dataValues.DeviceSensorCalRules?.some(deviceRule =>
            deviceRule.dataValues.serial_number === sensor_device_id.serial_number
          )
        );

        if (ruleExists) {
          return common.sendResponse(res, constant.requestMessages.SENSOR_CALIBRATION_RULES_ALREADY_EXIST, false, 500);
        }
      }
    }

    // Handle global rule
    if (rule_type === 1) {
      const global_rule = await calibrationRuleDAL.getCalibrationRules({ rule_type: 1 });
      if (global_rule?.length > 0) {
        return common.sendResponse(res, constant.requestMessages.GLOBAL_CALIBRATION_RULES_ALREADY_EXIST, false, 500);
      }

      const inserted_rule = await calibrationRuleDAL.insertCalibrationRule({
        rule_name, rule_type, interval, rule_status
      });
      return common.sendResponse(res, inserted_rule, true, 201, constant.requestMessages.CREATED_RULE_SUCCESSFULLY);
    }

    // Handle device and sensor rules
    const new_calibration_rule = await calibrationRuleDAL.insertCalibrationRule({
      rule_name, rule_type, interval, rule_status
    });

    if (!new_calibration_rule?.dataValues.id) {
      return common.sendResponse(res, constant.requestMessages.FAILED_TO_INSERT_RULE, false, 500);
    }

    // Insert device-specific rules
    if (rule_type === 2 && device_ids?.length > 0) {
      await Promise.all(device_ids.map(device_id =>
        deviceSensorCalRuleDAL.insertDeviceSensorCalRule({
          CalibrationRuleId: new_calibration_rule.dataValues.id,
          DeviceId: device_id,
          SensorTypeId: 0,
          DeviceSensorMasterId: 0,
          serial_number: 0,
          status: 1
        })
      ));
    }

    // Insert sensor-specific rules
    if (rule_type === 3 && sensor_device_ids?.length > 0) {
      await Promise.all(sensor_device_ids.map(sensor_device_id =>
        deviceSensorCalRuleDAL.insertDeviceSensorCalRule({
          CalibrationRuleId: new_calibration_rule.dataValues.id,
          DeviceId: sensor_device_id.device_id,
          SensorTypeId: sensor_device_id.sensor_type_id,
          serial_number: sensor_device_id.serial_number,
          DeviceSensorMasterId: sensor_device_id.sensor_id,
          status: 1
        })
      ));
    }

    return common.sendResponse(res, new_calibration_rule, true, 201, constant.requestMessages.CREATED_RULE_SUCCESSFULLY);

  } catch (error) {
    console.error('Error inserting calibration rule:', error);
    return common.sendResponse(res, constant.requestMessages.FAILED_TO_INSERT_RULE, false, 500);
  }
};

exports.updateCalibrationRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { rule_name, rule_type, interval, rule_status, device_ids, sensor_device_ids, is_change_status } = req.body;

    // Get existing rule
    const calibrationRule = await calibrationRuleDAL.getCalibrationRule(id);
    if (!calibrationRule) {
      return common.sendResponse(res, constant.requestMessages.RULE_NOT_FOUND, false, 404);
    }

    // Update basic rule information
    const updatedRuleData = {
      rule_name,
      rule_type,
      interval,
      rule_status
    };

    // For global rules or status changes, just update the rule
    if (rule_type === 1 || is_change_status) {
      await calibrationRuleDAL.updateCalibrationRule(id, updatedRuleData);
      return common.sendResponse(res, {
        success: true,
        message: constant.requestMessages.RULE_UPDATED_SUCCESSFULLY,
        calibrationRule: updatedRuleData,
      }, true, 200);
    }

    // For device or sensor rules, handle the associations
    await calibrationRuleDAL.updateCalibrationRule(id, updatedRuleData);

    // Deactivate existing device/sensor associations
    const existingRule = await calibrationRuleDAL.getCalibrationRules({ id });
    if (existingRule[0]?.DeviceSensorCalRules?.length > 0) {
      await Promise.all(existingRule[0].DeviceSensorCalRules.map(rule =>
        deviceSensorCalRuleDAL.updateDeviceSensorCalRule(rule.id, { status: 0 })
      ));
    }

    // Handle device-specific rules (rule_type 2)
    if (rule_type === 2 && device_ids?.length > 0) {
      // Check for existing active rules
      const hasExistingRules = await Promise.all(device_ids.map(async (device_id) => {
        const existingRules = await calibrationRuleDAL.getCalibrationRules(
          { rule_type: 2 },
          { DeviceId: device_id, SensorTypeId: 0, status: 1 }
        );
        return existingRules.some(rule =>
          rule.dataValues.DeviceSensorCalRules?.some(deviceRule =>
            deviceRule.dataValues.DeviceId === device_id
          )
        );
      }));

      if (hasExistingRules.some(exists => exists)) {
        return common.sendResponse(res, constant.requestMessages.DEVICE_CALIBRATION_RULES_ALREADY_EXIST, false, 500);
      }

      // Create new device associations
      await Promise.all(device_ids.map(device_id =>
        deviceSensorCalRuleDAL.insertDeviceSensorCalRule({
          CalibrationRuleId: id,
          DeviceId: device_id,
          SensorTypeId: 0,
          DeviceSensorMasterId: 0,
          serial_number: 0,
          status: 1
        })
      ));
    }

    // Handle sensor-specific rules (rule_type 3)
    if (rule_type === 3 && sensor_device_ids?.length > 0) {
      // Check for existing active rules
      const hasExistingRules = await Promise.all(sensor_device_ids.map(async (sensor_device_id) => {
        const existingRules = await calibrationRuleDAL.getCalibrationRules(
          { rule_type: 3 },
          { serial_number: sensor_device_id.serial_number, status: 1 }
        );
        return existingRules.some(rule =>
          rule.dataValues.DeviceSensorCalRules?.some(deviceRule =>
            deviceRule.dataValues.serial_number === sensor_device_id.serial_number
          )
        );
      }));

      if (hasExistingRules.some(exists => exists)) {
        return common.sendResponse(res, constant.requestMessages.SENSOR_CALIBRATION_RULES_ALREADY_EXIST, false, 500);
      }

      // Create new sensor associations
      await Promise.all(sensor_device_ids.map(sensor_device_id =>
        deviceSensorCalRuleDAL.insertDeviceSensorCalRule({
          CalibrationRuleId: id,
          DeviceId: sensor_device_id.device_id,
          SensorTypeId: sensor_device_id.sensor_type_id,
          serial_number: sensor_device_id.serial_number,
          DeviceSensorMasterId: sensor_device_id.sensor_id,
          status: 1
        })
      ));
    }

    return common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.RULE_UPDATED_SUCCESSFULLY,
      calibrationRule: updatedRuleData,
    }, true, 200);

  } catch (error) {
    console.error('Error updating calibration rule:', error);
    return common.sendResponse(res, constant.requestMessages.ERROR_RULE_UPDATE, false, 500);
  }
};

exports.deleteCalibrationRule = async (req, res) => {
  try {
    const { id } = req.params;

    const calibrationRule = await calibrationRuleDAL.getCalibrationRule(id);

    if (!calibrationRule) {
      return common.sendResponse(res, constant.requestMessages.RULE_NOT_FOUND, false, 404);
    }

    await calibrationRuleDAL.deleteCalibrationRule(id);

    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.RULE_DELETED_SUCCESSFULLY,
    }, true, 200);
  } catch (error) {
    console.error('Error deleting calibration rule:', error);
    common.sendResponse(res, constant.requestMessages.ERROR_RULE_DELETE, false, 500);
  }
};
