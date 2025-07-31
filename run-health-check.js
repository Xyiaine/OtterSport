#!/usr/bin/env node

/**
 * STANDALONE TOTAL HEALTH SYSTEM RUNNER
 * 
 * This script runs the Total Health System independently without 
 * requiring the full server to start. This allows us to perform
 * comprehensive testing, repair, and optimization even when
 * there are frontend compilation issues.
 */

console.log("🏥 Starting Total Health System...");

import { TotalHealthSystem } from './server/total-health-system.js';
import { storage } from './server/db.js';

async function runComprehensiveHealthCheck() {
  try {
    console.log("🔍 Initializing Total Health System...");
    const healthSystem = new TotalHealthSystem();
    
    console.log("📊 Running comprehensive optimization...");
    const report = await healthSystem.runComprehensiveOptimization();
    
    console.log("\n" + "=".repeat(60));
    console.log("📋 TOTAL HEALTH SYSTEM REPORT");
    console.log("=".repeat(60));
    console.log(`🎯 Overall Status: ${report.overall.toUpperCase()}`);
    console.log(`📊 Health Score: ${report.score}/100`);
    console.log(`⏱️  Timestamp: ${report.timestamp}`);
    console.log("");
    
    console.log("🖥️  Frontend Tests:");
    report.frontend.forEach(test => {
      const icon = test.status === 'passed' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
      console.log(`  ${icon} ${test.testName} (${test.duration}ms)`);
    });
    
    console.log("\n🔧 Backend Tests:");
    report.backend.forEach(test => {
      const icon = test.status === 'passed' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
      console.log(`  ${icon} ${test.testName} (${test.duration}ms)`);
    });
    
    console.log("\n🔗 Integration Tests:");
    report.integration.forEach(test => {
      const icon = test.status === 'passed' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
      console.log(`  ${icon} ${test.testName} (${test.duration}ms)`);
    });
    
    console.log("\n⚡ Performance Tests:");
    report.performance.forEach(test => {
      const icon = test.status === 'passed' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
      console.log(`  ${icon} ${test.testName} (${test.duration}ms)`);
      if (test.details?.performanceMetric) {
        console.log(`    📈 Metric: ${test.details.performanceMetric}ms`);
      }
    });
    
    console.log("\n📈 Code Quality:");
    console.log(`  🔍 Duplicate Code: ${report.codeQuality.duplicateCode}%`);
    console.log(`  ⚠️  Type Errors: ${report.codeQuality.typeErrors}`);
    console.log(`  🧹 Unused Code: ${report.codeQuality.unusedCode}%`);
    console.log(`  ⚡ Optimization: ${report.codeQuality.optimization}%`);
    
    console.log("\n" + "=".repeat(60));
    console.log("📄 Executive Summary:");
    console.log(report.executiveSummary);
    console.log("=".repeat(60));
    
    // Test core functionality
    console.log("\n🧪 Testing Core Functionality:");
    
    try {
      const exercises = await storage.getExercises();
      console.log(`✅ Exercises loaded: ${exercises.length} items`);
      
      const decks = await storage.getDecks();
      console.log(`✅ Decks loaded: ${decks.length} items`);
      
      const achievements = await storage.getAchievements();
      console.log(`✅ Achievements loaded: ${achievements.length} items`);
      
      console.log("✅ All core systems operational");
      
    } catch (error) {
      console.log(`❌ Core system error: ${error.message}`);
    }
    
    console.log(`\n🎉 Total Health System completed successfully!`);
    console.log(`📊 Final Score: ${report.score}/100 (${report.overall.toUpperCase()})`);
    
    return report;
    
  } catch (error) {
    console.error("❌ Total Health System failed:", error);
    throw error;
  }
}

// Run the health check
runComprehensiveHealthCheck()
  .then(report => {
    console.log("\n✅ Health check completed successfully");
    process.exit(0);
  })
  .catch(error => {
    console.error("\n❌ Health check failed:", error);
    process.exit(1);
  });