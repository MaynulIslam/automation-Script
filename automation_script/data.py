import pytest
from playwright.sync_api import Page, expect
import time
import pandas as pd
import os
import random
from datetime import datetime


def test_data_generation(page: Page):
    """Generate data.xlsx with Air Quality Stations data and random sensor combinations"""

    print('\n' + '='*70)
    print('DATA GENERATION SCRIPT')
    print('='*70)

    # Ask user how many times to run
    iterations = 1  # Default value
    try:
        user_input = input('\nHow many times do you want to run this data generation? ')
        if user_input.strip():
            iterations = int(user_input)
            if iterations <= 0:
                print('[WARN] Number must be positive. Using default: 1')
                iterations = 1
    except (ValueError, EOFError):
        print('[INFO] Using default: 1 iteration')
        iterations = 1

    print(f'\n[INFO] Will run data generation {iterations} time(s)')
    print('[INFO] Waiting 10 minutes between each run...\n')

    excel_path = os.path.join(os.path.dirname(__file__), 'data.xlsx')

    for iteration in range(1, iterations + 1):
        print('\n' + '='*70)
        print(f'ITERATION {iteration}/{iterations}')
        print('='*70)

        # ===== STEP 1: Login =====
        print('\n[STEP 1] Logging in...')
        page.goto('http://192.168.10.232:3000/')
        page.wait_for_load_state('networkidle')
        time.sleep(2)

        page.fill('input[name="user_name"]', 'admin')
        page.fill('input[name="password"]', 'admin')
        page.click('button[type="submit"]')
        page.wait_for_load_state('networkidle')
        time.sleep(2)

        print('[OK] Login successful')

        # ===== STEP 2: Navigate to Dashboard and Air Quality Stations =====
        print('\n[STEP 2] Navigating to Air Quality Stations...')
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

        print('[OK] On Air Quality Stations tab')

        # ===== STEP 3: Extract Air Quality Stations data =====
        print('\n[STEP 3] Extracting Air Quality Stations data...')

        rows = page.locator('tbody tr')
        row_count = rows.count()
        print(f'[INFO] Found {row_count} devices')

        if row_count == 0:
            print('[WARN] No devices found')
            continue

        # Prepare data for Air Quality Stations sheet
        aqs_data = {
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

        # Prepare data for Layout sheet
        layout_data = {
            'Location': [],
            'Combination 1': [],
            'Combination 2': [],
            'Combination 3': [],
            'Combination 4': [],
            'Combination 5': [],
            'Combination 6': []
        }

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

                # Add to AQS data (Sensor Set 1 will be calculated later)
                aqs_data['Image'].append(col_image)
                aqs_data['Location'].append(col_location)
                aqs_data['Sensor 1'].append(sensors[0])
                aqs_data['Sensor 2'].append(sensors[1])
                aqs_data['Sensor 3'].append(sensors[2])
                aqs_data['Sensor 4'].append(sensors[3])
                aqs_data['Sensor 5'].append(sensors[4])
                aqs_data['Sensor 6'].append(sensors[5])
                aqs_data['Sensor 7'].append(sensors[6])
                aqs_data['Sensor 8'].append(sensors[7])
                aqs_data['Sensor 9'].append(sensors[8])
                aqs_data['Sensor 10'].append(sensors[9])
                aqs_data['Actions'].append(col_actions)

                # Store device name for layout data
                layout_data['Location'].append(device_name)

                print(f'  Extracted data for: {device_name}')

            except Exception as e:
                print(f'[ERROR] Could not process row {i+1}: {str(e)[:100]}')

        print(f'[OK] Extracted data for {len(layout_data["Location"])} devices')

        # ===== STEP 4: Extract Layout Combination 1 from popup =====
        print('\n[STEP 4] Extracting Layout Combination 1 from web...')

        for idx, device_name in enumerate(layout_data['Location']):
            print(f'\n  Processing device {idx+1}/{len(layout_data["Location"])}: {device_name}')

            try:
                # Click on the eye button to open detail popup
                rows = page.locator('tbody tr')
                row = rows.nth(idx)
                cells = row.locator('td')

                eye_button = cells.nth(-1).locator('button').first
                if eye_button.is_visible():
                    eye_button.click()
                    time.sleep(3)

                # Check if popup opened
                dialog = page.locator('[role="dialog"]').first
                if not dialog.is_visible(timeout=5000):
                    print(f'    [WARN] Popup did not open')
                    layout_data['Combination 1'].append('N/A - Popup not opened')
                    continue

                # Click on Layout tab
                layout_tab = page.get_by_role("tab", name="Layout")
                if layout_tab.is_visible(timeout=3000):
                    layout_tab.click()
                    time.sleep(2)
                else:
                    print(f'    [WARN] Layout tab not found')
                    layout_data['Combination 1'].append('N/A - Layout tab not found')
                    # Close popup
                    close_buttons = dialog.locator('button:has(svg)').all()
                    for btn in close_buttons:
                        if btn.is_visible():
                            btn.click()
                            time.sleep(1)
                            break
                    continue

                # Extract sensors from Configured Order
                configured_sensors = []
                time.sleep(2)

                badges = page.locator('div[role="dialog"] span[class*="MuiBadge-badge"]').all()

                for badge in badges:
                    try:
                        badge_number = badge.inner_text().strip()
                        paper = badge.locator('..').locator('..').locator('..').locator('..')
                        all_text = paper.inner_text()
                        lines = [line.strip() for line in all_text.split('\n') if line.strip()]

                        sensor_text = None
                        for line in lines:
                            if line == badge_number:
                                continue
                            if len(line) == 1 and line.isalpha():
                                continue
                            if line:
                                sensor_text = line
                                break

                        if sensor_text:
                            # Check if this is a Climate Sensor
                            if 'Climate' in sensor_text:
                                checked_items = []
                                temp_checkbox = paper.locator('input[type="checkbox"]').nth(0)
                                if temp_checkbox.count() > 0 and temp_checkbox.is_checked():
                                    checked_items.append('Temp')
                                humidity_checkbox = paper.locator('input[type="checkbox"]').nth(1)
                                if humidity_checkbox.count() > 0 and humidity_checkbox.is_checked():
                                    checked_items.append('Humidity')
                                wetbulb_checkbox = paper.locator('input[type="checkbox"]').nth(2)
                                if wetbulb_checkbox.count() > 0 and wetbulb_checkbox.is_checked():
                                    checked_items.append('Wet Bulb')
                                wbgt_checkbox = paper.locator('input[type="checkbox"]').nth(3)
                                if wbgt_checkbox.count() > 0 and wbgt_checkbox.is_checked():
                                    checked_items.append('WBGT')

                                if checked_items:
                                    for sub_idx, item in enumerate(checked_items):
                                        actual_badge = int(badge_number) + sub_idx
                                        configured_sensors.append(f"{actual_badge}.{item}")
                                else:
                                    configured_sensors.append(f"{badge_number}.{sensor_text}")
                            else:
                                configured_sensors.append(f"{badge_number}.{sensor_text}")

                    except:
                        continue

                # Format combination 1
                if configured_sensors:
                    combination_1 = ', '.join(configured_sensors)
                    layout_data['Combination 1'].append(combination_1)
                    print(f'    [OK] Combination 1: {len(configured_sensors)} sensors')
                else:
                    layout_data['Combination 1'].append('No sensors configured')
                    print(f'    [WARN] No sensors found')

                # Close popup
                close_buttons = dialog.locator('button:has(svg)').all()
                for btn in close_buttons:
                    if btn.is_visible():
                        btn.click()
                        time.sleep(1)
                        break

            except Exception as e:
                print(f'    [ERROR] Failed: {str(e)[:100]}')
                layout_data['Combination 1'].append(f'Error: {str(e)[:50]}')

        print(f'\n[OK] Extracted Combination 1 for all devices')

        # ===== STEP 5: Generate 5 random combinations =====
        print('\n[STEP 5] Generating 5 random combinations...')

        for idx, combination_1 in enumerate(layout_data['Combination 1']):
            device_name = layout_data['Location'][idx]

            # Parse Combination 1
            if isinstance(combination_1, str) and combination_1 not in ['N/A - Popup not opened', 'N/A - Layout tab not found', 'No sensors configured'] and not combination_1.startswith('Error'):
                parts = combination_1.split(',')
                sensor_list = []
                for part in parts:
                    part = part.strip()
                    if '.' in part:
                        sensor_name = part.split('.', 1)[1].strip()
                        sensor_list.append(sensor_name)

                # Generate 5 random combinations
                for combo_num in range(2, 7):
                    shuffled = sensor_list.copy()
                    random.shuffle(shuffled)
                    combination = ', '.join([f"{i+1}.{sensor}" for i, sensor in enumerate(shuffled)])
                    layout_data[f'Combination {combo_num}'].append(combination)

                print(f'  Generated 5 combinations for: {device_name}')
            else:
                # No valid Combination 1, so no random combinations
                for combo_num in range(2, 7):
                    layout_data[f'Combination {combo_num}'].append('N/A')

        print('[OK] Generated all random combinations')

        # ===== STEP 6: Calculate Sensor Set 1 (compare with Combination 1) =====
        print('\n[STEP 6] Calculating Sensor Set 1...')

        for idx in range(len(aqs_data['Location'])):
            device_name = layout_data['Location'][idx]
            combination_1 = layout_data['Combination 1'][idx]

            # Get actual sensors from AQS data
            actual_sensors = [
                aqs_data['Sensor 1'][idx],
                aqs_data['Sensor 2'][idx],
                aqs_data['Sensor 3'][idx],
                aqs_data['Sensor 4'][idx],
                aqs_data['Sensor 5'][idx],
                aqs_data['Sensor 6'][idx],
                aqs_data['Sensor 7'][idx],
                aqs_data['Sensor 8'][idx],
                aqs_data['Sensor 9'][idx],
                aqs_data['Sensor 10'][idx]
            ]

            # Parse expected sensors from Combination 1
            expected_sensors = []
            if isinstance(combination_1, str) and combination_1 not in ['N/A - Popup not opened', 'N/A - Layout tab not found', 'No sensors configured'] and not combination_1.startswith('Error'):
                parts = combination_1.split(',')
                for part in parts:
                    part = part.strip()
                    if '.' in part:
                        sensor_name = part.split('.', 1)[1].strip()
                        expected_sensors.append(sensor_name)

            # Compare
            matching_count = 0
            not_matching_count = 0

            sensor_aliases = {
                'temp': 'temperature',
                'temperature': 'temperature',
                'humidity': 'humidity',
                'wet': 'wetbulb',
                'wetbulb': 'wetbulb',
                'wbgt': 'wbgt',
                'twl': 'twl'
            }

            for actual, expected in zip(actual_sensors, expected_sensors):
                if not expected:
                    break

                if actual and expected:
                    actual_parts = actual.split()
                    expected_parts = expected.split()
                    actual_name = actual_parts[0] if actual_parts else ""
                    expected_name = expected_parts[0] if expected_parts else ""

                    actual_normalized = sensor_aliases.get(actual_name.lower(), actual_name.lower())
                    expected_normalized = sensor_aliases.get(expected_name.lower(), expected_name.lower())

                    if actual_normalized == expected_normalized:
                        matching_count += 1
                    else:
                        not_matching_count += 1
                elif not actual and expected:
                    not_matching_count += 1

            sensor_set_result = f"Sensor Matching: {matching_count}, Not Matching: {not_matching_count}"
            aqs_data['Sensor Set 1'].append(sensor_set_result)

        print(f'[OK] Calculated Sensor Set 1 for all devices')

        # ===== STEP 7: Write to data.xlsx =====
        print('\n[STEP 7] Writing to data.xlsx...')

        try:
            with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
                # Write Air Quality Stations sheet
                df_aqs = pd.DataFrame(aqs_data)
                df_aqs.to_excel(writer, sheet_name='Air Quality Stations', index=False)

                # Write Layout sheet
                df_layout = pd.DataFrame(layout_data)
                df_layout.to_excel(writer, sheet_name='Layout', index=False)

            print(f'[SUCCESS] Data written to: {excel_path}')
            print(f'[INFO] Iteration {iteration}/{iterations} completed')

        except Exception as e:
            print(f'[ERROR] Failed to write Excel: {str(e)}')

        # Wait 10 minutes before next iteration
        if iteration < iterations:
            print(f'\n[INFO] Waiting 10 minutes before next run...')
            time.sleep(600)
            print('[INFO] Refreshing page...')
            page.reload()
            page.wait_for_load_state('networkidle')
            time.sleep(2)

    print('\n' + '='*70)
    print(f'[COMPLETE] Data generation completed {iterations} time(s)')
    print('='*70 + '\n')
