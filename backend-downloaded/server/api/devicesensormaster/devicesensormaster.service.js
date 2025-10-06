const common = require('../../util/common');
const constant = require('../../util/constant');
const deviceSensorDAL = require('./devicesensormaster.helper');

exports.getDeviceSensorData = async (req, res) => {
    try {
      // Get the device_id from the request query or params
      const device_id = req.params.device_id;
  
      // Call the DAL function to get device sensor data
      const deviceSensors = await deviceSensorDAL.getDeviceSensors(device_id);
      console.log("deviceSensors", deviceSensors);
      // Send the device sensor data as response
      res.status(200).json({
        success: true,
        data: deviceSensors,
        message: 'Device sensor data retrieved successfully.',
      });
    } catch (error) {
      console.error('Error retrieving device sensor data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve device sensor data.',
        error: error.message,
      });
    }
  };


  exports.getSensorList = async (req, res) => {
    try {
      // Get the device_id from the request query or params
      const { config_type, sensor_status  } = req.query;

      let where = {};
      if (config_type) {
        where.config_type = config_type;
      }
      if (sensor_status) {
        where.sensor_status = sensor_status;
      }

      const deviceSensors = await deviceSensorDAL.getSensorList(where);

      res.status(200).json({
        success: true,
        data: deviceSensors,
        message: 'Device sensor data retrieved successfully.',
      });
    } catch (error) {
      console.error('Error retrieving device sensor data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve device sensor data.',
        error: error.message,
      });
    }
  };