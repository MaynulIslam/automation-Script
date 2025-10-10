# This file contains the helper functions for detailed failure descriptions
# Will be merged into main file after testing

def build_dashboard_failure_description(dashboard_result, devices_df):
    """Build detailed dashboard failure description"""
    if dashboard_result.get('pass', False):
        return ''

    description_lines = []

    # Get mismatched devices (if we can identify them)
    # For now, just show the counts mismatch
    frontend_total = dashboard_result.get('frontend_total', 'N/A')
    db_total = dashboard_result.get('db_total', 'N/A')

    if str(frontend_total) != str(db_total):
        description_lines.append(f"Total Devices Mismatch:")
        description_lines.append(f"  Frontend: {frontend_total} devices")
        description_lines.append(f"  Database: {db_total} devices")

    frontend_active = dashboard_result.get('frontend_active', 'N/A')
    db_active = dashboard_result.get('db_active', 'N/A')

    if str(frontend_active) != str(db_active):
        description_lines.append(f"\nActive Devices Mismatch:")
        description_lines.append(f"  Frontend: {frontend_active} devices")
        description_lines.append(f"  Database: {db_active} devices")

    frontend_offline = dashboard_result.get('frontend_offline', 'N/A')
    db_offline = dashboard_result.get('db_offline', 'N/A')

    if str(frontend_offline) != str(db_offline):
        description_lines.append(f"\nOffline Devices Mismatch:")
        description_lines.append(f"  Frontend: {frontend_offline} devices")
        description_lines.append(f"  Database: {db_offline} devices")

    return '\n'.join(description_lines)


def build_device_existence_failure_description(device_result, devices_df):
    """Build detailed device existence failure description with device names and IPs"""
    if device_result.get('pass', False):
        return ''

    description_lines = []

    # Missing devices (in DB but not in frontend)
    missing_device_names = device_result.get('missing_devices', [])
    if missing_device_names:
        description_lines.append("Frontend doesn't have these devices:")
        for device_name in missing_device_names:
            # Find device in database
            device_row = devices_df[devices_df['device_name'] == device_name]
            if not device_row.empty:
                ip_address = device_row.iloc[0]['ip_address']
                description_lines.append(f"  - {device_name} - {ip_address}")
            else:
                description_lines.append(f"  - {device_name}")

    # Extra devices (in frontend but not in DB)
    extra_device_names = device_result.get('extra_devices', [])
    if extra_device_names:
        if missing_device_names:
            description_lines.append("")
        description_lines.append("Database doesn't have these devices:")
        for device_name in extra_device_names:
            # We can't get IP from DB since it's not there, would need to extract from frontend
            description_lines.append(f"  - {device_name}")

    return '\n'.join(description_lines)


def build_sensor_sequence_failure_description(sensor_result, devices_df, sensors_df):
    """Build detailed sensor sequence failure description"""
    if sensor_result.get('pass', False):
        return ''

    description_lines = []
    failure_details = sensor_result.get('failure_details', [])

    for idx, failure in enumerate(failure_details, 1):
        device_name = failure['device_name']
        mismatches = failure.get('mismatches', [])

        # Find device IP
        device_row = devices_df[devices_df['device_name'] == device_name]
        ip_address = device_row.iloc[0]['ip_address'] if not device_row.empty else 'N/A'

        description_lines.append(f"{idx}. Device: {device_name} - {ip_address}")

        # Get expected sensor sequence from DB
        if not device_row.empty:
            device_id = device_row.iloc[0]['id']
            device_sensors = sensors_df[sensors_df['device_id'] == device_id].copy()

            # Filter configured sensors
            if device_sensors['is_configured'].notna().any():
                configured = device_sensors[device_sensors['is_configured'] != 0]
                if len(configured) > 0:
                    device_sensors = configured

            # Sort by priority
            device_sensors = device_sensors.sort_values(
                by='priority',
                key=lambda x: x.replace(0, 999)
            ).head(10)

            backend_sensors = [sensor['location'] for _, sensor in device_sensors.iterrows() if pd.notna(sensor['location'])]
            description_lines.append(f"   Backend sensor priority: {', '.join(backend_sensors)}")

        # Add mismatch details
        for mismatch in mismatches:
            description_lines.append(f"   {mismatch}")

        if idx < len(failure_details):
            description_lines.append("")

    return '\n'.join(description_lines)


