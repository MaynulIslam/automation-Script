const os = require('os');
const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const common = require('../../util/common');
const constant = require('../../util/constant');
const settingsDAL = require('./settings.helper');

exports.getSettings = async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch the settings from the database
    const settings = await settingsDAL.getSettings(id);

    common.sendResponse(res, {
      success: true,
      settings,
    }, true, 200);
  } catch (error) {
    console.error('Error retrieving settings:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_SETTINGS, false, 500);
  }
};

exports.getAllSettings = async (req, res) => {
  try {
    // Fetch the settings from the database
    const settings = await settingsDAL.getAllSettings();
    if (!settings) {
      return common.sendResponse(res, constant.requestMessages.SETTINGS_NOT_FOUND, false, 404);
    }

    common.sendResponse(res, {
      success: true,
      settings,
    }, true, 200);
  } catch (error) {
    console.error('Error retrieving settings:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_SETTINGS, false, 500);
  }
};

exports.insertSettings = async (req, res) => {
  try {
    // Extract data from the request body
    const { device_name, ip_address, sw_version, poll, status } = req.body;

    // Create the settings record in the database
    const newSettings = await settingsDAL.insertSettings({ device_name, ip_address, sw_version, poll, status });

    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.SETTINGS_CREATED.message,
      settings: newSettings,
    }, true, 201);
  } catch (error) {
    // If there's an error during the insertion process, handle it here
    console.error("Error inserting settings:", error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_INSERT_SETTINGS, false, 500);
  }
};

exports.updateSettings = async (req, res) => {
  try {
    // Extract data from the request body
    const { id } = req.params;
    const { 
      device_name, ip_address, sw_version, poll, status, is_demo_mode,
      // SMTP fields
      smtp_enabled, smtp_host, smtp_port, smtp_secure, smtp_auth_user, 
      smtp_auth_pass, smtp_from_email, smtp_from_name, smtp_encryption,
      smtp_connection_timeout, smtp_debug
    } = req.body;

    console.info('id------->', id);
    let getSettings = await settingsDAL.getSettings(id);
    let existingSettings = getSettings.dataValues;

    if (!existingSettings) {
      return common.sendResponse(res, constant.requestMessages.SETTINGS_NOT_FOUND, false, 404);
    }

    // Update general settings
    existingSettings.device_name = device_name ? device_name : existingSettings.device_name;
    existingSettings.ip_address = ip_address ? ip_address : existingSettings.ip_address;
    existingSettings.sw_version = sw_version ? sw_version : existingSettings.sw_version;
    existingSettings.poll = poll  ? poll : existingSettings.poll;
    existingSettings.status = status  ? status : existingSettings.status;
    existingSettings.is_demo_mode = is_demo_mode !=undefined  ? is_demo_mode : existingSettings.is_demo_mode;
    
    // Update SMTP settings
    if (smtp_enabled !== undefined) existingSettings.smtp_enabled = smtp_enabled;
    if (smtp_host !== undefined) existingSettings.smtp_host = smtp_host;
    if (smtp_port !== undefined) existingSettings.smtp_port = smtp_port;
    if (smtp_secure !== undefined) existingSettings.smtp_secure = smtp_secure;
    if (smtp_auth_user !== undefined) existingSettings.smtp_auth_user = smtp_auth_user;
    if (smtp_auth_pass !== undefined) existingSettings.smtp_auth_pass = smtp_auth_pass;
    if (smtp_from_email !== undefined) existingSettings.smtp_from_email = smtp_from_email;
    if (smtp_from_name !== undefined) existingSettings.smtp_from_name = smtp_from_name;
    if (smtp_encryption !== undefined) existingSettings.smtp_encryption = smtp_encryption;
    if (smtp_connection_timeout !== undefined) existingSettings.smtp_connection_timeout = smtp_connection_timeout;
    if (smtp_debug !== undefined) existingSettings.smtp_debug = smtp_debug;

    // Save the updated settings record to the database
    console.info('existingSettings------>', existingSettings);
    await settingsDAL.updateSettings(id, existingSettings);

    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.SETTINGS_UPDATED.message,
      settings: existingSettings,
    }, true, 200);
  } catch (error) {
    console.error('Error updating settings:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_UPDATE_SETTINGS, false, 500);
  }
};


