
const userConfig = {
  first_name: "user",
  last_name: "user",
  user_name: "admin",
  password: "admin",
  email: "demo@maestro.com",
  mobile: "1213412",
  user_type: 1, // 1- Admin, 2 - Dev, 3 - Normal User, 4 - Guest
  status: 1,
};

const defaultDeviceTypeConfig = [
  {
    manufacturer: "High Grade Controls",
    type_name: "ModuDrive",
    type_code: "MOD05",
    comm_type: "MQTT",
    status: 1,
  },
  {
    manufacturer: "High Grade Controls",
    type_name: "Marquee",
    type_code: "MRQ05",
    comm_type: "MQTT",
    status: 1,
  },
  {
    manufacturer: "High Grade Controls",
    type_name: "Vigilante 2.0",
    type_code: "AQI05",
    comm_type: "MQTT",
    status: 1,
  },
  {
    manufacturer: "High Grade Controls",
    type_name: "ZEPHYR",
    type_code: "AQI04",
    comm_type: "XML",
    status: 1,
  },
  {
    manufacturer: "High Grade Controls",
    type_name: "Vigilante 1.0",
    type_code: "AQI02",
    comm_type: "XML",
    status: 1,
  },
  {
    manufacturer: "High Grade Controls",
    type_name: "Plexus",
    type_code: "PSW01",
    comm_type: "XML",
    status: 1,
  }
];

const deviceSensorType = [
  {
    "screen_name": "N/A",                   // Type: 0 if device is selected
    "sensor": "N/A",
    "range": "N/A",
    "type": "N/A",
    "abbreviation": "N/A",
    "unit": "N/A",
    "screen_unit": "N/A",
    "max": 0,
    "span": 0,
    "decimal_places": 0
  }
]

