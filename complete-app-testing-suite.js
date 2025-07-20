/**
 * COMPREHENSIVE OTTERSPORT APPLICATION TESTING SUITE
 * 
 * This script performs end-to-end testing of all major features:
 * - Authentication system
 * - Gamification system (XP, badges, achievements, leaderboards)
 * - Workout roadmap and progression
 * - Database connectivity and performance
 * - API endpoint responsiveness
 * - Error handling and edge cases
 * 
 * For Human Developers:
 * This testing suite validates that all core features work correctly
 * and helps identify performance bottlenecks or bugs in the system.
 */

import axios from 'axios';

// Test configuration
const BASE_URL = 'http://localhost:5000';
const TEST_RESULTS = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

// Helper function to log test results
function logTest(testName, passed, message = '', responseTime = null) {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const timeInfo = responseTime ? ` (${responseTime}ms)` : '';
  console.log(`${status} ${testName}${timeInfo}`);
  
  if (message) {
    console.log(`   ${message}`);
  }
  
  TEST_RESULTS.details.push({
    test: testName,
    passed,
    message,
    responseTime
  });
  
  if (passed) {
    TEST_RESULTS.passed++;
  } else {
    TEST_RESULTS.failed++;
  }
}

// Helper function to measure response time
async function timedRequest(url, method = 'GET', data = null) {
  const start = Date.now();
  try {
    const config = { 
      method, 
      url: `${BASE_URL}${url}`,
      timeout: 10000,
      validateStatus: () => true // Accept all status codes
    };
    if (data && method !== 'GET') {
      config.data = data;
    }
    const response = await axios(config);
    const responseTime = Date.now() - start;
    return { response, responseTime };
  } catch (error) {
    return { error, responseTime: Date.now() - start };
  }
}

// Test database connectivity
async function testDatabaseConnectivity() {
  console.log('\n🔍 Testing Database Connectivity...');
  
  const { response, responseTime, error } = await timedRequest('/api/exercises');
  
  if (error) {
    logTest('Database Connection', false, `Connection failed: ${error.message}`, responseTime);
    return false;
  }
  
  if (response.status === 200 && Array.isArray(response.data)) {
    logTest('Database Connection', true, `Found ${response.data.length} exercises`, responseTime);
    return true;
  } else {
    logTest('Database Connection', false, `Unexpected response: ${response.status}`, responseTime);
    return false;
  }
}

// Test API endpoints
async function testAPIEndpoints() {
  console.log('\n🚀 Testing Core API Endpoints...');
  
  const endpoints = [
    { path: '/api/exercises', name: 'Exercises API', expectJson: true },
    { path: '/api/decks', name: 'Decks API', expectJson: true },
    { path: '/api/gamification/xp-activities', name: 'XP Activities API', expectJson: true },
    { path: '/api/gamification/badges', name: 'Badges API', expectJson: true },
    { path: '/api/gamification/leaderboard', name: 'Leaderboard API', expectJson: true },
  ];
  
  for (const endpoint of endpoints) {
    const { response, responseTime, error } = await timedRequest(endpoint.path);
    
    if (error) {
      logTest(endpoint.name, false, `Request failed: ${error.message}`, responseTime);
      continue;
    }
    
    if (response.status === 200) {
      if (endpoint.expectJson) {
        try {
          const isValidJson = typeof response.data === 'object';
          logTest(endpoint.name, isValidJson, isValidJson ? 'Valid JSON response' : 'Invalid JSON', responseTime);
        } catch (e) {
          logTest(endpoint.name, false, 'Response is not valid JSON', responseTime);
        }
      } else {
        logTest(endpoint.name, true, 'Successful response', responseTime);
      }
    } else {
      logTest(endpoint.name, false, `HTTP ${response.status}`, responseTime);
    }
  }
}

