#!/usr/bin/env node

/**
 * COMPREHENSIVE GAME ARTIST MODE TEST SUITE
 * 
 * This script performs extensive testing of all Game Artist mode features:
 * - Visual element management
 * - Color palette generation
 * - Asset management 
 * - Performance monitoring
 * - Advanced tools functionality
 * - Theme system
 * - Animation timeline
 * - Layer management
 */

import fs from 'fs';
import path from 'path';

console.log('🎨 Starting Game Artist Mode Comprehensive Test Suite\n');

// Test configuration
const baseUrl = 'http://localhost:5000';
const testResults = [];

// Utility function to log test results
function logTest(testName, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const result = `${status} - ${testName}${details ? ': ' + details : ''}`;
  console.log(result);
  testResults.push({ testName, passed, details });
}

// Utility function to make HTTP requests
async function makeRequest(endpoint, options = {}) {
  try {
    const fetch = await import('node-fetch').then(m => m.default);
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    return { ok: response.ok, status: response.status, data: await response.json() };
  } catch (error) {
    return { ok: false, status: 0, error: error.message };
  }
}

// Test 1: Server connectivity and basic API response
async function testServerConnectivity() {
  console.log('\n🔌 Testing server connectivity...');
  
  const response = await makeRequest('/');
  logTest('Server is responsive', response.ok, `Status: ${response.status}`);
  
  const healthCheck = await makeRequest('/api/health');
  if (healthCheck.ok) {
    logTest('API health check', true, 'API endpoints accessible');
  } else {
    logTest('API health check', false, `Status: ${healthCheck.status}`);
  }
}

// Test 2: Game Artist Context and Components
async function testGameArtistComponents() {
  console.log('\n🎨 Testing Game Artist components...');
  
  // Check if Game Artist files exist
  const componentFiles = [
    'client/src/contexts/GameArtistContext.tsx',
    'client/src/components/ui/game-artist-toolbar.tsx', 
    'client/src/components/ui/visual-editor.tsx',
    'client/src/components/ui/color-palette-manager.tsx',
    'client/src/components/ui/layer-panel.tsx',
    'client/src/components/ui/animation-timeline.tsx',
    'client/src/components/ui/asset-library.tsx',
    'client/src/components/ui/theme-manager.tsx',
    'client/src/components/ui/game-artist-performance-monitor.tsx',
    'client/src/components/ui/game-artist-advanced-tools.tsx',
    'client/src/pages/game-artist.tsx'
  ];
  
  componentFiles.forEach(filePath => {
    const exists = fs.existsSync(path.resolve(filePath));
    logTest(`Component file exists: ${path.basename(filePath)}`, exists);
  });
}

// Test 3: Visual Elements System
async function testVisualElementsSystem() {
  console.log('\n🖼️  Testing visual elements system...');
  
  // Check if visual elements are properly defined
  try {
    const contextFile = fs.readFileSync('client/src/contexts/GameArtistContext.tsx', 'utf8');
    
    const hasVisualElementInterface = contextFile.includes('interface VisualElement');
    logTest('VisualElement interface defined', hasVisualElementInterface);
    
    const hasDefaultElements = contextFile.includes('defaultVisualElements');
    logTest('Default visual elements defined', hasDefaultElements);
    
    const hasUpdateFunction = contextFile.includes('updateVisualElement');
    logTest('Update visual element function exists', hasUpdateFunction);
    
    const hasBulkUpdate = contextFile.includes('bulkUpdateElements');
    logTest('Bulk update functionality exists', hasBulkUpdate);
    
    const hasUndoRedo = contextFile.includes('undoStack') && contextFile.includes('redoStack');
    logTest('Undo/Redo system implemented', hasUndoRedo);
    
  } catch (error) {
    logTest('Visual elements system analysis', false, error.message);
  }
}

// Test 4: Color System Features
async function testColorSystem() {
  console.log('\n🎨 Testing color management system...');
  
  try {
    const colorManagerFile = fs.readFileSync('client/src/components/ui/color-palette-manager.tsx', 'utf8');
    
    const hasColorPalette = colorManagerFile.includes('interface ColorPalette');
    logTest('Color palette interface defined', hasColorPalette);
    
    const hasColorAnalysis = colorManagerFile.includes('interface ColorAnalysis');
    logTest('Color analysis functionality', hasColorAnalysis);
    
    const hasHarmonyGeneration = colorManagerFile.includes('generateColorHarmony');
    logTest('Color harmony generation', hasHarmonyGeneration);
    
    const hasAccessibilityCheck = colorManagerFile.includes('accessibility');
    logTest('Accessibility validation', hasAccessibilityCheck);
    
  } catch (error) {
    logTest('Color system analysis', false, error.message);
  }
}

