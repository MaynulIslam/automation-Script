const { code, message } = require("./common");

const applicationConfiguration = {
  "environment": "prod",
  "realm_schema": 2,
  "software_version": "4.1.0",
  "modbus_software_version": 41,
  "API_KEY": "1",
  "DB_DATE_FORMAT": '%Y-%m-%d %H:%M:%S',
  "PAGE_SIZE": 10,
  "MEDIA_UPLOAD_DIR": '/tmp',
  // "MEDIA_UPLOAD_DIR": '/home/raj/maestro/media',
  "HOME_PATH": '/',
  // "HOME_PATH": '/home/raj/Desktop',
  "PROJECT_NAME": 'ModuDrive',
  "ENC_KEY": "M@e$troDigiT@lMine",
  "max_keypad_timeout": 20, // in seconds
  "chart_data_storage_time": 15, // in minutes
  "check_and_restart_actuator": 5, // in minutes
  "standard_sync_info_time": 1, // in minutes
  "sensors_db_sync_time": 3, // in minutes
  "remove_sensor_data_interval": 3 // in hours
};

const mqttTopics = [
  { 
    deviceType: 'VAQS',
    topics: [
      'SYSTEM_CONFIG',
      'DEVICE_CONFIG',
      'AIRFLOW_SENSORS',
      'GAS_SENSORS',
      'RH_SENSORS',
      'PRESSURE_SENSORS',
      'CUSTOM_SENSORS',
      'ACTUATOR_DATA',
      'MARQUEE_DATA'
    ]
  }
]

const recordStatus = {
  Active: true,
  Inactive: false
}

const alertLevel = {
  High: "High",
  Medium: "Medium",
  Low: "Low"
}

const sensorType = {
  airflow: "Airflow",
  gas: "Gas",
  climate: "Climate",
  pressure: "Pressure"
}

const configType = {
  airflow: 1,
  gas: 2,
  climate: 3,
  pressure: 4,
  system: 5,
  network: 6,
  actuator: 7,
  marquee: 8
}

const localPorts = [
  "ttymxc4",
  "ttymxc5",
  "ttymxc1",
  "ttymxc6",
];

const keypadSpiColor = {
  'Off': 0,
  'Green': 1,
  'Amber': 2,
  'Red': 3,
  'Flashing_Green': 4,
  'Flashing_Amber': 5,
  'Flashing_Red': 6
}

