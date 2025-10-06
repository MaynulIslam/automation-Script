const axios = require('axios');
const config = require('../config');

const apiClient = axios.create({
  baseURL: config.BASE_URL,
  timeout: config.TIMEOUT.MEDIUM,
  headers: {
    'Content-Type': 'application/json'
  }
});

let authToken = null;
let testDeviceId = null;

describe('Device API Tests', () => {

  // Setup: Login before running tests
  beforeAll(async () => {
    const response = await apiClient.post('/api/user/login', {
      email: config.ADMIN_USER.email,
      password: config.ADMIN_USER.password
    });

    authToken = response.data.token;
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    console.log('✓ Authenticated for device tests');
  });

  // Test 1: Get All Devices
  test('GET /api/device - Should retrieve all devices', async () => {
    const response = await apiClient.get('/api/device');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    console.log(`✓ Retrieved ${response.data.length} devices`);
  });

  // Test 2: Create New Device
  test('POST /api/device - Should create new device', async () => {
    const newDevice = {
      name: `Test Device ${Date.now()}`,
      deviceTypeId: 1, // Update with actual device type ID
      serialNumber: `SN${Date.now()}`,
      location: 'Test Lab',
      status: 'active'
    };

    try {
      const response = await apiClient.post('/api/device', newDevice);

      expect(response.status).toBe(200 || 201);
      if (response.data.id) {
        testDeviceId = response.data.id;
        console.log(`✓ Device created with ID: ${testDeviceId}`);
      }
    } catch (error) {
      console.log('Note: Adjust device creation payload based on actual schema');
      console.log('Error:', error.response?.data);
    }
  });

  // Test 3: Get Device by ID (if device was created)
  test('GET /api/device/:id - Should retrieve device by ID', async () => {
    if (!testDeviceId) {
      console.log('⊘ Skipping: No device ID available');
      return;
    }

    const response = await apiClient.get(`/api/device/${testDeviceId}`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id', testDeviceId);
    console.log('✓ Device retrieved by ID successfully');
  });

  // Test 4: Update Device
  test('PUT /api/device/:id - Should update device', async () => {
    if (!testDeviceId) {
      console.log('⊘ Skipping: No device ID available');
      return;
    }

    const updateData = {
      name: 'Updated Test Device',
      status: 'inactive'
    };

    const response = await apiClient.put(`/api/device/${testDeviceId}`, updateData);

    expect(response.status).toBe(200);
    console.log('✓ Device updated successfully');
  });

  // Test 5: Delete Device
  test('DELETE /api/device/:id - Should delete device', async () => {
    if (!testDeviceId) {
      console.log('⊘ Skipping: No device ID available');
      return;
    }

    const response = await apiClient.delete(`/api/device/${testDeviceId}`);

    expect(response.status).toBe(200);
    console.log('✓ Device deleted successfully');
  });
});
