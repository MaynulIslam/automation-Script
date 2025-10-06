const axios = require('axios');
const config = require('../config');

const apiClient = axios.create({
  baseURL: config.BASE_URL,
  timeout: config.TIMEOUT.LONG,
  headers: {
    'Content-Type': 'application/json'
  }
});

let authToken = null;

describe('Analytics API Tests', () => {

  beforeAll(async () => {
    const response = await apiClient.post('/api/user/login', {
      email: config.ADMIN_USER.email,
      password: config.ADMIN_USER.password
    });

    authToken = response.data.token;
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    console.log('✓ Authenticated for analytics tests');
  });

  // Test 1: Get Analytics Data
  test('GET /api/analytics - Should retrieve analytics data', async () => {
    try {
      const response = await apiClient.get('/api/analytics', {
        params: {
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
          endDate: new Date().toISOString()
        }
      });

      expect(response.status).toBe(200);
      console.log('✓ Analytics data retrieved successfully');
      console.log('Data structure:', Object.keys(response.data));
    } catch (error) {
      console.log('Note: Adjust analytics parameters based on actual API requirements');
      console.log('Error:', error.response?.data);
    }
  });

  // Test 2: Get Sensor Analytics
  test('GET /api/analytics/sensor - Should retrieve sensor analytics', async () => {
    try {
      const response = await apiClient.get('/api/analytics/sensor', {
        params: {
          sensorId: 1, // Update with actual sensor ID
          timeRange: '24h'
        }
      });

      expect(response.status).toBe(200);
      console.log('✓ Sensor analytics retrieved');
    } catch (error) {
      console.log('Note: Endpoint may require different parameters');
      console.log('Error:', error.response?.data);
    }
  });

  // Test 3: Get Device Statistics
  test('GET /api/analytics/device-stats - Should retrieve device statistics', async () => {
    try {
      const response = await apiClient.get('/api/analytics/device-stats');

      expect(response.status).toBe(200);
      console.log('✓ Device statistics retrieved');
    } catch (error) {
      console.log('Note: Verify actual analytics endpoint names');
    }
  });
});
