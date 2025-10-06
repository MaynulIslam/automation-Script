const Sequelize = require('sequelize');
const sequelize = require('../config/database'); // Your Sequelize configuration

const DataTypes = Sequelize.DataTypes;

const Models = require('@maestrodigitalmine/maestrolib/duetto-analytics/models');

const {
    Device: setupDevice,
    DeviceType: setupDeviceType,
    SensorType: setupSensorType,
    DeviceSensorMaster: setupDeviceSensorMaster,
    AlarmLogs: setupAlarmLogs,
    User: setupUser,
    Organization: setupOrganization,
    Settings: setupSettings,
    UserOrganization: setupUserOrganization,
    CalibrationRule: setupCalRule,
    License: setupLicense,
    LicensePlan: setupLicensePlan,
    DeviceSensorCalRule: setupDeviceSensorCalRule,
    CustomField: setupCustomField,
    SensorCalHistory: setupSensorCalHistory,
    GasSensorData: setupGasSensorData,
    AlarmCategory: setupAlarmCategory,
    AlarmReport: setupAlarmReport,
    RegulatoryBody: setupRegulatoryBody,
    SensorRegulation: setupSensorRegulation,
    Country: setupCountry,
    Shift: setupShift,
    Module: setupModule,
    UserModule: setupUserModule,
    Department: setupDepartment,
    UserDepartment: setupUserDepartment,
    DepartmentModule: setupDepartmentModule,
    Notification: setupNotification,
    UserNotification: setupUserNotification
  } = Models;

const Settings = setupSettings(sequelize, DataTypes);
const User = setupUser(sequelize, DataTypes);
const Organization = setupOrganization(sequelize, DataTypes);
const UserOrganization = setupUserOrganization(sequelize, DataTypes);
const DeviceType = setupDeviceType(sequelize, DataTypes);
const Device = setupDevice(sequelize, DataTypes);
const DeviceSensorMaster = setupDeviceSensorMaster(sequelize, DataTypes);
const AlarmCategory = setupAlarmCategory(sequelize, DataTypes);
const AlarmLogs = setupAlarmLogs(sequelize, DataTypes);
const SensorType = setupSensorType(sequelize, DataTypes);
const CalRule = setupCalRule(sequelize, DataTypes);
const DeviceSensorCalRule = setupDeviceSensorCalRule(sequelize, DataTypes);
const CustomField = setupCustomField(sequelize, DataTypes);
const License = setupLicense(sequelize, DataTypes);
const LicensePlan = setupLicensePlan(sequelize, DataTypes);
const SensorCalHistory = setupSensorCalHistory(sequelize, DataTypes);
const GasSensorData = setupGasSensorData(sequelize, DataTypes);
const AlarmReport = setupAlarmReport(sequelize, DataTypes);
const RegulatoryBody = setupRegulatoryBody(sequelize, DataTypes);
const SensorRegulation = setupSensorRegulation(sequelize, DataTypes);
const Country = setupCountry(sequelize, DataTypes);
const Shift = setupShift(sequelize, DataTypes);
const Module = setupModule(sequelize, DataTypes);
const UserModule = setupUserModule(sequelize, DataTypes);
const Department = setupDepartment(sequelize, DataTypes);
const UserDepartment = setupUserDepartment(sequelize, DataTypes);
const DepartmentModule = setupDepartmentModule(sequelize, DataTypes);
const Notification = setupNotification(sequelize, DataTypes);
const UserNotification = setupUserNotification(sequelize, DataTypes);


License.belongsTo(LicensePlan, {
    foreignKey: 'license_plan_id',
    allowNull: false,
});

User.belongsToMany(Organization, { through: UserOrganization });
Organization.belongsToMany(User, { through: UserOrganization });

User.belongsToMany(Module, { through: UserModule });
Module.belongsToMany(User, { through: UserModule });

// Direct associations for UserModule junction table
UserModule.belongsTo(User, { foreignKey: 'UserId' });
UserModule.belongsTo(Module, { foreignKey: 'ModuleId' });
User.hasMany(UserModule, { foreignKey: 'UserId' });
Module.hasMany(UserModule, { foreignKey: 'ModuleId' });

// User-Department many-to-many relationship
User.belongsToMany(Department, { through: UserDepartment, foreignKey: 'user_id' });
Department.belongsToMany(User, { through: UserDepartment, foreignKey: 'department_id' });

// Direct associations for UserDepartment junction table
UserDepartment.belongsTo(User, { foreignKey: 'user_id' });
UserDepartment.belongsTo(Department, { foreignKey: 'department_id' });
User.hasMany(UserDepartment, { foreignKey: 'user_id' });
Department.hasMany(UserDepartment, { foreignKey: 'department_id' });