const requestMessages = {
  'ERR_API_KEY_NOT_FOUND': {
    code: 2001,
    message: 'api-key not found'
  },
  'ERR_INVALID_API_KEY': {
    code: 2002,
    message: 'Invalid api-key'
  },
  'ERR_UDID_NOT_FOUND': {
    code: 2003,
    message: 'UDID not found'
  },
  'ERR_DEVICE_TYPE_NOT_FOUND': {
    code: 2004,
    message: 'device-type not found'
  },
  'ERR_INVALID_SIGNIN_REQUEST': {
    code: 2009,
    message: 'Invalid SignIn request'
  },
  'ERR_INVALID_REQUEST_GET_USER_LIST': {
    code: 2044,
    message: 'Invalid request to get users'
  },
  'ERR_USER_NAME_EXISTS_REQUEST': {
    code: 2047,
    message: 'Username is already exists'
  },
  'ERR_AUTH_TOKEN_REQUIRED': {
    code: 2048,
    message: 'Auth token required'
  },
  'ERR_INVALID_AUTH_TOKEN': {
    code: 2049,
    message: 'Unauthorized'
  },
  'ERR_EXPIRED_AUTH_TOKEN': {
    code: 2050,
    message: 'Unauthorized'
  },
  'SUCCESSFULLY_VALIDATED_TOKEN': {
    code: 2051,
    message: 'Token is Valid'
  },
  'UNKNOWN_AUTH_ERRR': {
    code: 2052,
    message: 'Unauthorized'
  },
  'USER_NOT_FOUND': {
    code: 2053,
    message:   'User not found.',
  },
  'FAILED_TO_RETRIEVE_USER': {
    code: 2054,
    message: 'Failed to retrieve user.'
  },
  'FAILED_TO_RETRIEVE_USERS': {
    code: 2055,
    message: 'Failed to retrieve users.'
  },
  'FAILED_TO_INSERT_USER': {
    code: 2056,
    message: 'Failed to insert user.'
  },
  'CREATED_USER_SUCCESSFULLY':{
    code: 2057,
    message: 'User created successfully!'
  },
  'USER_UPDATED_SUCCESSFULLY':{
    code: 2058,
    message:  'User updated successfully!',
  },
  'USER_DELETED_SUCCESSFULLY':{
    code: 2059,
    message: 'User deleted successfully!'
  },
  'ERROR_USER_DELETE':{
    code: 2060,
    message: 'Error occurred when deleting user!'
  },
  'ERROR_USER_UPDATE':{
    code: 2061,
    message: 'Error occurred when updating user!'
  },
  'SETTINGS_CREATED': {
    code: 3001,
    message: 'Settings created successfully!',
  },
  SETTINGS_UPDATED: {
    code: 3002,
    message: 'Settings updated successfully!',
  },
  SETTINGS_DELETED: {
    code: 3003,
    message: 'Settings deleted successfully!',
  },
  SETTINGS_NOT_FOUND: {
    code: 4001,
    message: 'Settings not found.',
  },
  FAILED_TO_RETRIEVE_SETTINGS: {
    code: 4002,
    message: 'Failed to retrieve settings.',
  },
  FAILED_TO_INSERT_SETTINGS: {
    code: 4003,
    message: 'Failed to insert settings.',
  },
  FAILED_TO_UPDATE_SETTINGS: {
    code: 4004,
    message: 'Failed to update settings.',
  },
  FAILED_TO_DELETE_SETTINGS: {
    code: 4005,
    message: 'Failed to delete settings.',
  },
  // SMTP Messages
  SMTP_TEST_SUCCESS: {
    code: 4006,
    message: 'SMTP connection test successful'
  },
  SMTP_TEST_FAILED: {
    code: 4007,
    message: 'SMTP connection test failed'
  },
  SMTP_MISSING_FIELDS: {
    code: 4008,
    message: 'Missing required SMTP configuration fields'
  },
  SMTP_AUTH_ERROR: {
    code: 4009,
    message: 'SMTP authentication failed. Please check your username and password.'
  },
  SMTP_CONNECTION_ERROR: {
    code: 4010,
    message: 'Could not connect to SMTP server. Please check host and port.'
  },
  SMTP_TIMEOUT_ERROR: {
    code: 4011,
    message: 'SMTP connection timeout. The server may be unreachable.'
  },
  SMTP_EMAIL_SENT: {
    code: 4012,
    message: 'Test email sent successfully'
  },
  SMTP_EMAIL_FAILED: {
    code: 4013,
    message: 'Failed to send test email'
  },
  SMTP_DISABLED: {
    code: 4014,
    message: 'SMTP is not enabled in settings'
  },
  SMTP_RECIPIENT_REQUIRED: {
    code: 4015,
    message: 'Recipient email address is required'
  },
  'ORGANIZATION_NOT_FOUND': {
    code: 2053,
    message: 'organization not found.',
  },
  'FAILED_TO_RETRIEVE_ORGANIZATION': {
    code: 2054,
    message: 'Failed to retrieve organization.',
  },
  'FAILED_TO_RETRIEVE_ORGANIZATIONS': {
    code: 2055,
    message: 'Failed to retrieve organizations.',
  },
  'FAILED_TO_INSERT_ORGANIZATION': {
    code: 2056,
    message: 'Failed to insert organization.',
  },
  'ORGANIZATION_UPDATED_SUCCESSFULLY': {
    code: 2057,
    message: 'organization updated successfully!',
  },
  'ORGANIZATION_DELETED_SUCCESSFULLY': {
    code: 2058,
    message: 'organization deleted successfully!',
  },
  'DEVICE_NOT_FOUND': {
    code: 2057,
    message: 'Device not found.',
  },
  'FAILED_TO_RETRIEVE_DEVICE': {
    code: 2058,
    message: 'Failed to retrieve device.',
  },
  'FAILED_TO_RETRIEVE_DEVICES': {
    code: 2059,
    message: 'Failed to retrieve devices.',
  },
  'FAILED_TO_INSERT_DEVICE': {
    code: 2060,
    message: 'Failed to insert device.',
  },
  'LICENSE_DEVICE_LIMIT_REACHED': {
    code: 2061,
    message: `Device limit reached. Your {licensePlan} - {code} plan allows maximum {maxDevices} devices.`
  },
  'DEVICE_CREATED_SUCCESSFULLY': {
    code: 2061,
    message: 'Added device successfully!',
  },
  'DEVICES_CREATED_SUCCESSFULLY': {
    code: 2091,
    message: 'Devices created successfully!',
  },
  'DEVICE_UPDATED_SUCCESSFULLY': {
    code: 2062,
    message: 'Device updated successfully!',
  },
  'DEVICE_DELETED_SUCCESSFULLY': {
    code: 2063,
    message: 'Device deleted successfully!',
  },
  'ERROR_DEVICE_UPDATE': {
    code: 2064,
    message: 'Error updating device.',
  },
  'ERROR_DEVICE_DELETE': {
    code: 2065,
    message: 'Error deleting device.',
  },
  'ERROR_DELETE_DEVICE_DB_OK':{
    code: 2066,
    message: 'Removed device from database but external device maybe offline',
  },
   'MODULE_NOT_FOUND': {
    code: 3001,
    message: 'Module not found.',
  },
  'FAILED_TO_RETRIEVE_MODULE': {
    code: 3002,
    message: 'Failed to retrieve module.',
  },
  'FAILED_TO_RETRIEVE_MODULES': {
    code: 3003,
    message: 'Failed to retrieve modules.',
  },
  'NO_MODULES_FOUND': {
    code: 3004,
    message: 'No modules found.',
  },
  'FAILED_TO_INSERT_MODULE': {
    code: 3005,
    message: 'Failed to insert module.',
  },
  'MODULE_CREATED_SUCCESSFULLY': {
    code: 3006,
    message: 'Module created successfully!',
  },
  'ERROR_MODULE_UPDATE': {
    code: 3007,
    message: 'Error updating module.',
  },
  'MODULE_UPDATED_SUCCESSFULLY': {
    code: 3008,
    message: 'Module updated successfully!',
  },
  'ERROR_MODULE_DELETE': {
    code: 3009,
    message: 'Error deleting module.',
  },
  'MODULE_DELETED_SUCCESSFULLY': {
    code: 3010,
    message: 'Module deleted successfully!',
  },
  'INVALID_DB_TYPE':{
    code: 3011,
    message: 'Invalid database type'
  },
  'SUCCESSFUL_CONNECTION':{
    code: 3012,
    message: 'Connection successful'
  },
  'INVALID_CONNECTION':{
    code: 3013,
    message: 'Connection failed'
  },
  'REDISCOVERY_REQUEST_SENT': {
    code: 3014,
    message: 'Device rediscovery sent successfully!',
  },
  'SENSOR_ALARM_UPDATED_SUCCESSFULLY':{
    code: 3015,
    message: 'Sensor alarm updated successfully!',
  },
  'CREATED_RULE_SUCCESSFULLY':{
    code: 3016,
    message: 'Calibration rule created successfully!',
  },
  'UPDATED_RULE_SUCCESSFULLY':{
    code: 3017,
    message: 'Calibration rule updated successfully!',
  },
  'DELETED_RULE_SUCCESSFULLY':{
    code: 3017,
    message: 'Calibration rule deleted successfully!',
  },
  'RULE_NOT_FOUND':{
    code: 3018,
    message: 'Calibration rule not found!',
  },
  'FAILED_TO_RETRIEVE_RULES':{
    code: 3019,
    message: 'Failed to retrieve calibration rules!',
  },
  'GLOBAL_CALIBRATION_RULES_ALREADY_EXIST':{
    code: 3020,
    message: 'Global calibration rules already exist!',
  },
  'RULE_DELETED_SUCCESSFULLY':{
    code: 3021,
    message: 'Calibration rule deleted successfully!',
  },
  'ERROR_RULE_DELETE':{
    code: 3022,
    message: 'Error deleting calibration rule!',
  },
  'ERROR_RULE_UPDATE':{
    code: 3023,
    message: 'Error updating calibration rule!',
  },
  'UPDATED_RULE_SUCCESSFULLY':{
    code: 3024,
    message: 'Calibration rule updated successfully!',
  },
  'CALIBRATION_RULE_ALREADY_EXIST':{
    code: 3025,
    message: 'Calibration rule already exist!',
  },
  'DEVICE_CALIBRATION_RULES_ALREADY_EXIST':{
    code: 3026,
    message: 'Device calibration rules already exist for the device!',
  },
  'SENSOR_CALIBRATION_RULES_ALREADY_EXIST':{
    code: 3027,
    message: 'Sensor calibration rules already exist for the sensor!',
  },
  'CUSTOM_FIELD_NOT_FOUND': {
    code: 3028,
    message: 'Custom field not found.',
  },
  'FAILED_TO_RETRIEVE_CUSTOM_FIELD': {
    code: 3029,
    message: 'Failed to retrieve custom field.',
  },
  'CUSTOM_FIELD_CREATED':{
    code: 3030,
    message: 'Custom field created successfully!',
  },
  'CUSTOM_FIELD_UPDATED':{
    code: 3031,
    message: 'Custom field updated successfully!',
  },
  'CUSTOM_FIELD_DELETED':{
    code: 3032,
    message: 'Custom field deleted successfully!',
  },
  'FAILED_TO_RETRIEVE_SYSTEM_INFO':{
    code: 3033,
    message: 'Failed to retrieve system info.',
  },
  'REQUIRED_FIELDS_MISSING': {
    code: 3034,
    message: 'Name, code, and billing cycle are required fields.',
  },
  'LICENSE_PLAN_CODE_EXISTS': {
    code: 3035,
    message: 'License plan with this code already exists.',
  },
  'LICENSE_PLAN_NOT_FOUND': {
    code: 3036,
    message: 'License plan not found.',
  },
  'FAILED_TO_CREATE_LICENSE_PLAN': {
    code: 3037,
    message: 'Failed to create license plan.',
  },
  'FAILED_TO_UPDATE_LICENSE_PLAN': {
    code: 3038,
    message: 'Failed to update license plan.',
  },
  'FAILED_TO_DELETE_LICENSE_PLAN': {
    code: 3039,
    message: 'Failed to delete license plan.',
  },
  'LICENSE_PLAN_HAS_ACTIVE_LICENSES': {
    code: 3040,
    message: 'Cannot delete license plan with active licenses.',
  },
  'LICENSE_PLAN_DELETED': {
    code: 3041,
    message: 'License plan deleted successfully.',
  },
  'FAILED_TO_RETRIEVE_LICENSE_PLAN': {
    code: 3042,
    message: 'Failed to retrieve license plan.',
  },
  'FAILED_TO_RETRIEVE_LICENSE_PLANS': {
    code: 3043,
    message: 'Failed to retrieve license plans.',
  },
  'LICENSE_PLAN_CREATED': {
    code: 3044,
    message: 'License plan created successfully.',
  },
  'LICENSE_PLAN_UPDATED': {
    code: 3045,
    message: 'License plan updated successfully.',
  },
  'UPLOAD_ERROR': {
    code: 3001,
    message: 'Error uploading license file.'
  },
  'INVALID_FORMAT': {
    code: 3002,
    message: 'Invalid license file format.'
  },
  'DECRYPTION_FAILED': {
    code: 3003,
    message: 'License decryption failed.'
  },
  'INVALID_LICENSE': {
    code: 3004,
    message: 'Invalid license.'
  },
  'LICENSE_PLAN_NOT_FOUND': {
    code: 3005,
    message: 'License plan not found.'
  },
  'VERIFICATION_SUCCESS': {
    code: 3006,
    message: 'License verification successful.'
  },
  'PROCESSING_ERROR': {
    code: 3007,
    message: 'Error processing license.'
  },
  'INTERNAL_SERVER_ERROR': {
    code: 3008,
    message: 'Internal server error.'
  },
  'LICENSE_ADDED': {
    code: 3009,
    message: 'License added successfully.'
  },
  'INTERNAL_SERVER_ERROR':{
    code: 3010,
    message: 'Internal server error'
  },
  'ACTIVE_LICENSE_FOUND': {
    code: 3011,
    message: 'Active license found.'
  },
  'NO_ACTIVE_LICENSE': {
    code: 3012,
    message: 'No active license found.'
  },
  'LICENSE_CHECK_ERROR': {
    code: 3013,
    message: 'Error checking license status.'
  },
  'EXECUTED_QUERY_SUCCESSFULLY': {
    code: 3014,
    message: 'Executed query successfully.'
  },
  'LICENSE_REQUIRED': {
    code: 3015,
    message: 'This feature requires an active license'
  },
  'LICENSE_EXPIRED': {
    code: 3016,
    message: 'Your license has expired. Please renew to continue using this feature'
  },
  'LICENSE_PLAN_NOT_FOUND': {
    code: 3017,
    message: 'License plan features not found'
  },
  'DATE_AND_TIMEFRAME_ARE_REQUIRED':{
    code: 3046,
    message: "Both 'date' and 'timeframe' parameters are required."
  },
  'FAILED_TO_RETRIEVE_SENSOR_ALARM_DATA':{
    code: 3047,
    message: 'Failed to retrieve sensor alarm data.'
  },
  'INVALID_TIMEFRAME_VALUE': {
    code: 3048,
    message: 'Invalid "timeframe" value. Use "monthly", "yearly", or "weekly".'
  },
  'SUCCESSFULLY_RETRIEVED_ALARM_REPORT': {
    code: 3049,
    message: 'Successfully retrieved alarm reports.'
  },
  'DEVICE_CONNECTION_FAILED': {
    code: 4001,
    message: 'Connection to device failed'
  },
  'DEVICE_CONNECTION_TIMEOUT': {
    code: 4002,
    message: 'No response received from device'
  },
  'DEVICE_CONNECTION_SETUP_ERROR': {
    code: 4003,
    message: 'Error setting up the request to device'
  },
  'DEVICE_CONNECTION_SUCCESS': {
    code: 4004,
    message: 'Connection to device successful'
  },
  'DEVICE_ADDED_ERROR_CONNECTING_TO_EXTERNAL_COMMS': {
    code: 4005,
    message: 'Device added successfully but error connecting to external device'
  },
  'REGULATORY_BODY_NOT_FOUND': {
    code: 3100,
    message: 'Regulatory body not found.'
  },
  'FAILED_TO_RETRIEVE_REGULATORY_BODY': {
    code: 3101,
    message: 'Failed to retrieve regulatory body.'
  },
  'FAILED_TO_RETRIEVE_REGULATORY_BODIES': {
    code: 3102,
    message: 'Failed to retrieve regulatory bodies.'
  },
  'REGULATORY_BODY_CREATED': {
    code: 3103,
    message: 'Regulatory body created successfully!'
  },
  'REGULATORY_BODY_UPDATED': {
    code: 3104,
    message: 'Regulatory body updated successfully!'
  },
  'REGULATORY_BODY_DELETED': {
    code: 3105,
    message: 'Regulatory body deleted successfully!'
  },
  'FAILED_TO_INSERT_REGULATORY_BODY': {
    code: 3106,
    message: 'Failed to insert regulatory body.'
  },
  'FAILED_TO_UPDATE_REGULATORY_BODY': {
    code: 3107,
    message: 'Failed to update regulatory body.'
  },
  'FAILED_TO_DELETE_REGULATORY_BODY': {
    code: 3108,
    message: 'Failed to delete regulatory body.'
  },
  'SENSOR_REGULATION_NOT_FOUND': {
    code: 3200,
    message: 'Sensor regulation not found.'
  },
  'FAILED_TO_RETRIEVE_SENSOR_REGULATION': {
    code: 3201,
    message: 'Failed to retrieve sensor regulation.'
  },
  'FAILED_TO_RETRIEVE_SENSOR_REGULATIONS': {
    code: 3202,
    message: 'Failed to retrieve sensor regulations.'
  },
  'SENSOR_REGULATION_CREATED': {
    code: 3203,
    message: 'Sensor regulation created successfully!'
  },
  'SENSOR_REGULATION_UPDATED': {
    code: 3204,
    message: 'Sensor regulation updated successfully!'
  },
  'SENSOR_REGULATION_DELETED': {
    code: 3205,
    message: 'Sensor regulation deleted successfully!'
  },
  'FAILED_TO_INSERT_SENSOR_REGULATION': {
    code: 3206,
    message: 'Failed to insert sensor regulation.'
  },
  'FAILED_TO_UPDATE_SENSOR_REGULATION': {
    code: 3207,
    message: 'Failed to update sensor regulation.'
  },
  'FAILED_TO_DELETE_SENSOR_REGULATION': {
    code: 3208,
    message: 'Failed to delete sensor regulation.'
  },
  'SHIFT_NOT_FOUND': {
    code: 3500,
    message: 'Shift not found.'
  },
  'FAILED_TO_RETRIEVE_SHIFTS': {
    code: 3501,
    message: 'Failed to retrieve shifts.'
  },
  'FAILED_TO_RETRIEVE_SHIFT': {
    code: 3502,
    message: 'Failed to retrieve shift.'
  },
  'SHIFT_CREATED': {
    code: 3503,
    message: 'Shift created successfully!'
  },
  'FAILED_TO_CREATE_SHIFT': {
    code: 3504,
    message: 'Failed to create shift.'
  },
  'SHIFT_UPDATED': {
    code: 3505,
    message: 'Shift updated successfully!'
  },
  'FAILED_TO_UPDATE_SHIFT': {
    code: 3506,
    message: 'Failed to update shift.'
  },
  'SHIFT_DELETED': {
    code: 3507,
    message: 'Shift deleted successfully!'
  },
  'FAILED_TO_DELETE_SHIFT': {
    code: 3508,
    message: 'Failed to delete shift.'
  },
  'COUNTRY_NOT_FOUND': {
    code: 3600,
    message: 'Country not found.'
  },
  'FAILED_TO_RETRIEVE_COUNTRIES': {
    code: 3601,
    message: 'Failed to retrieve countries.'
  },
  'DEPARTMENT_NOT_FOUND': {
    code: 3700,
    message: 'Department not found.'
  },
  'FAILED_TO_RETRIEVE_DEPARTMENT': {
    code: 3701,
    message: 'Failed to retrieve department.'
  },
  'FAILED_TO_RETRIEVE_DEPARTMENTS': {
    code: 3702,
    message: 'Failed to retrieve departments.'
  },
  'NO_DEPARTMENTS_FOUND': {
    code: 3703,
    message: 'No departments found.'
  },
  'FAILED_TO_INSERT_DEPARTMENT': {
    code: 3704,
    message: 'Failed to insert department.'
  },
  'DEPARTMENT_CREATED_SUCCESSFULLY': {
    code: 3705,
    message: 'Department created successfully!'
  },
  'DEPARTMENT_UPDATED_SUCCESSFULLY': {
    code: 3706,
    message: 'Department updated successfully!'
  },
  'DEPARTMENT_DELETED_SUCCESSFULLY': {
    code: 3707,
    message: 'Department deleted successfully!'
  },
  'FAILED_TO_UPDATE_DEPARTMENT': {
    code: 3708,
    message: 'Failed to update department.'
  },
  'FAILED_TO_DELETE_DEPARTMENT': {
    code: 3709,
    message: 'Failed to delete department.'
  },
  'DEPARTMENT_CODE_ALREADY_EXISTS': {
    code: 3710,
    message: 'Department code already exists.'
  },
  'NOTIFICATION_NOT_FOUND': {
    code: 3800,
    message: 'Notification not found.'
  },
  'FAILED_TO_RETRIEVE_NOTIFICATION': {
    code: 3801,
    message: 'Failed to retrieve notification.'
  },
  'FAILED_TO_RETRIEVE_NOTIFICATIONS': {
    code: 3802,
    message: 'Failed to retrieve notifications.'
  },
  'NO_NOTIFICATIONS_FOUND': {
    code: 3803,
    message: 'No notifications found.'
  },
  'FAILED_TO_INSERT_NOTIFICATION': {
    code: 3804,
    message: 'Failed to insert notification.'
  },
  'NOTIFICATION_CREATED_SUCCESSFULLY': {
    code: 3805,
    message: 'Notification created successfully!'
  },
  'NOTIFICATION_UPDATED_SUCCESSFULLY': {
    code: 3806,
    message: 'Notification updated successfully!'
  },
  'NOTIFICATION_DELETED_SUCCESSFULLY': {
    code: 3807,
    message: 'Notification deleted successfully!'
  },
  'FAILED_TO_UPDATE_NOTIFICATION': {
    code: 3808,
    message: 'Failed to update notification.'
  },
  'FAILED_TO_DELETE_NOTIFICATION': {
    code: 3809,
    message: 'Failed to delete notification.'
  },
  'FAILED_TO_RETRIEVE_USER_NOTIFICATIONS': {
    code: 3810,
    message: 'Failed to retrieve user notifications.'
  },
  'USER_ID_REQUIRED': {
    code: 3811,
    message: 'User ID is required.'
  },
  'NOTIFICATION_MARKED_AS_READ': {
    code: 3812,
    message: 'Notification marked as read successfully.'
  },
  'FAILED_TO_MARK_NOTIFICATION_AS_READ': {
    code: 3813,
    message: 'Failed to mark notification as read.'
  },
  'NOTIFICATION_DISMISSED': {
    code: 3814,
    message: 'Notification dismissed successfully.'
  },
  'FAILED_TO_DISMISS_NOTIFICATION': {
    code: 3815,
    message: 'Failed to dismiss notification.'
  },
  'FAILED_TO_RETRIEVE_DEPARTMENT_MODULES': {
    code: 3900,
    message: 'Failed to retrieve department modules.'
  },
  'FAILED_TO_RETRIEVE_MODULE_DEPARTMENTS': {
    code: 3901,
    message: 'Failed to retrieve module departments.'
  },
  'DEPARTMENT_MODULE_ASSIGNED_SUCCESSFULLY': {
    code: 3902,
    message: 'Module assigned to department successfully!'
  },
  'FAILED_TO_ASSIGN_MODULE_TO_DEPARTMENT': {
    code: 3903,
    message: 'Failed to assign module to department.'
  },
}

