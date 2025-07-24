#!/usr/bin/env node

/**
 * OTTERSPORT SYSTEM HEALTH MONITOR & AUTO-REPAIR TOOL
 * 
 * This comprehensive tool systematically checks every feature of the OtterSport app,
 * reports the state of each component, and automatically repairs database errors.
 * 
 * Usage:
 * - Node.js: node system-health-monitor.js
 * - Direct execution: ./system-health-monitor.js
 * - Programmatic: const healthCheck = require('./system-health-monitor.js'); healthCheck.runFullCheck();
 * 
 * Features:
 * - Complete application feature inventory and status
 * - Automatic database error detection and repair
 * - API endpoint validation with performance metrics
 * - Frontend component health checks
 * - Authentication system validation
 * - Real-time monitoring capabilities
 * - Machine-readable output for AI/automation
 * - Human-friendly reporting
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  baseUrl: 'http://localhost:5000',
  timeout: 10000,
  retryAttempts: 3,
  healthCheckInterval: 30000, // 30 seconds for continuous monitoring
  logFile: './health-check-log.json',
  reportFile: './system-health-report.json'
};

// Feature inventory with detailed checks
const FEATURE_INVENTORY = {
  'Core Authentication': {
    endpoints: ['/api/auth/user', '/api/auth/login', '/api/auth/logout'],
    critical: true,
    description: 'User authentication and session management'
  },
  'User Management': {
    endpoints: ['/api/user/stats', '/api/user/profile'],
    critical: true,
    description: 'User profiles, progress tracking, and statistics'
  },
  'Exercise Library': {
    endpoints: ['/api/exercises', '/api/exercises/category/cardio'],
    critical: true,
    description: 'Complete exercise database with categories and metadata'
  },
  'Deck System': {
    endpoints: ['/api/decks', '/api/decks/1/exercises'],
    critical: true,
    description: 'Card-based workout deck management and selection'
  },
  'Workout Engine': {
    endpoints: ['/api/workouts', '/api/workouts/create'],
    critical: true,
    description: 'Workout session creation and completion tracking'
  },
  'Achievement System': {
    endpoints: ['/api/achievements', '/api/achievements/user'],
    critical: false,
    description: 'Gamification with user achievement tracking'
  },
  'Card Battle Mode': {
    endpoints: ['/api/card-battle/start', '/api/card-battle/state'],
    critical: false,
    description: 'Competitive card-based gameplay against AI'
  },
  'Analytics Dashboard': {
    endpoints: ['/api/analytics/overview', '/api/analytics/performance'],
    critical: false,
    description: 'Performance metrics and progress analytics'
  },
  'Database Health': {
    endpoints: ['/api/dev/database/health', '/api/dev/database/status'],
    critical: true,
    description: 'Database connectivity and integrity checks'
  },
  'Migration Tools': {
    endpoints: ['/api/migration/health', '/api/migration/status'],
    critical: false,
    description: 'Cross-platform migration and deployment tools'
  }
};

// Database repair scripts
const DATABASE_REPAIRS = {
  connectionIssues: async () => {
    console.log('🔧 Attempting database connection repair...');
    try {
      const response = await makeRequest('/api/dev/database/reconnect', 'POST');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
  
  schemaValidation: async () => {
    console.log('🔧 Validating and repairing database schema...');
    try {
      const response = await makeRequest('/api/dev/database/validate-schema', 'POST');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
  
  seedDataMissing: async () => {
    console.log('🔧 Reseeding essential database data...');
    try {
      const response = await makeRequest('/api/dev/database/reseed', 'POST');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
  
  indexOptimization: async () => {
    console.log('🔧 Optimizing database indexes...');
    try {
      const response = await makeRequest('/api/dev/database/optimize-indexes', 'POST');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
};

// Utility functions
async function makeRequest(endpoint, method = 'GET', data = null, timeout = CONFIG.timeout) {
  const url = `${CONFIG.baseUrl}${endpoint}`;
  const config = {
    method,
    url,
    timeout,
    validateStatus: () => true // Don't throw on any status code
  };
  
  if (data && (method === 'POST' || method === 'PUT')) {
    config.data = data;
    config.headers = { 'Content-Type': 'application/json' };
  }
  
  try {
    const response = await axios(config);
    return {
      status: response.status,
      data: response.data,
      responseTime: response.headers['x-response-time'] || 'unknown',
      success: response.status >= 200 && response.status < 300
    };
  } catch (error) {
    return {
      status: 0,
      data: null,
      responseTime: 'timeout',
      success: false,
      error: error.message
    };
  }
}

async function retryRequest(endpoint, method = 'GET', data = null) {
  for (let attempt = 1; attempt <= CONFIG.retryAttempts; attempt++) {
    const result = await makeRequest(endpoint, method, data);
    if (result.success) {
      return result;
    }
    
    if (attempt < CONFIG.retryAttempts) {
      console.log(`⚠️  Retry ${attempt}/${CONFIG.retryAttempts} for ${endpoint}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  return await makeRequest(endpoint, method, data); // Final attempt
}

// Main health check functions
async function checkFeature(featureName, featureConfig) {
  console.log(`🔍 Checking: ${featureName}`);
  
  const results = {
    name: featureName,
    description: featureConfig.description,
    critical: featureConfig.critical,
    status: 'unknown',
    endpoints: [],
    overallHealth: 'unknown',
    issues: [],
    metrics: {
      totalEndpoints: featureConfig.endpoints.length,
      successfulEndpoints: 0,
      failedEndpoints: 0,
      averageResponseTime: 0
    }
  };
  
  let totalResponseTime = 0;
  let validResponseTimes = 0;
  
  for (const endpoint of featureConfig.endpoints) {
    const response = await retryRequest(endpoint);
    
    const endpointResult = {
      endpoint,
      status: response.status,
      success: response.success,
      responseTime: response.responseTime,
      error: response.error || null
    };
    
    results.endpoints.push(endpointResult);
    
    if (response.success) {
      results.metrics.successfulEndpoints++;
      if (response.responseTime !== 'unknown' && response.responseTime !== 'timeout') {
        const timeMs = parseInt(response.responseTime) || 0;
        totalResponseTime += timeMs;
        validResponseTimes++;
      }
    } else {
      results.metrics.failedEndpoints++;
      results.issues.push(`${endpoint}: ${response.error || `HTTP ${response.status}`}`);
    }
  }
  
  // Calculate metrics
  if (validResponseTimes > 0) {
    results.metrics.averageResponseTime = Math.round(totalResponseTime / validResponseTimes);
  }
  
  const successRate = (results.metrics.successfulEndpoints / results.metrics.totalEndpoints) * 100;
  
  // Determine overall health
  if (successRate === 100) {
    results.status = 'healthy';
    results.overallHealth = 'excellent';
  } else if (successRate >= 80) {
    results.status = 'warning';
    results.overallHealth = 'good';
  } else if (successRate >= 50) {
    results.status = 'degraded';
    results.overallHealth = 'poor';
  } else {
    results.status = 'critical';
    results.overallHealth = 'failing';
  }
  
  return results;
}

async function checkDatabaseHealth() {
  console.log('🔍 Performing comprehensive database health check...');
  
  const dbHealth = {
    name: 'Database Infrastructure',
    connectionStatus: 'unknown',
    schemaIntegrity: 'unknown',
    dataConsistency: 'unknown',
    performanceMetrics: {},
    repairsAttempted: [],
    issues: []
  };
  
  // Check database connection
  try {
    const connectionCheck = await retryRequest('/api/dev/database/health');
    if (connectionCheck.success) {
      dbHealth.connectionStatus = 'connected';
      dbHealth.performanceMetrics.connectionTime = connectionCheck.responseTime;
    } else {
      dbHealth.connectionStatus = 'failed';
      dbHealth.issues.push('Database connection failed');
      
      // Attempt repair
      const repaired = await DATABASE_REPAIRS.connectionIssues();
      dbHealth.repairsAttempted.push({
        type: 'connection',
        successful: repaired,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    dbHealth.connectionStatus = 'error';
    dbHealth.issues.push(`Connection error: ${error.message}`);
  }
  
  // Check schema integrity
  try {
    const schemaCheck = await retryRequest('/api/dev/database/schema-check');
    if (schemaCheck.success) {
      dbHealth.schemaIntegrity = 'valid';
    } else {
      dbHealth.schemaIntegrity = 'invalid';
      dbHealth.issues.push('Schema validation failed');
      
      // Attempt repair
      const repaired = await DATABASE_REPAIRS.schemaValidation();
      dbHealth.repairsAttempted.push({
        type: 'schema',
        successful: repaired,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    dbHealth.schemaIntegrity = 'error';
    dbHealth.issues.push(`Schema check error: ${error.message}`);
  }
  
  // Check data consistency
  try {
    const dataCheck = await retryRequest('/api/dev/database/data-check');
    if (dataCheck.success && dataCheck.data) {
      const data = dataCheck.data;
      if (data.exercises > 0 && data.decks > 0) {
        dbHealth.dataConsistency = 'valid';
        dbHealth.performanceMetrics.dataHealth = data;
      } else {
        dbHealth.dataConsistency = 'missing';
        dbHealth.issues.push('Essential data missing from database');
        
        // Attempt repair
        const repaired = await DATABASE_REPAIRS.seedDataMissing();
        dbHealth.repairsAttempted.push({
          type: 'seed-data',
          successful: repaired,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      dbHealth.dataConsistency = 'unknown';
      dbHealth.issues.push('Unable to verify data consistency');
    }
  } catch (error) {
    dbHealth.dataConsistency = 'error';
    dbHealth.issues.push(`Data check error: ${error.message}`);
  }
  
  return dbHealth;
}

async function checkFrontendHealth() {
  console.log('🔍 Checking frontend application health...');
  
  const frontendHealth = {
    name: 'Frontend Application',
    loadStatus: 'unknown',
    viteConnection: 'unknown',
    componentLoad: 'unknown',
    jsErrors: [],
    performance: {}
  };
  
  try {
    // Check main page load
    const mainPageResponse = await retryRequest('/');
    if (mainPageResponse.success) {
      frontendHealth.loadStatus = 'loaded';
      frontendHealth.performance.pageLoadTime = mainPageResponse.responseTime;
    } else {
      frontendHealth.loadStatus = 'failed';
    }
    
    // Check Vite dev server
    const viteResponse = await retryRequest('/@vite/client');
    if (viteResponse.success) {
      frontendHealth.viteConnection = 'connected';
    } else {
      frontendHealth.viteConnection = 'disconnected';
    }
    
  } catch (error) {
    frontendHealth.loadStatus = 'error';
    frontendHealth.jsErrors.push(error.message);
  }
  
  return frontendHealth;
}

async function runFullSystemCheck() {
  const startTime = Date.now();
  console.log('🚀 Starting comprehensive OtterSport system health check...');
  console.log('=' .repeat(60));
  
  const healthReport = {
    timestamp: new Date().toISOString(),
    systemInfo: {
      nodeVersion: process.version,
      platform: process.platform,
      checkDuration: 0
    },
    overallStatus: 'unknown',
    criticalIssues: 0,
    totalFeatures: Object.keys(FEATURE_INVENTORY).length,
    healthyFeatures: 0,
    degradedFeatures: 0,
    failingFeatures: 0,
    features: {},
    database: {},
    frontend: {},
    recommendations: [],
    autoRepairs: []
  };
  
  // Check all features
  for (const [featureName, featureConfig] of Object.entries(FEATURE_INVENTORY)) {
    const featureHealth = await checkFeature(featureName, featureConfig);
    healthReport.features[featureName] = featureHealth;
    
    // Update counters
    if (featureHealth.status === 'healthy') {
      healthReport.healthyFeatures++;
    } else if (featureHealth.status === 'warning' || featureHealth.status === 'degraded') {
      healthReport.degradedFeatures++;
    } else {
      healthReport.failingFeatures++;
      if (featureHealth.critical) {
        healthReport.criticalIssues++;
      }
    }
  }
  
  // Check database health
  healthReport.database = await checkDatabaseHealth();
  if (healthReport.database.repairsAttempted.length > 0) {
    healthReport.autoRepairs = healthReport.autoRepairs.concat(healthReport.database.repairsAttempted);
  }
  
  // Check frontend health
  healthReport.frontend = await checkFrontendHealth();
  
  // Determine overall system status
  if (healthReport.criticalIssues === 0 && healthReport.failingFeatures === 0) {
    healthReport.overallStatus = 'healthy';
  } else if (healthReport.criticalIssues === 0 && healthReport.failingFeatures <= 2) {
    healthReport.overallStatus = 'warning';
  } else if (healthReport.criticalIssues <= 2) {
    healthReport.overallStatus = 'degraded';
  } else {
    healthReport.overallStatus = 'critical';
  }
  
  // Generate recommendations
  if (healthReport.database.issues.length > 0) {
    healthReport.recommendations.push('Database requires attention - consider running database optimization');
  }
  
  if (healthReport.degradedFeatures > 3) {
    healthReport.recommendations.push('Multiple features showing degraded performance - investigate system resources');
  }
  
  if (healthReport.criticalIssues > 0) {
    healthReport.recommendations.push('Critical issues detected - immediate attention required');
  }
  
  // Calculate duration
  healthReport.systemInfo.checkDuration = Date.now() - startTime;
  
  return healthReport;
}

// Reporting functions
function printHumanReport(healthReport) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 OTTERSPORT SYSTEM HEALTH REPORT');
  console.log('='.repeat(60));
  console.log(`🕒 Generated: ${healthReport.timestamp}`);
  console.log(`⏱️  Check Duration: ${healthReport.systemInfo.checkDuration}ms`);
  console.log(`🎯 Overall Status: ${getStatusEmoji(healthReport.overallStatus)} ${healthReport.overallStatus.toUpperCase()}`);
  console.log();
  
  // Feature summary
  console.log('📋 FEATURE SUMMARY:');
  console.log(`   ✅ Healthy Features: ${healthReport.healthyFeatures}/${healthReport.totalFeatures}`);
  console.log(`   ⚠️  Degraded Features: ${healthReport.degradedFeatures}/${healthReport.totalFeatures}`);
  console.log(`   ❌ Failing Features: ${healthReport.failingFeatures}/${healthReport.totalFeatures}`);
  console.log(`   🚨 Critical Issues: ${healthReport.criticalIssues}`);
  console.log();
  
  // Feature details
  console.log('🔍 DETAILED FEATURE STATUS:');
  for (const [featureName, feature] of Object.entries(healthReport.features)) {
    const emoji = getStatusEmoji(feature.status);
    const criticalMarker = feature.critical ? ' [CRITICAL]' : '';
    console.log(`   ${emoji} ${featureName}${criticalMarker}: ${feature.overallHealth}`);
    
    if (feature.issues.length > 0) {
      feature.issues.forEach(issue => {
        console.log(`      ⚠️  ${issue}`);
      });
    }
    
    if (feature.metrics.averageResponseTime > 0) {
      console.log(`      ⏱️  Avg Response: ${feature.metrics.averageResponseTime}ms`);
    }
  }
  console.log();
  
  // Database health
  console.log('🗄️  DATABASE HEALTH:');
  console.log(`   Connection: ${getStatusEmoji(healthReport.database.connectionStatus)} ${healthReport.database.connectionStatus}`);
  console.log(`   Schema: ${getStatusEmoji(healthReport.database.schemaIntegrity)} ${healthReport.database.schemaIntegrity}`);
  console.log(`   Data: ${getStatusEmoji(healthReport.database.dataConsistency)} ${healthReport.database.dataConsistency}`);
  
  if (healthReport.database.issues.length > 0) {
    console.log('   Issues:');
    healthReport.database.issues.forEach(issue => {
      console.log(`      ⚠️  ${issue}`);
    });
  }
  
  if (healthReport.autoRepairs.length > 0) {
    console.log('   Auto-repairs attempted:');
    healthReport.autoRepairs.forEach(repair => {
      const success = repair.successful ? '✅' : '❌';
      console.log(`      ${success} ${repair.type} repair - ${repair.timestamp}`);
    });
  }
  console.log();
  
  // Frontend health
  console.log('🌐 FRONTEND HEALTH:');
  console.log(`   Page Load: ${getStatusEmoji(healthReport.frontend.loadStatus)} ${healthReport.frontend.loadStatus}`);
  console.log(`   Vite Server: ${getStatusEmoji(healthReport.frontend.viteConnection)} ${healthReport.frontend.viteConnection}`);
  
  if (healthReport.frontend.jsErrors.length > 0) {
    console.log('   JavaScript Errors:');
    healthReport.frontend.jsErrors.forEach(error => {
      console.log(`      ❌ ${error}`);
    });
  }
  console.log();
  
  // Recommendations
  if (healthReport.recommendations.length > 0) {
    console.log('💡 RECOMMENDATIONS:');
    healthReport.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
    console.log();
  }
  
  console.log('='.repeat(60));
}

function getStatusEmoji(status) {
  const statusMap = {
    'healthy': '✅',
    'connected': '✅',
    'loaded': '✅',
    'valid': '✅',
    'excellent': '✅',
    'warning': '⚠️',
    'degraded': '⚠️',
    'good': '⚠️',
    'poor': '⚠️',
    'critical': '❌',
    'failed': '❌',
    'failing': '❌',
    'error': '❌',
    'disconnected': '❌',
    'invalid': '❌',
    'missing': '❌',
    'unknown': '❓'
  };
  
  return statusMap[status] || '❓';
}

async function saveReports(healthReport) {
  try {
    // Save JSON report for machine consumption
    await fs.writeFile(CONFIG.reportFile, JSON.stringify(healthReport, null, 2));
    console.log(`📄 Detailed report saved to: ${CONFIG.reportFile}`);
    
    // Save log entry
    const logEntry = {
      timestamp: healthReport.timestamp,
      overallStatus: healthReport.overallStatus,
      criticalIssues: healthReport.criticalIssues,
      healthyFeatures: healthReport.healthyFeatures,
      totalFeatures: healthReport.totalFeatures,
      checkDuration: healthReport.systemInfo.checkDuration
    };
    
    let logHistory = [];
    try {
      const existingLog = await fs.readFile(CONFIG.logFile, 'utf8');
      logHistory = JSON.parse(existingLog);
    } catch (error) {
      // File doesn't exist yet, start fresh
    }
    
    logHistory.push(logEntry);
    
    // Keep only last 100 entries
    if (logHistory.length > 100) {
      logHistory = logHistory.slice(-100);
    }
    
    await fs.writeFile(CONFIG.logFile, JSON.stringify(logHistory, null, 2));
    console.log(`📜 Log updated: ${CONFIG.logFile}`);
    
  } catch (error) {
    console.error('❌ Failed to save reports:', error.message);
  }
}

// Continuous monitoring mode
async function startContinuousMonitoring() {
  console.log('🔄 Starting continuous monitoring mode...');
  console.log(`📊 Checks will run every ${CONFIG.healthCheckInterval / 1000} seconds`);
  console.log('📊 Press Ctrl+C to stop monitoring\n');
  
  while (true) {
    try {
      const healthReport = await runFullSystemCheck();
      printHumanReport(healthReport);
      await saveReports(healthReport);
      
      // Alert on critical issues
      if (healthReport.overallStatus === 'critical') {
        console.log('🚨 CRITICAL SYSTEM ALERT: Immediate attention required!');
      }
      
      console.log(`⏰ Next check in ${CONFIG.healthCheckInterval / 1000} seconds...\n`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.healthCheckInterval));
      
    } catch (error) {
      console.error('❌ Monitoring error:', error.message);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retry
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'check';
  
  switch (command) {
    case 'check':
    case 'health':
      const healthReport = await runFullSystemCheck();
      printHumanReport(healthReport);
      await saveReports(healthReport);
      
      // Exit with appropriate code
      if (healthReport.overallStatus === 'critical') {
        process.exit(2);
      } else if (healthReport.overallStatus === 'degraded' || healthReport.overallStatus === 'warning') {
        process.exit(1);
      } else {
        process.exit(0);
      }
      break;
      
    case 'monitor':
    case 'continuous':
      await startContinuousMonitoring();
      break;
      
    case 'repair':
      console.log('🔧 Running automatic database repairs...');
      const repairResults = [];
      
      for (const [repairName, repairFunction] of Object.entries(DATABASE_REPAIRS)) {
        console.log(`🔧 Attempting ${repairName}...`);
        const success = await repairFunction();
        repairResults.push({ repair: repairName, successful: success });
        console.log(`${success ? '✅' : '❌'} ${repairName}: ${success ? 'SUCCESS' : 'FAILED'}`);
      }
      
      console.log('\n🔧 Repair Summary:');
      repairResults.forEach(result => {
        console.log(`   ${result.successful ? '✅' : '❌'} ${result.repair}`);
      });
      break;
      
    case 'json':
      const jsonReport = await runFullSystemCheck();
      console.log(JSON.stringify(jsonReport, null, 2));
      break;
      
    default:
      console.log('OtterSport System Health Monitor');
      console.log('Usage:');
      console.log('  node system-health-monitor.js [command]');
      console.log('');
      console.log('Commands:');
      console.log('  check      - Run single health check (default)');
      console.log('  monitor    - Start continuous monitoring');
      console.log('  repair     - Run automatic database repairs');
      console.log('  json       - Output JSON report only');
      console.log('');
      console.log('Example:');
      console.log('  node system-health-monitor.js check');
      console.log('  node system-health-monitor.js monitor');
      break;
  }
}

// Export for programmatic use
module.exports = {
  runFullSystemCheck,
  checkDatabaseHealth,
  checkFrontendHealth,
  DATABASE_REPAIRS,
  printHumanReport,
  startContinuousMonitoring,
  CONFIG
};

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ System health check failed:', error.message);
    process.exit(3);
  });
}