const common = require('../../util/common');
const constant = require('../../util/constant');
const deviceTypeDAL = require('./devicetype.helper');

exports.getDeviceType = async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch the device type from the database
    const deviceType = await deviceTypeDAL.getDeviceType(id);

    if (!deviceType) {
      return res.status(404).json({
        success: false,
        message: 'Device type not found.',
      });
    }

    res.status(200).json({
      success: true,
      deviceType,
    });
  } catch (error) {
    console.error('Error retrieving device type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve device type.',
    });
  }
};

exports.getDeviceTypes = async (req, res) => {
  try {
    // Fetch all device types from the database
    const deviceTypes = await deviceTypeDAL.getDeviceTypes();

    res.status(200).json({
      success: true,
      deviceTypes,
    });
  } catch (error) {
    console.error('Error retrieving device types:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve device types.',
    });
  }
};


exports.insertDeviceType = async (req, res) => {
  try {
    // Extract data from the request body
    const { manufacturer, type_name, type_code, comm_type, status } = req.body;

    // Create the device type record in the database
    const newDeviceType = await deviceTypeDAL.insertDeviceType({
      manufacturer,
      type_name,
      type_code,
      comm_type,
      status,
    });

    // Return a success response with the newly created device type data
    res.status(201).json({
      success: true,
      message: 'Device type created successfully!',
      deviceType: newDeviceType,
    });
  } catch (error) {
    console.error('Error inserting device type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to insert device type.',
    });
  }
};

exports.updateDeviceType = async (req, res) => {
  try {
    // Extract data from the request body
    const { id } = req.params;
    const { manufacturer, type_name, type_code, comm_type, status } = req.body;

    // Update the device type details in the database
    const updatedDeviceType = await deviceTypeDAL.updateDeviceType(id, {
      manufacturer,
      type_name,
      type_code,
      comm_type,
      status,
    });

    // If device type is not found, return an error response
    if (!updatedDeviceType) {
      return res.status(404).json({
        success: false,
        message: 'Device type not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Device type updated successfully!',
      deviceType: updatedDeviceType,
    });
  } catch (error) {
    console.error('Error updating device type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update device type.',
    });
  }
};

exports.deleteDeviceType = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the device type from the database
    const deletedDeviceType = await deviceTypeDAL.deleteDeviceType(id);

    // If device type is not found, return an error response
    if (!deletedDeviceType) {
      return res.status(404).json({
        success: false,
        message: 'Device type not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Device type deleted successfully!',
    });
  } catch (error) {
    console.error('Error deleting device type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete device type.',
    });
  }
};