const updateMessages = {
  'DEVICE_UPDATE_SUCCESSFUL': {
    code: 3001,
    message: 'Device successfully updated'
  },
  'INVALID_DEVICE_UPDATE_REQUEST': {
    code: 3002,
    message: 'Invalid device update request'
  },
  'ERROR_IN_UPDATING_SOFTWARE': {
    code: 3003,
    message: 'Error in updating software.'
  },
  'STARTED_WORKING_ON_UPDATE_PROCEDURE': {
    code: 3004,
    message: 'Working on the software update.'
  },
  'ERROR_INVALID_REQUEST_TO_UPDATE_SOFTWARE': {
    code: 3005,
    message: 'Error invalid request to update software.'
  },
  'ERROR_IN_RENAMING_FILE': {
    code: 3006,
    message: 'Error in renaming file.'
  },
}

const fileUploadMessages = {
  'ERROR_IN_FILE_UPLOAD_INTERNAL_ERROR': {
    code: 4001,
    message: 'Error in uploading file'
  },
  'ERROR_IN_FILE_UPLOAD': {
    code: 4002,
    message: 'Error in uploading file'
  },
  'ERROR_IN_RENAMING_FILENAME': {
    code: 4003,
    message: 'Filename is not valid'
  },
  'FILE_SUCCESSFULLY_UPLOADED': {
    code: 4004,
    message: 'File successfully uploaded'
  },
  'ERROR_INVALID_FILE_EXTENSION': {
    code: 4005,
    message: 'File extension is not valid'
  },
  'ERROR_INVALID_FILE_UPLOAD_REQUEST': {
    code: 4006,
    message: 'Filename is not valid'
  },
  'INTERNAL_ERROR_OCCURED_IN_REMOVE_UPLOADED_FILE': {
    code: 4007,
    message: 'Error in file upload'
  },
}