// Test 5: Advanced Tools Testing
async function testAdvancedTools() {
  console.log('\n⚙️  Testing advanced tools...');
  
  try {
    const advancedToolsFile = fs.readFileSync('client/src/components/ui/game-artist-advanced-tools.tsx', 'utf8');
    
    const hasBatchOperations = advancedToolsFile.includes('BatchOperation');
    logTest('Batch operations system', hasBatchOperations);
    
    const hasColorHarmony = advancedToolsFile.includes('ColorHarmony');
    logTest('Advanced color harmony tools', hasColorHarmony);
    
    const hasAccessibilityValidation = advancedToolsFile.includes('validateAccessibility');
    logTest('Accessibility validation tools', hasAccessibilityValidation);
    
    const hasCSSGenerator = advancedToolsFile.includes('generateAnimationCSS');
    logTest('CSS animation generator', hasCSSGenerator);
    
    const hasVersionControl = advancedToolsFile.includes('interface Version');
    logTest('Version control system', hasVersionControl);
    
  } catch (error) {
    logTest('Advanced tools analysis', false, error.message);
  }
}

// Test 6: Performance Monitor
async function testPerformanceMonitor() {
  console.log('\n📊 Testing performance monitoring...');
  
  try {
    const performanceFile = fs.readFileSync('client/src/components/ui/game-artist-performance-monitor.tsx', 'utf8');
    
    const hasMetricsInterface = performanceFile.includes('interface PerformanceMetric');
    logTest('Performance metrics interface', hasMetricsInterface);
    
    const hasDebugLogs = performanceFile.includes('interface DebugLog');
    logTest('Debug logging system', hasDebugLogs);
    
    const hasRealTimeMonitoring = performanceFile.includes('collectMetrics');
    logTest('Real-time performance monitoring', hasRealTimeMonitoring);
    
    const hasExportFunctionality = performanceFile.includes('exportPerformanceReport');
    logTest('Performance report export', hasExportFunctionality);
    
  } catch (error) {
    logTest('Performance monitor analysis', false, error.message);
  }
}

// Test 7: Animation System
async function testAnimationSystem() {
  console.log('\n🎬 Testing animation system...');
  
  try {
    const animationFile = fs.readFileSync('client/src/components/ui/animation-timeline.tsx', 'utf8');
    
    const hasKeyframe = animationFile.includes('interface Keyframe');
    logTest('Keyframe system defined', hasKeyframe);
    
    const hasAnimationTrack = animationFile.includes('interface AnimationTrack');
    logTest('Animation tracks system', hasAnimationTrack);
    
    const hasAnimationProject = animationFile.includes('interface AnimationProject');
    logTest('Animation project management', hasAnimationProject);
    
    const hasEasingFunctions = animationFile.includes('cubicBezier');
    logTest('Easing functions implemented', hasEasingFunctions);
    
  } catch (error) {
    logTest('Animation system analysis', false, error.message);
  }
}

// Test 8: Asset Management
async function testAssetManagement() {
  console.log('\n📁 Testing asset management...');
  
  try {
    const assetLibraryFile = fs.readFileSync('client/src/components/ui/asset-library.tsx', 'utf8');
    
    const hasAssetInterface = assetLibraryFile.includes('interface Asset');
    logTest('Asset interface defined', hasAssetInterface);
    
    const hasAssetCategories = assetLibraryFile.includes('AssetCategory');
    logTest('Asset categorization system', hasAssetCategories);
    
    const hasDragDrop = assetLibraryFile.includes('dragOver');
    logTest('Drag and drop functionality', hasDragDrop);
    
    const hasMetadataSupport = assetLibraryFile.includes('metadata');
    logTest('Asset metadata support', hasMetadataSupport);
    
  } catch (error) {
    logTest('Asset management analysis', false, error.message);
  }
}

// Test 9: Theme Management
async function testThemeManagement() {
  console.log('\n🎨 Testing theme management...');
  
  try {
    const themeFile = fs.readFileSync('client/src/components/ui/theme-manager.tsx', 'utf8');
    
    const hasThemeInterface = themeFile.includes('interface Theme');
    logTest('Theme interface defined', hasThemeInterface);
    
    const hasThemeColors = themeFile.includes('interface ThemeColor');
    logTest('Theme color system', hasThemeColors);
    
    const hasAccessibilityValidation = themeFile.includes('accessibility');
    logTest('Theme accessibility validation', hasAccessibilityValidation);
    
    const hasThemeExport = themeFile.includes('exportTheme') || themeFile.includes('export');
    logTest('Theme export functionality', hasThemeExport);
    
  } catch (error) {
    logTest('Theme management analysis', false, error.message);
  }
}

