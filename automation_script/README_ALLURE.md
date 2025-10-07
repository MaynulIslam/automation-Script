# Allure Report Setup - Duetto Analytics Automation

## 📋 Prerequisites

You need to install **Allure Command Line** to view reports.

### Windows Installation:

**Option 1: Using Scoop (Recommended)**
```bash
# Install Scoop (if not already installed)
iwr -useb get.scoop.sh | iex

# Install Allure
scoop install allure
```

**Option 2: Manual Installation**
1. Download Allure from: https://github.com/allure-framework/allure2/releases
2. Extract to `C:\allure`
3. Add `C:\allure\bin` to system PATH

**Option 3: Using Chocolatey**
```bash
choco install allure
```

---

## 🚀 Running Tests with Allure

### 1. Run tests and generate results:
```bash
cd automation_script
pytest login_test.py --alluredir=./allure-results
```

### 2. View the report:
```bash
allure serve allure-results
```

This will automatically open the report in your browser!

---

## 📊 What's in the Report?

The Allure report includes:
- ✅ **Test execution summary** (Pass/Fail/Skip)
- ✅ **Screenshots** at each step
- ✅ **Detailed test steps** with timing
- ✅ **Graphs & charts** (timeline, categories, severity)
- ✅ **Test history** (if you run multiple times)
- ✅ **Error logs** and stack traces

---

## 📁 Report Structure

```
automation_script/
├── login_test.py           # Test file
├── conftest.py             # Pytest fixtures
├── pytest.ini              # Pytest configuration
├── allure-results/         # Raw test results (generated)
├── allure-report/          # HTML report (generated)
└── README_ALLURE.md        # This file
```

---

## 🎨 Allure Features Used

### Test Annotations:
```python
@allure.feature('Authentication')     # Group by feature
@allure.story('User Login')           # Sub-feature
@allure.title('Test login')           # Custom test name
@allure.severity(allure.severity_level.CRITICAL)  # Priority
```

### Test Steps:
```python
with allure.step('Navigate to login page'):
    # Your code here
```

### Attachments:
```python
allure.attach(page.screenshot(), name='Screenshot',
              attachment_type=allure.attachment_type.PNG)
```

---

## 🔧 Advanced Commands

### Run with custom report name:
```bash
pytest --alluredir=allure-results/$(date +%Y%m%d_%H%M%S)
```

### Generate static HTML report (no server needed):
```bash
pytest login_test.py --alluredir=./allure-results
allure generate allure-results -o allure-report --clean
```

Then open `allure-report/index.html` in browser.

### Clean old results:
```bash
rm -rf allure-results allure-report
```

---

## 📈 Example Report Features

1. **Overview** - Total tests, pass rate, duration
2. **Categories** - Group failures by type
3. **Suites** - Organize tests by feature
4. **Graphs** - Visual test statistics
5. **Timeline** - See test execution order
6. **Behaviors** - BDD-style feature mapping

---

## 🐛 Troubleshooting

**Issue: `allure: command not found`**
- Make sure Allure is installed and in PATH
- Restart terminal after installation

**Issue: No screenshots in report**
- Check that tests are running (not skipped)
- Verify `allure.attach()` is being called

**Issue: Report shows empty**
- Make sure `allure-results` directory has files
- Run tests first: `pytest login_test.py --alluredir=./allure-results`

---

## 📚 Resources

- Allure Docs: https://docs.qameta.io/allure/
- Allure Python: https://pypi.org/project/allure-pytest/
- Examples: https://github.com/allure-examples

---

**Happy Testing! 🚀**
