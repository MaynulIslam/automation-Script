const analyticsDAL = require('./analytics.helper'); // Update with the correct path
const common = require('../../util/common');
const constant = require('../../util/constant');

exports.getVigilanteAQSOverview = async(request, response) => {
    const sensor_data = await analyticsDAL.getSensorData()
}