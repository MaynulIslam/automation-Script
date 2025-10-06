const DatabaseHelper = require('../../util/databaseHelper');
const Sequelize = require('sequelize');
const { CalRule, DeviceSensorCalRule, Device, SensorType, DeviceSensorMaster } = require('../../model');
const sequelize = require('../../config/database');

const calibrationRuleHelper = new DatabaseHelper(CalRule);

const insertCalibrationRule = async(data) => {
    return await calibrationRuleHelper.create(data);
}

const updateCalibrationRule = async(id, data) => {
    return await calibrationRuleHelper.update(id, data);
}

const deleteCalibrationRule = async(id) => {
    return await calibrationRuleHelper.delete(id);
}

const getCalibrationRule = async(id) => {
    return await calibrationRuleHelper.findByPk(id);
}

// const getCalibrationRules = async (filterCriteria) => {
//   const whereClause = Object.keys(filterCriteria).length === 0 ? '' : `WHERE ${Object.keys(filterCriteria).map(key => `${key} = :${key}`).join(' AND ')}`;

//   const query = `
//    SELECT
//     "CalibrationRules".*,
//     "DeviceSensorCalRules".*,
//     "Devices".id AS device_id,
//     "Devices".device_name,
//     "SensorTypes".*,
//     "DeviceSensorMasters".*
//     FROM "CalibrationRules"
//     LEFT JOIN "DeviceSensorCalRules" ON "CalibrationRules".id = "DeviceSensorCalRules"."CalibrationRuleId" AND "DeviceSensorCalRules".status = 1
//     LEFT JOIN "Devices" ON "DeviceSensorCalRules"."DeviceId" = "Devices".id
//     LEFT JOIN "SensorTypes" ON "DeviceSensorCalRules"."SensorTypeId" = "SensorTypes".id
//     LEFT JOIN "DeviceSensorMasters" ON "DeviceSensorCalRules".serial_number = "DeviceSensorMasters".serial_number
//     ${whereClause}
//  ORDER BY "CalibrationRules".id DESC 
//   `;

//   const replacements = filterCriteria;
//   console.info('query--->',query);
//   return await sequelize.query(query, {
//     type: sequelize.QueryTypes.SELECT
//   });
// };

const getCalibrationRules = async (filterCriteria = {}, deviceSensorFilter={}) => {

  const whereClause = Object.keys(filterCriteria).length === 0 ? {} : filterCriteria;
  const deviceSensorFilterClause = Object.keys(filterCriteria).length === 0 ? { status: 1 } : deviceSensorFilter;
    const queryOptions = {
      where: whereClause,
      include: [
        {
          model: DeviceSensorCalRule,
          where: deviceSensorFilterClause,
          required: false,
          include: [
            {
              model: Device,
              required: false,
              attributes: ['id', 'device_name', 'ip_address', 'device_type_id', 'device_config', 'mac_id'],
            },
            {
              model: SensorType,
              required: false,
            },
            {
              model: DeviceSensorMaster,
              required: false,
              as: 'DeviceSensorMaster',
              attributes: ['sensor_id', 'serial_number', 'location'],
            
            }
          ]
        },
      ],
      order: [
        ['id', 'DESC']
      ]
    };
    return await calibrationRuleHelper.findByCriteria(queryOptions);
  }

const getCalibrationRuleByName = async(rule_name) => {
    const criteria = { where: { rule_name: rule_name } };
    return await calibrationRuleHelper.findByCriteria(criteria);
}

const getCalibrationRuleByType = async(rule_type) => {
    const criteria = { where: { rule_type: rule_type } };
    return await calibrationRuleHelper.findByCriteria(criteria);
}

module.exports = {
    insertCalibrationRule,
    updateCalibrationRule,
    deleteCalibrationRule,
    getCalibrationRule,
    getCalibrationRules,
    getCalibrationRuleByName,
    getCalibrationRuleByType
}