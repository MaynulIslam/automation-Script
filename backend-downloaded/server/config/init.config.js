const defaultModels = require('../util/default.model');
const common = require('../util/common');

const settingsDAL = require('../api/settings/settings.helper');
const userDAL = require('../api/user/user.helper');
const shiftDAL = require('../api/shift/shift.helper');
const moduleDAL = require('../api/module/module.helper');

const initializeDevice =  async ()=> {
  try {
    const deviceSettings = await settingsDAL.getAllSettings();
    if(deviceSettings && deviceSettings.length){
      // TODO: if anything to be done
      console.info("Device settings already initialized");
    }else{
     await settingsDAL.insertSettings(defaultModels.defaultSettings)
     await initializeUsers();
     await initializeShifts();
     await initializeModules();
    }
  } catch (error) {
    await settingsDAL.insertSettings(defaultModels.defaultSettings)
    await initializeModules();
  }
}

const initializeUsers = async () => {
  let userDetailsArray = [];

  const adminConfig = common.cloneObject(defaultModels.userConfig);
  adminConfig.password = await common.hashPassword("admin");
  userDetailsArray.push(adminConfig);

  // developer
  const devConfig = common.cloneObject(defaultModels.userConfig);
  devConfig.user_name = "dev@maestro";
  devConfig.email = "dev@maestro.com";
  devConfig.password = await common.hashPassword("#3a6f91@maestro");
  devConfig.user_type = 2;
  userDetailsArray.push(devConfig);

  // test or QA
  const testConfig = common.cloneObject(defaultModels.userConfig);
  testConfig.user_name = "test@maestro";
  testConfig.email = "test@maestro.com";
  testConfig.password = await common.hashPassword("m@e$tro8M");
  testConfig.user_type = 3;
  userDetailsArray.push(testConfig);

  // guest
  const guestConfig = common.cloneObject(defaultModels.userConfig);
  guestConfig.user_name = "guest@maestro";
  guestConfig.email = "guest@maestro.com";
  guestConfig.password = await common.hashPassword("guest@123");
  guestConfig.user_type = 4;
  userDetailsArray.push(guestConfig);

  const insertPromises = userDetailsArray.map(async (user) => {
    await userDAL.insertUser(user);
  });

  try {
    await Promise.all(insertPromises);
  } catch (error) {
    console.error("Error initializing users:", error);
  }
};

const initializeShifts = async () => {
  try {
    const existingShifts = await shiftDAL.getAllShifts();
    
    // Only create default shifts if none exist
    if (!existingShifts || existingShifts.length === 0) {
      console.info("Initializing default 3x8 hour shifts...");
      
      const defaultShifts = [
        {
          shift_name: 'Morning Shift',
          start_time: '06:00:00',
          end_time: '14:00:00',
          is_enabled: true,
          note: 'Default morning shift (6 AM - 2 PM)'
        },
        {
          shift_name: 'Afternoon Shift',
          start_time: '14:00:00',
          end_time: '22:00:00',
          is_enabled: true,
          note: 'Default afternoon shift (2 PM - 10 PM)'
        },
        {
          shift_name: 'Night Shift',
          start_time: '22:00:00',
          end_time: '06:00:00',
          is_enabled: true,
          note: 'Default night shift (10 PM - 6 AM)'
        }
      ];
      
      for (const shift of defaultShifts) {
        await shiftDAL.insertShift(shift);
      }
      
      console.info("Default shifts created successfully");
    } else {
      console.info("Shifts already exist, skipping initialization");
    }
  } catch (error) {
    console.error("Error initializing shifts:", error);
  }
};

const initializeModules = async () => {
  try {
    const existingModules = await moduleDAL.getAllModules();
    
    // Only create default modules if none exist
    if (!existingModules || existingModules.length === 0) {
      console.info("Initializing default modules...");
      
      const defaultModules = [
        {
          module_name: 'Dashboard',
          module_type: 'Core',
          status: 1
        },
        {
          module_name: 'Trending',
          module_type: 'Analytics',
          status: 1
        },
        {
          module_name: 'Alarms',
          module_type: 'Monitoring',
          status: 1
        },
        {
          module_name: 'Calibration',
          module_type: 'Maintenance',
          status: 1
        },
        {
          module_name: 'Device Management',
          module_type: 'Management',
          status: 1
        },
        {
          module_name: 'Maintenance',
          module_type: 'Maintenance',
          status: 1
        },
        {
          module_name: 'User Management',
          module_type: 'Management',
          status: 1
        },
        {
          module_name: 'Settings',
          module_type: 'Configuration',
          status: 1
        },
        {
          module_name: 'About',
          module_type: 'Information',
          status: 1
        }
      ];
      
      for (const module of defaultModules) {
        await moduleDAL.createModule(module);
      }
      
      console.info("Default modules created successfully");
    } else {
      console.info("Modules already exist, skipping initialization");
    }
  } catch (error) {
    console.error("Error initializing modules:", error);
  }
};

module.exports = {
  initializeDevice
}