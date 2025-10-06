const DatabaseHelper = require('../../util/databaseHelper');
const { DeviceSensorCalRule, Device, SensorType, CalRule } = require('../../model');
const { options } = require('../user');

const deviceSensorCalRuleHelper = new DatabaseHelper(DeviceSensorCalRule);

const insertDeviceSensorCalRule = async (data) => {
    return await deviceSensorCalRuleHelper.create(data);
}

const updateDeviceSensorCalRule = async (id, data) => {
    return await deviceSensorCalRuleHelper.update(id, data);
}

const deleteDeviceSensorCalRule = async (id) => {
    return await deviceSensorCalRuleHelper.delete(id);
}

const getDeviceSensorCalRule = async (id) => {
    return await deviceSensorCalRuleHelper.findByPk(id);
}

const getDeviceSensorCalRules = async () => {
    return await deviceSensorCalRuleHelper.findByCriteriaSpecial(undefined,
        [
            {
                model: Device,
                required: true,
            },
            {
                model: SensorType,
                required: false,
            },
            {
                model: CalRule,
                required: false,
            }
        ]);
}

const getDeviceSensorCalRuleByCriteria = async (criteria) => {
    return await deviceSensorCalRuleHelper.findByCriteria(criteria);
}

module.exports = {
    insertDeviceSensorCalRule,
    updateDeviceSensorCalRule,
    deleteDeviceSensorCalRule,
    getDeviceSensorCalRule,
    getDeviceSensorCalRules,
    getDeviceSensorCalRuleByCriteria
}
