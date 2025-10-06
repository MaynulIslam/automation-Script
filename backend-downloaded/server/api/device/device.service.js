const axios = require('axios');
const common = require('../../util/common');
const constant = require('../../util/constant');
const deviceDAL = require('./device.helper');
const sensorAlarmDAL = require('../sensoralarm/sensoralarm.helper');
const licenseService = require('../license/license.service');
const deviceSensorDAL = require('../devicesensormaster/devicesensormaster.helper');
const organizationDAL = require('../organization/organization.helper');

const { client } = require("../../util/common");
let discoverableDevices = {};

client.subscribe('maestrolink/system/discoverable', (topic, err) => {
  if (err) {
    console.error('Error subscribing to topic:', err);
  } else {
    console.log('Subscribed to topic:', topic);
  }
});

client.on('message', (topic, message) => {
  if (topic == 'maestrolink/system/discoverable') {
    discoverableDevices = JSON.parse(message);
  }
});

exports.getDevices = async (req, res) => {
  try {
    const devices = await deviceDAL.getDevices();
    const values = { key: "devices", data: devices };
    return common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error('Error retrieving devices:', error);
    return common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_DEVICES, false, 500);
  }
};

exports.getDeviceSensorData = async (req, res) => {
  try {
    const { id } = req.params;

    const deviceSensors = await deviceSensorDAL.getDeviceSensors(Number(id));
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

exports.getDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await deviceDAL.getDevice(id);
    if (!device) {
      return common.sendResponse(res, constant.requestMessages.DEVICE_NOT_FOUND, false, 404);
    }
    return common.sendResponse(res, device, true, 200);
  } catch (error) {
    console.error('Error retrieving device:', error);
    return common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_DEVICE, false, 500);
  }
};

exports.getDiscoverableDevice = async (req, res) => {
  try {
    const values = { key: "devices", data: [] };
    return common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error('Error retrieving device:', error);
    return common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_DEVICE, false, 500);
  }
};

exports.insertDevice = async (req, res) => {
  try {
    const { device_name, custom_time, global_unit, passcode, ip_address, netmask, gateway, primary_dns, secondary_dns, mac_id, status, username, password, ethip, tcpip, manual_add, device_type_id, equipment_number_1, equipment_number_2, custom_field_id, unit_number, host_ip } = req.body;
    const legacy_auth_code = btoa(`${username}:${password}`); // replace
    const org_info = await organizationDAL.getAllOrganizations();
    let org_details;

    if(org_info && org_info.length > 0){
      org_details = org_info[0];
    }

    const { isLicensed, licensePlan } = await licenseService.checkActiveLicense();

    if (!isLicensed) {
      return common.sendResponse(res, constant.requestMessages.NO_ACTIVE_LICENSE, false, 403);
    }
    const features = JSON.parse(licensePlan.features);
    if (!licensePlan || !licensePlan.features) {
      return common.sendResponse(res, constant.requestMessages.LICENSE_PLAN_NOT_FOUND, false, 403);
    }

    const devices = await deviceDAL.getDevices();

    if (devices.length >= features.maxDevices) {
      let device_max_limit_message = constant.requestMessages.LICENSE_DEVICE_LIMIT_REACHED.message;
      device_max_limit_message = device_max_limit_message.replaceAll('{deviceLimit}', licensePlan.name).replaceAll('{licensePlan}', licensePlan.name).replaceAll('{code}', licensePlan.code).replaceAll('{maxDevices}', features.maxDevices);
      return common.sendResponse(res, { message: device_max_limit_message, code: constant.requestMessages.LICENSE_DEVICE_LIMIT_REACHED.code }, false, 403);
    }
    let new_device
    try {
      new_device = await deviceDAL.insertDevice({ device_name, custom_time, global_unit, passcode, ip_address, netmask, gateway, primary_dns, secondary_dns, mac_id, status, password, ethip, tcpip, manual_add, device_type_id, legacy_auth_code, org_id: org_details.id, equipment_number_1, equipment_number_2, custom_field_id, unit_number });
    } catch (error) {
      console.error("error", error)
      return common.sendResponse(res,
        constant.requestMessages.FAILED_TO_INSERT_DEVICE,
        false,
        500
      );
    }
    let device_added_error_connecting_to_external_comms = false;
    let message;
    // conditional check on device type id for xml and mqtt 
    if (device_type_id >= 4) {
      // xml integration

    } else {
      // mqtt
      let device_details = {
        ip_address: host_ip,
        api_key: "TEST", // TODO : get from user
        manufacturer_name: "HGC",
        product_name: "duettoanalytics",
        product_type: "DA",
        manufacturer_sw_version: "0.7.0",
        manufacturer_hw_version: "1.0.0",
        status: true
      }
      try {
        await common.connectExternalComms(ip_address, device_details);
      } catch (error) {
        console.error('Error connecting to external comms:', error);
        device_added_error_connecting_to_external_comms = true;
      }
    }

    client.publish("maestrolink/system/add_devices", JSON.stringify(new_device));
    message = device_added_error_connecting_to_external_comms ? constant.requestMessages.DEVICE_ADDED_ERROR_CONNECTING_TO_EXTERNAL_COMMS : constant.requestMessages.DEVICE_CREATED_SUCCESSFULLY;
    
    return common.sendResponse(res, { new_device, message, status: true }, true, 201);
  } catch (error) {
    console.error('Error inserting device:', error);
    return common.sendResponse(res, constant.requestMessages.FAILED_TO_INSERT_DEVICE, false, 500);
  }
};