// Department-Module many-to-many relationship
Department.belongsToMany(Module, { through: DepartmentModule, foreignKey: 'department_id' });
Module.belongsToMany(Department, { through: DepartmentModule, foreignKey: 'module_id' });

// Direct associations for DepartmentModule junction table
DepartmentModule.belongsTo(Department, { foreignKey: 'department_id' });
DepartmentModule.belongsTo(Module, { foreignKey: 'module_id' });
Department.hasMany(DepartmentModule, { foreignKey: 'department_id' });
Module.hasMany(DepartmentModule, { foreignKey: 'module_id' });


// Direct Associations for Eager Loading
DeviceSensorCalRule.belongsTo(Device, {
    foreignKey: 'DeviceId',
    targetKey: 'id',
    onDelete: 'CASCADE',  
    onUpdate: 'CASCADE'
});

DeviceSensorCalRule.belongsTo(SensorType, { foreignKey: 'SensorTypeId', targetKey: 'id' });
DeviceSensorCalRule.belongsTo(CalRule, { foreignKey: 'CalibrationRuleId', targetKey: 'id' });
DeviceSensorCalRule.belongsTo(DeviceSensorMaster, { foreignKey: 'DeviceSensorMasterId', targetKey: 'sensor_id' });

CalRule.hasMany(DeviceSensorCalRule, { foreignKey: 'CalibrationRuleId' });
DeviceSensorCalRule.belongsTo(CalRule, { foreignKey: 'CalibrationRuleId' });

Device.belongsTo(DeviceType, {
    foreignKey: 'device_type_id',
    allowNull: false,
});

Device.belongsTo(CustomField, {
    foreignKey: 'custom_field_id',
    allowNull: true,
});

DeviceSensorMaster.belongsTo(Device, {
    foreignKey: 'device_id', 
    targetKey: 'id'
});

AlarmLogs.belongsTo(Device, {
    foreignKey: 'device_id', 
    targetKey: 'id',
    onDelete: 'CASCADE'
});

Device.hasMany(AlarmLogs, {
    foreignKey: 'device_id',
    onDelete: 'CASCADE'
});

AlarmLogs.belongsTo(DeviceSensorMaster, {
    foreignKey: 'sensor_id', 
    targetKey: 'sensor_id',
    onDelete: 'CASCADE'
});

AlarmLogs.belongsTo(AlarmCategory, {
    foreignKey: 'category_id',
    targetKey: 'category_id',
    onDelete: 'CASCADE'
});

AlarmReport.belongsTo(AlarmCategory, {
    foreignKey: 'category_id',
    targetKey: 'category_id'
});

SensorCalHistory.belongsTo(DeviceSensorMaster, {
    foreignKey: 'sensor_id', 
    targetKey: 'sensor_id'
});

SensorCalHistory.belongsTo(Device, {
    foreignKey: 'device_id', 
    targetKey: 'id'
});

GasSensorData.belongsTo(Device, {
    foreignKey: 'device_id', 
    targetKey: 'id'
});

GasSensorData.belongsTo(DeviceSensorMaster, {
    foreignKey: 'sensor_id', 
    targetKey: 'sensor_id'
});

RegulatoryBody.belongsTo(Country, {
    foreignKey: 'country_id', 
    targetKey: 'id'
});

SensorRegulation.belongsTo(RegulatoryBody, {
    foreignKey: 'fk_regulatory_body_id', 
    targetKey: 'id'
});

SensorRegulation.belongsTo(SensorType, {
    foreignKey: 'fk_sensor_type_id', 
    targetKey: 'id'
});

UserNotification.belongsTo(User, {
    foreignKey: 'user_id', 
    targetKey: 'id'
});

UserNotification.belongsTo(Notification, {
    foreignKey: 'notification_id', 
    targetKey: 'id'
});


// Exporting all models
const models = {
  Settings,
  User,
  Organization,
  UserOrganization,
  DeviceType,
  Device,
  SensorType,
  DeviceSensorMaster,
  AlarmLogs,
  CalRule,
  DeviceSensorCalRule,
  CustomField,
  License,
  LicensePlan,
  SensorCalHistory,
  GasSensorData,
  AlarmReport,
  AlarmCategory,
  SensorRegulation,
  RegulatoryBody,
  Country,
  Shift,
  Module,
  UserModule,
  Department,
  UserDepartment,
  DepartmentModule,
  Notification,
  UserNotification
};

module.exports = models;