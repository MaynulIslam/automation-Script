const { Op } = require('sequelize');
const DatabaseHelper = require('../../util/databaseHelper');
const { DeviceSensorMaster, Device } = require('../../model');
const deviceSensorHelper = new DatabaseHelper(DeviceSensorMaster);

const getDeviceSensors = async (device_id) => {
    try {
        let queryOptions = {
            where: {
                device_id: Number(device_id)
            },
            raw: true // Ensuring raw query for simplicity
        };

        return await deviceSensorHelper.findByCriteria(queryOptions);
    } catch (error) {
        console.error("Error fetching device sensors:", error);
    }
};

const getSensorList = async(criteria) =>{
    try {
        const queryOptions = {
            where: {
                sensor_type: {
                    [Op.ne]: null
                }
            },
            include: [{
                model: Device,
                required: true
            }],
            raw: true,
          };
        
          Object.keys(criteria).forEach(key => {
            if (criteria[key]) {
              queryOptions.where[key] = criteria[key];
            }
          });
        
        return await deviceSensorHelper.findByCriteria(queryOptions);
    } catch (error) {
        console.error("Error fetching device sensors:", error);
        throw error;
    }
}

module.exports = {
    getDeviceSensors,
    getSensorList
}