const sequelize = require("./database");

const insertDefaultRecords = async () => {
  try {
    // Raw queries for default records
    const defaultQueries = [
      `INSERT INTO public."Devices" (
          id, device_name, custom_time, global_unit, passcode, 
          ip_address, netmask, gateway, primary_dns, secondary_dns, 
          mac_id, org_id, ethip, tcpip, manual_add, 
          legacy_auth_code, status, network_config, device_config, 
          sensor_config, relay_config, display_config, 
          integrated_device_config, device_priority, "createdAt", "updatedAt", device_type_id
      ) VALUES (
          0, 'New Device', '00:00', 'Unit', '1234',
          '192.168.1.1', '255.255.255.0', '192.168.1.1', '8.8.8.8', '8.8.4.4',
          '00:1A:2B:3C:4D:5E', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', true, true, false,
          'legacyCode', 1, '{}', '{}', '{}', '{}', '{}',
          '{}', 10, NOW(), NOW(), 1
      ) ON CONFLICT (id) DO NOTHING`,

      `INSERT INTO public."DeviceSensorMasters" (
        sensor_id, fk_device_id, device_sensor_id, local_board,
        board, subport, sensor_config, "location", sensor_status,
        priority, config_type, sensor_type, serial_number,
        is_configured, "createdAt", "updatedAt", device_id
      ) VALUES (
        0, 0, '', '', '', '', '{"id": "test"}'::json, '', '',
        0, 0, 0, 0, 0, NOW(), NOW(), 0
      ) ON CONFLICT (sensor_id) DO NOTHING`,

      `INSERT INTO public."CustomFields" (
        id, field_type, field_name, field_value, "createdAt", "updatedAt"
      ) VALUES (
        0, 1, 'Default Level', '0', NOW(), NOW()
      ) ON CONFLICT (id) DO NOTHING`,

      `INSERT INTO public."CalibrationRules" (
        id, rule_name, rule_type, interval, rule_status, "createdAt", "updatedAt"
      ) VALUES (
        1, 'Global', 1, 60, 1, NOW(), NOW()
      ) ON CONFLICT (id) DO NOTHING`,

      `INSERT INTO public."CustomFields" (
        id, field_type, field_name, field_value, "createdAt", "updatedAt"
      ) VALUES (
        1, 1, 'Level 3000RAR', 'Level 3000RAR', NOW(), NOW()
      ) ON CONFLICT (id) DO NOTHING`,

      `INSERT INTO public."AlarmCategories" (
        category_id, category_name, subcategory_name, message, is_failure, description, status, source_type, "createdAt", "updatedAt"
      ) VALUES
      (0, 'Normal Operation', 'Normal Operation', 'Normal Operation', FALSE, 'System operating normally', 1, 1, NOW(), NOW()),
      (1, 'Communication Error', 'Modbus Communication Error', 'Modbus Communication Error', TRUE, 'Communication failure detected with the device', 1, 1, NOW(), NOW()),
      (2, 'Communication Error', 'Ethernet/IP Communication Error', 'Ethernet/IP Communication Error', TRUE, 'Communication failure detected with the device', 1, 1, NOW(), NOW()),
      (3, 'Communication Error', 'IP Conflict', 'IP Conflict', TRUE, NULL, 1, 1, NOW(), NOW()),
      (4, 'Communication Error', 'Device Offline (Ping)', 'Device Offline (Ping)', TRUE, NULL, 1, 1, NOW(), NOW()),
      (5, 'Wiring and Termination Issue', 'Cable Short', 'Cable Short', TRUE, NULL, 1, 1, NOW(), NOW()),
      (6, 'Wiring and Termination Issue', 'Power Supply', 'Power Supply', TRUE, NULL, 1, 1, NOW(), NOW()),
      (7, 'Wiring and Termination Issue', 'Termination resistor', 'Termination resistor', TRUE, NULL, 1, 1, NOW(), NOW()),
      (8, 'Wiring and Termination Issue', 'Cable termination', 'Cable termination', TRUE, NULL, 1, 1, NOW(), NOW()),
      (9, 'Wiring and Termination Issue', 'RJ45 Unplugged', 'RJ45 Unplugged', TRUE, NULL, 1, 1, NOW(), NOW()),
      (10, 'Wiring and Termination Issue', 'RJ45 Corrosion', 'RJ45 Corrosion', TRUE, NULL, 1, 1, NOW(), NOW()),
      (11, 'Wiring and Termination Issue', 'Junction box damaged', 'Junction box damaged', TRUE, NULL, 1, 1, NOW(), NOW()),
      (12, 'Wiring and Termination Issue', 'Low Sensor Voltage', 'Low Sensor Voltage', TRUE, NULL, 1, 1, NOW(), NOW()),
      (13, 'Internal Hardware Fault', 'PoE controller', 'PoE controller', TRUE, NULL, 1, 1, NOW(), NOW()),
      (14, 'Internal Hardware Fault', 'Switch processor damaged', 'Switch processor damaged', TRUE, NULL, 1, 1, NOW(), NOW()),
      (15, 'Internal Hardware Fault', 'Power distribution', 'Power distribution', TRUE, NULL, 1, 1, NOW(), NOW()),
      (16, 'USB Failure', 'Missing USB', 'Missing USB', TRUE, NULL, 1, 1, NOW(), NOW()),
      (17, 'USB Failure', 'Bad File', 'Bad File', TRUE, NULL, 1, 1, NOW(), NOW()),
      (18, 'USB Failure', 'Corrupted USB', 'Corrupted USB', TRUE, NULL, 1, 1, NOW(), NOW()),
      (19, 'Device Failure', 'EEPROM damaged', 'EEPROM damaged', TRUE, NULL, 1, 1, NOW(), NOW()),
      (20, 'Sensor Failure', 'EEPROM damaged', 'EEPROM damaged', TRUE, NULL, 1, 2, NOW(), NOW()),
      (21, 'Sensor Failure', 'Sensor Missing', 'Sensor Missing', TRUE, NULL, 1, 2, NOW(), NOW()),
      (22, 'Sensor Failure', 'Sensor Fault', 'Sensor Fault', TRUE, NULL, 1, 2, NOW(), NOW()),
      (23, 'Sensor Failure', 'Sensor End of Life', 'Sensor End of Life', TRUE, NULL, 1, 2, NOW(), NOW()),
      (24, 'Sensor Failure', 'Sensor Expired', 'Sensor Expired', TRUE, NULL, 1, 2, NOW(), NOW()),
      (25, 'Sensor Failure', 'Unknown Fault', 'Unknown Fault', TRUE, NULL, 1, 2, NOW(), NOW()),
      (26, 'Sensor Failure', 'Sensor Blocked', 'Sensor Blocked', TRUE, NULL, 1, 2, NOW(), NOW()),
      (27, 'Sensor Failure', 'Invalid Transit time window', 'Invalid Transit time window', TRUE, NULL, 1, 2, NOW(), NOW()),
      (28, 'Sensor Failure', 'Face to Face Range exceeded', 'Face to Face Range exceeded', TRUE, NULL, 1, 2, NOW(), NOW()),
      (29, 'Sensor Failure', 'Sensor Misaligned', 'Sensor Misaligned', TRUE, NULL, 1, 2, NOW(), NOW()),
      (30, 'Calibration Failure', 'Zero Calibration Fault', 'Zero Calibration Fault', TRUE, NULL, 1, 2, NOW(), NOW()),
      (31, 'Calibration Failure', 'Span Calibration Fault', 'Span Calibration Fault', TRUE, NULL, 1, 2, NOW(), NOW()),
      (32, 'Calibration Failure', 'Factor Calibration Fault', 'Factor Calibration Fault', TRUE, NULL, 1, 2, NOW(), NOW()),
      (33, 'Calibration Failure', 'Calibration gas expired', 'Calibration gas expired', TRUE, NULL, 1, 2, NOW(), NOW()),
      (34, 'Sensor Alarm', 'Low Alarm', 'Low Alarm', FALSE, NULL, 1, 2, NOW(), NOW()),
      (35, 'Sensor Alarm', 'High Alarm', 'High Alarm', FALSE, NULL, 1, 2, NOW(), NOW()),
      (36, 'Sensor Warning', 'Low Warning', 'Low Warning', FALSE, NULL, 1, 2, NOW(), NOW()),
      (37, 'Sensor Warning', 'High Warning', 'High Warning', FALSE, NULL, 1, 2, NOW(), NOW()),
      (38, 'Sensor Warning', 'Sensor Warming Up', 'Sensor Warming Up', FALSE, NULL, 1, 2, NOW(), NOW())
      ON CONFLICT (category_id) DO NOTHING`,
    ];

    // Execute queries in a transaction
    await sequelize.transaction(async (t) => {
      for (const query of defaultQueries) {
        await sequelize.query(query, {
          transaction: t,
          raw: true
        });
      }
    });

    console.info('Successfully inserted default records');
  } catch (error) {
    console.error('Error inserting default records:', error);
    throw error;
  }
};

module.exports = {
  insertDefaultRecords
};