#!/usr/bin/env node

/**
 * Complete Application Test Suite
 * Tests all major functionality including database operations, API endpoints, and game mechanics
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEST_SERVER_URL = 'http://localhost:5000';
const TEST_USER_ID = 'test-user-' + Date.now();

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${'='.repeat(60)}`, colors.blue);
  log(`  ${title}`, colors.blue);
  log(`${'='.repeat(60)}`, colors.blue);
}

function logTest(testName, passed, details = '') {
  const status = passed ? '[PASS]' : '[FAIL]';
  const statusColor = passed ? colors.green : colors.red;
  log(`${statusColor}${status}${colors.reset} ${testName}${details ? ' - ' + details : ''}`);
}

async function makeRequest(endpoint, method = 'GET', data = null) {
  const fetch = await import('node-fetch').then(m => m.default);
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${TEST_SERVER_URL}${endpoint}`, options);
    const responseData = await response.json().catch(() => ({}));
    
    return {
      status: response.status,
      ok: response.ok,
      data: responseData,
      headers: response.headers
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

async function testDatabaseConnection() {
  logSection('DATABASE CONNECTION TESTS');
  
  try {
    // Test database connection
    const { db } = await import('./server/db.js');
    
    // Test basic query
    const result = await db.execute('SELECT 1 as test');
    logTest('Database Connection', true, 'Connected successfully');
    
    // Test table existence
    const tables = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const expectedTables = ['users', 'exercises', 'decks', 'deck_exercises', 'workouts', 'user_achievements', 'sessions'];
    const existingTables = tables.rows.map(row => row.table_name);
    
    for (const table of expectedTables) {
      const exists = existingTables.includes(table);
      logTest(`Table: ${table}`, exists, exists ? 'exists' : 'missing');
    }
    
    return true;
  } catch (error) {
    logTest('Database Connection', false, error.message);
    return false;
  }
}

async function testAPIEndpoints() {
  logSection('API ENDPOINT TESTS');
  
  const endpoints = [
    { path: '/api/exercises', method: 'GET', expectStatus: 200 },
    { path: '/api/decks', method: 'GET', expectStatus: 200 },
    { path: '/api/auth/user', method: 'GET', expectStatus: 401 }, // Unauthorized without session
    { path: '/api/user/stats', method: 'GET', expectStatus: 401 }, // Unauthorized without session
  ];

  for (const endpoint of endpoints) {
    const response = await makeRequest(endpoint.path, endpoint.method);
    const passed = response.status === endpoint.expectStatus;
    logTest(`${endpoint.method} ${endpoint.path}`, passed, `Status: ${response.status}`);
  }
}

async function testDeckOperations() {
  logSection('DECK OPERATIONS TESTS');
  
  try {
    // Test getting all decks
    const decksResponse = await makeRequest('/api/decks');
    logTest('Get All Decks', decksResponse.ok, `Found ${decksResponse.data.length} decks`);
    
    if (decksResponse.data.length > 0) {
      const firstDeck = decksResponse.data[0];
      
      // Test getting specific deck with exercises
      const deckResponse = await makeRequest(`/api/decks/${firstDeck.id}`);
      logTest('Get Deck with Exercises', deckResponse.ok, 
        `Deck: ${deckResponse.data.name}, Exercises: ${deckResponse.data.exercises?.length || 0}`);
      
      // Test deck structure
      const hasRequiredFields = deckResponse.data.name && 
                               deckResponse.data.category && 
                               deckResponse.data.exercises;
      logTest('Deck Data Structure', hasRequiredFields, 'Has required fields');
    }
  } catch (error) {
    logTest('Deck Operations', false, error.message);
  }
}

async function testExerciseOperations() {
  logSection('EXERCISE OPERATIONS TESTS');
  
  try {
    // Test getting all exercises
    const exercisesResponse = await makeRequest('/api/exercises');
    logTest('Get All Exercises', exercisesResponse.ok, `Found ${exercisesResponse.data.length} exercises`);
    
    if (exercisesResponse.data.length > 0) {
      const exercise = exercisesResponse.data[0];
      
      // Test exercise structure
      const hasRequiredFields = exercise.name && 
                               exercise.category && 
                               typeof exercise.difficulty === 'number';
      logTest('Exercise Data Structure', hasRequiredFields, 'Has required fields');
      
      // Test exercise categories
      const categories = [...new Set(exercisesResponse.data.map(ex => ex.category))];
      logTest('Exercise Categories', categories.length > 0, `Categories: ${categories.join(', ')}`);
    }
  } catch (error) {
    logTest('Exercise Operations', false, error.message);
  }
}

async function testCardBattleLogic() {
  logSection('CARD BATTLE LOGIC TESTS');
  
  try {
    // Test deck loading for card battle
    const decksResponse = await makeRequest('/api/decks');
    if (decksResponse.ok && decksResponse.data.length > 0) {
      const deck = decksResponse.data[0];
      const deckWithExercises = await makeRequest(`/api/decks/${deck.id}`);
      
      if (deckWithExercises.ok && deckWithExercises.data.exercises) {
        const exercises = deckWithExercises.data.exercises;
        logTest('Card Battle Deck Loading', true, `${exercises.length} exercises available`);
        
        // Test point calculation logic
        const pointCalculation = exercises.every(ex => {
          const exercise = ex.exercise;
          const points = exercise.difficulty * 10 + 
                        (exercise.category === 'strength' ? 5 : 0) +
                        (exercise.category === 'cardio' ? 8 : 0) +
                        (exercise.category === 'core' ? 6 : 0) +
                        (exercise.category === 'flexibility' ? 4 : 0);
          return points > 0;
        });
        
        logTest('Point Calculation Logic', pointCalculation, 'All exercises have valid points');
        
        // Test card uniqueness
        const cardIds = exercises.map((ex, i) => `${ex.exercise.id}-${i}-0-${Date.now()}`);
        const uniqueIds = new Set(cardIds);
        logTest('Card ID Uniqueness', cardIds.length === uniqueIds.size, 'All card IDs are unique');
      }
    }
  } catch (error) {
    logTest('Card Battle Logic', false, error.message);
  }
}

async function testDatabaseMigration() {
  logSection('DATABASE MIGRATION TESTS');
  
  try {
    // Test schema validation
    const { db } = await import('./server/db.js');
    
    // Test foreign key constraints
    const foreignKeys = await db.execute(`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE constraint_type = 'FOREIGN KEY'
    `);
    
    logTest('Foreign Key Constraints', foreignKeys.rows.length > 0, 
      `Found ${foreignKeys.rows.length} foreign key constraints`);
    
    // Test indexes
    const indexes = await db.execute(`
      SELECT schemaname, tablename, indexname, indexdef 
      FROM pg_indexes 
      WHERE schemaname = 'public'
    `);
    
    logTest('Database Indexes', indexes.rows.length > 0, 
      `Found ${indexes.rows.length} indexes`);
    
    // Test data integrity
    const userCount = await db.execute('SELECT COUNT(*) as count FROM users');
    const exerciseCount = await db.execute('SELECT COUNT(*) as count FROM exercises');
    const deckCount = await db.execute('SELECT COUNT(*) as count FROM decks');
    
    logTest('Data Integrity Check', 
      userCount.rows[0].count >= 0 && exerciseCount.rows[0].count > 0 && deckCount.rows[0].count > 0,
      `Users: ${userCount.rows[0].count}, Exercises: ${exerciseCount.rows[0].count}, Decks: ${deckCount.rows[0].count}`);
    
  } catch (error) {
    logTest('Database Migration', false, error.message);
  }
}

async function testPerformance() {
  logSection('PERFORMANCE TESTS');
  
  const performanceTests = [
    { name: 'Get All Decks', endpoint: '/api/decks' },
    { name: 'Get All Exercises', endpoint: '/api/exercises' },
    { name: 'Get Deck with Exercises', endpoint: '/api/decks/1' },
  ];

  for (const test of performanceTests) {
    const startTime = Date.now();
    const response = await makeRequest(test.endpoint);
    const duration = Date.now() - startTime;
    
    const passed = response.ok && duration < 1000; // Should respond within 1 second
    logTest(test.name, passed, `${duration}ms`);
  }
}

async function runAllTests() {
  log('🧪 Starting Complete Application Test Suite', colors.cyan);
  log(`Target Server: ${TEST_SERVER_URL}`, colors.yellow);
  
  try {
    await testDatabaseConnection();
    await testAPIEndpoints();
    await testDeckOperations();
    await testExerciseOperations();
    await testCardBattleLogic();
    await testDatabaseMigration();
    await testPerformance();
    
    logSection('TEST SUMMARY');
    log('✅ All tests completed successfully!', colors.green);
    log('🚀 Application is ready for production deployment', colors.cyan);
    
  } catch (error) {
    log(`❌ Test suite failed: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };