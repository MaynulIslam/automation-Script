INSERT INTO public."Devices"
(id, device_name, custom_time, global_unit, passcode, ip_address, netmask, gateway, primary_dns, secondary_dns, mac_id, org_id, ethip, tcpip, manual_add, legacy_auth_code, status, network_config, device_config, sensor_config, relay_config, display_config, integrated_device_config, device_priority, "createdAt", "updatedAt", device_type_id)
VALUES
(0, 'New Device', '00:00', 'Unit', '1234', '192.168.1.1', '255.255.255.0', '192.168.1.1', '8.8.8.8', '8.8.4.4', '00:1A:2B:3C:4D:5E', 1, true, true, false, 'legacyCode', 1, '{}', '{}', '{}', '{}', '{}', '{}', 10, now(), now(), 1);

INSERT INTO public."DeviceSensorMasters"
(sensor_id, fk_device_id, device_sensor_id, local_board, board, subport, sensor_config, "location", sensor_status, priority, config_type, sensor_type, serial_number, is_configured, "createdAt", "updatedAt", device_id)
VALUES(0, 0, '', '', '', '', '{"id": "test"}'::json, '', '', 0, 0, 0, 0, 0, now(), now(), 0);


INSERT INTO public."CustomFields"
(id, field_type, field_name, field_value, "createdAt", "updatedAt")
VALUES(0, 1, 'Default Level', '0', NOW(), NOW());