const bashMessages = {
  'ERROR_IN_EXTRACTING_FILE': {
    code: 5001,
    message: 'Error in extracting file'
  },
}

const fileExtensionMessages = {
  'ERROR_UNSUPPORTED_FILE_EXTENSION': {
    code: 6001,
    message: 'Error unsupported file extension'
  },
}

const networkMessages = {
  'ERROR_INVALID_REQUEST_FOR_NETWORK_CHANGE': {
    code: 7001,
    message: 'Error invalid network change request'
  },
  'NETWORK_CHANGE_SUCCESSFUL': {
    code: 7002,
    message: 'Network config successfully changed!'
  },
  'ADDRESS_ALREADY_IN_USE': {
    code: 7003,
    message: 'IP address is already in use!'
  },
  'ERROR_IN_UPDATE_NETWORK_SETTINGS': {
    code: 7004,
    message: 'Error in update network settings'
  },
  'ERROR_IN_APPLYING_UPDATE_NETWORK_CHANGES_COMMANDS_STATIC': {
    code: 7005,
    message: 'Error in update network settings'
  },
  'ERROR_IN_APPLYING_UPDATE_NETWORK_CHANGES_COMMANDS_DHCP': {
    code: 7006,
    message: 'Error in update network settings'
  },
  'ERROR_IN_REMOVING_NETWORK': {
    code: 7007,
    message: 'Error in removing network'
  }
}