exports.insertDevices = async (req, res) => {
  try {
    const devices = Array.isArray(req.body) ? req.body : [req.body];
    const newDevices = await deviceDAL.bulkInsertDevice(devices);

    client.publish("maestrolink/system/add_devices", JSON.stringify(newDevices));
    return common.sendResponse(res, newDevices, true, 201, constant.requestMessages.DEVICES_CREATED_SUCCESSFULLY);
  } catch (error) {
    console.error('Error inserting device:', error);
    return common.sendResponse(res, constant.requestMessages.FAILED_TO_INSERT_DEVICE, false, 500);
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const { device_name, custom_time, global_unit, passcode, ip_address, netmask, gateway, primary_dns, secondary_dns, mac_id, status, username, password, ethip, tcpip, equipment_number_1, equipment_number_2, unit_number, custom_field_id } = req.body;

    const deviceData = await deviceDAL.getDevice(id);
    const device = deviceData.dataValues;
    if (!device) {
      return common.sendResponse(res, constant.requestMessages.DEVICE_NOT_FOUND, false, 404);
    }
    device.device_name = device_name;
    device.custom_time = custom_time;
    device.global_unit = global_unit;
    device.passcode = passcode;
    device.ip_address = ip_address;
    device.netmask = netmask;
    device.gateway = gateway;
    device.primary_dns = primary_dns;
    device.secondary_dns = secondary_dns;
    device.mac_id = mac_id;
    device.status = status;
    device.username = username;
    device.password = password;
    device.ethip = ethip;
    device.tcpip = tcpip;
    device.equipment_number_1 = equipment_number_1;
    device.equipment_number_2 = equipment_number_2;
    device.unit_number = unit_number;
    device.custom_field_id = custom_field_id;

    let updated_device = await deviceDAL.updateDevice(id, device);
    client.publish("maestrolink/system/update_device", JSON.stringify(device));
    return common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.DEVICE_UPDATED_SUCCESSFULLY,
      updated_device,
    }, true, 200);
  } catch (error) {
    console.error('Error updating device:', error);
    return common.sendResponse(res, constant.requestMessages.ERROR_DEVICE_UPDATE, false, 500);
  } //  
};

