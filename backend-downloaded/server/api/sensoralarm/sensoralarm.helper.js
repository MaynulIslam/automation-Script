const { Op } = require('sequelize');
const DatabaseHelper = require('../../util/databaseHelper');
const {AlarmLogs, AlarmReport, Device, DeviceSensorMaster } = require('../../model');

const sensorAlarmHelper = new DatabaseHelper(AlarmLogs);
const alarmReportHelper = new DatabaseHelper(AlarmReport);


const insertSensorAlarm = async (data) => {
  return await sensorAlarmHelper.create(data);
};

const bulkInsertSensorAlarm = async (data) => {
  return await sensorAlarmHelper.bulkCreate(data);
};

const updateSensorAlarm = async (id, data) => {
  return await sensorAlarmHelper.update(id, data);
};

const deleteSensorAlarm = async (id) => {
  return await sensorAlarmHelper.delete(id);
};

const getSensorAlarm = async (id) => {
  return await sensorAlarmHelper.findByPk(id);
};

const getSensorAlarmById = async (id) => {
  return await sensorAlarmHelper.findOne({
      sensor_alarm_id: id
    });
};


const getUniqueDeviceCount = async () => {
  try {
    return await sensorAlarmHelper.getUniqueColumnCount('device_id');
  } catch (error) {
    throw new Error(`Error getting unique device count: ${error.message}`);
  }
};

const getAllSensorAlarm = async ({ criteria = null } = {}) => {
  try {
      let queryOptions = {
          order: [['sensor_alarm_id', 'DESC']], // Order by sensor_alarm_id in descending order,
          where: {
            alarm_message: { [Op.notIn]: ['Normal Operation', 'Sensor Initializing'] } // Add default condition
          }
      };
      
      if (criteria && (criteria.device_id || criteria.sensor_id)) {
          // Add conditions to where clause if device_id or sensor_id are present in criteria
          queryOptions.where = {};
          if (criteria.device_id) {
              queryOptions.where.device_id = criteria.device_id;
          }
          if (criteria.sensor_id) {
              queryOptions.where.sensor_id = criteria.sensor_id;
          }
          // if (criteria.category) {
          //   queryOptions.where.category = criteria.category;
          // }
          // if (criteria.subcategory) {
          //   queryOptions.where.subcategory = criteria.subcategory;
          // }
      }

      
      let options = [
          {
            model: Device,
            required: true,
          },
          {
            model: DeviceSensorMaster,
            required: true,
          }
        ];

      return await sensorAlarmHelper.findByCriteria(queryOptions, options);
  } catch (error) {
      console.error("Error in getAllSensorAlarm:", error);
      throw error;
  }
};

const getAllSensorAlarmPagination = async ({ criteria = null, limit = null, offset = null } = {}) => {
  try {
      let queryOptions = {
          order: [['sensor_alarm_id', 'DESC']]
      };
      
      if (limit) {
          queryOptions.limit = limit;
      }

      if (offset) {
          queryOptions.offset = offset;
      }

      if (criteria && (criteria.device_id || criteria.sensor_id)) {
          queryOptions.where = {};
          if (criteria.device_id) {
              queryOptions.where.device_id = criteria.device_id;
          }
          if (criteria.sensor_id) {
              queryOptions.where.sensor_id = criteria.sensor_id;
          }
      }

      let options = [
          {
              model: Device,
              required: true,
          },
          {
              model: DeviceSensorMaster,
              required: true,
          }
      ];

      return await sensorAlarmHelper.findByCriteria(queryOptions, options);
  } catch (error) {
      console.error("Error in getAllSensorAlarm:", error);
      throw error;
  }
};

const getTotalCount = async (criteria) => {
  let countOptions = {
    where: {}
  };

  if (criteria && criteria.device_id) {
    countOptions.where.device_id = criteria.device_id;
  }

  if (criteria && criteria.sensor_id) {
    countOptions.where.sensor_id = criteria.sensor_id;
  }


  if (Object.keys(countOptions.where).length === 0) {
    return await sensorAlarmHelper.count({});
  } else {
    return await sensorAlarmHelper.count(countOptions);
  }
};

const updateSensorAlarmByKey = async (key, value, data) => {
  return await sensorAlarmHelper.updateByKey(key, value, data);
};
  
module.exports = {
  getTotalCount,
  insertSensorAlarm,
  bulkInsertSensorAlarm,
  updateSensorAlarm,
  deleteSensorAlarm,
  getSensorAlarm,
  getAllSensorAlarm,
  getUniqueDeviceCount,
  getSensorAlarmById,
  updateSensorAlarmByKey
};