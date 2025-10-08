from playwright.sync_api import sync_playwright
import time
import psycopg2
import pandas as pd
import os


def login():
    """Login to Duetto Analytics application"""

    # Ask user for Duetto IP with port
    duetto_url = input('\nEnter Duetto IP address with port (e.g., http://192.168.10.232:3000/): ').strip()

    # Validate URL is not empty
    if not duetto_url:
        print('[ERROR] URL cannot be empty')
        return

    # Add http:// if not present
    if not duetto_url.startswith('http://') and not duetto_url.startswith('https://'):
        duetto_url = 'http://' + duetto_url

    # Ensure trailing slash
    if not duetto_url.endswith('/'):
        duetto_url += '/'

    print('\n' + '='*70)
    print('TESTING: Login')
    print('='*70)
    print(f'[INFO] Duetto URL: {duetto_url}')

    # Start Playwright
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=False, slow_mo=500)
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        # Navigate to login page
        print(f'[INFO] Navigating to: {duetto_url}')

        try:
            page.goto(duetto_url)
            page.wait_for_load_state('networkidle')
            time.sleep(2)
        except Exception as e:
            print(f'[ERROR] Failed to navigate to login page: {str(e)}')
            browser.close()
            return

        # Fill in credentials
        print('[INFO] Entering credentials (admin/admin)...')
        page.fill('input[name="user_name"]', 'admin')
        page.fill('input[name="password"]', 'admin')

        # Click login button
        print('[INFO] Clicking login button...')
        page.click('button[type="submit"]')
        page.wait_for_load_state('networkidle')
        time.sleep(2)

        # Check if login was successful
        current_url = page.url

        # Give it more time to load
        time.sleep(3)
        current_url = page.url

        # Try to find dashboard indicator (button or URL change)
        is_logged_in = False

        # Check 1: URL doesn't contain login
        if 'login' not in current_url.lower():
            is_logged_in = True

        # Check 2: Try to find Dashboard button (means we're logged in)
        try:
            dashboard_btn = page.get_by_role("button", name="Dashboard")
            if dashboard_btn.count() > 0:
                is_logged_in = True
        except:
            pass

        if is_logged_in:
            print('\n[SUCCESS] Login Successful')
            print(f'[INFO] Current URL: {current_url}')
            print('='*70 + '\n')
        else:
            print('\n[FAIL] Login Failed')
            print(f'[INFO] Current URL: {current_url}')
            print('='*70 + '\n')

        # Keep browser open
        input('\nPress Enter to close browser...')
        browser.close()


