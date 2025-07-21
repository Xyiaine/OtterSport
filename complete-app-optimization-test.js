/**
 * COMPREHENSIVE OTTERSPORT APPLICATION TEST SUITE
 * 
 * This test suite validates all core functionality and performance metrics
 * for the OtterSport fitness card game application.
 */

const axios = require('axios');

const baseURL = 'http://localhost:5000';
const api = axios.create({ baseURL });

/**
 * Test Results Tracker
 */
const testResults = {
  passed: 0,
  failed: 0,
  errors: [],
  performance: {}
};

/**
 * Utility function to run tests with timing
 */
async function runTest(testName, testFunction) {
  console.log(`\n🧪 Testing: ${testName}`);
  const startTime = Date.now();
  
  try {
    const result = await testFunction();
    const duration = Date.now() - startTime;
    
    if (result.success) {
      testResults.passed++;
      console.log(`✅ PASS (${duration}ms): ${testName}`);
      if (result.data) {
        console.log(`   Data: ${JSON.stringify(result.data).slice(0, 100)}...`);
      }
    } else {
      testResults.failed++;
      testResults.errors.push({ test: testName, error: result.error });
      console.log(`❌ FAIL: ${testName} - ${result.error}`);
    }
    
    testResults.performance[testName] = duration;
  } catch (error) {
    testResults.failed++;
    testResults.errors.push({ test: testName, error: error.message });
    console.log(`❌ ERROR: ${testName} - ${error.message}`);
    testResults.performance[testName] = Date.now() - startTime;
  }
}

/**
 * Core API Endpoint Tests
 */
async function testExercisesEndpoint() {
  const response = await api.get('/api/exercises');
  const exercises = response.data;
  
  return {
    success: exercises.length >= 18 && // Should have base + utility + warmup cards
             exercises.some(ex => ex.cardType === 'utility') &&
             exercises.some(ex => ex.cardType === 'warmup'),
    data: { count: exercises.length, types: [...new Set(exercises.map(ex => ex.cardType))] },
    error: exercises.length < 18 ? `Only ${exercises.length} exercises found, expected 18+` : null
  };
}

async function testDecksEndpoint() {
  const response = await api.get('/api/decks');
  const decks = response.data;
  
  return {
    success: decks.length >= 4 && decks.every(deck => deck.name && deck.category),
    data: { count: decks.length, categories: decks.map(d => d.category) },
    error: decks.length < 4 ? `Only ${decks.length} decks found` : null
  };
}

async function testAchievementsEndpoint() {
  const response = await api.get('/api/achievements');
  const achievements = response.data;
  
  return {
    success: achievements.length >= 8,
    data: { count: achievements.length },
    error: achievements.length < 8 ? `Only ${achievements.length} achievements found` : null
  };
}

/**
 * Database Validation Tests
 */
async function testDatabaseIntegrity() {
  try {
    const response = await api.get('/api/development/database-health');
    const health = response.data;
    
    return {
      success: health.status === 'healthy',
      data: health,
      error: health.status !== 'healthy' ? 'Database unhealthy' : null
    };
  } catch (error) {
    return { success: false, error: 'Database health check failed' };
  }
}

async function testUtilityCards() {
  const response = await api.get('/api/exercises');
  const utilityCards = response.data.filter(ex => ex.cardType === 'utility');
  
  const expectedUtilities = ['Fresh Hand', 'Deck Shuffle', 'Quick Draw', 'Energy Boost', 'Strategic Skip'];
  const foundUtilities = utilityCards.map(card => card.name);
  
  return {
    success: expectedUtilities.every(expected => foundUtilities.includes(expected)),
    data: { found: foundUtilities, expected: expectedUtilities },
    error: expectedUtilities.length !== foundUtilities.length ? 'Missing utility cards' : null
  };
}

