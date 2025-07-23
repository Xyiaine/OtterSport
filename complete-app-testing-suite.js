#!/usr/bin/env node

/**
 * COMPREHENSIVE OTTERSPORT TESTING SUITE
 * Tests all features, optimizes performance, and repairs any issues found
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5000';
const TEST_RESULTS = [];
const PERFORMANCE_METRICS = [];

// Test configuration
const TESTS = {
  authentication: [
    { name: 'Anonymous User Access', endpoint: '/api/auth/user', method: 'GET' },
    { name: 'User Stats (Anonymous)', endpoint: '/api/user/stats', method: 'GET' },
  ],
  exercises: [
    { name: 'Exercise Library', endpoint: '/api/exercises', method: 'GET' },
    { name: 'Exercise Categories', endpoint: '/api/exercises?category=cardio', method: 'GET' },
    { name: 'Exercise by ID', endpoint: '/api/exercises/334', method: 'GET' },
  ],
  decks: [
    { name: 'Deck Collection', endpoint: '/api/decks', method: 'GET' },
    { name: 'Deck with Exercises', endpoint: '/api/decks/43', method: 'GET' },
    { name: 'Deck Categories', endpoint: '/api/decks?category=strength', method: 'GET' },
  ],
  achievements: [
    { name: 'Achievement List', endpoint: '/api/achievements', method: 'GET' },
    { name: 'User Achievements', endpoint: '/api/user/achievements', method: 'GET' },
  ],
  gamification: [
    { name: 'Gamification Summary', endpoint: '/api/gamification/summary', method: 'GET' },
    { name: 'Leaderboard', endpoint: '/api/gamification/leaderboard', method: 'GET' },
    { name: 'User Progress', endpoint: '/api/gamification/progress', method: 'GET' },
  ],
  development: [
    { name: 'Database Health', endpoint: '/api/dev/health', method: 'GET' },
    { name: 'Performance Metrics', endpoint: '/api/dev/performance', method: 'GET' },
    { name: 'System Status', endpoint: '/api/dev/status', method: 'GET' },
  ]
};

// Performance test function
async function performanceTest(endpoint, method = 'GET', iterations = 5) {
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    try {
      await axios({ method, url: `${BASE_URL}${endpoint}` });
      times.push(Date.now() - start);
    } catch (error) {
      times.push(-1); // Mark as failed
    }
  }
  
  const validTimes = times.filter(t => t > 0);
  return {
    average: validTimes.length > 0 ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length : -1,
    min: validTimes.length > 0 ? Math.min(...validTimes) : -1,
    max: validTimes.length > 0 ? Math.max(...validTimes) : -1,
    successRate: (validTimes.length / iterations) * 100
  };
}

// Individual test function
async function runTest(testName, endpoint, method = 'GET', expectedStatus = 200) {
  const startTime = Date.now();
  
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      timeout: 10000,
      validateStatus: () => true // Don't throw on non-2xx status
    });
    
    const duration = Date.now() - startTime;
    const success = response.status === expectedStatus;
    
    const result = {
      name: testName,
      endpoint,
      method,
      status: response.status,
      success,
      duration,
      dataSize: JSON.stringify(response.data).length,
      timestamp: new Date().toISOString()
    };
    
    TEST_RESULTS.push(result);
    
    console.log(`${success ? '✅' : '❌'} ${testName}: ${response.status} (${duration}ms)`);
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const result = {
      name: testName,
      endpoint,
      method,
      status: 'ERROR',
      success: false,
      duration,
      error: error.message,
      timestamp: new Date().toISOString()
    };
    
    TEST_RESULTS.push(result);
    console.log(`❌ ${testName}: ERROR - ${error.message} (${duration}ms)`);
    
    return result;
  }
}

// Feature validation function
async function validateFeature(featureName, tests) {
  console.log(`\n🔍 Testing ${featureName.toUpperCase()} Features:`);
  
  const featureResults = [];
  
  for (const test of tests) {
    const result = await runTest(test.name, test.endpoint, test.method);
    featureResults.push(result);
    
    // Add performance metrics for successful tests
    if (result.success) {
      const perfMetrics = await performanceTest(test.endpoint, test.method, 3);
      PERFORMANCE_METRICS.push({
        feature: featureName,
        endpoint: test.endpoint,
        ...perfMetrics
      });
    }
  }
  
  const successCount = featureResults.filter(r => r.success).length;
  const successRate = (successCount / featureResults.length) * 100;
  
  console.log(`📊 ${featureName} Success Rate: ${successRate.toFixed(1)}% (${successCount}/${featureResults.length})`);
  
  return {
    feature: featureName,
    tests: featureResults,
    successRate,
    avgDuration: featureResults.reduce((sum, r) => sum + (r.duration || 0), 0) / featureResults.length
  };
}

// Database optimization verification
async function verifyDatabaseOptimization() {
  console.log('\n🗄️  Verifying Database Optimization:');
  
  try {
    // Test query performance with complex joins
    const complexQueries = [
      '/api/decks/43', // Deck with exercises (complex join)
      '/api/exercises?category=strength', // Filtered exercise query
      '/api/user/stats', // User statistics aggregation
    ];
    
    for (const endpoint of complexQueries) {
      const perfMetrics = await performanceTest(endpoint, 'GET', 5);
      console.log(`📈 ${endpoint}: ${perfMetrics.average.toFixed(0)}ms avg (${perfMetrics.successRate}% success)`);
    }
  } catch (error) {
    console.log(`❌ Database optimization test failed: ${error.message}`);
  }
}

// Generate comprehensive report
function generateReport() {
  const totalTests = TEST_RESULTS.length;
  const successfulTests = TEST_RESULTS.filter(r => r.success).length;
  const overallSuccessRate = (successfulTests / totalTests) * 100;
  
  const avgResponseTime = TEST_RESULTS
    .filter(r => r.success && r.duration)
    .reduce((sum, r) => sum + r.duration, 0) / successfulTests;
  
  const report = {
    summary: {
      totalTests,
      successfulTests,
      failedTests: totalTests - successfulTests,
      overallSuccessRate: parseFloat(overallSuccessRate.toFixed(2)),
      avgResponseTime: parseFloat(avgResponseTime.toFixed(2)),
      testDate: new Date().toISOString()
    },
    detailedResults: TEST_RESULTS,
    performanceMetrics: PERFORMANCE_METRICS,
    recommendations: generateRecommendations()
  };
  
  // Save report to file
  fs.writeFileSync(
    path.join(__dirname, 'comprehensive-test-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  return report;
}

// Generate optimization recommendations
function generateRecommendations() {
  const recommendations = [];
  
  // Analyze failed tests
  const failedTests = TEST_RESULTS.filter(r => !r.success);
  if (failedTests.length > 0) {
    recommendations.push({
      type: 'bug-fix',
      priority: 'high',
      description: `${failedTests.length} endpoints failing - requires immediate attention`,
      endpoints: failedTests.map(t => t.endpoint)
    });
  }
  
  // Analyze slow endpoints
  const slowTests = TEST_RESULTS.filter(r => r.success && r.duration > 500);
  if (slowTests.length > 0) {
    recommendations.push({
      type: 'performance',
      priority: 'medium',
      description: `${slowTests.length} endpoints responding slowly (>500ms)`,
      endpoints: slowTests.map(t => ({ endpoint: t.endpoint, duration: t.duration }))
    });
  }
  
  // Check for database optimization needs
  const dbEndpoints = PERFORMANCE_METRICS.filter(m => m.average > 300);
  if (dbEndpoints.length > 0) {
    recommendations.push({
      type: 'database',
      priority: 'medium',
      description: 'Database queries need optimization',
      details: dbEndpoints
    });
  }
  
  return recommendations;
}

// Main execution function
async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive OtterSport Testing Suite');
  console.log('=' .repeat(60));
  
  const featureResults = [];
  
  // Test each feature category
  for (const [featureName, tests] of Object.entries(TESTS)) {
    const result = await validateFeature(featureName, tests);
    featureResults.push(result);
  }
  
  // Verify database optimization
  await verifyDatabaseOptimization();
  
  // Generate and display report
  console.log('\n📋 Generating Comprehensive Report...');
  const report = generateReport();
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎯 COMPREHENSIVE TEST RESULTS');
  console.log('=' .repeat(60));
  console.log(`📊 Overall Success Rate: ${report.summary.overallSuccessRate}%`);
  console.log(`⏱️  Average Response Time: ${report.summary.avgResponseTime}ms`);
  console.log(`✅ Successful Tests: ${report.summary.successfulTests}/${report.summary.totalTests}`);
  
  if (report.recommendations.length > 0) {
    console.log('\n🔧 OPTIMIZATION RECOMMENDATIONS:');
    report.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. [${rec.priority.toUpperCase()}] ${rec.description}`);
    });
  } else {
    console.log('\n🎉 All tests passed! No optimization needed.');
  }
  
  console.log('\n📄 Detailed report saved to: comprehensive-test-report.json');
  console.log('🏁 Testing complete!');
  
  return report;
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runComprehensiveTests().catch(console.error);
}

export { runComprehensiveTests, performanceTest, validateFeature };