// Helper function to convert netmask to CIDR notation
function netmaskToCIDR(netmask) {
  const parts = netmask.split('.');
  const binary = parts
    .map(part => parseInt(part)
      .toString(2)
      .padStart(8, '0'))
    .join('');
  return binary.split('1').length - 1;
}
exports.updateNetworkSettings = async (req, res) => {
  try {
    // Extract data from the request body
    const { id } = req.params;
    const { 
      network_type,
      ip_address, 
      mac_id,
      netmask,
      gateway,
      primaryDNS,
      secondaryDNS
    } = req.body;

    console.info('id------->', id);
    
    // Get existing settings
    let getSettings = await settingsDAL.getSettings(id);
    let existingSettings = getSettings.dataValues;

    // Check if settings exist
    if (!existingSettings) {
      return common.sendResponse(res, constant.requestMessages.SETTINGS_NOT_FOUND, false, 404);
    }

    // Update settings with new values, keeping existing ones if not provided
    existingSettings.network_type = network_type ? network_type : existingSettings.network_type;
    existingSettings.ip_address = ip_address ? ip_address : existingSettings.ip_address;
    existingSettings.mac_id = mac_id ? mac_id : existingSettings.mac_id;
    existingSettings.netmask = netmask ? netmask : existingSettings.netmask;
    existingSettings.gateway = gateway ? gateway : existingSettings.gateway;
    existingSettings.primaryDNS = primaryDNS ? primaryDNS : existingSettings.primaryDNS;
    existingSettings.secondaryDNS = secondaryDNS ? secondaryDNS : existingSettings.secondaryDNS;

    // Generate netplan configuration
    const netplanConfig = {
      network: {
        version: 2,
        renderer: "networkd",
        ethernets: {
          eth0: network_type === 'DHCP' ? {
            dhcp4: true,
            nameservers: {
              addresses: [primaryDNS, secondaryDNS]
            }
          } : {
            dhcp4: false,
            addresses: [`${ip_address}/${netmaskToCIDR(netmask)}`],
            gateway4: gateway,
            nameservers: {
              addresses: [primaryDNS, secondaryDNS]
            }
          }
        }
      }
    };

    // Convert config to YAML and write to file
    const yaml = require('js-yaml');
    const netplanYaml = yaml.dump(netplanConfig);
    
    try {
      // Backup existing configuration
      await execPromise('sudo cp /etc/netplan/50-cloud-init.yaml /etc/netplan/50-cloud-init.yaml.backup');
      
      // Write new configuration
      await fs.writeFile('/etc/netplan/50-cloud-init.yaml', netplanYaml);
      
      // Apply network changes
      // await execPromise('sudo netplan apply');
      
      // Save to database
      await settingsDAL.updateSettings(id, existingSettings);

      // Send success response
      return common.sendResponse(res, {
        success: true,
        message: constant.requestMessages.SETTINGS_UPDATED.message,
        settings: existingSettings,
      }, true, 200);
    } catch (error) {
      // If netplan update fails, restore backup
      await execPromise('sudo cp /etc/netplan/50-cloud-init.yaml.backup /etc/netplan/50-cloud-init.yaml');
      await execPromise('sudo netplan apply');
      throw new Error('Failed to update network configuration: ' + error.message);
    }

  } catch (error) {
    console.error('Error updating network settings:', error);
    return common.sendResponse(res, constant.requestMessages.FAILED_TO_UPDATE_SETTINGS, false, 500);
  }
};


exports.deleteSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const existingSettings = await settingsDAL.getSettings(id);

    // If settings are not found, return an error response
    if (!existingSettings) {
      return common.sendResponse(res, constant.requestMessages.SETTINGS_NOT_FOUND, false, 404);
    }

    // Delete the settings from the database
    await settingsDAL.deleteSettings();

    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.SETTINGS_DELETED.message,
    }, true, 200);
  } catch (error) {
    console.error('Error deleting settings:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_DELETE_SETTINGS, false, 500);
  }
};

exports.getSystemInfo = async (req, res) => {
  try {
    const isWindows = os.platform() === 'win32';
    
    if (isWindows) {
      return common.sendResponse(res, "eth0 interface not applicable on Windows", false, 400);
    }

    const networkInterfaces = os.networkInterfaces();

    const eth0 = networkInterfaces.eth0;

    if (!eth0) {
      return common.sendResponse(res, "eth0 interface not found", false, 404);
    }

    const eth0Info = eth0.map((interface) => ({
      address: interface.address,
      family: interface.family,
      mac: interface.mac,
      internal: interface.internal
    }));

    return common.sendResponse(res, eth0Info, true, 200);
    
  } catch (error) {
    console.error('Error retrieving system info:', error);
    return common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_SYSTEM_INFO, false, 500);
  }
};