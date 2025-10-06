const common = require('../../../util/common');
const constant = require('../../../util/constant');
const airflowDAL = require('./rhsensor.helper');

exports.getRhSensorData = async (req, res) => {
  try {
    const rhSensorData = await airflowDAL.getAllRhSensorData();
    const values = { key: "rhSensor", data: rhSensorData };
    common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error('Error retrieving device types:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve device types.',
    });
  }
};
