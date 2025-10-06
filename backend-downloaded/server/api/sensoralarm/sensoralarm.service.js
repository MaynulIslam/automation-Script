const common = require('../../util/common');
const constant = require('../../util/constant');
const sensoralarmDAL = require('./sensoralarm.helper');

exports.getSensorAlarmData = async (req, res) => {
  try {
    const sensorAlarmData = await sensoralarmDAL.getAllSensorAlarm();
    const formattedData = formatSensorAlarmData(sensorAlarmData);
    const values = { key: "sensorAlarm", data: formattedData };
    common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error('Error retrieving device types', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve device types.',
    });
  }
};

exports.getSensorAlarmDataPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;  // Default pageSize to 10 if not specified
    // Calculate the offset
    const offset = (page - 1) * pageSize;
    const totalCount = await sensoralarmDAL.getTotalCount();
    const sensorAlarmData = await sensoralarmDAL.getAllSensorAlarm({
      limit: pageSize,
      offset: offset
    });
    const formattedData = formatSensorAlarmData(sensorAlarmData);
    const values = {
      key: "sensorAlarm",
      data: formattedData, 
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalRecords: totalCount,
        totalPages: Math.ceil(totalCount / pageSize)
      }
    };
    common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error('Error getSensorAlarmData', error);
    res.status(500).json({
      success: false,
      message: 'Failed getSensorAlarmData',
    });
  }
};

exports.getSensorAlarmDataByDevice = async (req, res) => {
  try {
    let device_id = req.params.device_id;
    const sensorAlarmData = await sensoralarmDAL.getAllSensorAlarm({
      criteria: {
        device_id: device_id  // Pass device_id as part of criteria object
      }
    });
    const formattedData = formatSensorAlarmData(sensorAlarmData);
    const values = { key: "sensorAlarm", data: formattedData };

    common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error('Error retrieving device types', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve device types',
    });
  }
};

exports.getSensorAlarmDataByDevicePagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;  // Default pageSize to 10 if not specified

    // Calculate the offset
    const offset = (page - 1) * pageSize;

    const totalCount = await sensoralarmDAL.getCount({ device_id });

    let device_id = req.params.device_id;
    const sensorAlarmData = await sensoralarmDAL.getAllSensorAlarm({
      criteria: {
        device_id: device_id  // Pass device_id as part of criteria object
      },
      limit: pageSize,
      offset: offset
    });
    const formattedData = formatSensorAlarmData(sensorAlarmData);
    const values = {
      key: "sensorAlarm", data: formattedData, pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalRecords: totalCount,
        totalPages: Math.ceil(totalCount / pageSize)
      }
    };

    common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error('Error retrieving device types', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve device types',
    });
  }
};

exports.getSensorAlarmDataBySensor = async (req, res) => {
  try {
    let sensor_id = req.params.sensor_id;
    const sensorAlarmData = await sensoralarmDAL.getAllSensorAlarm({
      criteria: {
        sensor_id: sensor_id  // Pass device_id as part of criteria object
      }
    });
    const formattedData = formatSensorAlarmData(sensorAlarmData);
    const values = { key: "sensorAlarm", data: formattedData };
    common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error('Error retrieving sensor alarm data.', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sensor alarm data.',
    });
  }
};

const setAlarmStatus = (alarm_message) => {
  // Convert message to lowercase once
  const message = alarm_message.toLowerCase();

  // Define keywords that trigger High Alarm
  const highAlarmTriggers = ['alarm', 'span', 'calibration', 'blocked', 'failed'];

  // Check for warning first
  if (message.includes('warn')) {
    return 'warning';
  }

  // Check for sensor error
  if (message.includes('error')) {
    return 'alarm';
  }

  // Check for any high alarm triggers
  if (highAlarmTriggers.some(trigger => message.includes(trigger))) {
    return 'alarm';
  }

  // Check specific status messages
  const specificMessages = {
    'zero cal fault': 'alarm',
    'sensor disconnected': 'alarm',
    'sensor missing': 'alarm',
    'high gas alarm': 'alarm',
    'zero fault': 'alarm',
    'unknown fault': 'alarm',
    'sensor expired': 'warning',
    'high gas warn': 'warning',
  };

  return specificMessages[message] || 'normal';
};

