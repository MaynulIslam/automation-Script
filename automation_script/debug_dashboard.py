"""
Debug script to inspect dashboard elements
"""
import pytest
from playwright.sync_api import Page
import time

def test_inspect_dashboard_elements(page: Page):
    """Inspect what elements are actually on the dashboard page"""

    # Login
    print("\n=== LOGGING IN ===")
    page.goto('http://192.168.10.232:3000/')
    page.wait_for_load_state('networkidle')
    page.fill('input[name="user_name"]', 'admin')
    page.fill('input[name="password"]', 'admin')
    page.click('button[type="submit"]')
    page.wait_for_load_state('networkidle')
    time.sleep(3)

    # Navigate to devices page
    print("\n=== NAVIGATING TO DEVICES PAGE ===")
    page.goto('http://192.168.10.232:3000/dashboard/devices')
    page.wait_for_load_state('networkidle')
    time.sleep(2)

    print(f"\nCurrent URL: {page.url}")

    # Take screenshot
    page.screenshot(path="dashboard_debug.png")
    print("\nScreenshot saved as: dashboard_debug.png")

    # Print page title
    print(f"\nPage Title: {page.title()}")

    # Try to find all text content on the page
    print("\n=== PAGE TEXT CONTENT ===")
    body_text = page.locator('body').inner_text()
    print(body_text[:2000])  # Print first 2000 characters

    # Try to find specific elements
    print("\n=== LOOKING FOR METRIC CARDS ===")

    # Try different selectors
    selectors_to_try = [
        "text=Total Devices",
        "text=Active",
        "text=Alarms",
        "text=Offline",
        "text=Pending Service",
        "[role='button']",
        "button",
        ".MuiStack-root",
        ".MuiTypography-root",
    ]

    for selector in selectors_to_try:
        try:
            elements = page.locator(selector)
            count = elements.count()
            print(f"\nSelector '{selector}': Found {count} elements")
            if count > 0 and count < 20:  # Don't print too many
                for i in range(min(count, 5)):
                    try:
                        text = elements.nth(i).inner_text(timeout=1000)
                        print(f"  Element {i}: '{text[:100]}'")
                    except:
                        print(f"  Element {i}: Could not get text")
        except Exception as e:
            print(f"\nSelector '{selector}': Error - {str(e)[:100]}")

    # Check for Stack components that might contain the metrics
    print("\n=== CHECKING STACK COMPONENTS ===")
    try:
        stacks = page.locator('div[class*="MuiStack"]')
        print(f"Found {stacks.count()} Stack components")
    except Exception as e:
        print(f"Error finding stacks: {e}")

    # Check for Typography components
    print("\n=== CHECKING TYPOGRAPHY COMPONENTS ===")
    try:
        typos = page.locator('span[class*="MuiTypography"], p[class*="MuiTypography"], div[class*="MuiTypography"]')
        count = typos.count()
        print(f"Found {count} Typography components")
        for i in range(min(count, 10)):
            try:
                text = typos.nth(i).inner_text(timeout=1000)
                if text.strip():
                    print(f"  Typography {i}: '{text}'")
            except:
                pass
    except Exception as e:
        print(f"Error finding typography: {e}")

    print("\n=== DEBUG COMPLETE ===")
