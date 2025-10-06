const { Client } = require('pg');
const { Umzug, SequelizeStorage } = require('umzug');
const path = require('path');
const { Country, Module, Shift } = require('../model');
const fs = require('fs');

const defaultModels = require('../util/default.model');
const deviceTypeDAL = require('../api/devicetype/devicetype.helper');
const sensorTypeDAL = require('../api/sensortype/sensortype.helper');
const licensePlanDAL = require('../api/licenseplan/licenseplan.helper');
const initQuery = require('./init.query');

const getDbConfig = () => ({
  database: process.env.SENSOR_DB_NAME,
  username: process.env.SENSOR_DB_USERNAME,
  password: process.env.SENSOR_DB_PASSWORD,
  port: process.env.SENSOR_DB_PORT,
  host: process.env.SENSOR_DB_HOST,
});

const createDatabase = async () => {
  const dbConfig = getDbConfig();

  const client = new Client({
    user: dbConfig.username,
    password: dbConfig.password,
    host: dbConfig.host,
    port: dbConfig.port
  });

  try {
    await client.connect();
    
    // Use parameterized query to prevent SQL injection
    const checkIfExistsQuery = {
      text: 'SELECT 1 FROM pg_database WHERE datname = $1',
      values: [dbConfig.database]
    };

    const { rows } = await client.query(checkIfExistsQuery);

    if (rows.length === 0) {
      // Create database only if it doesn't exist
      await client.query(`CREATE DATABASE "${dbConfig.database}"`);
      console.info(`Database "${dbConfig.database}" created successfully.`);
    } else {
      console.info(`Database "${dbConfig.database}" already exists, skipping creation.`);
    }
  } catch (error) {
    console.error('Error handling database:', error);
    throw error;
  } finally {
    await client.end();
  }
};

const initializeDeviceAndLicenseData = async () => {
  try {
    await deviceTypeDAL.insertMultipleDeviceType(defaultModels.defaultDeviceTypeConfig);
    await licensePlanDAL.insertMultipleLicensePlans(defaultModels.defaultLicensePlans);
    await initQuery.insertDefaultRecords();
  } catch (error) {
    console.error('Error initializing default models:', error);
    throw error;
  }
};

const initializeSensorData = async () => {
  try {
    const sensorTypes = await sensorTypeDAL.getAllSensorType();
    if (sensorTypes.length === 0) {
      await sensorTypeDAL.insertBulkSensorType(defaultModels.defaultSensorTypes);
    }
  } catch (error) {
    console.error('Error initializing sensor types:', error);
    throw error;
  }
};

const initializeDefaultModels = async () => {
  console.log("<-----------------------init sensor db---------------------->");
  
  try {
    const deviceTypes = await deviceTypeDAL.getDeviceTypes();
    
    if (!deviceTypes?.length) {
      await initializeDeviceAndLicenseData();
    }
    
    await initializeSensorData();
    await insertAllCountriesIfEmpty();
    await initializeDefaultModules();
    await initializeDefaultShifts();
  } catch (error) {
    console.error('Error in database initialization:', error);
    throw error;
  }
};

const runMigrations = async (sequelize) => {
  try {
    // Check if this is a fresh database by looking for core tables
    const [results] = await sequelize.query(
      `SELECT COUNT(*) as table_count FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name IN ('Settings', 'Users', 'Organizations')`
    );

    const coreTablesExist = parseInt(results[0].table_count) > 0;

    if (!coreTablesExist) {
      console.info('🆕 Fresh database detected - skipping migrations (tables will be created by Sequelize sync)');
      return;
    }

    console.info('🔄 Existing database detected - checking for pending migrations...');

    const umzug = new Umzug({
      migrations: {
        glob: path.resolve(__dirname, '../../migrations/*.js')
      },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
    });

    const migrations = await umzug.up();
    console.info("migrations--->", migrations);
    if (migrations.length > 0) {
      console.info('Migrations executed:', migrations.map(m => m.name));
    } else {
      console.info('No new migrations to execute');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

const runSeeds = async (sequelize) => {
  const seeder = new Umzug({
    migrations: {
      glob: path.resolve(__dirname, '../../seeders/*.js')
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ 
      sequelize,
      tableName: 'SequelizeSeeds' // Different table for tracking seeds
    }),
    logger: console,
  });

  try {
    const seeds = await seeder.up();
    console.info("seeds--->", seeds);
    if (seeds.length > 0) {
      console.info('Seeds executed:', seeds.map(s => s.name));
    } else {
      console.info('No new seeds to execute');
    }
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
};

const insertAllCountriesIfEmpty = async () => {
  try {
    const count = await Country.count();
    if (count === 0) {
      // Load countries from a static JSON file
      const countriesPath = path.resolve(__dirname, './countries.json');
      const countries = JSON.parse(fs.readFileSync(countriesPath, 'utf-8'));
      await Country.bulkCreate(countries);
      console.info('Inserted all countries into Country table.');
    } else {
      console.info('Country table already has entries, skipping insert.');
    }
  } catch (error) {
    console.error('Error inserting countries:', error);
    throw error;
  }
};

const initializeDefaultModules = async () => {
  try {
    const count = await Module.count();
    if (count === 0) {
      const defaultModules = [
        { module_name: 'dashboard', module_type: 'page', status: 1 },
        { module_name: 'trending', module_type: 'page', status: 1 },
        { module_name: 'alarms', module_type: 'page', status: 1 },
        { module_name: 'calibration', module_type: 'page', status: 1 },
        { module_name: 'device', module_type: 'page', status: 1 },
        { module_name: 'maintenance', module_type: 'page', status: 1 },
        { module_name: 'settings', module_type: 'page', status: 1 },
        { module_name: 'user_management', module_type: 'page', status: 1 },
        { module_name: 'about', module_type: 'page', status: 1 }
      ];

      await Module.bulkCreate(defaultModules);
      console.info('Inserted default modules into Module table.');
    } else {
      console.info('Module table already has entries, skipping insert.');
    }
  } catch (error) {
    console.error('Error inserting default modules:', error);
    throw error;
  }
};

const initializeDefaultShifts = async () => {
  try {
    const count = await Shift.count();
    if (count === 0) {
      const defaultShifts = [
        {
          shift_name: 'Morning Shift',
          start_time: '06:00:00',
          end_time: '14:00:00',
          description: 'Morning shift (6:00 AM - 2:00 PM)',
          is_active: true
        },
        {
          shift_name: 'Evening Shift',
          start_time: '14:00:00',
          end_time: '22:00:00',
          description: 'Evening shift (2:00 PM - 10:00 PM)',
          is_active: true
        },
        {
          shift_name: 'Night Shift',
          start_time: '22:00:00',
          end_time: '06:00:00',
          description: 'Night shift (10:00 PM - 6:00 AM)',
          is_active: true
        }
      ];

      await Shift.bulkCreate(defaultShifts);
      console.info('Inserted default shifts into Shift table.');
    } else {
      console.info('Shift table already has entries, skipping insert.');
    }
  } catch (error) {
    console.error('Error inserting default shifts:', error);
    throw error;
  }
};

module.exports = {
  createDatabase,
  initializeDefaultModels,
  runMigrations,
  runSeeds,
  insertAllCountriesIfEmpty,
  initializeDefaultModules,
  initializeDefaultShifts
};