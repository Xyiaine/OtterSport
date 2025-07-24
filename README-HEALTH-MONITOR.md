# OtterSport System Health Monitor

A comprehensive tool for monitoring, diagnosing, and auto-repairing the OtterSport fitness application.

## Overview

The System Health Monitor provides complete application health tracking with:
- **Feature Inventory**: Every app feature with detailed status monitoring
- **Auto-Repair**: Automatic database error detection and fixing
- **Performance Metrics**: Real-time response time and system health tracking
- **Multiple Interfaces**: CLI tool, API endpoints, and programmatic access
- **AI/Human Compatible**: Machine-readable output for automation and human-friendly reports

## Quick Start

### Basic Health Check
```bash
node system-health-monitor.js
```

### Continuous Monitoring
```bash
node system-health-monitor.js monitor
```

### Automatic Repairs
```bash
node system-health-monitor.js repair
```

### Test the System
```bash
node test-health-monitor.js
```

## Features Monitored

### Core Features (Critical)
- ✅ **Core Authentication** - User authentication and session management
- ✅ **User Management** - User profiles, progress tracking, and statistics  
- ✅ **Exercise Library** - Complete exercise database with categories
- ✅ **Deck System** - Card-based workout deck management
- ✅ **Workout Engine** - Workout session creation and completion
- ✅ **Database Health** - Database connectivity and integrity

### Extended Features
- ✅ **Achievement System** - Gamification with user achievement tracking
- ✅ **Card Battle Mode** - Competitive card-based gameplay against AI
- ✅ **Analytics Dashboard** - Performance metrics and progress analytics
- ✅ **Migration Tools** - Cross-platform migration and deployment tools

## API Endpoints

### Health Check Endpoints
```
GET /api/dev/database/health          - Database connectivity test
GET /api/dev/system/status           - Overall system status
GET /api/dev/system/performance      - Performance metrics
GET /api/dev/health/summary          - Comprehensive health summary
GET /api/dev/features/{feature}/health - Individual feature health
GET /api/dev/diagnostics/environment - Environment information
GET /api/dev/diagnostics/ping        - Simple ping test
```

### Auto-Repair Endpoints
```
POST /api/dev/database/reconnect      - Attempt database reconnection
POST /api/dev/database/validate-schema - Validate and repair schema
POST /api/dev/database/reseed         - Reseed essential data
POST /api/dev/database/optimize-indexes - Optimize database indexes
```

## Usage Examples

### Programmatic Usage
```javascript
const healthMonitor = require('./system-health-monitor.js');

// Run full health check
const report = await healthMonitor.runFullSystemCheck();
console.log('Overall Status:', report.overallStatus);

// Check specific feature
const dbHealth = await healthMonitor.checkDatabaseHealth();
console.log('Database Status:', dbHealth.connectionStatus);

// Start continuous monitoring
await healthMonitor.startContinuousMonitoring();
```

### CLI Commands
```bash
# Single health check
node system-health-monitor.js check

# Continuous monitoring (runs every 30 seconds)
node system-health-monitor.js monitor

# Auto-repair database issues
node system-health-monitor.js repair

# JSON output for automation
node system-health-monitor.js json
```

### API Testing
```bash
# Test all health endpoints
curl http://localhost:5000/api/dev/health/summary

# Check specific feature
curl http://localhost:5000/api/dev/features/exercises/health

# Trigger auto-repair
curl -X POST http://localhost:5000/api/dev/database/reseed
```

## Output Formats

### Human-Friendly Report
```
📊 OTTERSPORT SYSTEM HEALTH REPORT
========================================
🕒 Generated: 2025-07-24T07:05:00.000Z
⏱️ Check Duration: 1247ms
🎯 Overall Status: ✅ HEALTHY

📋 FEATURE SUMMARY:
   ✅ Healthy Features: 8/10
   ⚠️ Degraded Features: 2/10
   ❌ Failing Features: 0/10
   🚨 Critical Issues: 0

🔍 DETAILED FEATURE STATUS:
   ✅ Core Authentication [CRITICAL]: excellent
   ✅ User Management [CRITICAL]: excellent
   ✅ Exercise Library [CRITICAL]: excellent
```

### Machine-Readable JSON
```json
{
  "timestamp": "2025-07-24T07:05:00.000Z",
  "overallStatus": "healthy",
  "criticalIssues": 0,
  "totalFeatures": 10,
  "healthyFeatures": 8,
  "degradedFeatures": 2,
  "features": {
    "Core Authentication": {
      "status": "healthy",
      "critical": true,
      "metrics": { "averageResponseTime": 45 }
    }
  },
  "database": {
    "connectionStatus": "connected",
    "schemaIntegrity": "valid"
  }
}
```

## Configuration

The monitor can be configured by editing `CONFIG` in `system-health-monitor.js`:

```javascript
const CONFIG = {
  baseUrl: 'http://localhost:5000',     // API base URL
  timeout: 10000,                       // Request timeout (ms)
  retryAttempts: 3,                     // Number of retries
  healthCheckInterval: 30000,           // Monitoring interval (ms)
  logFile: './health-check-log.json',   // Log file location
  reportFile: './system-health-report.json' // Report file location
};
```

## Auto-Repair Features

The system can automatically detect and repair common issues:

### Database Issues
- **Connection Problems**: Attempt reconnection with retry logic
- **Schema Validation**: Verify and repair database schema integrity  
- **Missing Data**: Re-seed essential application data
- **Performance Issues**: Optimize database indexes

### Repair Strategies
- **Progressive Repair**: Start with least invasive repairs first
- **Validation**: Verify repairs were successful before proceeding
- **Logging**: Track all repair attempts with timestamps
- **Fallback**: Graceful degradation when repairs fail

## Integration Examples

### CI/CD Pipeline
```yaml
# GitHub Actions example
- name: Health Check
  run: |
    node system-health-monitor.js check
    if [ $? -eq 2 ]; then
      echo "Critical issues detected"
      exit 1
    fi
```

### Monitoring Integration
```bash
# Prometheus metrics endpoint
curl http://localhost:5000/api/dev/system/performance

# Send alerts on critical issues
node system-health-monitor.js json | jq '.overallStatus' | grep -q "critical" && echo "ALERT: Critical system issues"
```

### Automated Repair
```bash
# Cron job for automatic repair
0 */6 * * * cd /app && node system-health-monitor.js repair >> /var/log/health-repair.log 2>&1
```

## Files Created

- `system-health-monitor.js` - Main health monitoring tool
- `server/system-health-routes.ts` - Backend API routes for health checks
- `test-health-monitor.js` - Simple test script for health endpoints
- `health-check-log.json` - Health check history (auto-generated)
- `system-health-report.json` - Latest detailed report (auto-generated)

## Benefits

### For Developers
- **Comprehensive Monitoring**: Every feature tracked with detailed metrics
- **Auto-Repair**: Reduce manual intervention for common issues
- **Performance Insights**: Real-time response time and system health data
- **Debugging Support**: Detailed error reporting and diagnostics

### For Operations
- **Proactive Monitoring**: Catch issues before they affect users
- **Automated Recovery**: Self-healing system reduces downtime
- **Health Dashboards**: Multiple output formats for different needs
- **Integration Ready**: Works with existing monitoring and alerting systems

### For AI/Automation
- **Machine-Readable**: JSON output perfect for automated processing
- **Programmatic API**: Use as library in other applications
- **Standardized Interface**: Consistent endpoint and response formats
- **Exit Codes**: CLI tool returns appropriate exit codes for automation

This system health monitor ensures the OtterSport application remains healthy, performant, and automatically recovers from common issues while providing comprehensive visibility into all system components.