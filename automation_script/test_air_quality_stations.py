import pytest
# import allure  # TODO: Re-enable after automation script is complete
from playwright.sync_api import Page, expect
import time
import pandas as pd
import os


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
        'Configured Order': []
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
                    layout_data['Configured Order'].append('N/A - Popup not opened')
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
                    layout_data['Configured Order'].append('N/A - Layout tab not found')
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

                        # Approach 1: Look for any paragraph near this badge
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
                layout_data['Configured Order'].append(configured_order_str)

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
                layout_data['Configured Order'].append(f'Error: {str(e)[:50]}')

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