const commandMessages = {
  'ERROR_IN_COMMAND_EXECUTION': {
    code: 8001,
    message: 'Error in execution'
  },
  'ERROR_IN_COMMAND_EXECUTION_OUTPUT': {
    code: 8002,
    message: 'Error in execution'
  }
}

const realmMessages = {
  'ERROR_IN_REALM_DB_CONNECTION_ERROR': {
    code: 9001,
    message: 'Error in openeing connection to db'
  },
  'ERROR_IN_REALM_DB_READING_OBJECT': {
    code: 9002,
    message: 'Error in reading db'
  },
  'ERROR_IN_REALM_DB_WRITE_ERROR': {
    code: 9003,
    message: 'Error in writing db'
  },
  'ERROR_IN_REALM_DB_GET_OBJ_BY_ID': {
    code: 9004,
    message: 'Error in reading data'
  },
  'ERROR_IN_REALM_DB_UPDATE_OBJ_BY_ID': {
    code: 9005,
    message: 'Error in updating data'
  },
  'ERROR_IN_REALM_DB_DELETE_BY_ID': {
    code: 9006,
    message: 'Error in deleting data'
  },
  'ERROR_IN_REALM_DB_UPDATE_MULTIPLE': {
    code: 9007,
    message: 'Error in updating data'
  },
  'ERROR_IN_REALM_DB_FILTERED_OBJ': {
    code: 9008,
    message: 'Error in reading the data'
  },
  'ERROR_IN_REALM_DB_DELETE_BY_FILTER_QUERY': {
    code: 9009,
    message: 'Error in deleting data'
  },
  'ERROR_IN_REALM_DB_DELETE_BY_FILTER_QUERY_MULTI_SCHEMA': {
    code: 9010,
    message: 'Error in deleting data'
  },
}