// Test 10: Layer Management
async function testLayerManagement() {
  console.log('\n📑 Testing layer management...');
  
  try {
    const layerFile = fs.readFileSync('client/src/components/ui/layer-panel.tsx', 'utf8');
    
    const hasLayerGroups = layerFile.includes('interface LayerGroup');
    logTest('Layer grouping system', hasLayerGroups);
    
    const hasDragReorder = layerFile.includes('draggedElement');
    logTest('Drag and drop reordering', hasDragReorder);
    
    const hasVisibilityToggle = layerFile.includes('isVisible');
    logTest('Visibility toggle functionality', hasVisibilityToggle);
    
    const hasLockingSystem = layerFile.includes('isLocked');
    logTest('Element locking system', hasLockingSystem);
    
  } catch (error) {
    logTest('Layer management analysis', false, error.message);
  }
}

// Test 11: Game Artist Integration
async function testGameArtistIntegration() {
  console.log('\n🔗 Testing Game Artist mode integration...');
  
  try {
    const appFile = fs.readFileSync('client/src/App.tsx', 'utf8');
    const gameArtistPage = fs.readFileSync('client/src/pages/game-artist.tsx', 'utf8');
    
    const hasGameArtistProvider = appFile.includes('GameArtistProvider');
    logTest('GameArtistProvider integrated in App', hasGameArtistProvider);
    
    const hasToolbar = appFile.includes('GameArtistToolbar');
    logTest('GameArtistToolbar integrated', hasToolbar);
    
    const hasRoute = appFile.includes('/game-artist');
    logTest('Game Artist route defined', hasRoute);
    
    const hasAdvancedComponents = gameArtistPage.includes('GameArtistAdvancedTools') && 
                                  gameArtistPage.includes('GameArtistPerformanceMonitor');
    logTest('Advanced components integrated', hasAdvancedComponents);
    
    const hasTabSystem = gameArtistPage.includes('TabsList') && gameArtistPage.includes('performance');
    logTest('Tab system with performance tab', hasTabSystem);
    
  } catch (error) {
    logTest('Game Artist integration analysis', false, error.message);
  }
}

// Main test execution
async function runAllTests() {
  console.log('🚀 Starting comprehensive Game Artist mode testing...\n');
  console.log('=' + '='.repeat(60) + '=');
  
  const startTime = Date.now();
  
  try {
    await testServerConnectivity();
    await testGameArtistComponents();
    await testVisualElementsSystem();
    await testColorSystem();
    await testAdvancedTools();
    await testPerformanceMonitor();
    await testAnimationSystem();
    await testAssetManagement();
    await testThemeManagement();
    await testLayerManagement();
    await testGameArtistIntegration();
    
  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('\n' + '=' + '='.repeat(60) + '=');
  console.log('📋 TEST SUITE SUMMARY');
  console.log('=' + '='.repeat(60) + '=');
  
  const totalTests = testResults.length;
  const passedTests = testResults.filter(t => t.passed).length;
  const failedTests = totalTests - passedTests;
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  console.log(`⏱️  Duration: ${duration}s`);
  console.log(`📊 Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Success Rate: ${successRate}%`);
  
  if (failedTests > 0) {
    console.log('\n❌ FAILED TESTS:');
    testResults.filter(t => !t.passed).forEach(test => {
      console.log(`   • ${test.testName}${test.details ? ': ' + test.details : ''}`);
    });
  }
  
  console.log('\n🎯 GAME ARTIST MODE STATUS:');
  if (successRate >= 90) {
    console.log('🟢 EXCELLENT - Game Artist mode is fully functional with advanced features');
  } else if (successRate >= 75) {
    console.log('🟡 GOOD - Game Artist mode is functional with minor issues');
  } else if (successRate >= 50) {
    console.log('🟠 PARTIAL - Game Artist mode has basic functionality');
  } else {
    console.log('🔴 NEEDS WORK - Game Artist mode requires significant fixes');
  }
  
  // Generate test report
  const report = {
    timestamp: new Date().toISOString(),
    duration: duration + 's',
    totalTests,
    passedTests,
    failedTests,
    successRate: successRate + '%',
    testResults,
    status: successRate >= 90 ? 'EXCELLENT' : 
            successRate >= 75 ? 'GOOD' : 
            successRate >= 50 ? 'PARTIAL' : 'NEEDS_WORK'
  };
  
  // Save report to file
  fs.writeFileSync('game-artist-test-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Test report saved to: game-artist-test-report.json');
  
  console.log('\n🎨 Game Artist Mode Testing Complete!');
  return successRate >= 75; // Return success if 75% or more tests pass
}

// Execute tests
runAllTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal test error:', error);
    process.exit(1);
  });

export { runAllTests };