exports.deleteDevice = async (req, res) => {
  let is_db_deleted = false;

  try {
    const { id } = req.params;
    const { host_ip } = req.body;

    const device = await deviceDAL.getDevice(id);
    if (!device) {
      return common.sendResponse(res, constant.requestMessages.DEVICE_NOT_FOUND, false, 404);
    }
    await deviceDAL.deleteDevice(id);
    is_db_deleted = true;
    if (device.device_type_id >= 4) {
      // xml integration
      // handle xml clear
    } else {
      await common.removeExternalComms(device.ip_address, { ip_address: host_ip });
    }
    client.publish("maestrolink/system/remove_device", JSON.stringify(device));

    return common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.DEVICE_DELETED_SUCCESSFULLY,
    }, true, 200);
  } catch (error) {
    console.error('Error deleting device:', error);
    if (!is_db_deleted) {
      return common.sendResponse(res, constant.requestMessages.ERROR_DEVICE_DELETE, false, 500);
    } else {
      return common.sendResponse(res, constant.requestMessages.ERROR_DELETE_DEVICE_DB_OK, true, 200);
    }
  }
};

exports.deleteDevices = async (req, res) => {
  try {
    const { ids } = req.query;
    const deviceIds = ids.split(',').map(Number); // Split the comma-separated string and convert to an array of numbers
    console.log('Device IDs to delete:', deviceIds);

    await deviceDAL.deleteDevices(deviceIds);
    client.publish("maestrolink/system/remove_devices", JSON.stringify(deviceIds));
    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.DEVICE_DELETED_SUCCESSFULLY,
    }, true, 200);
  } catch (error) {
    console.error('Error deleting device:', error);
    common.sendResponse(res, constant.requestMessages.ERROR_DEVICE_DELETE, false, 500);
  }
}

exports.rediscoverDevices = async (req, res) => {
  try {
    const values = { key: "rediscover", data: true };
    client.publish("maestrolink/system/rediscover", "");
    return common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error('Error retrieving device:', error);
    return common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_DEVICE, false, 500);
  }
};

exports.getDeviceKeyFigures = async (req, res) => {
  try {
    const devices = await deviceDAL.getDevices();
    const sensorAlarms = await sensorAlarmDAL.getAllSensorAlarm();
    const deviceAlarmCount = await sensorAlarmDAL.getUniqueDeviceCount();

    // const discoverableDevices = Object.keys(discoverableDevices).length;
    let activeDevices = 0;
    devices.forEach(device => {
      if (discoverableDevices[device.ip_address]) {
        // is online
        activeDevices++;
      }
    })

    const values = {
      key: "keyFigures", data: {
        activeDevices: activeDevices,
        devices: devices.length,
        deviceAlarmCount: deviceAlarmCount,
        offline: devices.length - activeDevices
      }
    };
    return common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error("error", error);
  }
}