const userMessages = {
  'ERROR_INVALID_REQUEST_FOR_INSERT_USER': {
    code: 10001,
    message: 'Error invalid request to insert user'
  },
  'USER_SUCCESSFULLY_ADDED': {
    code: 10002,
    message: 'User added successfully'
  },
  'ERROR_INVALID_REQUEST_FOR_UPDATE_USER': {
    code: 10003,
    message: 'Error invalid request to update user'
  },
  'USER_SUCCESSFULLY_UPDATED': {
    code: 10004,
    message: 'User updated successfully'
  },
  'USER_ALREADY_EXIST': {
    code: 10005,
    message: 'User already exist'
  },
  'USER_NOT_EXIST': {
    code: 10006,
    message: 'User is not available in the database'
  },
  'ERROR_INVALID_REQUEST_FOR_DELETE_USER': {
    code: 10007,
    message: 'Error invalid request to delete user'
  },
  'USER_SUCCESSFULLY_DELETED': {
    code: 10008,
    message: 'User successfully deleted'
  },
  'INVALID_REQUEST_TO_SIGN_IN_USER': {
    code: 10009,
    message: 'Invalid request to signin user'
  },
  'USER_NOT_EXIST_WITH_EMAIL': {
    code: 10010,
    message: 'Invalid email or password'
  },
  'INVALID_PASSWORD': {
    code: 10011,
    message: 'Invalid username or password'
  },
  'USER_SIGNED_IN_SUCCESSFUL': {
    code: 10012,
    message: 'Sign in successful!'
  },
  'ERROR_IN_GET_USER_DETAILS': {
    code: 10013,
    message: 'Error in getting user details'
  },
  'ERROR_INVALID_REQUEST_TO_VERIFY_TOKEN': {
    code: 10014,
    message: 'Error bad request!'
  },
}

const deviceMessages = {
  'ERROR_INVALID_REQUEST_FOR_INSERT_DEVICE': {
    code: 11001,
    message: 'Error invalid request to insert device'
  },
  'DEVICE_SUCCESSFULLY_CREATED': {
    code: 11002,
    message: 'Device successfully created'
  },
  'ERROR_INVALID_REQUEST_FOR_UPDATE_DEVICE': {
    code: 11003,
    message: 'Error invalid request to update device'
  },
  'DEVICE_SUCCESSFULLY_UPDATED': {
    code: 11004,
    message: 'Device successfully updated'
  },
  'ERROR_IN_GETTING_DEIVCE_DETAILS': {
    code: 11005,
    message: 'Error in getting device details'
  },
  'ERROR_IN_REBOOT_DEVICE': {
    code: 11006,
    message: 'Error in reboot device'
  },
  'ERROR_IN_EXECUTE_COMMAND': {
    code: 11007,
    message: 'Error in reboot device'
  },
  'DEVICE_RESTART_REQUEST_SUCCESS': {
    code: 11008,
    message: 'Rebooting the device. Please hold tight.'
  },
  'ERROR_IN_UPDATE_DEVICE': {
    code: 11009,
    message: 'Error in update device.'
  },
  'ERROR_IN_GETTING_NETWORK_CONFIGURATION': {
    code: 11010,
    message: 'Error in getting network configuration'
  },
  'ERROR_IN_GETTING_DEVICE_CONFIGURATION': {
    code: 11011,
    message: 'Error in getting Device configuration'
  },
  'ERROR_DEVICE_CONFIGURATION_NOT_AVAILABLE': {
    code: 11012,
    message: 'Error device configuration is not available'
  },
  'ERROR_INVALID_REQUEST_FOR_UPDATE_DEVICE_CONFIG': {
    code: 11013,
    message: 'Error invalid request to update device configuration'
  },
  'DEVICE_CONFIGURATION_SUCCESSFULLY_UPDATED': {
    code: 11014,
    message: 'Device configuration successfully updated'
  },
  'ERROR_IN_UPDATE_DEVICE_MODULE_CONFIG': {
    code: 11015,
    message: 'Error in updating module config'
  },
  'ERROR_IN_UPLOAD_ENC_DEVICE_CONFIG_FILE': {
    code: 11016,
    message: 'Error in uploading device config file'
  },
  'ERROR_FILE_NOT_SUPPORTED_FOR_DEVICE_CONFIG': {
    code: 11017,
    message: 'Error file not supported for device config'
  },
  'ERROR_INVALID_DEVICE_CONFIG': {
    code: 11018,
    message: 'Error invalid device config file'
  },
  'ERROR_INVALID_REQUEST_TO_IMPORT_DEVICE': {
    code: 11019,
    message: 'Error invalid request to import device details'
  },
  'ERROR_IN_GET_SHIFT_DETAILS': {
    code: 11020,
    message: 'Error in getting shift details'
  },
  'ERROR_IN_UPDATE_SHIFT_DETAILS': {
    code: 11021,
    message: 'Error in update shift details'
  }, 
  'ERROR_IN_EXPORT_DEVICE_DETAILS': {
    code: 11022,
    message: 'Error in export device details'
  },
  'ERROR_IN_WRITING_DEVICE_DETAILS_FILE': {
    code: 11023,
    message: 'Error in export device details'
  },
  'ERROR_IN_DECODING_DEVICE_DETAILS_FILE': {
    code: 11024,
    message: 'Error in decoding device details'
  },
  'SUCCESSFULLY_UPDATED_DEVICE_SETTINGS': {
    code: 11025,
    message: 'Successfully updated all the settings'
  },
  'ERROR_IN_UPDATING_DEVICE_SETTINGS': {
    code: 11026,
    message: 'Error in restoring device settings'
  },
  'ERROR_IN_GETTING_CURRENT_DEVICE_SETTINGS': {
    code: 11027,
    message: 'Error in restoring device settings'
  }, 
  'ERROR_DEVICE_DETAILS_NOT_AVAILABLE': {
    code: 11028,
    message: 'Error device details not available'
  },
  'ERROR_IN_EXECUTE_COMMAND_DEVICE_UPDATE': {
    code: 11029,
    message: 'Error in updating device time information'
  },
  'DEVICE_SUCCESSFULLY_UPDATED_RESTART': {
    code: 11030,
    message: 'Successfully Updated. Restarting the ModuDrive. Please wait for 3 minutes.'
  },
  'ERROR_IN_CHANGING_DEVICE_NTP_MODE': {
    code: 11031,
    message: 'Error in setting datetime mode'
  }, 
  'ERROR_IN_CHANGING_DEVICE_NTP_DATETIME': {
    code: 11032,
    message: 'Error in setting datetime'
  }
}

const appInitializationMessages = {
  "ERROR_IN_SENSORS_INITIALIZATION": {
    code: 12001,
    message: "Error in initialization of sensors"
  }
}

const spiInitializationMessages = {
  "ERROR_IN_SPI_INITIALIZATION": {
    code: 13001,
    messages: "Error in spi initialization"
  },
  "SPI_INITIALIZATION_SUCCESSFUL": {
    code: 13001,
    message: "SPI initialization successful"
  }
}

const actuatorMessages = {
  "ERROR_IN_UPDATING_ACTUATOR_SENSOR_SETTINGS": {
    code: 14001,
    message: "Error in actuator sensor initialization"
  },
  "ACTUATOR_SENSOR_SETTINGS_SUCCESSFULLY_UPDATED": {
    code: 14002,
    message: "Actuator sensor settings successfully updated"
  },
  "ERROR_INVALID_REQUEST_TO_RESTART_ACTUATOR": {
    code: 14003,
    message: "Error invalid request to restart actuator"
  },
  "ACTUATOR_SUCCESSFULLY_RESTARTED": {
    code: 14004,
    message: "Actuator restart request successful!"
  },
  "ERROR_IN_RESTARTING_ACTUATOR": {
    code: 14005,
    message: "Error in restarting Actuator"
  },
  "ERROR_INVALID_REQUEST_TO_CHECK_ACTUATOR_CONNECTION": {
    code: 14006,
    message: "Error invalid request to check actuator connection"
  },
  "ERROR_INVALID_IP_FOR_ACTUATOR": {
    code: 14007,
    message: "Error same IP exist with another actuator"
  },
  "ERROR_IN_GET_ACTUATOR_DETAILS": {
    code: 14008,
    message: "Error in getting actuator details"
  },
  "ERROR_INVALID_REQUEST_TO_UPDATE_ACTUATOR": {
    code: 14009,
    message: "Error invalid request to update the actuator."
  },
  "ACTUATOR_UPDATED_SUCCESSFULLY": {
    code: 14010,
    message: "Actuator successfully updated."
  },
  "ERROR_IN_UPDATING_ACTUATOR_DETAILS": {
    code: 14011,
    message: "Error in updating actuator details"
  }
}

const gasMessages = {
  "ERROR_IN_GAS_SENSOR_INITIALIZATION": {
    code: 15001,
    message: "Error in gas sensor initialization"
  },
  "ERROR_IN_GAS_SENSOR_INITIALIZATION": {
    code: 15002,
    message: "Error in gas sensor initialization"
  },
  "ERROR_INVALID_GAS_SENSOR_SETTINGS": {
    code: 15003,
    message: "Error invalid request to update gas sensor settings"
  },
  "ERROR_IN_UPDATING_GAS_SENSOR_SETTINGS": {
    code: 15004,
    message: "Error in updating gas settings"
  },
  "GAS_SENSOR_SETTINGS_SUCCESSFULLY_UPDATED": {
    code: 15005,
    message: "Gas sensor settings successfully updated"
  },
  "ERROR_IN_GETTING_GAS_SENSOR_CALIBRATION_DATA": {
    code: 15006,
    message: "Gas sensor settings successfully updated"
  },
  "ERROR_INVALID_REQUEST_FOR_GAS_CALIBRATION": {
    code: 15007,
    message: "Error invalid request for Gas calibration data"
  },
  "GAS_CALIBRATION_REQUEST_SUCCESSFUL": {
    code: 15008,
    message: "Gas calibration request successful"
  }
}

const airFlowMessages = {
  "ERROR_IN_AIRFLOW_SENSOR_INITIALIZATION": {
    code: 16001,
    message: "Error in airflow sensor initialization"
  },
  "ERROR_INVALID_AIRFLOW_SENSOR_SETTINGS": {
    code: 16002,
    message: "Error invalid request to update airflow sensor settings"
  },
  "ERROR_IN_UPDATING_AIRFLOW_SENSOR_SETTINGS": {
    code: 16003,
    message: "Error in updating airflow settings"
  },
  "AIRFLOW_SENSOR_SETTINGS_SUCCESSFULLY_UPDATED": {
    code: 16004,
    message: "Airflow sensor settings successfully updated"
  }
}

const climateMessages = {
  "ERROR_IN_CLIMATE_SENSOR_INITIALIZATION": {
    code: 17001,
    message: "Error in climate sensor initialization"
  },
  "ERROR_INVALID_CLIMATE_SENSOR_SETTINGS": {
    code: 17002,
    message: "Error invalid request to update climate sensor settings"
  },
  "ERROR_IN_UPDATING_CLIMATE_SENSOR_SETTINGS": {
    code: 17003,
    message: "Error in updating climate settings"
  },
  "CLIMATE_SENSOR_SETTINGS_SUCCESSFULLY_UPDATED": {
    code: 17004,
    message: "Climate sensor settings successfully updated"
  }
}

const factoryDefault = {
  "ERROR_IN_RESETTING_DEVICE": {
    code: 18001,
    message: "Error in resettings device"
  },
  "DEVICE_RESET_SUCCESSFUL": {
    code: 18002,
    message: "Device reset successful. Please wait for 3 minute."
  },
  "ERROR_INVALID_REQUEST_TO_FACTORY_DEFAULT_DEVICE": {
    code: 18003,
    message: "Error invalid request to factory default device"
  },
}

const marqueeMessages = {
  "ERROR_INVALID_REQUEST_TO_UPDATE_MARQUEE": {
    code: 19001,
    message: "Error invalid request to update marquee"
  },
  "MARQUEE_UPDATED_SUCCESSFULLY": {
    code: 19002,
    message: "Marquee updated successfully"
  },
  "ERROR_IN_UPDATING_MARQUEE_SETTINGS": {
    code: 19003,
    message: "Error in updating marquee settings"
  },
  "ERROR_INVALID_IP_FOR_MARQUEE": {
    code: 19004,
    message: "Error same IP already exist with another Marquee!"
  }
}

const airflowChartDataMessages = {
  "ERROR_IN_GETTING_AIRFLOW_CHART_DATA": {
    code: 20001,
    message: "Error in getting airflow chart data"
  },
  "ERROR_INVALID_REQUEST_TO_GET_AIRFLOW_CHART_DATA": {
    code: 20002,
    message: "Error invalid request to get airflow chart data"
  }
}

const gasChartDataMessages = {
  "ERROR_IN_GETTING_GAS_CHART_DATA": {
    code: 30001,
    message: "Error in getting gas chart data"
  },
  "ERROR_IN_GETTING_GAS_CHART_DATA_BY_ID": {
    code: 30002,
    message: "Error in getting gas chart data by id"
  },
  "ERROR_INVALID_REQUEST_FOR_GET_GAS_CHART_DETAILS": {
    code: 30003,
    message: "Error invalid request for get chart details"
  },
}

const climateChartDataMessages = {
  "ERROR_IN_GETTING_CLIMATE_CHART_DATA": {
    code: 40001,
    message: "Error in getting gas chart data"
  },
  "ERROR_INVALID_REQUEST_IN_GETTING_CLIMATE_CHART_DATA": {
    code: 40002,
    message: "Error invalid request to get chart data"
  }
}

