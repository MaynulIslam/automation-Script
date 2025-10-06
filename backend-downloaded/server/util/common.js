const debug = require('debug')('server:api:common');
const util = require('util');
const Sequelize = require('sequelize');
const execPromisify = util.promisify(require('child_process').exec);
const { exec, execSync } = require("child_process");

const fs = require('fs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const xml2js = require('xml2js');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const mqtt = require('mqtt')

const constant = require('./constant');

module.exports.client = mqtt.connect(`mqtt://${process.env.MQTT_URL}:1883`);

module.exports.customException = (name, message, code) => {
  this.name = name
  this.message = message
  this.code = code
}

module.exports.cloneObject = function (obejct) {
  return JSON.parse(JSON.stringify(obejct));
};

module.exports.cloneObjectWithSchema = function (obejct, schema) {
  let results = {}; 
  for (let k of Object.keys(schema)) {
    results[k] = obejct[k]; 
  } 
  return results; 
};

module.exports.sendResponse = function (response, data, status, statusCode) {
  if (status) {
    response.status(statusCode).send({
      status: true,
      response: data
    });
  } else {
    response.status(statusCode).send({
      status: false,
      response: data
    });
  }
}

module.exports.sendObjectResponse = function (response, values, status, statusCode) {
  const paginationInfo = values.pagination ? { pagination: values.pagination } : {};

  if (status) {
    response.status(statusCode).send({
      status: true,
      [values.key]: values.data,
      ...paginationInfo,
    });
  } else {
    response.status(statusCode).send({
      status: false,
      data,
      ...paginationInfo,  //
    });
  }
}

module.exports.createSequelizeInstance = function(connectionString, databaseType) {
  return new Sequelize(connectionString, { dialect: databaseType });
}

module.exports.validateObject = function (arrParam) {
  arrParam.forEach(function (param) {
    if (param == undefined && typeof param != "object") {
      return false;
    }
  });
  return true;
}

module.exports.validateParams = function (arrParam) {
  try {
    arrParam.forEach(function (param) {
      debug("param", param)
      if (param == undefined || param.toString().trim() == "") {
        throw "Invalid params";
      }
    });
    return true;
  } catch (ex) {
    return false;
  }
}

module.exports.Shell = async (bash) => {
  for (let i = 0; i < bash.length; i++)
    await Command(bash[i][0], false, bash[i][1]);

}

module.exports.command = async (cmd, out, msg) => {
  try {
    const { stdout, stderr } = await exec(cmd);
    if (msg)
      Debug_Message(msg);
    if (out)
      return stdout;
  }
  catch (e) {
    Error_Message(e);
  }
}

module.exports.executeCommands = async (commands, output = []) => {
  for (let c of commands) {
    exec(c, {maxBuffer: 1024 * 500000}, (error, stdout, stderr) => {
      if (error) {
        console.log(`executeCommands error------------>:\n${error.message}`);
        return {
          status: false,
          error: constant.commandMessages.ERROR_IN_COMMAND_EXECUTION
        };
      }
      if (stderr) {
        console.log(`executeCommands stderr------------>:\n${stderr}`);
        return {
          status: false,
          error: constant.commandMessages.ERROR_IN_COMMAND_EXECUTION_OUTPUT
        };
      }
    });
  }
  return {
    status: true,
    data: output
  }
}

module.exports.executeCMDArray = async (commands, output = [], filter = 0) => {
  for (let cmd of commands) {
    const { stdout, stderr } = await execPromisify(cmd, {maxBuffer: 1024 * 500000});
    if(stderr){
      console.log("stderr------------------->", stderr)
    }
    if(stdout && stdout.length > 0){
      switch(filter){
        case 1: const out = stdout.trim().split('\n').filter(d => d.length > 0)
                output.push(out)
                break;
        default:
            debug('No filter added')
      }
    } else {
      output.push('')
    }
  }
  return {
    status: true,
    data: output
  }
}

module.exports.executeCommandsSync = async (commands, output = []) => {
  return await new Promise((resolve, reject) => {
    for (let c of commands) {

      try {
        let command_output = execSync(c, { maxBuffer: 1024 * 500000 });
        if(command_output){
          output.push(command_output.toString())
        }
      } catch (error) {
        console.log("command_output----------->", error)
        reject({
          status: false,
          error: constant.commandMessages.ERROR_IN_COMMAND_EXECUTION
        });
      }
    }
    resolve({
      status: true,
      data: output
    })
  })
}

// Initializing messages (in blue)
module.exports.bootMessage = (msg) => {
  // debug("\x1b[36m%s\x1b[0m" + msg);
  console.log("\x1b[36m%s\x1b[0m", msg);
}

// Debugging messages (in yellow)
module.exports.debugMessage = (msg) => {
  // Mutes messages if debugging is off
  // debug("\x1b[33m%s\x1b[0m" + msg);
  console.log("\x1b[33m%s\x1b[0m", msg);
}

// Success messages (in green)
module.exports.successMessage = (msg) => {
  // debug("\x1b[32m%s\x1b[0m" + msg);
  console.log("\x1b[32m%s\x1b[0m", msg);
}

// Error messages (in red)
module.exports.errorMessage = (msg) => {
  console.log("\x1b[31m%s\x1b[0m", msg);
}

module.exports.getFileExtensionForUpload = (type) => {
  switch (type) {
    case "1": // File upload for update device
      return {
        status: true,
        data: [".enc", ".tar.gz", ".gz", ".zip"]
      }
    case "2": // File upload for images
      return {
        status: true,
        data: [".png", ".jpg"]
      }
    default: // Error
      return {
        status: false,
        error: constant.fileExtensionMessages.ERROR_UNSUPPORTED_FILE_EXTENSION
      }
  }
}

module.exports.validatePassword = async(req_pass, db_pass) => {
  // need to add encryption logic and verify hash
  let result = await bcrypt.compareSync(req_pass, db_pass);

  if(result){
    return {
      status: true
    }
  } else {
    return {
      status: false
    }
  }
}

module.exports.getGasSensorENGUnitsNumber = (unit_str) => {
  switch (unit_str) {
    case 'NONE': return 0;
    case '% LEL': return 1;
    case '%': return 2;
    case 'PPM': return 3; 
    case '% LEL * 10': return 4; 
    case '% * 10': return 5; 
    case 'PPM * 10': return 6; 
    case '% LEL * 100': return 7; 
    case '% * 100': return 8;
    case 'PPM * 100': return 9; 
    default:
      return 3;
  }
}

module.exports.convertBinary = (string, type) => {
  switch (type) {
    case 'Decimal': 
      // Decimal
      return parseInt(string, 2);
    default:
      return 0;
  }
}

module.exports.convertNumArrayToStringArray = (num) => {
  return num.toString();
}

module.exports.getGASSensorName = (type) => {
  switch (type) {
    case 1: 
      return "CO, 100PPM";
    case 2: 
      return "CO, 500PPM";
    case 3: 
      return "CO, 1000PPM";
    case 4: 
      return "NO2, 10PPM";
    case 5: 
      return "NO, 100PPM";
    case 6: 
      return "NO, 500PPM";
    case 7: 
      return "NO, 1000PPM";
    case 8: 
      return "O2, 25%";
    case 9: 
      return "H2S, 25PPM";
    case 10: 
      return "H2S, 100PPM";
    case 11: 
      return "SO2, 10PPM";
    case 12: 
      return "SO2, 1000PPM";
    case 13: 
      return "CLO2, 3PPM";
    case 14: 
      return "CL2, 5PPM";
    case 15: 
      return "NH3, 100PPM";
    case 16: 
      return "CO2, 0.5%";
    case 17: 
      return "CO2, 2%";
    case 18: 
      return "CO2, 5%";
    case 19: 
      return "METHANE, %LEL";
    case 20: 
      return "PROPANE, %LEL";
    case 21: 
      return "HCN, 10PPM";
    case 22: 
      return "SO2, 20PPM";
    case 23: 
      return "CO, 25PPM";
    case 24: 
      return "NO2, 300PPM";
    case 25: 
      return "SO2, 3PPM";
    case 26: 
      return "SO2, 300PPM";
    case 27: 
      return "NO2, 5PPM";
    case 28: 
      return "SO2, 5PPM";
    default:
      return 0;
  }
}

module.exports.getUnits = (type) => {
  switch(type){
    case "Airflow":
      return ["Velocity", "Volumetric", "Mass"]
    case "GAS":
      return ["Concentration", "STEL", "TWA"]
    case "Temperature":
      return ["Ambient", "Work Limit", "WGBT"]
    case "Humidity":
      return ["Relative", "Density of Air"]
    case "Pressure":
      return ["Absolute"]
    default:
      return []
  }
}

module.exports.getAirflowMarqueeColorCode = (type) => {
  switch(type){
    case 0:
      // High Alarm
      return 1;
    case 1:
      // High Warning
      return 0;
    case 2:
      // Low Warning 
      return 0;
    case 3:
      // Low Alarm
      return 1;
    default:
      return 2;
  }
}

module.exports.getMarqueeColorCode = (type) => {
  switch(type){
    case 0:
      return 2;
    case 1:
      // High Alarm
      return 1;
    case 2:
      // High Warning
      return 0;
    case 4:
      // Low Warning
      return 0;
    case 8:
      // Low Alarm
      return 1;
    default:
      return 2;
  }
}

module.exports.getRoundOff = (value) => {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

module.exports.roundOff = (value, decimal) => {
  return Math.round((value + Number.EPSILON) * decimal) / decimal
}

module.exports.getDecToHex = (value, padding) => {
  value = Number(value).toString(16);
  padding = typeof padding === "undefined" || padding === null ? (padding = 2) : padding;

  while (value.length < padding) {
    value = "0" + value;
  }
  
  return value;
}

module.exports.getDecToBinary = (value, length) => {
  value = Number(value).toString(2);
  
  while (value.length < length) {
    value = "0" + value;
  }
  
  return value;
}

module.exports.getBintoHex = (value) => {
  value = parseInt(value, 2).toString(16).toUpperCase();;
  
  while (value.length < 4) {
    value = "0" + value;
  }
  
  return "0x" + value;
}

/**
 * Sleep function for certain ms
 *
 * @param {number} floatNumber - number of ms.
 * @return {function} - Returns timeout function.
 */
module.exports.sleep = ms => new Promise(r => setTimeout(r, ms));


//********************************************************************************************************************************************* */

const singlePrecisionBytesLength = 4; // 32 bits
const doublePrecisionBytesLength = 8; // 64 bits
const bitsInByte = 8;

/**
 * Converts the float number into its IEEE 754 binary representation.
 * @see: https://en.wikipedia.org/wiki/IEEE_754
 *
 * @param {number} floatNumber - float number in decimal format.
 * @param {number} byteLength - number of bytes to use to store the float number.
 * @return {string} - binary string representation of the float number.
 */
function floatAsBinaryString(floatNumber, byteLength) {
  let numberAsBinaryString = '';

  const arrayBuffer = new ArrayBuffer(byteLength);
  const dataView = new DataView(arrayBuffer);

  const byteOffset = 0;
  const littleEndian = false;

  if (byteLength === singlePrecisionBytesLength) {
    dataView.setFloat32(byteOffset, floatNumber, littleEndian);
  } else {
    dataView.setFloat64(byteOffset, floatNumber, littleEndian);
  }

  for (let byteIndex = 0; byteIndex < byteLength; byteIndex += 1) {
    let bits = dataView.getUint8(byteIndex).toString(2);
    if (bits.length < bitsInByte) {
      bits = new Array(bitsInByte - bits.length).fill('0').join('') + bits;
    }
    numberAsBinaryString += bits;
  }

  return numberAsBinaryString;
}

/**
 * Converts the float number into its IEEE 754 64-bits binary representation.
 *
 * @param {number} floatNumber - float number in decimal format.
 * @return {string} - 64 bits binary string representation of the float number.
 */
 module.exports.floatAs64BinaryString = (floatNumber) => {
  return floatAsBinaryString(floatNumber, doublePrecisionBytesLength);
}

/**
 * Converts the float number into its IEEE 754 32-bits binary representation.
 *
 * @param {number} floatNumber - float number in decimal format.
 * @return {string} - 32 bits binary string representation of the float number.
 */
module.exports.floatAs32BinaryString = (floatNumber) => {
  return floatAsBinaryString(floatNumber, singlePrecisionBytesLength);
}

module.exports.validatePassword = async(req_pass, db_pass) => {
  // need to add encryption logic and verify hash
  let result = await bcrypt.compareSync(req_pass, db_pass);

  if(result){
    return {
      status: true
    }
  } else {
    return {
      status: false
    }
  }
}

module.exports.hashPassword = async (plaintextPassword) =>{
  let hash ="";
  try{
    let salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(plaintextPassword, salt);
  } catch (error) {
    console.error(error)
  }
  return hash;
}

module.exports.parseDeviceInfo = (inputString) => {
  const lines = inputString.split('\n');

  if (lines.length !== 4) {
    return null; // Return null for invalid input format
  }

  const [unformattedMacId, manufacturer, moduleName, deviceName] = lines.map(line => line.replace(/\r/g, '').trim());
  let macId = unformattedMacId.replace(/-/g, ':');
  return {
    macId,
    manufacturer,
    moduleName,
    deviceName
  };
};

// Function to retrieve data from diag.xml for a given IP addr ess
module.exports.getDataFromDiagXml = async (ipAddress) =>{
  const url = `http://${ipAddress}/diag.xml`;

  try {
    const response = await axios.get(url);
    const xmlData = response.data;

    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlData, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.response);
        }
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports.getDataFromStatusXml = async (ipAddress) =>{
  const url = `http://${ipAddress}/status.xml`;

  try {
    const response = await axios.get(url);
    const xmlData = response.data;

    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlData, (err, result) => {
        if (err) {
          console.error('getDataFromStatusXml',err);
          reject(err);
        } else {
          resolve(result.response);
        }
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports.connectExternalComms = async (ip_address, body) =>{
  const url = `http://${ip_address}/api/externalcomms/connectExternalDevice`;
  try {
    const response = await axios.post(url, body, {
      timeout: 5000, // 5 second timeout
    });
    return response.data;
  } catch (error) {
    console.log('connectExternalComms error',error)
    throw error;
  }
}

module.exports.updateExternalComms = async (ip_address, body) =>{
  const url = `http://${ip_address}/api/externalcomms/updateExternalDeviceComms`;
  try {
    const response = await axios.put(url, body, {
      timeout: 5000, // 5 second timeout
    });
    return response;
  } catch (error) {
    console.info('updateExternalComms error',error)
    return error;
  }
}

module.exports.removeExternalComms = async (ip_address, body) =>{
  const url = `http://${ip_address}/api/externalcomms/deleteExternalDeviceComms`;
  try {
    console.info("removeExternalComms url",url, 'body',body); 
    const response = await axios.delete(url,{ data: body, timeout: 5000 } );
    console.log("removeExternalComms response",response)
    return response;
  } catch (error) {
    console.log('removeExternalComms error',error)
    return Promise.reject(error);
  }
}

module.exports.retrieveHostInfo = ()=> {
  try {
      const machine_id = fs.readFileSync('/etc/machine-id', 'utf8').trim();

      const mac_address = execSync(
          "cat /sys/class/net/$(ip route show default | awk '/default/ {print $5}')/address",
          { encoding: 'utf8' }
      ).trim();

      const cpu_info = execSync("cat /proc/cpuinfo | grep 'model name' | head -1", { encoding: 'utf8' })
          .split(':')[1]
          .trim();
        const combined_id = `${machine_id}-${mac_address}-${cpu_info}`;
    
      const host_id = crypto.createHash('sha256').update(combined_id).digest('hex');

      return {
          host_id,
          machine_id,
          mac_address,
          cpu_info
      }
  } catch (error) {
      console.error("error ->", error);
  }
}