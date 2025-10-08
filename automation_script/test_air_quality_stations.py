import pytest
# import allure  # TODO: Re-enable after automation script is complete
from playwright.sync_api import Page, expect
import time
import pandas as pd
import os
import random
from datetime import datetime
import paho.mqtt.client as mqtt
import json


def display_air_quality_stations(page: Page):
    """Display Air Quality Stations tab table"""

    print('\n' + '='*70)
    print('TESTING: Air Quality Stations')
    print('='*70)

    # Navigate to dashboard and click on Dashboard button
    print('\n[INFO] Navigating to Dashboard...')
    try:
        dashboard_nav = page.get_by_role("button", name="Dashboard").first
        dashboard_nav.click()
        page.wait_for_load_state('networkidle')
        time.sleep(2)
    except:
        pass  # Already on dashboard

    # Click on Air Quality Stations tab
    print('[INFO] Clicking on Air Quality Stations tab...')
    tabs = page.locator('button[role="tab"]')
    if tabs.count() > 0:
        tabs.nth(0).click()
        time.sleep(2)

    # Get all rows
    rows = page.locator('tbody tr')
    row_count = rows.count()
    print(f'\n[INFO] Found {row_count} devices\n')

    if row_count == 0:
        print('[INFO] No devices found in Air Quality Stations tab')
        print('\n' + '='*70 + '\n')
        return

    # Prepare data for Excel and terminal display
    data = {
        'Image': [],
        'Location': [],
        'Sensor 1': [],
        'Sensor 2': [],
        'Sensor 3': [],
        'Sensor 4': [],
        'Sensor 5': [],
        'Sensor 6': [],
        'Sensor 7': [],
        'Sensor 8': [],
        'Sensor 9': [],
        'Sensor 10': [],
        'Actions': []
    }

    # Print table header
    print('='*150)
    print(f'{"Image":<10} | {"Location":<20} | {"Sensor 1":<15} | {"Sensor 2":<15} | {"Sensor 3":<15} | {"Sensor 4":<15} | {"Sensor 5":<15} | {"Actions":<10}')
    print('='*150)

    # Extract data from each row
    for i in range(row_count):
        try:
            row = rows.nth(i)
            cells = row.locator('td')
            cell_count = cells.count()

            # Column 1: Image (just print "Image")
            col_image = "Image"

            # Column 2: Location
            col_location = ""
            if cell_count > 1:
                location_text = cells.nth(1).inner_text()
                col_location = location_text.replace('\n', ' ').strip()

            # Columns 3-12: All 10 sensors
            sensors = []
            for j in range(2, min(12, cell_count - 1)):  # Get all 10 sensors
                sensor_text = cells.nth(j).inner_text()
                sensor_text = sensor_text.replace('\n', ' ').strip()
                sensors.append(sensor_text)

            # Pad sensors list if less than 10
            while len(sensors) < 10:
                sensors.append("")

            # Actions
            col_actions = "[Link]"

            # Add to data dictionary for Excel
            data['Image'].append(col_image)
            data['Location'].append(col_location)
            data['Sensor 1'].append(sensors[0])
            data['Sensor 2'].append(sensors[1])
            data['Sensor 3'].append(sensors[2])
            data['Sensor 4'].append(sensors[3])
            data['Sensor 5'].append(sensors[4])
            data['Sensor 6'].append(sensors[5])
            data['Sensor 7'].append(sensors[6])
            data['Sensor 8'].append(sensors[7])
            data['Sensor 9'].append(sensors[8])
            data['Sensor 10'].append(sensors[9])
            data['Actions'].append(col_actions)

            # Print row (showing first 5 sensors only for terminal display)
            print(f'{col_image:<10} | {col_location:<20} | {sensors[0]:<15} | {sensors[1]:<15} | {sensors[2]:<15} | {sensors[3]:<15} | {sensors[4]:<15} | {col_actions:<10}')

        except Exception as e:
            print(f'[WARN] Could not read row {i+1}: {str(e)[:50]}')

    print('='*150)

    # Write to Excel file
    try:
        df = pd.DataFrame(data)
        excel_path = os.path.join(os.path.dirname(__file__), 'air_quality_stations.xlsx')
        df.to_excel(excel_path, index=False, sheet_name='Air Quality Stations')
        print(f'\n[SUCCESS] Data written to Excel file: {excel_path}')
    except Exception as e:
        print(f'\n[ERROR] Failed to write to Excel: {str(e)}')

    print('\n' + '='*70 + '\n')