exports.checkDeviceConnection = async (req, res) => {
  try {
    const { ip_address, username, password } = req.body;
    const url = `http://${ip_address}/secure/network.htm`;
    console.info('url', url);
    // Create basic auth credentials
    const credentials = `${username}:${password}`;
    const encoded_credentials = Buffer.from(credentials).toString('base64');
    
    try {
      // Make the request from the backend
      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${encoded_credentials}`,
        },
        timeout: 10000, // 10 second timeout
      });

      const values = { 
        key: "connection_result", 
        data: {
          success: true,
          ...constant.requestMessages.DEVICE_CONNECTION_SUCCESS,
        }
      };
      
      return common.sendObjectResponse(res, values, true, 200);
    } catch (error) {
      if (error.response) {
        const values = { 
          key: "connection_result", 
          data: {
            success: false,
            error: error.response.data,
            status: error.response.status,
            ...constant.requestMessages.DEVICE_CONNECTION_FAILED
          }
        };
        return common.sendObjectResponse(res, values, false, error.response.status);
      } else if (error.request) {
        const values = { 
          key: "connection_result", 
          data: {
            success: false,
            message: constant.requestMessages.DEVICE_CONNECTION_TIMEOUT.message,
            error: 'Request timeout or network error',
            code: constant.requestMessages.DEVICE_CONNECTION_TIMEOUT.code
          }
        };
        return common.sendObjectResponse(res, values, false, 500);
      } else {
        const values = { 
          key: "connection_result", 
          data: {
            success: false,
            message: constant.requestMessages.DEVICE_CONNECTION_SETUP_ERROR.message,
            error: error.message,
            code: constant.requestMessages.DEVICE_CONNECTION_SETUP_ERROR.code
          }
        };
        return common.sendObjectResponse(res, values, false, 500);
      }
    }
  } catch (ex) {
    return common.sendResponse(res, ex.message, false, 500);
  }
};

// Export devices to CSV format
exports.exportDevicesCSV = async (req, res) => {
  try {
    const devices = await deviceDAL.getDevices();
    console.info('Devices found:', devices?.length);
    
    // Define CSV headers
    const csvHeaders = [
      'device_name',
      'ip_address', 
      'mac_id',
      'device_type_id',
      'equipment_number_1',
      'equipment_number_2',
      'unit_number',
      'custom_field_id',
      'status'
    ];
    
    if (!devices || devices.length === 0) {
      // Return empty CSV with headers if no devices
      const csvContent = csvHeaders.join(',');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="devices_export_${new Date().toISOString().split('T')[0]}.csv"`);
      return res.status(200).send(csvContent);
    }
    
    // Convert devices to CSV format - handle Sequelize dataValues
    const csvRows = devices.map(device => {
      const deviceData = device.dataValues || device;
      return [
        `"${(deviceData.device_name || '').replace(/"/g, '""')}"`,
        `"${(deviceData.ip_address || '').replace(/"/g, '""')}"`,
        `"${(deviceData.mac_id || '').replace(/"/g, '""')}"`,
        deviceData.device_type_id || '',
        `"${(deviceData.equipment_number_1 || '').replace(/"/g, '""')}"`,
        `"${(deviceData.equipment_number_2 || '').replace(/"/g, '""')}"`,
        `"${(deviceData.unit_number || '').replace(/"/g, '""')}"`,
        deviceData.custom_field_id || '',
        deviceData.status || 0
      ];
    });
    
    // Create CSV content
    const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
    
    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="devices_export_${new Date().toISOString().split('T')[0]}.csv"`);
    
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error('Error exporting devices to CSV:', error);
    return common.sendResponse(res, constant.requestMessages.EXPORT_FAILED || 'Export failed', false, 500);
  }
};

// Export devices to JSON format
exports.exportDevicesJSON = async (req, res) => {
  try {
    const devicesResult = await deviceDAL.getDevices();
    console.info('Raw devices result for JSON:', devicesResult);
    console.info('First device for JSON:', devicesResult?.[0]);
    
    // Extract actual devices array - Sequelize returns array directly
    const devices = Array.isArray(devicesResult) ? devicesResult : [];
    console.info('Processed devices array length for JSON:', devices.length);
    
    if (!devices || devices.length === 0) {
      // Return empty JSON structure if no devices
      const exportData = {
        export_date: new Date().toISOString(),
        total_devices: 0,
        devices: []
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="devices_export_${new Date().toISOString().split('T')[0]}.json"`);
      return res.status(200).json(exportData);
    }
    
    // Clean up device data for export - Sequelize models have dataValues
    const exportData = devices.map(device => {
      const deviceData = device.dataValues || device;
      console.log('Processing device for JSON:', deviceData);
      return {
        device_name: deviceData.device_name,
        ip_address: deviceData.ip_address,
        mac_id: deviceData.mac_id,
        device_type_id: deviceData.device_type_id,
        equipment_number_1: deviceData.equipment_number_1,
        equipment_number_2: deviceData.equipment_number_2,
        unit_number: deviceData.unit_number,
        custom_field_id: deviceData.custom_field_id,
        status: deviceData.status
      };
    });
    
    console.log('Final export data length:', exportData.length);
    
    // Set response headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="devices_export_${new Date().toISOString().split('T')[0]}.json"`);
    
    return res.status(200).json({
      export_date: new Date().toISOString(),
      total_devices: exportData.length,
      devices: exportData
    });
  } catch (error) {
    console.error('Error exporting devices to JSON:', error);
    return common.sendResponse(res, constant.requestMessages.EXPORT_FAILED || 'Export failed', false, 500);
  }
};

