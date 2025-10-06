const common = require('../../../util/common');
const constant = require('../../../util/constant');
const dpDAL = require('./dpsensor.helper');

exports.getDpSensorData = async (req, res) => {
  try {
    const dpSensorData = await dpDAL.getAllDpSensorData();
    const values = { key: "dpSensor", data: dpSensorData };
    common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error('Error retrieving device types:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve device types.',
    });
  }
};