def data_fetch():
    """Fetch data from PostgreSQL database and store in Excel"""

    print('\n' + '='*70)
    print('FUNCTION: Data Fetch from Database')
    print('='*70)

    # Database connection details (from .env file)
    DB_HOST = '192.168.10.232'
    DB_PORT = 5432
    DB_NAME = 'duetto_analytics_db'
    DB_USER = 'postgres'
    DB_PASSWORD = 'postgrespw'

    try:
        # Connect to PostgreSQL
        print(f'[INFO] Connecting to database at {DB_HOST}:{DB_PORT}...')
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        print('[SUCCESS] Connected to database')

        cursor = conn.cursor()

        # Fetch all data from Devices table
        print('\n[STEP 1] Fetching data from Devices table...')
        cursor.execute('SELECT * FROM public."Devices"')

        # Get column names
        devices_columns = [desc[0] for desc in cursor.description]
        devices_data = cursor.fetchall()

        print(f'[OK] Retrieved {len(devices_data)} records from Devices table')

        # Create DataFrame for Devices
        devices_df = pd.DataFrame(devices_data, columns=devices_columns)

        # Convert timezone-aware datetime columns to timezone-naive
        for col in devices_df.columns:
            if pd.api.types.is_datetime64_any_dtype(devices_df[col]):
                if devices_df[col].dt.tz is not None:
                    devices_df[col] = devices_df[col].dt.tz_localize(None)

        # Fetch all data from DeviceSensorMasters table
        print('\n[STEP 2] Fetching data from DeviceSensorMasters table...')
        cursor.execute('SELECT * FROM public."DeviceSensorMasters"')

        # Get column names
        sensors_columns = [desc[0] for desc in cursor.description]
        sensors_data = cursor.fetchall()

        print(f'[OK] Retrieved {len(sensors_data)} records from DeviceSensorMasters table')

        # Create DataFrame for DeviceSensorMasters
        sensors_df = pd.DataFrame(sensors_data, columns=sensors_columns)

        # Convert timezone-aware datetime columns to timezone-naive
        for col in sensors_df.columns:
            if pd.api.types.is_datetime64_any_dtype(sensors_df[col]):
                if sensors_df[col].dt.tz is not None:
                    sensors_df[col] = sensors_df[col].dt.tz_localize(None)

        # Close database connection
        cursor.close()
        conn.close()
        print('\n[INFO] Database connection closed')

        # Save to Excel
        print('\n[STEP 3] Saving data to Excel...')
        excel_path = os.path.join(os.path.dirname(__file__), 'excel_container.xlsx')

        # Write both sheets
        with pd.ExcelWriter(excel_path, engine='openpyxl', mode='w') as writer:
            devices_df.to_excel(writer, sheet_name='list of devices', index=False)
            sensors_df.to_excel(writer, sheet_name='DeviceSensorMasters', index=False)

        print(f'[SUCCESS] Data saved to: {excel_path}')
        print(f'  - Sheet 1: "list of devices" ({len(devices_df)} rows)')
        print(f'  - Sheet 2: "DeviceSensorMasters" ({len(sensors_df)} rows)')

        print('='*70 + '\n')

    except psycopg2.Error as e:
        print(f'[ERROR] Database error: {e}')
        print('='*70 + '\n')
    except Exception as e:
        print(f'[ERROR] Unexpected error: {e}')
        print('='*70 + '\n')