const formatSensorAlarmData = (sensorAlarmData) => {
  return sensorAlarmData.map(alarm => ({
    sensor_alarm_id: alarm.sensor_alarm_id,
    sensor_id: alarm.sensor_id,
    alarm_type: alarm.alarm_type,
    alarm_level: alarm.alarm_level,
    alarm_message: alarm.alarm_message,
    category: alarm.category,
    subcategory: alarm.subcategory,
    status: setAlarmStatus(alarm.alarm_message),
    acknowledged: alarm.acknowledged,
    resolution_message: alarm.resolution_message,
    duration: alarm.duration,
    createdAt: alarm.createdAt,
    updatedAt: alarm.updatedAt,
    value: alarm.value,
    unit: alarm.unit,
    device: {
      id: alarm['Device.id'],
      device_name: alarm['Device.device_name'],
      ip_address: alarm['Device.ip_address'],
      mac_id: alarm['Device.mac_id'],
      org_id: alarm['Device.org_id'],
      ethip: alarm['Device.ethip'],
      tcpip: alarm['Device.tcpip'],
      manual_add: alarm['Device.manual_add'],
      legacy_auth_code: alarm['Device.legacy_auth_code'],
      status: alarm['Device.status'],
      createdAt: alarm['Device.createdAt'],
      updatedAt: alarm['Device.updatedAt'],
      device_type_id: alarm['Device.device_type_id']
    },
    device_sensor_master: {
      sensor_id: alarm['DeviceSensorMaster.sensor_id'],
      fk_device_id: alarm['DeviceSensorMaster.fk_device_id'],
      device_sensor_id: alarm['DeviceSensorMaster.device_sensor_id'],
      local_board: alarm['DeviceSensorMaster.local_board'],
      board: alarm['DeviceSensorMaster.board'],
      subport: alarm['DeviceSensorMaster.subport'],
      location: alarm['DeviceSensorMaster.location'],
      sensor_status: alarm['DeviceSensorMaster.sensor_status'],
      priority: alarm['DeviceSensorMaster.priority'],
      config_type: alarm['DeviceSensorMaster.config_type'],
      sensor_type: alarm['DeviceSensorMaster.sensor_type'],
      serial_number: alarm['DeviceSensorMaster.serial_number'],
      createdAt: alarm['DeviceSensorMaster.createdAt'],
      updatedAt: alarm['DeviceSensorMaster.updatedAt'],
      device_id: alarm['DeviceSensorMaster.device_id']
    }
  }));
};

exports.updateSensorAlarm = async (req, res) => {
  try {
    const { id } = req.params;
    const { acknowledged, status, alarm_message } = req.body;

    try {

      let existing_sensor_alarm = await sensoralarmDAL.getSensorAlarmById(id);
      existing_sensor_alarm.acknowledged = acknowledged;

      const sensorAlarmData = await sensoralarmDAL.updateSensorAlarmByKey('sensor_alarm_id', id, {acknowledged:  acknowledged, status: status, alarm_message: alarm_message});

      return common.sendResponse(
        res,
        {
          success: true,
          message: constant.requestMessages.SENSOR_ALARM_UPDATED_SUCCESSFULLY,
          sensorAlarmData,
        },
        true,
        200,
      );
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update sensor alarm.',
      });
    }

  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      success: false,
      message: 'Failed to update sensor alarm.',
    });
  }
};

exports.getAlarmDataByCategory = async (req, res) => {
  try {
    let category = req.query.category;
    let subcategory = req.query.subcategory;
    const sensorAlarmData = await sensoralarmDAL.getAllSensorAlarm({
      criteria: {
        category: category,
        subcategory: subcategory
      }
    });
    const formattedData = formatSensorAlarmData(sensorAlarmData);
    const values = { key: "sensorAlarm", data: {count: formattedData.length, data: formattedData}};
    common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error(constant.requestMessages.FAILED_TO_RETRIEVE_SENSOR_ALARM_DATA, error);
    res.status(500).json({
      success: false,
      message: constant.requestMessages.FAILED_TO_RETRIEVE_SENSOR_ALARM_DATA,
    });
  }
};

exports.getAlarmReport = async (req, res) => {
  try {
    let from_date = req.query.from_date;
    let to_date = req.query.to_date;
    const alarmReportData = await sensoralarmDAL.getAllAlarmReports({
      criteria: {
        from_date: from_date,
        to_date: to_date
      }
    });
    const values = { key: "alarmReport", data: alarmReportData };
    common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error(constant.requestMessages.FAILED_TO_RETRIEVE_SENSOR_ALARM_DATA.message, error);
    res.status(500).json({
      success: false,
      message: constant.requestMessages.FAILED_TO_RETRIEVE_SENSOR_ALARM_DATA,
    });
  }
}

