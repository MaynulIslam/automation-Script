const common = require('../../../util/common');
const constant = require('../../../util/constant');
const airflowDAL = require('./gassensor.helper');

exports.getGasSensorData = async (req, res) => {
  try {
    const gasSensorData = await airflowDAL.getAllGasSensorData();
    const values = { key: "gasSensor", data: gasSensorData };
    common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error('Error retrieving device types:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve device types.',
    });
  }
};
