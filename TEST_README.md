# Duetto Analytics - API Test Automation

Comprehensive API testing suite for Duetto Analytics IoT sensor monitoring system.

## 📋 Test Coverage

### API Modules Tested:
- ✅ User Management (Login, CRUD, Auth)
- ✅ Device Management
- ✅ Analytics & Reporting
- ⏳ Sensor Data (Gas, Airflow, Pressure, Humidity)
- ⏳ Organization Management
- ⏳ Alarm Reporting
- ⏳ Settings & Configuration

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Test Environment
Edit `tests/config.js` with your server details:
- Update `BASE_URL` (currently: http://192.168.10.232:3000)
- Update admin credentials in `ADMIN_USER`

### 3. Run Tests

**Run All Tests:**
```bash
npm test
```

**Run Specific Test Suite:**
```bash
npm run test:user       # User API tests
npm run test:device     # Device API tests
npm run test:analytics  # Analytics API tests
```

**Watch Mode (auto-rerun on changes):**
```bash
npm run test:watch
```

**Coverage Report:**
```bash
npm run test:coverage
```

## 📁 Project Structure

```
DA Test Automation/
├── tests/
│   ├── config.js              # Test configuration
│   └── api/
│       ├── user.test.js       # User API tests
│       ├── device.test.js     # Device API tests
│       └── analytics.test.js  # Analytics tests
├── backend-downloaded/        # Application source code
├── package.json               # Dependencies & scripts
└── TEST_README.md             # This file
```

## 🔧 Configuration

### API Base URL
Default: `http://192.168.10.232:3000`

Update in `tests/config.js`:
```javascript
BASE_URL: process.env.API_BASE_URL || 'http://192.168.10.232:3000'
```

Or set environment variable:
```bash
export API_BASE_URL=http://your-server:3000
npm test
```

### Admin Credentials
Update in `tests/config.js`:
```javascript
ADMIN_USER: {
  email: 'admin@maestrodigitalmine.com',
  password: 'your-password'
}
```

## 📊 Test Scenarios

### User API Tests
- ✅ Login with valid credentials
- ✅ Verify access token
- ✅ Get all users
- ✅ Create new user
- ✅ Get user by ID
- ✅ Update user
- ✅ Delete user
- ✅ Invalid login (negative test)
- ✅ Unauthorized access (negative test)

### Device API Tests
- ✅ Get all devices
- ✅ Create device
- ✅ Get device by ID
- ✅ Update device
- ✅ Delete device

### Analytics API Tests
- ✅ Get analytics data with date range
- ✅ Get sensor analytics
- ✅ Get device statistics

## 🛠️ Available Endpoints

Based on backend analysis, the following endpoints are available:

### Core APIs:
- `/api/user` - User management & authentication
- `/api/device` - Device CRUD operations
- `/api/devicetype` - Device type management
- `/api/devicesensormaster` - Device sensor configuration
- `/api/sensor` - Sensor data endpoints
  - `/api/sensor/gassensor`
  - `/api/sensor/airflowsensor`
  - `/api/sensor/dpsensor` (differential pressure)
  - `/api/sensor/rhsensor` (humidity)
- `/api/analytics` - Analytics & reporting
- `/api/alarmreport` - Alarm reporting
- `/api/sensoralarm` - Sensor alarm configuration
- `/api/organization` - Organization management
- `/api/department` - Department management
- `/api/settings` - System settings
- `/api/notification` - Notification management
- `/api/calibrationrule` - Calibration rules
- `/api/license` - License management

## 🔍 Extending Tests

### Add New Test Suite:
1. Create new file in `tests/api/` (e.g., `organization.test.js`)
2. Follow the pattern from existing test files
3. Add npm script in `package.json`:
```json
"test:organization": "jest tests/api/organization.test.js"
```

### Example Test Template:
```javascript
const axios = require('axios');
const config = require('../config');

const apiClient = axios.create({
  baseURL: config.BASE_URL,
  timeout: config.TIMEOUT.MEDIUM
});

let authToken = null;

describe('Your API Tests', () => {
  beforeAll(async () => {
    const response = await apiClient.post('/api/user/login', {
      email: config.ADMIN_USER.email,
      password: config.ADMIN_USER.password
    });
    authToken = response.data.token;
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  });

  test('Your test case', async () => {
    const response = await apiClient.get('/api/your-endpoint');
    expect(response.status).toBe(200);
  });
});
```

## 📈 Next Steps

### Additional Test Suites to Create:
1. Sensor API tests (Gas, Airflow, Pressure, Humidity)
2. Organization & Department tests
3. Alarm & Notification tests
4. Settings & Configuration tests
5. Integration tests with InfluxDB
6. Performance & Load tests
7. End-to-end workflow tests

### Postman Collection (Optional):
```bash
npm run postman:run
```
(Create Postman collection in `postman/` directory)

## 🐛 Troubleshooting

### Connection Issues:
- Verify server is running: `http://192.168.10.232:3000/test`
- Check network connectivity
- Verify credentials in `tests/config.js`

### Test Failures:
- Check actual API response structure
- Update test assertions to match your API schema
- Review backend code in `backend-downloaded/server/api/`

## 📝 Notes

- All tests use JWT authentication
- Token is obtained via `/api/user/login`
- Most endpoints require `Authorization: Bearer <token>` header
- Test data is cleaned up after each test suite

## 🔐 Security

⚠️ **Important:**
- Never commit credentials to git
- Use environment variables for sensitive data
- Update `.gitignore` to exclude `tests/config.js` if it contains secrets

---

**Happy Testing! 🚀**