// Import devices from CSV/JSON
exports.importDevices = async (req, res) => {
  const sequelize = require('../../config/database'); // todo check if this is correct
  const transaction = await sequelize.transaction();
  
  try {
    const { devices, format } = req.body;
    
    if (!devices || !Array.isArray(devices)) {
      await transaction.rollback();
      return common.sendResponse(res, 'Invalid devices data provided', false, 400);
    }

    // Validate device data structure
    const requiredFields = ['device_name', 'ip_address', 'mac_id'];
    const validDevices = [];
    const errors = [];

    for (let i = 0; i < devices.length; i++) {
      const device = devices[i];
      const missingFields = requiredFields.filter(field => !device[field]);
      
      if (missingFields.length > 0) {
        errors.push(`Row ${i + 1}: Missing required fields: ${missingFields.join(', ')}`);
        continue;
      }

      // Check for duplicate IP addresses in the import data
      const duplicateIP = validDevices.find(d => d.ip_address === device.ip_address);
      if (duplicateIP) {
        errors.push(`Row ${i + 1}: Duplicate IP address ${device.ip_address} in import data`);
        continue;
      }

      // Check for duplicate MAC addresses in the import data
      const duplicateMAC = validDevices.find(d => d.mac_id === device.mac_id);
      if (duplicateMAC) {
        errors.push(`Row ${i + 1}: Duplicate MAC address ${device.mac_id} in import data`);
        continue;
      }

      // Set default values for all fields including required ones
      validDevices.push({
        device_name: device.device_name,
        ip_address: device.ip_address,
        mac_id: device.mac_id,
        device_type_id: device.device_type_id || 3, // Default to VAQS
        equipment_number_1: device.equipment_number_1 || '',
        equipment_number_2: device.equipment_number_2 || '',
        unit_number: device.unit_number || '',
        custom_field_id: device.custom_field_id || null,
        status: device.status || 0,
        manual_add: true,
        password: '',
        username: '',
        ethip: false,
        tcpip: true,
        // Required fields that were missing
        custom_time: device.custom_time || '',
        global_unit: device.global_unit || '',
        passcode: device.passcode || '',
        netmask: device.netmask || '',
        gateway: device.gateway || '',
        primary_dns: device.primary_dns || '',
        secondary_dns: device.secondary_dns || ''
      });
    }

    if (validDevices.length === 0) {
      await transaction.rollback();
      return common.sendResponse(res, { 
        message: 'No valid devices to import',
        errors: errors
      }, false, 400);
    }

    // Check license limits
    const { isLicensed, licensePlan } = await licenseService.checkActiveLicense();
    if (!isLicensed) {
      await transaction.rollback();
      return common.sendResponse(res, constant.requestMessages.NO_ACTIVE_LICENSE, false, 403);
    }

    const features = JSON.parse(licensePlan.features);
    const existingDevices = await deviceDAL.getDevices();
    const totalAfterImport = existingDevices.length + validDevices.length;

    if (totalAfterImport > features.maxDevices) {
      await transaction.rollback();
      return common.sendResponse(res, {
        message: `Import would exceed license limit. Current: ${existingDevices.length}, Importing: ${validDevices.length}, Limit: ${features.maxDevices}`,
        code: 'LICENSE_LIMIT_EXCEEDED'
      }, false, 403);
    }

    // Check for existing devices with same IP or MAC in the database
    const { Device } = require('../../model');
    const ips = validDevices.map(d => d.ip_address);
    const macs = validDevices.map(d => d.mac_id);
    
    const existingByIP = await Device.findAll({
      where: {
        ip_address: ips
      },
      transaction
    });
    
    const existingByMAC = await Device.findAll({
      where: {
        mac_id: macs
      },
      transaction
    });

    if (existingByIP.length > 0 || existingByMAC.length > 0) {
      await transaction.rollback();
      const conflictMessages = [];
      if (existingByIP.length > 0) {
        conflictMessages.push(`IP addresses already exist: ${existingByIP.map(d => d.ip_address).join(', ')}`);
      }
      if (existingByMAC.length > 0) {
        conflictMessages.push(`MAC addresses already exist: ${existingByMAC.map(d => d.mac_id).join(', ')}`);
      }
      
      return common.sendResponse(res, {
        message: 'Import failed due to conflicts',
        errors: conflictMessages
      }, false, 409);
    }

    // Get organization info
    const org_info = await organizationDAL.getAllOrganizations();
    const org_details = org_info && org_info.length > 0 ? org_info[0] : null;

    // Add organization info to each device
    const devicesWithOrg = validDevices.map(device => ({
      ...device,
      org_id: org_details?.id || null,
      legacy_auth_code: btoa(`${device.username}:${device.password}`)
    }));

    // Bulk insert devices within transaction
    const newDevices = await Device.bulkCreate(devicesWithOrg, { 
      transaction,
      validate: true,
      returning: true
    });
    
    // Try to connect to external comms for each device (non-blocking)
    const externalCommsErrors = [];
    for (const device of newDevices) {
      // Only try external comms for MQTT devices (device_type_id < 4)
      if (device.device_type_id < 4) {
        try {
          const device_details = {
            ip_address: req.get('host') || 'localhost', // Get host from request
            api_key: "TEST",
            manufacturer_name: "HGC", 
            product_name: "duettoanalytics",
            product_type: "DA",
            manufacturer_sw_version: "0.7.0",
            manufacturer_hw_version: "1.0.0",
            status: true
          };
          
          await common.connectExternalComms(device.ip_address, device_details);
        } catch (error) {
          console.error(`Error connecting to external comms for device ${device.device_name} (${device.ip_address}):`, error);
          externalCommsErrors.push(`${device.device_name} (${device.ip_address}): External communication failed`);
        }
      }
    }
    
    // Commit the transaction regardless of external comms status
    await transaction.commit();
    
    // Publish MQTT message for system update (after successful commit)
    client.publish("maestrolink/system/add_devices", JSON.stringify(newDevices));

    // Prepare response message
    let message = `Successfully imported ${newDevices.length} devices`;
    if (externalCommsErrors.length > 0) {
      message += `, but ${externalCommsErrors.length} device(s) had external communication issues`;
    }

    const response = {
      success: true,
      message: message,
      imported_count: newDevices.length,
      total_errors: errors.length + externalCommsErrors.length,
      validation_errors: errors.length > 0 ? errors : undefined,
      external_comms_errors: externalCommsErrors.length > 0 ? externalCommsErrors : undefined
    };

    return common.sendResponse(res, response, true, 201);

  } catch (error) {
    // Rollback transaction on any error
    await transaction.rollback();
    console.error('Error importing devices:', error);
    
    // Handle specific Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return common.sendResponse(res, {
        message: 'Import failed due to validation errors',
        errors: error.errors.map(e => `${e.path}: ${e.message}`)
      }, false, 400);
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return common.sendResponse(res, {
        message: 'Import failed due to duplicate entries',
        errors: error.errors.map(e => `${e.path}: ${e.message}`)
      }, false, 409);
    }
    
    return common.sendResponse(res, 'Import failed: ' + error.message, false, 500);
  }
};