const actuatorChartDataMessages = {
  "ERROR_IN_GETTING_ACTUATOR_CHART_DATA": {
    code: 50001,
    message: "Error in getting actuator chart data"
  },
  "ERROR_INVALID_REQUEST_IN_GETTING_ACTUATOR_CHART_DATA": {
    code: 50002,
    message: "Error invalid request to get actuator chart data"
  },
  "ERROR_IN_GETTING_ACTUATOR_SIGNATURE": {
    code: 50003,
    message: "Error in getting actuator signatures"
  },
  "ERROR_IN_GETTING_ACTUATOR_SIGNATURE_CHART_DATA": {
    code: 50004,
    message: "Error in getting actuator signature chart data"
  },
  "ERROR_INVALID_REQUEST_FOR_ACTUATOR_SIGNATURE": {
    code: 50005,
    message: "Error invalid request for actuator signatures"
  },
  "ERROR_IN_DELETE_ACTUATOR_SIGNATURE": {
    code: 50006,
    message: "Error in deleting actuator signature data"
  },
  "ACTUATOR_SIGNATURE_SUCCESSFULLY_DELETED": {
    code: 50007,
    message: "Actuator signature data successfully deleted"
  },
}

const differentialPressureChartDataMessages = {
  "ERROR_IN_GETTING_DP_CHART_DATA": {
    code: 60001,
    message: "Error in getting DP chart data"
  },
  "ERROR_INVALID_REQUEST_IN_GETTING_DP_CHART_DATA": {
    code: 60002,
    message: "Error invalid request to get DP chart data"
  }
}

const customSensorMessages = {
  "ERROR_INVALID_REQUEST_TO_INSERT_CUSTOM_SENSOR": {
    code: 70001,
    message: "Error invalid request to insert custom sensor data"
  },
  "ERROR_IN_INSERT_CUSTOM_SENSOR_DETAILS": {
    code: 70002,
    message: "Error in saving custom sensor details"
  },
  "CUSTOM_SENSOR_SUCCESSFULLY_ADDED": {
    code: 70003,
    message: "Custom Sensor successfully added"
  },
  "ERROR_IN_GET_CUSTOM_SENSOR_DATA": {
    code: 70004,
    message: "Error in getting custom sensor data"
  },
  "ERROR_IN_GET_ATTACHED_CUSTOM_SENSOR_DATA": {
    code: 70005,
    message: "Error in getting custom sensor data"
  },
  "ERROR_INVALID_REQUEST_TO_DELETE_CUSTOM_SENSOR": {
    code: 70006,
    message: "Error invalid request to delete custom sensor data"
  },
  "ERROR_IN_DELETE_CUSTOM_SENSOR": {
    code: 70007,
    message: "Error in deleting custom sensor data"
  },
  "SUCCESSFULLY_DELETED_CUSTOM_SENSOR": {
    code: 70008,
    message: "Successfully deleted custom sensor"
  },
  "ERROR_IN_GET_CUSTOM_SENSOR_BY_ID": {
    code: 70009,
    message: "Error in getting data for custom sensor"
  },
  "CUSTOM_SENSOR_SUCCESSFULLY_UPDATED": {
    code: 70010,
    message: "Custom Sensor successfully updated"
  },
  "ERROR_IN_DELETE_CUSTOM_SENSOR_DATA": {
    code: 70011,
    message: "Error in delete custom sensor data"
  },
}

const differentialPressureMessages = {
  "ERROR_INVALID_REQUEST_TO_UPDATE_DP_SENSOR": {
    code: 80001,
    message: "Error invalid request to update DP sensor"
  },
  "ERROR_IN_UPDATE_DP_SENSOR": {
    code: 80002,
    message: "Error in update DP sensor"
  },
  "DP_SENSOR_UPDATED_SUCCESSFULLY": {
    code: 80003,
    message: "DP sensor updated successfully"
  },
}

const lightStatus = {
  "Off": 0,
  "Steady": 1,
  "Flash": 2,
  "Strobe": 3
}

const lightColor = {
  "Off": 0,
  "Red": 1,
  "Green": 2,
  "Yellow": 3,
  "Blue": 4,
  "Magenta": 5,
  "Cyan": 6,
  "White": 7,
  "Amber": 8,
  "Rose": 9,
  "LimeGreen": 10,
  "Orange": 11,
  "SkyBlue": 12,
  "Violet": 13,
  "SpringGreen": 14
}

const climateMeasurementType = {
  "temp_inst": 0,
  "temp_wet_bulb": 1,
  "temp_euro_wbgt": 2,
  "temp_wbgt": 3,
  "temp_work_limit": 4,
  "tempo_heat_stress": 5,
  "humidity_inst": 6,
  "humidity_density": 7,
  "pressure_inst": 8,
  "pressure_saturation": 9,
  "pressure_specific": 10,
  "dust": 11
}

const supportedDbList = ['mysql', 'postgresql', 'mssql'];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

module.exports = {
  appConfig: applicationConfiguration,
  requestMessages: requestMessages,
  fileUploadMessages: fileUploadMessages,
  updateMessages: updateMessages,
  bashMessages: bashMessages,
  fileExtensionMessages: fileExtensionMessages,
  networkMessages: networkMessages,
  commandMessages: commandMessages,
  realmMessages: realmMessages,
  userMessages: userMessages,
  deviceMessages: deviceMessages,
  recordStatus: recordStatus,
  appInitializationMessages: appInitializationMessages,
  spiInitializationMessages: spiInitializationMessages,
  gasMessages: gasMessages,
  airFlowMessages: airFlowMessages,
  alertLevel: alertLevel,
  sensorType: sensorType,
  climateMessages: climateMessages,
  localPorts: localPorts,
  factoryDefault:factoryDefault,
  actuatorMessages: actuatorMessages,
  airflowChartDataMessages: airflowChartDataMessages,
  gasChartDataMessages: gasChartDataMessages,
  lightStatus: lightStatus,
  lightColor: lightColor,
  marqueeMessages: marqueeMessages,
  climateMeasurementType: climateMeasurementType,
  climateChartDataMessages: climateChartDataMessages,
  actuatorChartDataMessages: actuatorChartDataMessages,
  differentialPressureChartDataMessages: differentialPressureChartDataMessages,
  differentialPressureMessages: differentialPressureMessages,
  customSensorMessages: customSensorMessages,
  keypadSpiColor: keypadSpiColor,
  configType: configType,
  mqttTopics,
  supportedDbList,
  monthNames,
  daysOfWeek
}
