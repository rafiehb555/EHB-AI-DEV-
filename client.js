const axios = require('axios');

async function testBackendHealth() {
  try {
    const response = await axios.get('http://localhost:8000/health');
    console.log('Backend health check response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking backend health:', error.message);
    return null;
  }
}

async function registerTestUser() {
  try {
    const response = await axios.post('http://localhost:8000/api/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123456',
      role: 'admin'
    });
    console.log('User registration response:', response.data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('Test user already exists, trying to login instead');
      return await loginTestUser();
    }
    console.error('Error registering test user:', error.message);
    console.error('Error details:', error.response?.data || 'No response data');
    return null;
  }
}

async function loginTestUser() {
  try {
    const response = await axios.post('http://localhost:8000/api/auth/login', {
      email: 'test@example.com',
      password: 'test123456'
    });
    console.log('User login successful, token received');
    return response.data;
  } catch (error) {
    console.error('Error logging in test user:', error.message);
    console.error('Error details:', error.response?.data || 'No response data');
    return null;
  }
}

async function testOpenAIIntegration(token) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.post('http://localhost:8000/api/ai/chat', {
      message: 'Hello, AI Assistant. Can you provide a brief overview of this dashboard system?',
      userRole: 'admin'
    }, { headers });
    console.log('AI response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error testing AI integration:', error.message);
    console.error('Error details:', error.response?.data || 'No response data');
    return null;
  }
}

async function main() {
  console.log('Testing backend API...');
  
  // Test health endpoint
  const healthResponse = await testBackendHealth();
  if (healthResponse && healthResponse.status === 'ok') {
    console.log('✅ Backend health check passed');
  } else {
    console.log('❌ Backend health check failed');
    return;
  }
  
  // Register/login test user
  console.log('\nRegistering/logging in test user...');
  const authData = await registerTestUser();
  if (!authData || !authData.token) {
    console.log('❌ Authentication failed');
    return;
  }
  console.log('✅ Authentication successful');
  
  // Test OpenAI integration with token
  console.log('\nTesting OpenAI integration with authentication...');
  const aiResponse = await testOpenAIIntegration(authData.token);
  if (aiResponse) {
    console.log('✅ OpenAI integration test passed');
  } else {
    console.log('❌ OpenAI integration test failed');
  }
}

main().catch(console.error);