def test_AQS(page):
    """Test Air Quality Stations tab - verify device count and sensor sequence"""

    print('\n' + '='*70)
    print('TEST: Air Quality Stations Tab Verification')
    print('='*70)

    # STEP 1: Load expected data from Excel
    print('\n[STEP 1] Loading expected data from Excel...')
    excel_path = os.path.join(os.path.dirname(__file__), 'excel_container.xlsx')

    devices_df = pd.read_excel(excel_path, sheet_name='list of devices')
    sensors_df = pd.read_excel(excel_path, sheet_name='DeviceSensorMasters')

    # Filter AQS devices (device_type_id = 3, 4, 5)
    aqs_devices = devices_df[devices_df['device_type_id'].isin([3, 4, 5])].copy()
    aqs_devices = aqs_devices.sort_values('id')

    print(f'[INFO] Expected AQS devices: {len(aqs_devices)}')
    for _, device in aqs_devices.iterrows():
        print(f'  - Device ID {device["id"]}: {device["device_name"]} (type_id: {device["device_type_id"]})')

    # Prepare expected sensor sequences for each device
    expected_data = {}
    for _, device in aqs_devices.iterrows():
        device_id = device['id']
        device_name = device['device_name']

        # Get sensors for this device
        device_sensors = sensors_df[sensors_df['device_id'] == device_id].copy()

        # Filter configured sensors (is_configured != 0)
        # If all are 0 or NaN, show all sensors
        if device_sensors['is_configured'].notna().any():
            configured_sensors = device_sensors[device_sensors['is_configured'] != 0]
            if len(configured_sensors) > 0:
                device_sensors = configured_sensors

        # Sort by priority (priority=0 goes to end)
        device_sensors = device_sensors.sort_values(
            by='priority',
            key=lambda x: x.replace(0, 999)  # Replace 0 with high number to push to end
        )

        # Take first 10 sensors
        device_sensors = device_sensors.head(10)

        # Build expected sensor list
        expected_sensors = []
        for idx, (_, sensor) in enumerate(device_sensors.iterrows(), 1):
            sensor_info = {
                'position': idx,
                'location': sensor['location'],
                'config_type': int(sensor['config_type']) if pd.notna(sensor['config_type']) else None,
                'sensor_type': int(sensor['sensor_type']) if pd.notna(sensor['sensor_type']) else None,
                'priority': int(sensor['priority']) if pd.notna(sensor['priority']) else 0
            }
            expected_sensors.append(sensor_info)

        expected_data[device_id] = {
            'device_name': device_name,
            'expected_sensor_count': len(expected_sensors),
            'sensors': expected_sensors
        }

    # STEP 2: Navigate to Dashboard
    print('\n[STEP 2] Navigating to Dashboard...')

    # Check if already on dashboard, if not navigate
    try:
        dashboard_btn = page.get_by_role("button", name="Dashboard")
        if dashboard_btn.count() > 0:
            print('[INFO] Already logged in, clicking Dashboard...')
            dashboard_btn.click()
            page.wait_for_load_state('networkidle')
            time.sleep(2)
    except:
        print('[ERROR] Not logged in or Dashboard button not found')
        return

    # STEP 3: Verify we're on Air Quality Stations tab (Tab 0 - should be default)
    print('\n[STEP 3] Verifying Air Quality Stations tab...')

    # Wait for table to load
    try:
        page.wait_for_selector('table tbody tr', timeout=10000)
        time.sleep(2)  # Extra wait for data to populate
    except:
        print('[ERROR] Table not found or not loaded')
        return

    # STEP 4: Count devices in frontend
    print('\n[STEP 4] Counting devices in frontend...')

    # Get all table rows
    table_rows = page.locator('table tbody tr')
    actual_device_count = table_rows.count()

    print(f'[INFO] Found devices in frontend: {actual_device_count}')

    # Compare device counts
    if actual_device_count == len(aqs_devices):
        print(f'[PASS] Device count matches! Expected: {len(aqs_devices)}, Found: {actual_device_count}')
    else:
        print(f'[FAIL] Device count mismatch! Expected: {len(aqs_devices)}, Found: {actual_device_count}')

    # STEP 5: Verify sensor sequence for each device
    print('\n[STEP 5] Verifying sensor sequences...')
    print('-' * 70)

    passed_devices = 0
    failed_devices = 0

    for row_idx in range(actual_device_count):
        row = table_rows.nth(row_idx)

        # Extract device name from Location column (2nd column, index 1)
        # The device name is in a link within ListItemText
        try:
            device_name_cell = row.locator('td').nth(1)
            device_name_text = device_name_cell.inner_text().split('\n')[0].strip()

            print(f'\n[Device {row_idx + 1}] {device_name_text}')

            # Find this device in expected data
            device_id = None
            for dev_id, dev_data in expected_data.items():
                if dev_data['device_name'] == device_name_text:
                    device_id = dev_id
                    break

            if device_id is None:
                print(f'[WARN] Device "{device_name_text}" not found in expected data')
                failed_devices += 1
                continue

            expected_sensors = expected_data[device_id]['sensors']
            print(f'Expected sensors: {len(expected_sensors)}')

            # Extract sensors from columns 3-12 (Sensor 1-10)
            sensor_match_count = 0
            sensor_mismatch_count = 0

            for sensor_idx, expected_sensor in enumerate(expected_sensors):
                position = expected_sensor['position']
                expected_location = expected_sensor['location']
                expected_config_type = expected_sensor['config_type']

                # Column index: 0=Product, 1=Location, 2=Sensor1, 3=Sensor2, etc.
                sensor_column_idx = 1 + position  # +1 because location is at index 1

                try:
                    sensor_cell = row.locator('td').nth(sensor_column_idx)
                    sensor_text = sensor_cell.inner_text().strip()

                    # Check if sensor location matches
                    if expected_location and expected_location in sensor_text:
                        print(f'  ✓ Sensor {position}: {expected_location} (config_type: {expected_config_type})')
                        sensor_match_count += 1
                    else:
                        print(f'  ✗ Sensor {position}: Expected "{expected_location}", but found "{sensor_text[:50]}"')
                        sensor_mismatch_count += 1

                except Exception as e:
                    print(f'  ✗ Sensor {position}: Could not read sensor data - {str(e)}')
                    sensor_mismatch_count += 1

            # Check remaining columns should be empty
            for empty_position in range(len(expected_sensors) + 1, 11):
                sensor_column_idx = 1 + empty_position
                try:
                    sensor_cell = row.locator('td').nth(sensor_column_idx)
                    sensor_text = sensor_cell.inner_text().strip()
                    if sensor_text and 'Not Installed' not in sensor_text:
                        print(f'  [WARN] Sensor {empty_position}: Expected empty, but found content')
                except:
                    pass  # Empty is expected

            # Determine pass/fail for this device
            if sensor_mismatch_count == 0:
                print(f'[PASS] Sensor sequence verified ({sensor_match_count}/{len(expected_sensors)})')
                passed_devices += 1
            else:
                print(f'[FAIL] Sensor sequence mismatch ({sensor_match_count} matches, {sensor_mismatch_count} mismatches)')
                failed_devices += 1

        except Exception as e:
            print(f'[ERROR] Failed to process device row {row_idx}: {str(e)}')
            failed_devices += 1

    # STEP 6: Summary
    print('\n' + '='*70)
    print('TEST SUMMARY')
    print('='*70)
    print(f'Total devices tested: {passed_devices + failed_devices}')
    print(f'Passed: {passed_devices}')
    print(f'Failed: {failed_devices}')

    if failed_devices == 0 and actual_device_count == len(aqs_devices):
        print('\n[OVERALL RESULT] ✓ PASS - All verifications passed!')
    else:
        print('\n[OVERALL RESULT] ✗ FAIL - Some verifications failed')

    print('='*70 + '\n')


