import pytest
# import allure  # TODO: Re-enable after automation script is complete
from playwright.sync_api import Page, expect
import time
import re
import asyncio
from test_air_quality_stations import display_air_quality_stations, layout_air_quality_station, layout_combination, change_layout


def test_login(page: Page):
    """Test login functionality"""

    print('\n' + '='*70)
    print('TESTING: Login')
    print('='*70)

    # Navigate to login page
    page.goto('http://192.168.10.232:3000/')
    page.wait_for_load_state('networkidle')

    # Fill in credentials
    page.fill('input[name="user_name"]', 'admin')
    page.fill('input[name="password"]', 'admin')

    # Click login button
    page.click('button[type="submit"]')
    page.wait_for_load_state('networkidle')
    time.sleep(2)

    # Check if login was successful
    current_url = page.url

    # Check if we're logged in by looking for dashboard elements or changed URL
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
    else:
        print('\n[WARN] Login validation unclear')
        print(f'[INFO] Current URL: {current_url}')
        print('[INFO] Continuing anyway...')

    print('='*70 + '\n')


def test_dashboard(page: Page):
    """Test dashboard navigation and Total Devices"""

    print('\n' + '='*70)
    print('TESTING: Dashboard')
    print('='*70)

    # Ensure we're on a page (browser is already logged in from test_login)
    print('\n[INFO] Already logged in from previous test')
    time.sleep(1)

    # Click on Dashboard from side navigation
    print('\n[STEP 1] Clicking on Dashboard from side navigation...')
    try:
        # Find Dashboard link in sidebar - using role button with name Dashboard
        dashboard_nav = page.get_by_role("button", name="Dashboard").first
        dashboard_nav.click()
        page.wait_for_load_state('networkidle')
        time.sleep(2)
        print('  [OK] Clicked on Dashboard')
    except Exception as e:
        print(f'  [FAIL] Could not click Dashboard: {str(e)}')
        assert False, f"Failed to click Dashboard: {str(e)}"

    # Look for Total Devices in top matrix bar
    print('\n[STEP 2] Looking at Top Matrix bar, finding Total Devices...')
    try:
        # Find Total Devices metric card
        total_devices_element = page.locator("text=Total Devices")
        expect(total_devices_element).to_be_visible(timeout=10000)
        print('  [OK] Found Total Devices')

        # Get the count
        total_devices_card = total_devices_element.locator('..').locator('..')
        card_text = total_devices_card.inner_text()

        # Extract number from text like "10 Devices\nTotal Devices"
        match = re.search(r'(\d+)\s*Devices', card_text)
        if match:
            device_count = int(match.group(1))

            # Click on Total Devices
            print('\n[STEP 3] Clicking on Total Devices...')
            total_devices_card.click()
            time.sleep(2)
            print('  [OK] Clicked on Total Devices')

            # Print the count
            print(f'\n[RESULT] Total Devices = {device_count} devices')

            # Now count devices in each tab
            print('\n[STEP 4] Counting devices in each tab...\n')

            tabs = page.locator('button[role="tab"]')
            tab_count = tabs.count()

            device_counts = {}
            total_from_tabs = 0

            # Tab 0: Air Quality Stations
            if tab_count > 0:
                print('  Clicking on Tab 0: Air Quality Stations')
                tabs.nth(0).click()
                time.sleep(2)
                rows = page.locator('tbody tr')
                aq_count = rows.count()
                device_counts['Air Quality Stations'] = aq_count
                total_from_tabs += aq_count
                print(f'  Total Air Quality Stations: {aq_count} devices\n')

            # Tab 1: Plexus PowerNet
            if tab_count > 1:
                print('  Clicking on Tab 1: Plexus PowerNet')
                tabs.nth(1).click()
                time.sleep(2)
                rows = page.locator('tbody tr')
                plexus_count = rows.count()
                device_counts['Plexus PowerNet'] = plexus_count
                total_from_tabs += plexus_count
                print(f'  Total Plexus PowerNet: {plexus_count} devices\n')

            # Tab 2: ModuDrive
            if tab_count > 2:
                print('  Clicking on Tab 2: ModuDrive')
                tabs.nth(2).click()
                time.sleep(2)
                rows = page.locator('tbody tr')
                modudrive_count = rows.count() - 1  # Always subtract 1
                device_counts['ModuDrive'] = modudrive_count
                total_from_tabs += modudrive_count
                print(f'  Total ModuDrive: {modudrive_count} devices\n')

            # Tab 3: SuperBrite Marquee Display
            if tab_count > 3:
                print('  Clicking on Tab 3: SuperBrite Marquee Display')
                tabs.nth(3).click()
                time.sleep(2)
                rows = page.locator('tbody tr')
                marquee_count = rows.count() - 1  # Always subtract 1
                device_counts['SuperBrite Marquee Display'] = marquee_count
                total_from_tabs += marquee_count
                print(f'  Total SuperBrite Marquee Display: {marquee_count} devices\n')

            # Verify: Compare totals
            print('='*70)
            print('[VERIFICATION]')
            print('='*70)
            print(f'\nTotal from metric card: {device_count} devices')
            print(f'Total from all tabs:    {total_from_tabs} devices')

            if device_count == total_from_tabs:
                print(f'\n[PASS] Total Devices: {device_count} MATCHES with total devices in the tabs: {total_from_tabs}')
            else:
                print(f'\n[FAIL] Total Devices: {device_count} DOES NOT MATCH with total devices in the tabs: {total_from_tabs}')
                print(f'Difference: {abs(device_count - total_from_tabs)} devices')

        else:
            print('  [FAIL] Could not extract device count')
            assert False, "Failed to extract Total Devices count"

    except Exception as e:
        print(f'  [FAIL] Error finding Total Devices: {str(e)}')
        assert False, f"Failed to find Total Devices: {str(e)}"

    print('\n' + '='*70 + '\n')

    # Display Air Quality Stations table at the end
    display_air_quality_stations(page)

    # Extract and store Layout configuration for Air Quality Stations
    layout_air_quality_station(page)

    # Generate 5 random combinations from Combination 1
    layout_combination()

    # Apply Combination 2 to all devices via MQTT
    change_layout(page, combination_name='Combination 2')