const defaultSensorTypes = [
  {
    "id": 1,
    "screen_name": "CO  ",                   // Type: 1
    "sensor": "Carbon Monoxide",
    "range": "100 ppm",
    "type": "Carbon Monoxide -- 100 ppm",
    "abbreviation": "CO",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 100,
    "span": 50,
    "decimal_places": 1
  }, {
    "id": 2,
    "screen_name": "CO  ",                   // Type: 2
    "sensor": "Carbon Monoxide",
    "range": "500 ppm",
    "type": "Carbon Monoxide -- 500 ppm",
    "abbreviation": "CO",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 500,
    "span": 250,
    "decimal_places": 0
  }, {
    "id": 3,
    "screen_name": "CO  ",                   // Type: 3
    "sensor": "Carbon Monoxide",
    "range": "1000 ppm",
    "type": "Carbon Monoxide -- 1000 ppm",
    "abbreviation": "CO",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 999,
    "span": 500,
    "decimal_places": 0
  }, {
    "id": 4,
    "screen_name": "NO2 ",                   // Type: 4
    "sensor": "Nitrogen Dioxide",
    "range": "10 ppm",
    "type": "Nitrogen Dioxide -- 10 ppm",
    "abbreviation": "NO<sub style='font-size: 60%;line-height: 60%'>2</sub>",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 10,
    "span": 5,
    "decimal_places": 1
  }, {
    "id": 5,
    "screen_name": "NO  ",                   // Type: 5
    "sensor": "Nitric Oxide",
    "range": "100 ppm",
    "type": "Nitric Oxide -- 100 ppm",
    "abbreviation": "NO",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 100,
    "span": 50,
    "decimal_places": 1
  }, {
    "id": 6,
    "screen_name": "NO  ",                   // Type: 6
    "sensor": "Nitric Oxide",
    "range": "500 ppm",
    "type": "Nitric Oxide -- 500 ppm",
    "abbreviation": "NO",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 500,
    "span": 250,
    "decimal_places": 0
  }, {
    "id": 7,
    "screen_name": "NO  ",                   // Type: 7
    "sensor": "Nitric Oxide",
    "range": "1000 ppm",
    "type": "Nitric Oxide -- 1000 ppm",
    "abbreviation": "NO",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 999,
    "span": 500,
    "decimal_places": 0
  }, {
    "id": 8,
    "screen_name": "O2  ",                   // Type: 8
    "sensor": "Oxygen",
    "range": "25.0 %",
    "type": "Oxygen -- 25.0 %",
    "abbreviation": "O<sub style='font-size: 60%;line-height: 60%'>2</sub>",
    "unit": "%",
    "screen_unit": "PCT",
    "max": 25,
    "span": 20.9,
    "decimal_places": 1
  }, {
    "id": 9,
    "screen_name": "H2S ",                   // Type: 9
    "sensor": "Hydrogen Sulfide",
    "range": "50 ppm",
    "type": "Hydrogen Sulfide -- 50 ppm",
    "abbreviation": "H<sub style='font-size: 60%;line-height: 60%'>2</sub>S",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 50,
    "span": 25,
    "decimal_places": 1
  }, {
    "id": 10,
    "screen_name": "H2S ",                   // Type: 10
    "sensor": "Hydrogen Sulfide",
    "range": "100 ppm",
    "type": "Hydrogen Sulfide -- 100 ppm",
    "abbreviation": "H<sub style='font-size: 60%;line-height: 60%'>2</sub>S",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 100,
    "span": 50,
    "decimal_places": 0
  }, {
    "id": 11,
    "screen_name": "SO2 ",                   // Type: 11
    "sensor": "Sulfur Dioxide",
    "range": "10 ppm",
    "type": "Sulfur Dioxide -- 10 ppm",
    "abbreviation": "SO<sub style='font-size: 60%;line-height: 60%'>2</sub>",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 10,
    "span": 5,
    "decimal_places": 1
  }, {
    "id": 12,
    "screen_name": "SO2 ",                   // Type: 12
    "sensor": "Sulfur Dioxide",
    "range": "1000 ppm",
    "type": "Sulfur Dioxide -- 1000 ppm",
    "abbreviation": "SO<sub style='font-size: 60%;line-height: 60%'>2</sub>",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 1000,
    "span": 500,
    "decimal_places": 0
  }, {
    "id": 13,
    "screen_name": "CLO2  ",                   // Type: 13
    "sensor": "Chlorine Dioxide",
    "range": "3 ppm",
    "type": "Chlorine Dioxide -- 3 ppm",
    "abbreviation": "CLO2",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 3,
    "span": 1,
    "decimal_places": 1
  }, {
    "id": 14,
    "screen_name": "CL2 ",                   // Type: 14
    "sensor": "Chlorine",
    "range": "5 ppm",
    "type": "Chlorine -- 5 ppm",
    "abbreviation": "CL<sub style='font-size: 60%;line-height: 60%'>2</sub>",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 5,
    "span": 2,
    "decimal_places": 2
  }, {
    "id": 15,
    "screen_name": "NH3 ",                   // Type: 15
    "sensor": "Ammonia",
    "range": "100 ppm",
    "type": "Ammonia -- 100 ppm",
    "abbreviation": "NH<sub style='font-size: 60%;line-height: 60%'>3</sub>",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 100,
    "span": 50,
    "decimal_places": 1
  }, {
    "id": 16,
    "screen_name": "CO2 ",                   // Type: 16
    "sensor": "Carbon Dioxide",
    "range": "0.5 %",
    "type": "Carbon Dioxide -- 0.5 %",
    "abbreviation": "CO<sub style='font-size: 60%;line-height: 60%'>2</sub>",
    "unit": "%",
    "screen_unit": "PCT",
    "max": 0.5,
    "span": 0.5,
    "decimal_places": 2
  }, {
    "id": 17,
    "screen_name": "CO2 ",                   // Type: 17
    "sensor": "Carbon Dioxide",
    "range": "2 %",
    "type": "Carbon Dioxide -- 2 %",
    "abbreviation": "CO<sub style='font-size: 60%;line-height: 60%'>2</sub>",
    "unit": "%",
    "screen_unit": "PCT",
    "max": 2,
    "span": 2,
    "decimal_places": 2
  }, {
    "id": 18,
    "screen_name": "CO2 ",                   // Type: 18
    "sensor": "Carbon Dioxide",
    "range": "5 %",
    "type": "Carbon Dioxide -- 5 %",
    "abbreviation": "CO<sub style='font-size: 60%;line-height: 60%'>2</sub>",
    "unit": "%",
    "screen_unit": "PCT",
    "max": 5,
    "span": 5,
    "decimal_places": 2
  }, {
    "id": 19,
    "screen_name": "CH4 ",                   // Type: 19
    "sensor": "Methane",
    "range": "100% LEL",
    "type": "Methane -- 100% LEL",
    "abbreviation": "CH<sub style='font-size: 60%;line-height: 60%'>4</sub>",
    "unit": "% LEL",
    "screen_unit": "% LEL",
    "max": 100,
    "span": 50,
    "decimal_places": 1
  }, {
    "id": 20,
    "screen_name": "C3H8",                   // Type: 20
    "sensor": "Propane",
    "range": "100% LEL",
    "type": "Propane -- 100% LEL",
    "abbreviation": "C<sub style='font-size: 60%;line-height: 60%'>3</sub>H<sub style='font-size: 60%;line-height: 60%'>8</sub>",
    "unit": "% LEL",
    "screen_unit": "% LEL",
    "max": 100,
    "span": 50,
    "decimal_places": 0
  }, {
    "id": 21,
    "screen_name": "HCN ",                   // Type: 21
    "sensor": "Hydrogen Cyanide",
    "range": "10 ppm",
    "type": "Hydrogen Cyanide -- 10 ppm",
    "abbreviation": "HCN",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 10,
    "span": 5,
    "decimal_places": 2
  }, {
    "id": 22,
    "screen_name": "SO2 ",                   // Type: 22
    "sensor": "Sulfur Dioxide",
    "range": "20 ppm",
    "type": "Sulfur Dioxide -- 20 ppm",
    "abbreviation": "SO<sub style='font-size: 60%;line-height: 60%'>2</sub>",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 20,
    "span": 10,
    "decimal_places": 0
  }, {
    "id": 23,
    "screen_name": "CO  ",                   // Type: 23
    "sensor": "Carbon Monoxide",
    "range": "25 ppm",
    "type": "Carbon Monoxide -- 25 ppm",
    "abbreviation": "CO",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 25,
    "span": 5,
    "decimal_places": 0
  }, {
    "id": 24,
    "screen_name": "NO2 ",                   // Type: 24
    "sensor": "Nitrogen Dioxide",
    "range": "300 ppm",
    "type": "Nitrogen Dioxide -- 300 ppm",
    "abbreviation": "NO<sub style='font-size: 60%;line-height: 60%'>2</sub>",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 300,
    "span": 150,
    "decimal_places": 1
  }, {
    "id": 25,
    "screen_name": "SO2 ",                   // Type: 25
    "sensor": "Sulfur Dioxide",
    "range": "3 ppm",
    "type": "Sulfur Dioxide -- 3 ppm",
    "abbreviation": "SO<sub style='font-size: 60%;line-height: 60%'>2</sub>",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 3,
    "span": 5,
    "decimal_places": 0
  }, {
    "id": 26,
    "screen_name": "SO2 ",                   // Type: 26
    "sensor": "Sulfur Dioxide",
    "range": "300 ppm",
    "type": "Sulfur Dioxide -- 300 ppm",
    "abbreviation": "SO<sub style='font-size: 60%;line-height: 60%'>2</sub>",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 300,
    "span": 150,
    "decimal_places": 0
  }, {
    "id": 27,
    "screen_name": "NO2 ",                   // Type: 27
    "sensor": "Nitrogen Dioxide",
    "range": "5 ppm",
    "type": "Nitrogen Dioxide -- 5 ppm",
    "abbreviation": "NO<sub style='font-size: 60%;line-height: 60%'>2</sub>",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 5,
    "span": 5,
    "decimal_places": 1
  }, {
    "id": 28,
    "screen_name": "SO2 ",                   // Type: 28
    "sensor": "Sulfur Dioxide",
    "range": "5 ppm",
    "type": "Sulfur Dioxide -- 5 ppm",
    "abbreviation": "SO<sub style='font-size: 60%;line-height: 60%'>2</sub>",
    "unit": "ppm",
    "screen_unit": "PPM",
    "max": 5,
    "span": 5,
    "decimal_places": 0
  },
  {
    "id": 0,
    "screen_name": "N/A",                   // Type: 0 if device is selected
    "sensor": "N/A",
    "range": "N/A",
    "type": "N/A",
    "abbreviation": "N/A",
    "unit": "N/A",
    "screen_unit": "N/A",
    "max": 0,
    "span": 0,
    "decimal_places": 0
  }
];