// Test gamification system
async function testGamificationSystem() {
  console.log('\n🎮 Testing Gamification System...');
  
  // Test XP activities
  const { response: xpResponse, responseTime: xpTime } = await timedRequest('/api/gamification/xp-activities');
  if (xpResponse && xpResponse.status === 200) {
    const activities = xpResponse.data;
    logTest('XP Activities', Array.isArray(activities) && activities.length > 0, 
           `Found ${activities.length} XP activities`, xpTime);
  } else {
    logTest('XP Activities', false, 'Failed to fetch XP activities', xpTime);
  }
  
  // Test badges system
  const { response: badgesResponse, responseTime: badgesTime } = await timedRequest('/api/gamification/badges');
  if (badgesResponse && badgesResponse.status === 200) {
    const badges = badgesResponse.data;
    logTest('Badges System', Array.isArray(badges) && badges.length > 0, 
           `Found ${badges.length} badges`, badgesTime);
  } else {
    logTest('Badges System', false, 'Failed to fetch badges', badgesTime);
  }
  
  // Test leaderboard
  const { response: leaderboardResponse, responseTime: leaderboardTime } = await timedRequest('/api/gamification/leaderboard');
  if (leaderboardResponse && leaderboardResponse.status === 200) {
    logTest('Leaderboard', true, 'Leaderboard accessible', leaderboardTime);
  } else {
    logTest('Leaderboard', false, 'Failed to access leaderboard', leaderboardTime);
  }
}

// Test exercises and decks
async function testWorkoutSystem() {
  console.log('\n💪 Testing Workout System...');
  
  // Test exercises
  const { response: exercisesResponse, responseTime: exercisesTime } = await timedRequest('/api/exercises');
  if (exercisesResponse && exercisesResponse.status === 200) {
    const exercises = exercisesResponse.data;
    if (Array.isArray(exercises) && exercises.length > 0) {
      logTest('Exercises Database', true, `Found ${exercises.length} exercises`, exercisesTime);
      
      // Check exercise structure
      const firstExercise = exercises[0];
      const hasRequiredFields = firstExercise.name && firstExercise.category && 
                               typeof firstExercise.difficulty === 'number';
      logTest('Exercise Data Structure', hasRequiredFields, 
             hasRequiredFields ? 'All required fields present' : 'Missing required fields');
    } else {
      logTest('Exercises Database', false, 'No exercises found or invalid format', exercisesTime);
    }
  } else {
    logTest('Exercises Database', false, 'Failed to fetch exercises', exercisesTime);
  }
  
  // Test decks
  const { response: decksResponse, responseTime: decksTime } = await timedRequest('/api/decks');
  if (decksResponse && decksResponse.status === 200) {
    const decks = decksResponse.data;
    logTest('Workout Decks', Array.isArray(decks) && decks.length > 0, 
           `Found ${decks.length} workout decks`, decksTime);
  } else {
    logTest('Workout Decks', false, 'Failed to fetch workout decks', decksTime);
  }
}

// Test performance metrics
async function testPerformanceMetrics() {
  console.log('\n⚡ Testing Performance Metrics...');
  
  const performanceTests = [
    { endpoint: '/api/exercises', name: 'Exercises Load Time', maxTime: 500 },
    { endpoint: '/api/decks', name: 'Decks Load Time', maxTime: 500 },
    { endpoint: '/api/gamification/badges', name: 'Badges Load Time', maxTime: 300 },
    { endpoint: '/api/gamification/xp-activities', name: 'XP Activities Load Time', maxTime: 300 }
  ];
  
  for (const test of performanceTests) {
    const { response, responseTime } = await timedRequest(test.endpoint);
    const performanceOk = responseTime <= test.maxTime;
    
    if (response && response.status === 200) {
      logTest(test.name, performanceOk, 
             performanceOk ? 'Good performance' : `Slow response (>${test.maxTime}ms)`, 
             responseTime);
    } else {
      logTest(test.name, false, 'Endpoint failed', responseTime);
    }
  }
}

