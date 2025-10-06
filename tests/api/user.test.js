const axios = require('axios');
const config = require('../config');

// API Client
const apiClient = axios.create({
  baseURL: config.BASE_URL,
  timeout: config.TIMEOUT.MEDIUM,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Store auth token
let authToken = null;
let testUserId = null;

describe('User API Tests', () => {

  // Test 1: User Login
  test('POST /api/user/login - Should login successfully', async () => {
    const response = await apiClient.post('/api/user/login', {
      email: config.ADMIN_USER.email,
      password: config.ADMIN_USER.password
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('token');

    // Store token for subsequent tests
    authToken = response.data.token;
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

    console.log('✓ Login successful, token received');
  });

  // Test 2: Verify Access Token
  test('POST /api/user/verifyAccessToken - Should verify token', async () => {
    const response = await apiClient.post('/api/user/verifyAccessToken', {
      token: authToken
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('valid', true);
    console.log('✓ Token verified successfully');
  });

  // Test 3: Get All Users
  test('GET /api/user/getUsers - Should retrieve all users', async () => {
    const response = await apiClient.get('/api/user/getUsers');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    console.log(`✓ Retrieved ${response.data.length} users`);
  });

  // Test 4: Create New User
  test('POST /api/user/insertUser - Should create new user', async () => {
    const newUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `testuser${Date.now()}@example.com`,
      password: 'TestPassword123!',
      role: 'user'
    };

    const response = await apiClient.post('/api/user/insertUser', newUser);

    expect(response.status).toBe(200 || 201);
    expect(response.data).toHaveProperty('id');

    testUserId = response.data.id;
    console.log(`✓ User created with ID: ${testUserId}`);
  });

  // Test 5: Get User by ID
  test('GET /api/user/getUser/:id - Should retrieve user by ID', async () => {
    const response = await apiClient.get(`/api/user/getUser/${testUserId}`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id', testUserId);
    console.log('✓ User retrieved by ID successfully');
  });

  // Test 6: Update User
  test('PUT /api/user/updateUser/:id - Should update user', async () => {
    const updateData = {
      firstName: 'Updated',
      lastName: 'TestUser'
    };

    const response = await apiClient.put(`/api/user/updateUser/${testUserId}`, updateData);

    expect(response.status).toBe(200);
    console.log('✓ User updated successfully');
  });

  // Test 7: Delete User
  test('DELETE /api/user/deleteUser/:id - Should delete user', async () => {
    const response = await apiClient.delete(`/api/user/deleteUser/${testUserId}`);

    expect(response.status).toBe(200);
    console.log('✓ User deleted successfully');
  });

  // Test 8: Invalid Login
  test('POST /api/user/login - Should fail with invalid credentials', async () => {
    try {
      await apiClient.post('/api/user/login', {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      expect(error.response.status).toBe(401 || 400);
      console.log('✓ Invalid login rejected as expected');
    }
  });

  // Test 9: Unauthorized Access
  test('GET /api/user/getUsers - Should fail without token', async () => {
    const clientWithoutAuth = axios.create({
      baseURL: config.BASE_URL,
      timeout: config.TIMEOUT.MEDIUM
    });

    try {
      await clientWithoutAuth.get('/api/user/getUsers');
    } catch (error) {
      expect(error.response.status).toBe(401 || 403);
      console.log('✓ Unauthorized access blocked as expected');
    }
  });
});