def layout_air_quality_station(page: Page):
    """Extract and store Layout Configured Order for Air Quality Stations"""

    print('\n' + '='*70)
    print('TESTING: Air Quality Stations - Layout Configuration')
    print('='*70)

    # Navigate to dashboard and click on Dashboard button
    print('\n[INFO] Navigating to Dashboard...')
    try:
        dashboard_nav = page.get_by_role("button", name="Dashboard").first
        dashboard_nav.click()
        page.wait_for_load_state('networkidle')
        time.sleep(2)
    except:
        pass  # Already on dashboard

    # Click on Air Quality Stations tab
    print('[INFO] Clicking on Air Quality Stations tab...')
    tabs = page.locator('button[role="tab"]')
    if tabs.count() > 0:
        tabs.nth(0).click()
        time.sleep(2)

    # Get all rows
    rows = page.locator('tbody tr')
    row_count = rows.count()
    print(f'\n[INFO] Found {row_count} devices\n')

    if row_count == 0:
        print('[INFO] No devices found in Air Quality Stations tab')
        print('\n' + '='*70 + '\n')
        return

    # Prepare data for Layout sheet
    layout_data = {
        'Location': [],
        'Combination 1': []
    }

    # Loop through each device
    for i in range(row_count):
        try:
            print(f'\n[INFO] Processing device {i+1}/{row_count}...')

            # Get device location/name
            row = rows.nth(i)
            cells = row.locator('td')

            location = ""
            if cells.count() > 1:
                location_text = cells.nth(1).inner_text()
                location = location_text.split('\n')[0].strip()  # Get device name only

            print(f'  Device: {location}')

            # Click on the eye button in column 13 (Actions column)
            try:
                # Get the 13th column (td[13]) which contains the Eye button
                # Using xpath: td[13]/button to get the eye button
                eye_button = row.locator('td:nth-child(13) button').first

                if eye_button.is_visible():
                    eye_button.click()
                    print('  [OK] Clicked Eye button in column 13')
                else:
                    print('  [WARN] Eye button in column 13 not visible')
                    layout_data['Location'].append(location)
                    layout_data['Configured Order'].append('N/A - Eye button not visible')
                    continue

                time.sleep(3)  # Wait for popup to open

                # Check if popup/dialog opened
                dialog = page.locator('[role="dialog"]').first
                if not dialog.is_visible(timeout=5000):
                    print(f'  [WARN] Detail popup did not open for {location}')
                    layout_data['Location'].append(location)
                    layout_data['Combination 1'].append('N/A - Popup not opened')
                    continue

                print('  [OK] Detail popup opened')

                # Click on Layout tab
                # Find the tab with text "Layout"
                layout_tab = page.get_by_role("tab", name="Layout")
                if layout_tab.is_visible(timeout=3000):
                    layout_tab.click()
                    time.sleep(2)
                    print('  [OK] Clicked Layout tab')
                else:
                    print('  [WARN] Layout tab not found')
                    layout_data['Location'].append(location)
                    layout_data['Combination 1'].append('N/A - Layout tab not found')
                    # Close popup
                    try:
                        close_buttons = dialog.locator('button:has(svg)').all()
                        for btn in close_buttons:
                            if btn.is_visible():
                                btn.click()
                                time.sleep(1)
                                break
                    except:
                        pass
                    continue

                # Extract sensors from Configured Order column
                # Let's take a simple approach - find badges and get nearby text
                configured_sensors = []

                # Wait for the layout to fully load
                time.sleep(2)

                # Take a screenshot for debugging
                try:
                    page.screenshot(path=f"layout_debug_{i}.png")
                    print(f'  [DEBUG] Screenshot saved: layout_debug_{i}.png')
                except:
                    pass

                # Find all badges in the dialog
                badges = page.locator('div[role="dialog"] span[class*="MuiBadge-badge"]').all()
                print(f'  [DEBUG] Found {len(badges)} badges')

                # Try multiple approaches to get sensor text
                for idx, badge in enumerate(badges, 1):
                    try:
                        badge_number = badge.inner_text().strip()
                        print(f'  [DEBUG] Processing badge {badge_number}')

                        # Get all text content from the parent Paper component
                        # Go up to the Paper element
                        paper = badge.locator('..').locator('..').locator('..').locator('..')
                        all_text = paper.inner_text()
                        print(f'  [DEBUG] Paper text: {all_text[:100]}')

                        # Try to extract sensor name from the text
                        # Split by newlines and get relevant parts
                        lines = [line.strip() for line in all_text.split('\n') if line.strip()]

                        # Usually first non-empty line after badge should be sensor name
                        sensor_text = None
                        for line in lines:
                            # Skip badge number itself
                            if line == badge_number:
                                continue
                            # Skip location indicators (A, B, C, etc.)
                            if len(line) == 1 and line.isalpha():
                                continue
                            # This should be the sensor name
                            if line:
                                sensor_text = line
                                break

                        if sensor_text:
                            # Check if this is a Climate Sensor
                            if 'Climate' in sensor_text:
                                # Look for checked checkboxes for Climate sensor
                                checked_items = []

                                # Check for Temp checkbox
                                temp_checkbox = paper.locator('input[type="checkbox"]').nth(0)
                                if temp_checkbox.count() > 0 and temp_checkbox.is_checked():
                                    checked_items.append('Temp')

                                # Check for Humidity checkbox
                                humidity_checkbox = paper.locator('input[type="checkbox"]').nth(1)
                                if humidity_checkbox.count() > 0 and humidity_checkbox.is_checked():
                                    checked_items.append('Humidity')

                                # Check for Wet Bulb checkbox
                                wetbulb_checkbox = paper.locator('input[type="checkbox"]').nth(2)
                                if wetbulb_checkbox.count() > 0 and wetbulb_checkbox.is_checked():
                                    checked_items.append('Wet Bulb')

                                # Check for WBGT checkbox
                                wbgt_checkbox = paper.locator('input[type="checkbox"]').nth(3)
                                if wbgt_checkbox.count() > 0 and wbgt_checkbox.is_checked():
                                    checked_items.append('WBGT')

                                if checked_items:
                                    # For each checked item, add as separate sensor with incremented badge number
                                    for sub_idx, item in enumerate(checked_items):
                                        actual_badge = int(badge_number) + sub_idx
                                        configured_sensors.append(f"{actual_badge}.{item}")
                                        print(f'    ✓ Sensor {actual_badge}: {item} (from Climate)')
                                else:
                                    # No items checked, just add Climate
                                    configured_sensors.append(f"{badge_number}.{sensor_text}")
                                    print(f'    ✓ Sensor {badge_number}: {sensor_text}')
                            else:
                                # Regular sensor (not Climate)
                                configured_sensors.append(f"{badge_number}.{sensor_text}")
                                print(f'    ✓ Sensor {badge_number}: {sensor_text}')
                        else:
                            print(f'  [WARN] Could not extract sensor text for badge {badge_number}')

                    except Exception as e:
                        print(f'  [ERROR] Badge {idx}: {str(e)[:100]}')
                        continue

                # Format the configured order as comma-separated string
                if configured_sensors:
                    configured_order_str = ', '.join(configured_sensors)
                    print(f'  [OK] Found {len(configured_sensors)} configured sensors')
                else:
                    configured_order_str = 'No sensors configured'
                    print(f'  [WARN] No configured sensors found')

                layout_data['Location'].append(location)
                layout_data['Combination 1'].append(configured_order_str)

                # Close the popup - using the close button with svg icon
                # The close button is typically in the dialog header
                close_btn = dialog.locator('button svg').first.locator('..').locator('..')

                # Alternative: find button that contains svg (close button)
                close_buttons = dialog.locator('button:has(svg)').all()

                # Try to click the first button with svg (usually the close button)
                closed = False
                for btn in close_buttons:
                    try:
                        if btn.is_visible():
                            btn.click()
                            closed = True
                            time.sleep(1)
                            print('  [OK] Closed detail popup')
                            break
                    except:
                        continue

                if not closed:
                    print('  [WARN] Could not close popup automatically')

            except Exception as e:
                print(f'  [ERROR] Failed to process layout for {location}: {str(e)[:100]}')
                layout_data['Location'].append(location)
                layout_data['Combination 1'].append(f'Error: {str(e)[:50]}')

                # Try to close any open dialog
                try:
                    dialog = page.locator('[role="dialog"]').first
                    if dialog.is_visible():
                        close_buttons = dialog.locator('button:has(svg)').all()
                        for btn in close_buttons:
                            if btn.is_visible():
                                btn.click()
                                time.sleep(1)
                                break
                except:
                    pass

        except Exception as e:
            print(f'[ERROR] Could not process device {i+1}: {str(e)[:100]}')

    print('\n' + '='*70)

    # Write to Excel Layout tab
    try:
        df_layout = pd.DataFrame(layout_data)
        excel_path = os.path.join(os.path.dirname(__file__), 'air_quality_stations.xlsx')

        # Read existing Excel file to preserve other sheets
        try:
            with pd.ExcelWriter(excel_path, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
                df_layout.to_excel(writer, sheet_name='Layout', index=False)
            print(f'\n[SUCCESS] Layout data written to Excel file: {excel_path}')
        except FileNotFoundError:
            # File doesn't exist, create new one
            with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
                df_layout.to_excel(writer, sheet_name='Layout', index=False)
            print(f'\n[SUCCESS] Layout data written to new Excel file: {excel_path}')

    except Exception as e:
        print(f'\n[ERROR] Failed to write Layout data to Excel: {str(e)}')

    print('\n' + '='*70 + '\n')


def layout_combination():
    """Generate 5 additional combinations from Combination 1 in Layout sheet"""

    print('\n' + '='*70)
    print('FUNCTION: Generate Layout Combinations')
    print('='*70)

    excel_path = os.path.join(os.path.dirname(__file__), 'air_quality_stations.xlsx')

    # Check if Excel file exists
    if not os.path.exists(excel_path):
        print(f'[ERROR] Excel file not found: {excel_path}')
        print('[INFO] Please run layout_air_quality_station first to generate the file')
        return

    # Read existing Layout sheet
    try:
        layout_df = pd.read_excel(excel_path, sheet_name='Layout')
        print(f'[INFO] Loaded Layout sheet with {len(layout_df)} devices')
    except Exception as e:
        print(f'[ERROR] Could not read Layout sheet: {str(e)}')
        return

    # Check if Combination 1 exists
    if 'Combination 1' not in layout_df.columns:
        print('[ERROR] Combination 1 column not found in Layout sheet')
        return

    # Prepare new combination columns
    layout_df['Combination 2'] = ''
    layout_df['Combination 3'] = ''
    layout_df['Combination 4'] = ''
    layout_df['Combination 5'] = ''
    layout_df['Combination 6'] = ''

    # Generate combinations for each device
    for idx, row in layout_df.iterrows():
        device_name = row['Location']
        combination_1 = row['Combination 1']

        print(f'\n[INFO] Processing device: {device_name}')

        # Parse Combination 1
        if isinstance(combination_1, str) and combination_1 not in ['N/A - Popup not opened', 'N/A - Layout tab not found', 'No sensors configured'] and not str(combination_1).startswith('Error'):

            # Split by comma to get individual sensors
            parts = combination_1.split(',')
            sensor_list = []

            for part in parts:
                part = part.strip()
                # Remove the number prefix (e.g., "1.") to get sensor data
                if '.' in part:
                    sensor_data = part.split('.', 1)[1].strip()
                    sensor_list.append(sensor_data)

            if len(sensor_list) > 0:
                print(f'  Found {len(sensor_list)} sensors in Combination 1')

                # Generate 5 random combinations
                for combo_num in range(2, 7):
                    # Shuffle the sensor list
                    shuffled = sensor_list.copy()
                    random.shuffle(shuffled)

                    # Format as "1.sensor, 2.sensor, 3.sensor..."
                    combination = ', '.join([f"{i+1}.{sensor}" for i, sensor in enumerate(shuffled)])

                    # Store in dataframe
                    layout_df.at[idx, f'Combination {combo_num}'] = combination

                print(f'  [OK] Generated 5 combinations for {device_name}')
            else:
                print(f'  [WARN] No sensors found in Combination 1 for {device_name}')
                for combo_num in range(2, 7):
                    layout_df.at[idx, f'Combination {combo_num}'] = 'N/A'
        else:
            print(f'  [WARN] Invalid Combination 1 for {device_name}: {combination_1}')
            for combo_num in range(2, 7):
                layout_df.at[idx, f'Combination {combo_num}'] = 'N/A'

    # Write back to Excel
    try:
        # Read the Air Quality Stations sheet to preserve it
        aqs_df = pd.read_excel(excel_path, sheet_name='Air Quality Stations')

        # Write both sheets
        with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
            aqs_df.to_excel(writer, sheet_name='Air Quality Stations', index=False)
            layout_df.to_excel(writer, sheet_name='Layout', index=False)

        print(f'\n[SUCCESS] Updated Layout sheet with 5 new combinations')
        print(f'[INFO] Excel file: {excel_path}')

    except Exception as e:
        print(f'\n[ERROR] Failed to write to Excel: {str(e)}')

    print('\n' + '='*70 + '\n')


def check_aqs_sensor_sequence(page: Page, iterations: int):
    """Check if Air Quality Stations sensors match the expected Layout sequence

    Args:
        page: Playwright page object
        iterations: Number of times to run the sensor sequence check
    """

    print('\n' + '='*70)
    print('FUNCTION: Check AQS Sensor Sequence')
    print('='*70)

    print(f'\n[INFO] Will run sensor sequence check {iterations} time(s)')
    print('[INFO] Each check will refresh the Air Quality Stations table and compare with Layout')
    print('[INFO] Waiting 10 minutes between each check...\n')

    excel_path = os.path.join(os.path.dirname(__file__), 'air_quality_stations.xlsx')

    # Create Fault_ss folder if it doesn't exist
    fault_ss_folder = os.path.join(os.path.dirname(__file__), 'Fault_ss')
    if not os.path.exists(fault_ss_folder):
        os.makedirs(fault_ss_folder)
        print(f'[INFO] Created folder: {fault_ss_folder}')

    for iteration in range(1, iterations + 1):
        print('\n' + '='*70)
        print(f'ITERATION {iteration}/{iterations}')
        print('='*70)

        # Navigate to dashboard and Air Quality Stations tab
        print('\n[INFO] Navigating to Air Quality Stations tab...')
        try:
            dashboard_nav = page.get_by_role("button", name="Dashboard").first
            dashboard_nav.click()
            page.wait_for_load_state('networkidle')
            time.sleep(2)
        except:
            pass

        # Click on Air Quality Stations tab
        tabs = page.locator('button[role="tab"]')
        if tabs.count() > 0:
            tabs.nth(0).click()
            time.sleep(2)

        # Get all rows
        rows = page.locator('tbody tr')
        row_count = rows.count()
        print(f'[INFO] Found {row_count} devices\n')

        if row_count == 0:
            print('[INFO] No devices found in Air Quality Stations tab')
            continue

        # Prepare data for Air Quality Stations sheet (fresh data)
        data = {
            'Image': [],
            'Location': [],
            'Sensor 1': [],
            'Sensor 2': [],
            'Sensor 3': [],
            'Sensor 4': [],
            'Sensor 5': [],
            'Sensor 6': [],
            'Sensor 7': [],
            'Sensor 8': [],
            'Sensor 9': [],
            'Sensor 10': [],
            'Actions': [],
            'Sensor Set 1': []
        }

        # Read Layout sheet to get expected sequences
        layout_df = None
        try:
            layout_df = pd.read_excel(excel_path, sheet_name='Layout')
            print('[INFO] Loaded Layout sheet for comparison')
        except Exception as e:
            print(f'[ERROR] Could not read Layout sheet: {str(e)[:100]}')
            print('[WARN] Will collect data without comparison')

        # Extract data from each row
        for i in range(row_count):
            try:
                row = rows.nth(i)
                cells = row.locator('td')
                cell_count = cells.count()

                # Column 1: Image
                col_image = "Image"

                # Column 2: Location
                col_location = ""
                if cell_count > 1:
                    location_text = cells.nth(1).inner_text()
                    col_location = location_text.replace('\n', ' ').strip()

                # Get device name only (first line)
                device_name = col_location.split('\n')[0].strip() if '\n' in col_location else col_location

                # Columns 3-12: All 10 sensors
                sensors = []
                for j in range(2, min(12, cell_count - 1)):
                    sensor_text = cells.nth(j).inner_text()
                    sensor_text = sensor_text.replace('\n', ' ').strip()
                    sensors.append(sensor_text)

                # Pad sensors list if less than 10
                while len(sensors) < 10:
                    sensors.append("")

                # Actions
                col_actions = "[Link]"

                # Compare with expected sequence from Layout
                sensor_set_result = "N/A"
                if layout_df is not None:
                    try:
                        # Find this device in Layout sheet
                        # Try exact match first
                        matching_row = layout_df[layout_df['Location'] == device_name]

                        # If no exact match, try partial match (contains)
                        if matching_row.empty:
                            matching_row = layout_df[layout_df['Location'].str.contains(device_name, na=False, regex=False)]

                        # If still no match, try reverse - check if device_name contains any Layout location
                        if matching_row.empty:
                            for idx, row in layout_df.iterrows():
                                layout_location = str(row['Location']).strip()
                                if layout_location in device_name or device_name in layout_location:
                                    matching_row = layout_df.iloc[[idx]]
                                    break

                        if not matching_row.empty:
                            expected_sequence = matching_row.iloc[0]['Combination 1']
                            print(f'  [DEBUG] Matched device: "{device_name}" with Layout location: "{matching_row.iloc[0]["Location"]}"')

                            # Parse expected sequence: "1.CO 0-500 ppm, 2.NO2 0-20 ppm, ..."
                            expected_sensors = []
                            if isinstance(expected_sequence, str) and expected_sequence not in ['N/A - Popup not opened', 'N/A - Layout tab not found', 'No sensors configured']:
                                parts = expected_sequence.split(',')
                                for part in parts:
                                    part = part.strip()
                                    # Remove the number prefix (e.g., "1.")
                                    if '.' in part:
                                        sensor_name = part.split('.', 1)[1].strip()
                                        expected_sensors.append(sensor_name)

                            # Compare actual vs expected
                            matching_count = 0
                            not_matching_count = 0

                            for idx, (actual, expected) in enumerate(zip(sensors, expected_sensors)):
                                if not expected:
                                    # No expected sensor at this position
                                    break

                                if actual and expected:
                                    # Extract sensor name from actual (e.g., "CO 0-500 ppm" -> "CO")
                                    actual_parts = actual.split()
                                    expected_parts = expected.split()

                                    actual_name = actual_parts[0] if actual_parts else ""
                                    expected_name = expected_parts[0] if expected_parts else ""

                                    # Debug output for DRIFT devices
                                    if 'DRIFT' in device_name:
                                        print(f'  [DEBUG] Sensor {idx+1}: Actual="{actual}" | Expected="{expected}" | Comparing "{actual_name}" vs "{expected_name}"')

                                    # Normalize sensor names for comparison (handle abbreviations)
                                    # Temp -> Temperature, Wet -> Wetbulb, etc.
                                    sensor_aliases = {
                                        'temp': 'temperature',
                                        'temperature': 'temperature',
                                        'humidity': 'humidity',
                                        'wet': 'wetbulb',
                                        'wetbulb': 'wetbulb',
                                        'wbgt': 'wbgt',
                                        'twl': 'twl'
                                    }

                                    # Normalize both names
                                    actual_normalized = sensor_aliases.get(actual_name.lower(), actual_name.lower())
                                    expected_normalized = sensor_aliases.get(expected_name.lower(), expected_name.lower())

                                    if actual_normalized == expected_normalized:
                                        matching_count += 1
                                    else:
                                        not_matching_count += 1
                                        print(f'  [MISMATCH] {device_name} Sensor {idx+1}: Expected "{expected_name}", Got "{actual_name}"')
                                        print(f'    Full actual: "{actual}" | Full expected: "{expected}"')
                                elif not actual and expected:
                                    # Expected sensor but not showing
                                    not_matching_count += 1
                                    print(f'  [MISSING] {device_name} Sensor {idx+1}: Expected "{expected}", Got empty')

                            sensor_set_result = f"Sensor Matching: {matching_count}, Not Matching: {not_matching_count}"
                            print(f'  {device_name}: {sensor_set_result}')

                            # Take screenshot if there are any mismatches
                            if not_matching_count > 0:
                                # Generate filename with device name and current time
                                current_time = datetime.now().strftime('%Y%m%d_%H%M%S')
                                # Clean device name for filename (remove special characters)
                                safe_device_name = "".join(c for c in device_name if c.isalnum() or c in (' ', '_', '-')).strip()
                                safe_device_name = safe_device_name.replace(' ', '_')
                                screenshot_filename = f"{safe_device_name}_{current_time}.png"
                                screenshot_path = os.path.join(fault_ss_folder, screenshot_filename)

                                try:
                                    page.screenshot(path=screenshot_path)
                                    print(f'  [SCREENSHOT] Saved fault screenshot: {screenshot_filename}')
                                except Exception as ss_error:
                                    print(f'  [ERROR] Failed to save screenshot: {str(ss_error)[:50]}')
                        else:
                            sensor_set_result = "N/A - Device not found in Layout"
                            print(f'  [WARN] Could not find "{device_name}" in Layout sheet')
                            print(f'  [DEBUG] Available Layout locations: {list(layout_df["Location"].values)}')
                    except Exception as e:
                        sensor_set_result = f"Error: {str(e)[:30]}"
                        print(f'  [ERROR] Comparison failed for {device_name}: {str(e)[:50]}')

                # Add to data dictionary
                data['Image'].append(col_image)
                data['Location'].append(col_location)
                data['Sensor 1'].append(sensors[0])
                data['Sensor 2'].append(sensors[1])
                data['Sensor 3'].append(sensors[2])
                data['Sensor 4'].append(sensors[3])
                data['Sensor 5'].append(sensors[4])
                data['Sensor 6'].append(sensors[5])
                data['Sensor 7'].append(sensors[6])
                data['Sensor 8'].append(sensors[7])
                data['Sensor 9'].append(sensors[8])
                data['Sensor 10'].append(sensors[9])
                data['Actions'].append(col_actions)
                data['Sensor Set 1'].append(sensor_set_result)

            except Exception as e:
                print(f'[ERROR] Could not process row {i+1}: {str(e)[:100]}')

        # Write to Excel - update Air Quality Stations sheet
        try:
            df = pd.DataFrame(data)

            # Read existing file to preserve Layout sheet
            with pd.ExcelWriter(excel_path, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
                df.to_excel(writer, sheet_name='Air Quality Stations', index=False)

            print(f'\n[SUCCESS] Updated Air Quality Stations sheet with Sensor Set 1 comparison')
            print(f'[INFO] Iteration {iteration}/{iterations} completed')

        except Exception as e:
            print(f'\n[ERROR] Failed to write to Excel: {str(e)}')

        # Wait 10 minutes before next iteration (unless it's the last one)
        if iteration < iterations:
            print(f'\n[INFO] Waiting 10 minutes before next check...')
            time.sleep(600)  # 600 seconds = 10 minutes
            print('[INFO] Refreshing page...')
            page.reload()
            page.wait_for_load_state('networkidle')
            time.sleep(2)

    print('\n' + '='*70)
    print(f'[COMPLETE] Sensor sequence check completed {iterations} time(s)')
    print('='*70 + '\n')


def change_layout(page: Page, combination_name='Combination 2'):
    """
    Change device layouts using specified Combination from Excel via MQTT

    Args:
        page: Playwright page object
        combination_name: Which combination to use (e.g., 'Combination 2', 'Combination 3', etc.)
    """

    print('\n' + '='*70)
    print(f'FUNCTION: Change Layout via MQTT ({combination_name})')
    print('='*70)

    # MQTT Configuration
    MQTT_BROKER_HOST = '192.168.10.232'
    MQTT_BROKER_PORT = 8083

    # MQTT Client Setup
    mqtt_connected = False
    mqtt_publish_success = {}

    def on_connect(client, userdata, flags, rc, properties=None):
        nonlocal mqtt_connected
        if rc == 0:
            print('[INFO] Connected to MQTT broker')
            mqtt_connected = True
        else:
            print(f'[ERROR] Connection failed with code {rc}')

    def on_publish(client, userdata, mid, properties=None):
        mqtt_publish_success[mid] = True
        print(f'[INFO] Message published successfully (mid: {mid})')

    # Create MQTT client with WebSocket transport
    client_id = f"python-automation-{int(datetime.now().timestamp())}"
    mqtt_client = mqtt.Client(client_id=client_id, transport="websockets")
    mqtt_client.on_connect = on_connect
    mqtt_client.on_publish = on_publish

    # Connect to MQTT broker
    try:
        print(f'[INFO] Connecting to MQTT broker at {MQTT_BROKER_HOST}:{MQTT_BROKER_PORT}...')
        mqtt_client.connect(MQTT_BROKER_HOST, MQTT_BROKER_PORT, 60)
        mqtt_client.loop_start()

        # Wait for connection
        timeout = 10
        start = time.time()
        while not mqtt_connected and (time.time() - start) < timeout:
            time.sleep(0.1)

        # Give it a bit more time
        time.sleep(1)

        if not mqtt_connected:
            print('[ERROR] Failed to connect to MQTT broker after 10 seconds')
            mqtt_client.loop_stop()
            mqtt_client.disconnect()
            return
    except Exception as e:
        print(f'[ERROR] MQTT connection error: {str(e)}')
        return

    # Read Excel file
    excel_path = os.path.join(os.path.dirname(__file__), 'air_quality_stations.xlsx')

    try:
        layout_df = pd.read_excel(excel_path, sheet_name='Layout')
        print(f'[INFO] Loaded {len(layout_df)} devices from Excel')
    except Exception as e:
        print(f'[ERROR] Could not read Excel: {e}')
        mqtt_client.loop_stop()
        mqtt_client.disconnect()
        return

    # Check if combination column exists
    if combination_name not in layout_df.columns:
        print(f'[ERROR] Column "{combination_name}" not found in Layout sheet')
        mqtt_client.loop_stop()
        mqtt_client.disconnect()
        return

    # Navigate to Dashboard > Air Quality Stations
    print('\n[INFO] Navigating to Air Quality Stations...')
    try:
        dashboard_nav = page.get_by_role("button", name="Dashboard").first
        dashboard_nav.click()
        page.wait_for_load_state('networkidle')
        time.sleep(2)
    except:
        pass

    # Click on Air Quality Stations tab
    tabs = page.locator('button[role="tab"]')
    if tabs.count() > 0:
        tabs.nth(0).click()
        time.sleep(2)

    # Process each device
    success_count = 0
    failure_count = 0

    for idx, row in layout_df.iterrows():
        device_name = row['Location']
        combination = row[combination_name]

        print(f'\n{"="*70}')
        print(f'Device {idx+1}/{len(layout_df)}: {device_name}')
        print(f'{"="*70}')

        # Skip if no valid combination
        if pd.isna(combination) or combination in ['N/A', '']:
            print(f'  [SKIP] No valid {combination_name}')
            continue

        try:
            # Open device Layout tab to get sensor mapping
            print(f'  [STEP 1] Opening Layout tab to extract sensor data...')

            rows = page.locator('tbody tr')
            row_elem = rows.nth(idx)

            # Click eye button
            eye_button = row_elem.locator('td:nth-child(13) button').first
            if eye_button.is_visible():
                eye_button.click()
                time.sleep(2)
            else:
                print(f'  [ERROR] Eye button not found')
                failure_count += 1
                continue

            # Check if popup opened
            dialog = page.locator('[role="dialog"]').first
            if not dialog.is_visible(timeout=5000):
                print(f'  [ERROR] Popup not opened')
                failure_count += 1
                continue

            # Click Layout tab
            layout_tab = page.get_by_role("tab", name="Layout")
            if layout_tab.is_visible(timeout=3000):
                layout_tab.click()
                time.sleep(2)
            else:
                print(f'  [ERROR] Layout tab not found')
                # Close popup
                close_buttons = dialog.locator('button:has(svg)').all()
                for btn in close_buttons:
                    if btn.is_visible():
                        btn.click()
                        break
                failure_count += 1
                continue

            # Extract sensor data from React state
            print(f'  [STEP 2] Extracting sensor data from React state...')
            sensor_data = page.evaluate("""
                () => {
                    // Find the React Fiber node containing the board state
                    const dialog = document.querySelector('[role="dialog"]');
                    if (!dialog) return null;

                    const fiberKey = Object.keys(dialog).find(key =>
                        key.startsWith('__reactFiber')
                    );

                    if (!fiberKey) return null;

                    let fiber = dialog[fiberKey];

                    // Traverse up to find the component with board state
                    while (fiber) {
                        if (fiber.memoizedState?.board?.tasks) {
                            const tasks = fiber.memoizedState.board.tasks;
                            return Object.values(tasks).map(task => ({
                                name: task.name,
                                sensor_id: task.sensor_id,
                                config_type: task.config_type,
                                location: task.location || '',
                                obj: task.obj || {},
                                selectedItems: task.selectedItems || []
                            }));
                        }
                        fiber = fiber.return;
                    }

                    return null;
                }
            """)

            if not sensor_data:
                print(f'  [ERROR] Could not extract sensor data')
                # Close popup
                close_buttons = dialog.locator('button:has(svg)').all()
                for btn in close_buttons:
                    if btn.is_visible():
                        btn.click()
                        break
                failure_count += 1
                continue

            # Convert list to dict keyed by name
            sensor_mapping = {}
            for sensor in sensor_data:
                sensor_mapping[sensor['name']] = sensor

            print(f'  [OK] Found {len(sensor_mapping)} sensors')

            # Get device_id from React state
            device_id = page.evaluate("""
                () => {
                    // Try to find device_id from component props
                    const dialog = document.querySelector('[role="dialog"]');
                    if (!dialog) return null;

                    const fiberKey = Object.keys(dialog).find(key =>
                        key.startsWith('__reactFiber')
                    );

                    if (!fiberKey) return null;

                    let fiber = dialog[fiberKey];
                    while (fiber) {
                        if (fiber.memoizedProps?.deviceId) {
                            return fiber.memoizedProps.deviceId;
                        }
                        fiber = fiber.return;
                    }
                    return null;
                }
            """)

            # Get device_type from React state
            device_type = page.evaluate("""
                () => {
                    const dialog = document.querySelector('[role="dialog"]');
                    if (!dialog) return null;

                    const fiberKey = Object.keys(dialog).find(key =>
                        key.startsWith('__reactFiber')
                    );

                    if (!fiberKey) return null;

                    let fiber = dialog[fiberKey];
                    while (fiber) {
                        if (fiber.memoizedProps?.deviceType) {
                            return fiber.memoizedProps.deviceType;
                        }
                        fiber = fiber.return;
                    }
                    return 'vaqs';  // Default
                }
            """)

            if not device_id:
                print(f'  [ERROR] Could not extract device_id')
                # Close popup
                close_buttons = dialog.locator('button:has(svg)').all()
                for btn in close_buttons:
                    if btn.is_visible():
                        btn.click()
                        break
                failure_count += 1
                continue

            print(f'  [INFO] Device ID: {device_id}')
            print(f'  [INFO] Device Type: {device_type}')

            # Parse combination from Excel
            print(f'  [STEP 3] Parsing {combination_name}...')

            # Parse combination string: "1.PM 2.5 μm, 2.Temp, 3.Humidity, ..."
            parts = combination.split(',')
            parsed_sensors = []
            climate_items = ['Temp', 'Temperature', 'Humidity', 'Wet Bulb', 'Wetbulb', 'WBGT']

            for part in parts:
                part = part.strip()
                if '.' not in part:
                    continue

                # Split "1.PM 2.5 μm" into position and sensor name
                _, sensor_name = part.split('.', 1)
                sensor_name = sensor_name.strip()

                # Check if this is a climate sensor component
                if sensor_name in climate_items:
                    parsed_sensors.append({
                        'sensor': 'Climate',
                        'climate_item': sensor_name
                    })
                else:
                    parsed_sensors.append({
                        'sensor': sensor_name,
                        'climate_item': None
                    })

            print(f'  [OK] Parsed {len(parsed_sensors)} sensors')

            # Build MQTT payload
            print(f'  [STEP 4] Building MQTT payload...')

            sensor_priority_list = []
            climate_selected_items = []
            climate_added = False

            for parsed in parsed_sensors:
                if parsed['climate_item']:
                    # Collect climate items
                    climate_selected_items.append(parsed['climate_item'])
                else:
                    # Add any pending climate sensor first
                    if climate_selected_items and not climate_added:
                        climate_sensor = sensor_mapping.get('Climate Sensor') or sensor_mapping.get('Climate')
                        if climate_sensor:
                            # Normalize climate item names
                            normalized_items = []
                            for item in climate_selected_items:
                                if item in ['Temp', 'Temperature']:
                                    normalized_items.append('Temp')
                                elif item in ['Wet Bulb', 'Wetbulb']:
                                    normalized_items.append('Wet Bulb')
                                else:
                                    normalized_items.append(item)

                            # Sort by standard order
                            sort_order = ["Temp", "Humidity", "Wet Bulb", "WBGT"]
                            normalized_items = sorted(normalized_items, key=lambda x: sort_order.index(x) if x in sort_order else 999)

                            sensor_priority_list.append({
                                'id': climate_sensor['sensor_id'],
                                'config_type': climate_sensor.get('obj', {}).get('name', 'Climate Sensor'),
                                'name': 'Climate Sensor',
                                'location': climate_sensor.get('obj', {}).get('location', ''),
                                'selectedItems': normalized_items
                            })
                            climate_added = True
                            climate_selected_items = []

                    # Add regular sensor
                    sensor_info = sensor_mapping.get(parsed['sensor'])
                    if sensor_info:
                        sensor_priority_list.append({
                            'id': sensor_info['sensor_id'],
                            'config_type': sensor_info.get('obj', {}).get('name', parsed['sensor']),
                            'name': parsed['sensor'],
                            'location': sensor_info.get('obj', {}).get('location', ''),
                            'selectedItems': []
                        })
                    else:
                        print(f'  [WARN] Sensor not found: {parsed["sensor"]}')

            # Add any remaining climate items
            if climate_selected_items:
                climate_sensor = sensor_mapping.get('Climate Sensor') or sensor_mapping.get('Climate')
                if climate_sensor:
                    normalized_items = []
                    for item in climate_selected_items:
                        if item in ['Temp', 'Temperature']:
                            normalized_items.append('Temp')
                        elif item in ['Wet Bulb', 'Wetbulb']:
                            normalized_items.append('Wet Bulb')
                        else:
                            normalized_items.append(item)

                    sort_order = ["Temp", "Humidity", "Wet Bulb", "WBGT"]
                    normalized_items = sorted(normalized_items, key=lambda x: sort_order.index(x) if x in sort_order else 999)

                    sensor_priority_list.append({
                        'id': climate_sensor['sensor_id'],
                        'config_type': climate_sensor.get('obj', {}).get('name', 'Climate Sensor'),
                        'name': 'Climate Sensor',
                        'location': climate_sensor.get('obj', {}).get('location', ''),
                        'selectedItems': normalized_items
                    })

            payload = {
                'device_id': device_id,
                'device_type': device_type,
                'sensor_priority': sensor_priority_list
            }

            print(f'  [INFO] Payload: {len(payload["sensor_priority"])} sensors configured')

            # Publish to MQTT
            print(f'  [STEP 5] Publishing to MQTT...')
            topic = f'duetto_analytics/aqs/sensor_priority/{device_id}'

            result = mqtt_client.publish(topic, json.dumps(payload))

            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                print(f'  [SUCCESS] Published to MQTT topic: {topic}')
                success_count += 1

                # Wait a bit for MQTT to process
                time.sleep(1)

                # Also publish realtime update (like frontend does)
                realtime_payload = {
                    'device_id': device_id,
                    'device_type': device_type,
                    'sensor_priority': sensor_priority_list,
                    'timestamp': datetime.now().isoformat()
                }
                mqtt_client.publish('maestrolink/realtime/priority_update', json.dumps(realtime_payload))

            else:
                print(f'  [FAIL] Failed to publish to MQTT (rc: {result.rc})')
                failure_count += 1

            # Close popup
            close_buttons = dialog.locator('button:has(svg)').all()
            for btn in close_buttons:
                if btn.is_visible():
                    btn.click()
                    time.sleep(1)
                    break

        except Exception as e:
            print(f'  [ERROR] Exception: {str(e)[:200]}')
            failure_count += 1

            # Try to close any open popup
            try:
                close_buttons = page.locator('[role="dialog"] button:has(svg)').all()
                for btn in close_buttons:
                    if btn.is_visible():
                        btn.click()
                        break
            except:
                pass

    # Disconnect MQTT
    mqtt_client.loop_stop()
    mqtt_client.disconnect()
    print('\n[INFO] Disconnected from MQTT broker')

    # Summary
    print('\n' + '='*70)
    print('SUMMARY')
    print('='*70)
    print(f'Total devices: {len(layout_df)}')
    print(f'Success: {success_count}')
    print(f'Failed: {failure_count}')
    print(f'Skipped: {len(layout_df) - success_count - failure_count}')
    print('='*70 + '\n')