async function testWarmupCards() {
  const response = await api.get('/api/exercises');
  const warmupCards = response.data.filter(ex => ex.cardType === 'warmup');
  
  return {
    success: warmupCards.length >= 3 && warmupCards.every(card => card.utilityEffect),
    data: { count: warmupCards.length, cards: warmupCards.map(c => c.name) },
    error: warmupCards.length < 3 ? 'Insufficient warm-up cards' : null
  };
}

/**
 * Performance Tests
 */
async function testAPIResponseTimes() {
  const endpoints = ['/api/exercises', '/api/decks', '/api/achievements'];
  const results = {};
  
  for (const endpoint of endpoints) {
    const start = Date.now();
    await api.get(endpoint);
    results[endpoint] = Date.now() - start;
  }
  
  const maxTime = Math.max(...Object.values(results));
  
  return {
    success: maxTime < 200, // Target: sub-200ms response times
    data: results,
    error: maxTime >= 200 ? `Slow response time: ${maxTime}ms` : null
  };
}

/**
 * Game Logic Tests
 */
async function testCardBattleLogic() {
  // Test that we can fetch a deck and start a game
  const decksResponse = await api.get('/api/decks');
  const decks = decksResponse.data;
  
  if (decks.length === 0) {
    return { success: false, error: 'No decks available for card battle' };
  }
  
  // Test deck exercises endpoint
  const deckId = decks[0].id;
  const exercisesResponse = await api.get(`/api/decks/${deckId}/exercises`);
  const deckExercises = exercisesResponse.data;
  
  return {
    success: deckExercises.length > 0,
    data: { deckId, exerciseCount: deckExercises.length },
    error: deckExercises.length === 0 ? 'No exercises in deck' : null
  };
}

/**
 * Frontend Build Test
 */
async function testFrontendBuild() {
  try {
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    const { stdout, stderr } = await execPromise('npm run build');
    
    return {
      success: !stderr.includes('ERROR') && stdout.includes('built'),
      data: { output: stdout.split('\n').slice(-5).join('\n') },
      error: stderr.includes('ERROR') ? stderr : null
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Main Test Runner
 */
async function runAllTests() {
  console.log('🚀 Starting OtterSport Comprehensive Test Suite...\n');
  
  // Core API Tests
  await runTest('Exercise API Endpoint', testExercisesEndpoint);
  await runTest('Decks API Endpoint', testDecksEndpoint);
  await runTest('Achievements API Endpoint', testAchievementsEndpoint);
  
  // Database Tests
  await runTest('Database Integrity', testDatabaseIntegrity);
  await runTest('Utility Cards Validation', testUtilityCards);
  await runTest('Warm-up Cards Validation', testWarmupCards);
  
  // Performance Tests
  await runTest('API Response Times', testAPIResponseTimes);
  
  // Game Logic Tests
  await runTest('Card Battle Logic', testCardBattleLogic);
  
  // Build Tests
  await runTest('Frontend Build', testFrontendBuild);
  
  // Final Results
  console.log('\n' + '='.repeat(60));
  console.log('🎯 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📊 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  if (testResults.errors.length > 0) {
    console.log('\n🔍 FAILED TESTS:');
    testResults.errors.forEach(error => {
      console.log(`   • ${error.test}: ${error.error}`);
    });
  }
  
  console.log('\n⚡ PERFORMANCE METRICS:');
  Object.entries(testResults.performance).forEach(([test, time]) => {
    const status = time < 100 ? '🟢' : time < 200 ? '🟡' : '🔴';
    console.log(`   ${status} ${test}: ${time}ms`);
  });
  
  const overallHealth = testResults.failed === 0 ? '🟢 EXCELLENT' : 
                       testResults.failed <= 2 ? '🟡 GOOD' : '🔴 NEEDS WORK';
  
  console.log(`\n🏆 OVERALL HEALTH: ${overallHealth}`);
  console.log('='.repeat(60));
}

// Run the tests
runAllTests().catch(console.error);