const common = require('../../util/common');
const constant = require('../../util/constant');
const airflowDAL = require('./airflowsensor.helper');

exports.getAirflowSensorData = async (req, res) => {
  try {
    const airflowSensorData = await airflowDAL.getAllAirflowSensorData();
    const values = { key: "airflowsensor", data: airflowSensorData };
    common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error("error", error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve Airflow Sensor Data.',
    });
  }
}
