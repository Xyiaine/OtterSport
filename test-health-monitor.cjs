#!/usr/bin/env node

/**
 * SIMPLE HEALTH MONITOR TEST
 * 
 * This script demonstrates the system health monitor functionality
 * and tests all the health check endpoints.
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testHealthEndpoints() {
  console.log('🧪 Testing OtterSport System Health Monitor');
  console.log('=' .repeat(50));
  
  const endpoints = [
    { name: 'Database Health', url: '/api/dev/database/health' },
    { name: 'System Status', url: '/api/dev/system/status' },
    { name: 'Performance Metrics', url: '/api/dev/system/performance' },
    { name: 'Health Summary', url: '/api/dev/health/summary' },
    { name: 'Exercise Feature Health', url: '/api/dev/features/exercises/health' },
    { name: 'Deck Feature Health', url: '/api/dev/features/decks/health' },
    { name: 'Authentication Feature Health', url: '/api/dev/features/authentication/health' },
    { name: 'Environment Diagnostics', url: '/api/dev/diagnostics/environment' },
    { name: 'Ping Test', url: '/api/dev/diagnostics/ping' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const startTime = Date.now();
      const response = await axios.get(`${BASE_URL}${endpoint.url}`, { timeout: 5000 });
      const responseTime = Date.now() - startTime;
      
      console.log(`✅ ${endpoint.name}: ${response.status} (${responseTime}ms)`);
      
      if (endpoint.name === 'Health Summary') {
        console.log(`   Overall Health: ${response.data.overallHealth}`);
        console.log(`   Storage Type: ${response.data.components.storage.type}`);
      }
      
    } catch (error) {
      const responseTime = error.response ? 'timeout' : 'error';
      console.log(`❌ ${endpoint.name}: ${error.response?.status || 'ERROR'} (${responseTime})`);
    }
  }
  
  console.log('\n📊 Running comprehensive health check using the monitor...');
  
  // Test the comprehensive health monitor
  try {
    const { runFullSystemCheck } = require('./system-health-monitor.js');
    const healthReport = await runFullSystemCheck();
    
    console.log(`\n🎯 Overall System Status: ${healthReport.overallStatus.toUpperCase()}`);
    console.log(`📈 Healthy Features: ${healthReport.healthyFeatures}/${healthReport.totalFeatures}`);
    console.log(`⚠️  Issues Found: ${healthReport.criticalIssues} critical, ${healthReport.degradedFeatures} degraded`);
    console.log(`⏱️  Total Check Duration: ${healthReport.systemInfo.checkDuration}ms`);
    
    if (healthReport.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      healthReport.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`);
      });
    }
    
  } catch (error) {
    console.log(`❌ Comprehensive health check failed: ${error.message}`);
  }
  
  console.log('\n✅ Health monitor test completed!');
}

// Run the test
testHealthEndpoints().catch(error => {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
});