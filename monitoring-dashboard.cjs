#!/usr/bin/env node

/**
 * REAL-TIME MONITORING DASHBOARD
 * 
 * Interactive dashboard for continuous monitoring of OtterSport health
 * Features:
 * - Real-time metrics display
 * - Live performance graphs
 * - Alert notifications
 * - Historical trend analysis
 * - Interactive controls
 */

const { AdvancedSystemAnalyzer } = require('./advanced-health-monitor.cjs');

class MonitoringDashboard {
  constructor() {
    this.analyzer = new AdvancedSystemAnalyzer();
    this.isRunning = false;
    this.metrics = [];
    this.alerts = [];
  }
  
  async start() {
    console.clear();
    console.log('🖥️  OTTERSPORT REAL-TIME MONITORING DASHBOARD');
    console.log('='.repeat(60));
    
    this.isRunning = true;
    
    // Initial analysis
    await this.updateMetrics();
    
    // Start monitoring loop
    const interval = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(interval);
        return;
      }
      
      await this.updateMetrics();
      this.displayDashboard();
    }, 10000); // Update every 10 seconds
    
    // Display initial dashboard
    this.displayDashboard();
    
    // Handle user input
    this.setupUserInput();
  }
  
  async updateMetrics() {
    try {
      const performance = await this.analyzer.performanceMonitor.collectMetrics();
      const timestamp = Date.now();
      
      this.metrics.push({
        timestamp,
        ...performance
      });
      
      // Keep only last 50 metrics for trending
      if (this.metrics.length > 50) {
        this.metrics.shift();
      }
      
      // Check for alerts
      this.checkForAlerts(performance);
      
    } catch (error) {
      console.error('❌ Failed to update metrics:', error.message);
    }
  }
  
  checkForAlerts(metrics) {
    const alerts = [];
    
    if (metrics.responseTime > 1000) {
      alerts.push({
        type: 'performance',
        message: `High response time: ${metrics.responseTime}ms`,
        severity: 'warning',
        timestamp: new Date().toISOString()
      });
    }
    
    if (metrics.status === 'error') {
      alerts.push({
        type: 'system',
        message: `System error: ${metrics.error}`,
        severity: 'critical',
        timestamp: new Date().toISOString()
      });
    }
    
    // Add new alerts
    alerts.forEach(alert => {
      this.alerts.unshift(alert);
    });
    
    // Keep only last 10 alerts
    if (this.alerts.length > 10) {
      this.alerts = this.alerts.slice(0, 10);
    }
  }
  
  displayDashboard() {
    // Clear screen and move cursor to top
    process.stdout.write('\x1b[2J\x1b[H');
    
    const now = new Date().toLocaleTimeString();
    const latest = this.metrics[this.metrics.length - 1];
    
    console.log('🖥️  OTTERSPORT MONITORING DASHBOARD');
    console.log('='.repeat(60));
    console.log(`📅 Last Updated: ${now}                        🔄 Auto-refresh: ON`);
    console.log('');
    
    // System Status
    this.displaySystemStatus(latest);
    
    // Performance Metrics
    this.displayPerformanceMetrics();
    
    // Alerts
    this.displayAlerts();
    
    // Trend Analysis
    this.displayTrends();
    
    // Controls
    this.displayControls();
  }
  
  displaySystemStatus(latest) {
    const status = latest?.status || 'unknown';
    const statusIcon = status === 'healthy' ? '✅' : status === 'error' ? '❌' : '⚠️';
    
    console.log('📊 SYSTEM STATUS');
    console.log('-'.repeat(30));
    console.log(`Overall Health: ${statusIcon} ${status.toUpperCase()}`);
    
    if (latest) {
      console.log(`Response Time: ${latest.responseTime}ms`);
      console.log(`Storage Type: ${latest.database?.status || 'unknown'}`);
      console.log(`Last Check: ${new Date(latest.timestamp).toLocaleTimeString()}`);
    }
    
    console.log('');
  }
  
  displayPerformanceMetrics() {
    if (this.metrics.length === 0) return;
    
    console.log('⚡ PERFORMANCE METRICS');
    console.log('-'.repeat(30));
    
    const responseTimes = this.metrics.map(m => m.responseTime).filter(rt => rt != null);
    const avgResponse = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const maxResponse = Math.max(...responseTimes);
    const minResponse = Math.min(...responseTimes);
    
    console.log(`Average Response Time: ${avgResponse.toFixed(1)}ms`);
    console.log(`Max Response Time: ${maxResponse}ms`);
    console.log(`Min Response Time: ${minResponse}ms`);
    console.log(`Total Checks: ${this.metrics.length}`);
    
    // Simple ASCII graph
    this.displayResponseTimeGraph(responseTimes.slice(-20));
    
    console.log('');
  }
  
  displayResponseTimeGraph(data) {
    if (data.length < 2) return;
    
    console.log('\nResponse Time Trend (last 20 checks):');
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    // Create simple ASCII graph
    const graphHeight = 8;
    const graph = [];
    
    for (let i = 0; i < graphHeight; i++) {
      graph[i] = [];
    }
    
    data.forEach((value, index) => {
      const normalized = Math.round(((value - min) / range) * (graphHeight - 1));
      const row = graphHeight - 1 - normalized;
      
      for (let i = 0; i < graphHeight; i++) {
        if (i === row) {
          graph[i][index] = '█';
        } else if (!graph[i][index]) {
          graph[i][index] = ' ';
        }
      }
    });
    
    // Display graph
    for (let i = 0; i < graphHeight; i++) {
      const line = graph[i].map(char => char || ' ').join('');
      const value = Math.round(min + ((graphHeight - 1 - i) / (graphHeight - 1)) * range);
      console.log(`${value.toString().padStart(4)}ms |${line}`);
    }
    
    console.log(`     ${'+'.repeat(data.length)}`);
  }
  
  displayAlerts() {
    console.log('🚨 RECENT ALERTS');
    console.log('-'.repeat(30));
    
    if (this.alerts.length === 0) {
      console.log('✅ No recent alerts');
    } else {
      this.alerts.slice(0, 5).forEach(alert => {
        const time = new Date(alert.timestamp).toLocaleTimeString();
        const icon = alert.severity === 'critical' ? '🔴' : '🟡';
        console.log(`${icon} [${time}] ${alert.message}`);
      });
    }
    
    console.log('');
  }
  
  displayTrends() {
    if (this.metrics.length < 5) return;
    
    console.log('📈 TREND ANALYSIS');
    console.log('-'.repeat(30));
    
    const recent = this.metrics.slice(-10);
    const older = this.metrics.slice(-20, -10);
    
    if (older.length > 0) {
      const recentAvg = recent.reduce((sum, m) => sum + (m.responseTime || 0), 0) / recent.length;
      const olderAvg = older.reduce((sum, m) => sum + (m.responseTime || 0), 0) / older.length;
      
      const trend = recentAvg > olderAvg ? '📈 Increasing' : '📉 Decreasing';
      const change = Math.abs(recentAvg - olderAvg).toFixed(1);
      
      console.log(`Response Time Trend: ${trend} (${change}ms change)`);
      
      // Health trend
      const recentErrors = recent.filter(m => m.status === 'error').length;
      const olderErrors = older.filter(m => m.status === 'error').length;
      
      if (recentErrors > olderErrors) {
        console.log('🔻 System stability decreasing');
      } else if (recentErrors < olderErrors) {
        console.log('🔺 System stability improving');
      } else {
        console.log('➡️ System stability stable');
      }
    }
    
    console.log('');
  }
  
  displayControls() {
    console.log('🎮 CONTROLS');
    console.log('-'.repeat(30));
    console.log('r - Run full analysis    s - Security check    l - Load test');
    console.log('p - Performance test     a - View alerts       h - Help');
    console.log('q - Quit dashboard');
    console.log('');
    console.log('Press any key + Enter to execute command...');
  }
  
  setupUserInput() {
    process.stdin.setRawMode(false);
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', async (input) => {
      const command = input.toString().trim().toLowerCase();
      
      switch (command) {
        case 'r':
          await this.runFullAnalysis();
          break;
        case 's':
          await this.runSecurityCheck();
          break;
        case 'l':
          await this.runLoadTest();
          break;
        case 'p':
          await this.runPerformanceTest();
          break;
        case 'a':
          this.viewAlerts();
          break;
        case 'h':
          this.showHelp();
          break;
        case 'q':
          this.quit();
          break;
        default:
          console.log(`Unknown command: ${command}`);
      }
    });
  }
  
  async runFullAnalysis() {
    console.log('\n🔍 Running full system analysis...');
    const result = await this.analyzer.runComprehensiveAnalysis();
    console.log(`✅ Analysis complete. Status: ${result.overallStatus}`);
    console.log('Press any key to return to dashboard...');
    await this.waitForKey();
  }
  
  async runSecurityCheck() {
    console.log('\n🔒 Running security checks...');
    const result = await this.analyzer.securityMonitor.runSecurityChecks();
    console.log(`✅ Security check complete. Risk level: ${result.overallRisk}`);
    console.log('Press any key to return to dashboard...');
    await this.waitForKey();
  }
  
  async runLoadTest() {
    console.log('\n🏋️ Running load test...');
    const result = await this.analyzer.loadTester.runLoadTest();
    if (result) {
      console.log(`✅ Load test complete. Success rate: ${result.successRate.toFixed(1)}%`);
    }
    console.log('Press any key to return to dashboard...');
    await this.waitForKey();
  }
  
  async runPerformanceTest() {
    console.log('\n⚡ Running performance test...');
    const result = await this.analyzer.performanceMonitor.collectMetrics();
    console.log(`✅ Performance test complete. Response time: ${result.responseTime}ms`);
    console.log('Press any key to return to dashboard...');
    await this.waitForKey();
  }
  
  viewAlerts() {
    console.clear();
    console.log('🚨 ALL ALERTS');
    console.log('='.repeat(40));
    
    if (this.alerts.length === 0) {
      console.log('✅ No alerts to display');
    } else {
      this.alerts.forEach((alert, index) => {
        const time = new Date(alert.timestamp).toLocaleTimeString();
        const icon = alert.severity === 'critical' ? '🔴' : '🟡';
        console.log(`${index + 1}. ${icon} [${time}] ${alert.type.toUpperCase()}: ${alert.message}`);
      });
    }
    
    console.log('\nPress any key to return to dashboard...');
    this.waitForKey();
  }
  
  showHelp() {
    console.clear();
    console.log('📚 DASHBOARD HELP');
    console.log('='.repeat(40));
    console.log('Available Commands:');
    console.log('');
    console.log('r - Run full system analysis');
    console.log('    Performs comprehensive health check including all features');
    console.log('');
    console.log('s - Security check');
    console.log('    Runs security vulnerability assessment');
    console.log('');
    console.log('l - Load test');
    console.log('    Performs stress testing with multiple concurrent users');
    console.log('');
    console.log('p - Performance test');
    console.log('    Collects current performance metrics');
    console.log('');
    console.log('a - View alerts');
    console.log('    Shows all recent alerts and notifications');
    console.log('');
    console.log('h - Help');
    console.log('    Shows this help information');
    console.log('');
    console.log('q - Quit');
    console.log('    Exits the monitoring dashboard');
    console.log('');
    console.log('The dashboard automatically refreshes every 10 seconds with');
    console.log('real-time metrics, alerts, and trend analysis.');
    console.log('');
    console.log('Press any key to return to dashboard...');
    this.waitForKey();
  }
  
  async waitForKey() {
    return new Promise(resolve => {
      const handler = () => {
        process.stdin.removeListener('data', handler);
        resolve();
      };
      process.stdin.once('data', handler);
    });
  }
  
  quit() {
    this.isRunning = false;
    console.clear();
    console.log('👋 Monitoring dashboard stopped.');
    console.log('Thank you for using OtterSport Health Monitor!');
    process.exit(0);
  }
}

// Start dashboard if run directly
if (require.main === module) {
  const dashboard = new MonitoringDashboard();
  dashboard.start().catch(error => {
    console.error('❌ Dashboard failed:', error.message);
    process.exit(1);
  });
}

module.exports = { MonitoringDashboard };