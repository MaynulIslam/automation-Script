const { Op } = require('sequelize');
const DatabaseHelper = require('../../util/databaseHelper');
const {AlarmLogs, AlarmReport, Device, DeviceSensorMaster } = require('../../model');

const sensorAlarmHelper = new DatabaseHelper(AlarmLogs);
const alarmReportHelper = new DatabaseHelper(AlarmReport);


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

const getAllAlarmReports = async ({ criteria = null } = {}) => {
  try {
      let queryOptions = { where: {} };
      
      if (criteria.from_date && criteria.to_date) {
        queryOptions.where.createdAt = {
            [Op.gte]: new Date(criteria.from_date), 
            [Op.lte]: new Date(criteria.to_date),   
        };
    }
      return await alarmReportHelper.findByCriteria(queryOptions);
  } catch (error) {
      console.error("Error in getAllAlarmReports:", error);
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


  
module.exports = {
  getTotalCount,
  getSensorAlarm,
  getAllSensorAlarm,
  getUniqueDeviceCount,
  getSensorAlarmById,
  getAllAlarmReports
};