const defaultSettings = {
  device_name: 'Duetto-Analytics',
  ip_address: '192.168.10.174', 
  sw_version: '1.0.0',
  poll: 8,
  status: 1,
  is_demo_mode: false,
}

const defaultLicensePlans = [
  {
    name: 'Free',
    code: 'DAS-3',
    description: 'Free plan with limited features', 
    features: {
        maxDevices: 3,
        storage: '5GB',
        customDomain: false,
        apiAccess: false,
        support: 'email',
        backups: false
    },
    billing_cycle: 'monthly',
    status: 1
  }, 
  {
    name: 'Standard 5',
    code: 'DAS-5',
    description: 'Standard plan for small teams with up to 5 devices',
    features: {
      maxDevices: 5,
      storage: '50GB',
      customDomain: false,
      apiAccess: false,
      support: 'email',
      backups: 'weekly'
    },
    billing_cycle: 'monthly',
    status: 1
  },
  {
    name: 'Standard 10',
    code: 'DAS-10',
    description: 'Standard plan for growing teams with up to 10 devices',
    features: {
      maxDevices: 10,
      storage: '50GB',
      customDomain: false,
      apiAccess: false,
      support: 'email',
      backups: 'weekly'
    },
    billing_cycle: 'monthly',
    status: 1
  },
  {
    name: 'Standard 25',
    code: 'DAS-25',
    description: 'Standard plan for medium teams with up to 25 devices',
    features: {
      maxDevices: 25,
      storage: '50GB',
      customDomain: false,
      apiAccess: false,
      support: 'email',
      backups: 'weekly'
    },
    billing_cycle: 'monthly',
    status: 1
  },
  {
    name: 'Professional 5',
    code: 'DAP-5',
    description: 'Professional plan with advanced features for up to 5 devices',
    features: {
      maxDevices: 5,
      storage: '250GB',
      customDomain: true,
      apiAccess: true,
      support: 'priority',
      backups: 'daily',
      ssoAuth: true,
      advancedAnalytics: true
    },
    billing_cycle: 'monthly',
    status: 1
  },
  {
    name: 'Professional 10',
    code: 'DAP-10',
    description: 'Professional plan with advanced features for up to 10 devices',
    features: {
      maxDevices: 10,
      storage: '250GB',
      customDomain: true,
      apiAccess: true,
      support: 'priority',
      backups: 'daily',
      ssoAuth: true,
      advancedAnalytics: true
    },
    billing_cycle: 'monthly',
    status: 1
  },
  {
    name: 'Professional 25',
    code: 'DAP-25',
    description: 'Professional plan with advanced features for up to 25 devices',
    features: {
      maxDevices: 25,
      storage: '250GB',
      customDomain: true,
      apiAccess: true,
      support: 'priority',
      backups: 'daily',
      ssoAuth: true,
      advancedAnalytics: true
    },
    billing_cycle: 'monthly',
    status: 1
  },
  {
    name: 'Professional 50',
    code: 'DAP-50',
    description: 'Professional plan with advanced features for up to 50 devices',
    features: {
      maxDevices: 50,
      storage: '500GB',
      customDomain: true,
      apiAccess: true,
      support: 'priority',
      backups: 'daily',
      ssoAuth: true,
      advancedAnalytics: true
    },
    billing_cycle: 'monthly',
    status: 1
  },
  {
    name: 'Professional 100',
    code: 'DAP-100',
    description: 'Professional plan with advanced features for up to 100 devices',
    features: {
      maxDevices: 100,
      storage: '750GB',
      customDomain: true,
      apiAccess: true,
      support: 'priority',
      backups: 'daily',
      ssoAuth: true,
      advancedAnalytics: true
    },
    billing_cycle: 'monthly',
    status: 1
  },
  {
    name: 'Professional 200',
    code: 'DAP-200',
    description: 'Professional plan with advanced features for up to 200 devices',
    features: {
      maxDevices: 200,
      storage: '1TB',
      customDomain: true,
      apiAccess: true,
      support: 'priority',
      backups: 'daily',
      ssoAuth: true,
      advancedAnalytics: true
    },
    billing_cycle: 'monthly',
    status: 1
  },
  {
    name: 'Professional Unlimited',
    code: 'DAP-X',
    description: 'Professional plan with advanced features for unlimited devices',
    features: {
      maxDevices: 1000,
      storage: '2TB',
      customDomain: true,
      apiAccess: true,
      support: '24/7 dedicated',
      backups: 'real-time',
      ssoAuth: true,
      advancedAnalytics: true,
      sla: '99.99%',
      customization: true,
      dedicated: true
    },
    billing_cycle: 'monthly',
    status: 1
  }
];

module.exports = {
  defaultDeviceTypeConfig,
  userConfig,
  defaultSettings,
  deviceSensorType,
  defaultSensorTypes,
  defaultLicensePlans
}