// Test error handling
async function testErrorHandling() {
  console.log('\n🛡️  Testing Error Handling...');
  
  // Test 404 endpoints
  const { response: notFoundResponse, responseTime: notFoundTime } = 
    await timedRequest('/api/nonexistent-endpoint');
  logTest('404 Error Handling', notFoundResponse.status === 404, 
         `Returned status: ${notFoundResponse.status}`, notFoundTime);
  
  // Test unauthorized access
  const { response: authResponse, responseTime: authTime } = 
    await timedRequest('/api/gamification/summary');
  logTest('Authentication Check', authResponse.status === 401, 
         'Protected endpoints properly secured', authTime);
}

// Test frontend accessibility
async function testFrontendAccess() {
  console.log('\n🌐 Testing Frontend Access...');
  
  const { response, responseTime, error } = await timedRequest('/');
  
  if (error) {
    logTest('Frontend Loading', false, `Failed to load: ${error.message}`, responseTime);
    return;
  }
  
  if (response.status === 200 && response.data.includes('<!DOCTYPE html>')) {
    logTest('Frontend Loading', true, 'HTML page loads successfully', responseTime);
  } else {
    logTest('Frontend Loading', false, `Unexpected response: ${response.status}`, responseTime);
  }
}

// Generate comprehensive report
function generateTestReport() {
  console.log('\n📊 COMPREHENSIVE TEST REPORT');
  console.log('=' .repeat(50));
  console.log(`✅ Tests Passed: ${TEST_RESULTS.passed}`);
  console.log(`❌ Tests Failed: ${TEST_RESULTS.failed}`);
  console.log(`⚠️  Warnings: ${TEST_RESULTS.warnings}`);
  
  const totalTests = TEST_RESULTS.passed + TEST_RESULTS.failed;
  const successRate = totalTests > 0 ? ((TEST_RESULTS.passed / totalTests) * 100).toFixed(1) : 0;
  console.log(`📈 Success Rate: ${successRate}%`);
  
  if (TEST_RESULTS.failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    TEST_RESULTS.details
      .filter(test => !test.passed)
      .forEach(test => {
        console.log(`   • ${test.test}: ${test.message}`);
      });
  }
  
  // Performance summary
  const responseTimes = TEST_RESULTS.details
    .filter(test => test.responseTime)
    .map(test => test.responseTime);
  
  if (responseTimes.length > 0) {
    const avgTime = (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(0);
    const maxTime = Math.max(...responseTimes);
    console.log(`\n⚡ PERFORMANCE SUMMARY:`);
    console.log(`   Average Response Time: ${avgTime}ms`);
    console.log(`   Maximum Response Time: ${maxTime}ms`);
  }
  
  console.log('\n🎯 RECOMMENDATIONS:');
  if (TEST_RESULTS.failed === 0) {
    console.log('   ✅ All systems operational - ready for production deployment!');
  } else {
    console.log('   🔧 Review failed tests before deployment');
  }
  
  const highResponseTimes = responseTimes.filter(time => time > 1000);
  if (highResponseTimes.length > 0) {
    console.log('   ⚡ Consider database indexing optimization for slow queries');
  }
}

// Main test execution
async function runAllTests() {
  console.log('🚀 OTTERSPORT APPLICATION TEST SUITE');
  console.log('=====================================');
  console.log('Testing all core functionality...\n');
  
  try {
    // Core system tests
    const dbConnected = await testDatabaseConnectivity();
    if (!dbConnected) {
      console.log('❌ Database connection failed - aborting tests');
      return;
    }
    
    await testAPIEndpoints();
    await testGamificationSystem();
    await testWorkoutSystem();
    await testPerformanceMetrics();
    await testErrorHandling();
    await testFrontendAccess();
    
    generateTestReport();
    
  } catch (error) {
    console.error('❌ Test suite encountered an error:', error.message);
  }
}

// Export for use in other scripts
export {
  runAllTests,
  testDatabaseConnectivity,
  testAPIEndpoints,
  testGamificationSystem,
  testWorkoutSystem,
  testPerformanceMetrics
};

// Run tests if script is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runAllTests();
}