def run_full_test():
    """Run complete test workflow: login → data_fetch → test_AQS"""

    print('\n' + '#'*70)
    print('# DUETTO ANALYTICS - FULL TEST WORKFLOW')
    print('#'*70 + '\n')

    # Step 1: Fetch latest data from database
    print('[WORKFLOW] Step 1: Fetching latest data from database...')
    data_fetch()

    # Step 2: Launch browser and login
    print('\n[WORKFLOW] Step 2: Launching browser and logging in...')

    # Ask user for Duetto IP with port
    duetto_url = input('\nEnter Duetto IP address with port (e.g., http://192.168.10.232:3000/): ').strip()

    # Validate URL is not empty
    if not duetto_url:
        print('[ERROR] URL cannot be empty')
        return

    # Add http:// if not present
    if not duetto_url.startswith('http://') and not duetto_url.startswith('https://'):
        duetto_url = 'http://' + duetto_url

    # Ensure trailing slash
    if not duetto_url.endswith('/'):
        duetto_url += '/'

    # Start Playwright
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=False, slow_mo=500)
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        # Navigate to login page
        print(f'[INFO] Navigating to: {duetto_url}')

        try:
            page.goto(duetto_url)
            page.wait_for_load_state('networkidle')
            time.sleep(2)
        except Exception as e:
            print(f'[ERROR] Failed to navigate to login page: {str(e)}')
            browser.close()
            return

        # Fill in credentials
        print('[INFO] Entering credentials (admin/admin)...')
        page.fill('input[name="user_name"]', 'admin')
        page.fill('input[name="password"]', 'admin')

        # Click login button
        print('[INFO] Clicking login button...')
        page.click('button[type="submit"]')
        page.wait_for_load_state('networkidle')
        time.sleep(3)

        # Check if login was successful
        current_url = page.url

        is_logged_in = False

        # Check 1: URL doesn't contain login
        if 'login' not in current_url.lower():
            is_logged_in = True

        # Check 2: Try to find Dashboard button
        try:
            dashboard_btn = page.get_by_role("button", name="Dashboard")
            if dashboard_btn.count() > 0:
                is_logged_in = True
        except:
            pass

        if is_logged_in:
            print('[SUCCESS] Login Successful')
            print(f'[INFO] Current URL: {current_url}')
        else:
            print('[FAIL] Login Failed')
            print(f'[INFO] Current URL: {current_url}')
            browser.close()
            return

        # Step 3: Run test_AQS
        print('\n[WORKFLOW] Step 3: Running Air Quality Stations verification...')
        test_AQS(page)

        # Keep browser open
        input('\nPress Enter to close browser and exit...')
        browser.close()

    print('\n[WORKFLOW] Test workflow completed!\n')


if __name__ == '__main__':
    # Run the full test workflow
    run_full_test()
