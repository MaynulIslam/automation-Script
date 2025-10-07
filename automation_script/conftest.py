import pytest
from playwright.sync_api import sync_playwright

@pytest.fixture(scope="session")
def browser():
    """
    Session-scoped fixture: Browser opens once for all tests
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=500)
        yield browser
        browser.close()


@pytest.fixture(scope="session")
def page(browser):
    """
    Session-scoped fixture: Single page for all tests
    """
    context = browser.new_context(
        viewport={'width': 1920, 'height': 1080}
    )
    page = context.new_page()
    yield page
    page.close()
    context.close()