def capture_failure_screenshots(page, browser, conn, iteration, timestamp,
                                dashboard_failed, device_failed, sensor_failed,
                                dashboard_result, device_result, sensor_result):
    """Capture screenshots for each type of failure"""
    evidence_files = []

    devices_df = fetch_devices_from_db(conn)
    sensors_df = fetch_sensors_from_db(conn)

    # Dashboard Matrix failure
    if dashboard_failed:
        # Frontend screenshot
        frontend_filename = f'iteration_{iteration}_{timestamp}_dashboard_matrix_frontend.png'
        frontend_path = os.path.join(os.path.dirname(__file__), 'evidence', frontend_filename)
        page.screenshot(path=frontend_path, full_page=True)
        evidence_files.append(frontend_filename)
        print(f'[SCREENSHOT] Dashboard Matrix Frontend: {frontend_filename}')

        # Database screenshot
        db_filename = f'iteration_{iteration}_{timestamp}_dashboard_matrix_database.png'
        db_path = os.path.join(os.path.dirname(__file__), 'evidence', db_filename)
        capture_db_screenshot(devices_df.head(20), f"Dashboard Matrix - Database", db_path, browser)
        evidence_files.append(db_filename)

    # Air Quality Station (Device Exists) failure
    if device_failed:
        # Frontend screenshot
        frontend_filename = f'iteration_{iteration}_{timestamp}_aqs_devices_frontend.png'
        frontend_path = os.path.join(os.path.dirname(__file__), 'evidence', frontend_filename)
        page.screenshot(path=frontend_path, full_page=True)
        evidence_files.append(frontend_filename)
        print(f'[SCREENSHOT] AQS Devices Frontend: {frontend_filename}')

        # Database screenshot - show AQS devices only
        aqs_devices = devices_df[devices_df['device_type_id'].isin([3, 4, 5])]
        db_filename = f'iteration_{iteration}_{timestamp}_aqs_devices_database.png'
        db_path = os.path.join(os.path.dirname(__file__), 'evidence', db_filename)
        capture_db_screenshot(aqs_devices[['device_name', 'ip_address', 'device_type_id']],
                            f"AQS Devices - Database", db_path, browser)
        evidence_files.append(db_filename)

    # Sensor Sequence failure
    if sensor_failed:
        # Frontend screenshot
        frontend_filename = f'iteration_{iteration}_{timestamp}_sensor_sequence_frontend.png'
        frontend_path = os.path.join(os.path.dirname(__file__), 'evidence', frontend_filename)
        page.screenshot(path=frontend_path, full_page=True)
        evidence_files.append(frontend_filename)
        print(f'[SCREENSHOT] Sensor Sequence Frontend: {frontend_filename}')

        # Database screenshot - show sensor priorities
        db_filename = f'iteration_{iteration}_{timestamp}_sensor_sequence_database.png'
        db_path = os.path.join(os.path.dirname(__file__), 'evidence', db_filename)

        # Get failed devices and their sensors
        failure_details = sensor_result.get('failure_details', [])
        if failure_details:
            failed_device_names = [f['device_name'] for f in failure_details]
            failed_device_ids = devices_df[devices_df['device_name'].isin(failed_device_names)]['id'].tolist()
            failed_sensors = sensors_df[sensors_df['device_id'].isin(failed_device_ids)]
            failed_sensors = failed_sensors[['device_id', 'location', 'priority', 'is_configured']].sort_values(['device_id', 'priority'])
            capture_db_screenshot(failed_sensors, f"Sensor Sequence - Database", db_path, browser)
        else:
            capture_db_screenshot(sensors_df.head(20), f"Sensor Sequence - Database", db_path, browser)

        evidence_files.append(db_filename)

    return evidence_files
