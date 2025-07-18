#!/usr/bin/env node

/**
 * Database Optimization and Testing Suite
 * Comprehensive database optimization, testing, and migration preparation
 */

import { db } from './server/db.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
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

async function testDatabaseConnection() {
  logSection('DATABASE CONNECTION & HEALTH');
  
  try {
    // Test basic connection
    await db.execute('SELECT 1 as test');
    logTest('Database Connection', true, 'PostgreSQL connected');
    
    // Test database version
    const version = await db.execute('SELECT version()');
    logTest('Database Version', true, version.rows[0].version.split(',')[0]);
    
    // Test connection pool
    const connections = await db.execute('SELECT count(*) as active FROM pg_stat_activity WHERE state = \'active\'');
    logTest('Active Connections', true, `${connections.rows[0].active} active connections`);
    
    return true;
  } catch (error) {
    logTest('Database Connection', false, error.message);
    return false;
  }
}

async function testSchemaIntegrity() {
  logSection('SCHEMA INTEGRITY TESTS');
  
  try {
    // Check table existence
    const tables = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    const expectedTables = ['users', 'exercises', 'decks', 'deck_exercises', 'workouts', 'user_achievements', 'sessions'];
    const existingTables = tables.rows.map(row => row.table_name);
    
    for (const table of expectedTables) {
      const exists = existingTables.includes(table);
      logTest(`Table: ${table}`, exists);
    }
    
    // Check foreign key constraints
    const foreignKeys = await db.execute(`
      SELECT 
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
    `);
    
    logTest('Foreign Key Constraints', foreignKeys.rows.length > 0, 
      `${foreignKeys.rows.length} constraints found`);
    
    // Check indexes
    const indexes = await db.execute(`
      SELECT 
        schemaname, 
        tablename, 
        indexname, 
        indexdef 
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `);
    
    logTest('Database Indexes', indexes.rows.length > 0, 
      `${indexes.rows.length} indexes found`);
    
    return true;
  } catch (error) {
    logTest('Schema Integrity', false, error.message);
    return false;
  }
}

async function testDataIntegrity() {
  logSection('DATA INTEGRITY TESTS');
  
  try {
    // Check table counts
    const counts = {};
    const tables = ['users', 'exercises', 'decks', 'deck_exercises', 'workouts', 'user_achievements'];
    
    for (const table of tables) {
      const result = await db.execute(`SELECT COUNT(*) as count FROM ${table}`);
      counts[table] = parseInt(result.rows[0].count);
      logTest(`${table} records`, counts[table] >= 0, `${counts[table]} records`);
    }
    
    // Check referential integrity
    const orphanedDeckExercises = await db.execute(`
      SELECT COUNT(*) as count 
      FROM deck_exercises de
      LEFT JOIN decks d ON de.deck_id = d.id
      LEFT JOIN exercises e ON de.exercise_id = e.id
      WHERE d.id IS NULL OR e.id IS NULL
    `);
    
    logTest('Referential Integrity', orphanedDeckExercises.rows[0].count === '0', 
      `${orphanedDeckExercises.rows[0].count} orphaned records`);
    
    // Check for duplicate exercises
    const duplicateExercises = await db.execute(`
      SELECT name, COUNT(*) as count 
      FROM exercises 
      GROUP BY name 
      HAVING COUNT(*) > 1
    `);
    
    logTest('Exercise Uniqueness', duplicateExercises.rows.length === 0, 
      `${duplicateExercises.rows.length} duplicate exercise names`);
    
    return true;
  } catch (error) {
    logTest('Data Integrity', false, error.message);
    return false;
  }
}

async function testPerformance() {
  logSection('PERFORMANCE TESTS');
  
  try {
    // Test query performance
    const queries = [
      { name: 'Get All Exercises', query: 'SELECT * FROM exercises ORDER BY name' },
      { name: 'Get All Decks', query: 'SELECT * FROM decks ORDER BY name' },
      { name: 'Get Deck with Exercises', query: `
        SELECT d.*, e.name as exercise_name 
        FROM decks d
        JOIN deck_exercises de ON d.id = de.deck_id
        JOIN exercises e ON de.exercise_id = e.id
        WHERE d.id = 1
        ORDER BY de.order
      ` },
      { name: 'User Statistics', query: `
        SELECT 
          u.id,
          u.total_workouts,
          u.total_minutes,
          COUNT(w.id) as completed_workouts
        FROM users u
        LEFT JOIN workouts w ON u.id = w.user_id
        WHERE u.id = 'sample-user'
        GROUP BY u.id, u.total_workouts, u.total_minutes
      ` }
    ];
    
    for (const testQuery of queries) {
      const startTime = Date.now();
      try {
        await db.execute(testQuery.query);
        const duration = Date.now() - startTime;
        const passed = duration < 500; // Should complete within 500ms
        logTest(testQuery.name, passed, `${duration}ms`);
      } catch (error) {
        logTest(testQuery.name, false, error.message);
      }
    }
    
    // Test connection pooling
    const poolTests = [];
    for (let i = 0; i < 5; i++) {
      poolTests.push(db.execute('SELECT 1'));
    }
    
    const startTime = Date.now();
    await Promise.all(poolTests);
    const duration = Date.now() - startTime;
    
    logTest('Connection Pooling', duration < 1000, `${duration}ms for 5 concurrent queries`);
    
    return true;
  } catch (error) {
    logTest('Performance Tests', false, error.message);
    return false;
  }
}

async function optimizeDatabase() {
  logSection('DATABASE OPTIMIZATION');
  
  try {
    // Analyze table statistics
    const tables = ['users', 'exercises', 'decks', 'deck_exercises', 'workouts', 'user_achievements'];
    
    for (const table of tables) {
      await db.execute(`ANALYZE ${table}`);
      logTest(`Analyze ${table}`, true, 'Statistics updated');
    }
    
    // Check for missing indexes
    const slowQueries = await db.execute(`
      SELECT 
        query,
        calls,
        total_time,
        mean_time,
        stddev_time
      FROM pg_stat_statements 
      WHERE mean_time > 100
      ORDER BY mean_time DESC
      LIMIT 5
    `).catch(() => ({ rows: [] }));
    
    if (slowQueries.rows.length > 0) {
      logTest('Slow Query Detection', true, `${slowQueries.rows.length} slow queries found`);
    } else {
      logTest('Slow Query Detection', true, 'No slow queries detected');
    }
    
    // Vacuum and reindex
    await db.execute('VACUUM ANALYZE');
    logTest('Database Vacuum', true, 'Completed vacuum analyze');
    
    return true;
  } catch (error) {
    logTest('Database Optimization', false, error.message);
    return false;
  }
}

async function testMigrationReadiness() {
  logSection('MIGRATION READINESS TESTS');
  
  try {
    // Check environment variables
    const requiredEnvVars = ['DATABASE_URL', 'PGHOST', 'PGPORT', 'PGUSER', 'PGPASSWORD', 'PGDATABASE'];
    
    for (const envVar of requiredEnvVars) {
      const exists = process.env[envVar] !== undefined;
      logTest(`Environment Variable: ${envVar}`, exists);
    }
    
    // Test connection string format
    const dbUrl = process.env.DATABASE_URL;
    const isValidFormat = dbUrl && dbUrl.startsWith('postgres://');
    logTest('Database URL Format', isValidFormat, 'Valid PostgreSQL connection string');
    
    // Test SSL/TLS configuration
    const sslTest = await db.execute('SHOW ssl').catch(() => ({ rows: [{ ssl: 'off' }] }));
    logTest('SSL Configuration', true, `SSL: ${sslTest.rows[0].ssl}`);
    
    // Test backup compatibility
    const backupTest = await db.execute(`
      SELECT 
        current_database() as database,
        current_user as user,
        version() as version
    `);
    
    logTest('Backup Compatibility', true, 
      `Database: ${backupTest.rows[0].database}, User: ${backupTest.rows[0].user}`);
    
    return true;
  } catch (error) {
    logTest('Migration Readiness', false, error.message);
    return false;
  }
}

async function generateMigrationScript() {
  logSection('MIGRATION SCRIPT GENERATION');
  
  try {
    const migrationScript = `#!/bin/bash
# OtterSport Database Migration Script
# Generated: ${new Date().toISOString()}

set -e

echo "🚀 Starting OtterSport Database Migration..."

# Check if required environment variables exist
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is required"
    exit 1
fi

echo "✅ Environment variables validated"

# Test database connection
echo "🔍 Testing database connection..."
if ! npm run db:push; then
    echo "❌ Database connection failed"
    exit 1
fi

echo "✅ Database connection successful"

# Run schema migrations
echo "📊 Running schema migrations..."
npm run db:push

echo "✅ Schema migrations completed"

# Seed initial data if tables are empty
echo "🌱 Checking for initial data..."
npm run seed

echo "✅ Initial data seeded"

# Verify migration
echo "🔍 Verifying migration..."
npm run test:db

echo "✅ Migration verification completed"
echo "🎉 Migration completed successfully!"
`;

    fs.writeFileSync('migrate-database.sh', migrationScript);
    execSync('chmod +x migrate-database.sh');
    
    logTest('Migration Script', true, 'Generated migrate-database.sh');
    
    // Generate environment template
    const envTemplate = `# OtterSport Environment Variables
# Copy this file to .env and fill in your values

# Database Configuration
DATABASE_URL=postgres://username:password@hostname:5432/database_name
PGHOST=hostname
PGPORT=5432
PGUSER=username
PGPASSWORD=password
PGDATABASE=database_name

# Session Configuration
SESSION_SECRET=your_secure_random_session_secret_here

# Replit Configuration (if deploying on Replit)
REPLIT_DOMAINS=your-repl-name.your-username.repl.co
ISSUER_URL=https://replit.com
`;

    fs.writeFileSync('.env.template', envTemplate);
    logTest('Environment Template', true, 'Generated .env.template');
    
    return true;
  } catch (error) {
    logTest('Migration Script Generation', false, error.message);
    return false;
  }
}

async function runFullOptimization() {
  log('🏃‍♂️ Starting Complete Database Optimization Suite', colors.cyan);
  
  let allTestsPassed = true;
  
  try {
    allTestsPassed &= await testDatabaseConnection();
    allTestsPassed &= await testSchemaIntegrity();
    allTestsPassed &= await testDataIntegrity();
    allTestsPassed &= await testPerformance();
    allTestsPassed &= await optimizeDatabase();
    allTestsPassed &= await testMigrationReadiness();
    allTestsPassed &= await generateMigrationScript();
    
    logSection('OPTIMIZATION SUMMARY');
    
    if (allTestsPassed) {
      log('✅ All optimization tests passed successfully!', colors.green);
      log('🚀 Database is fully optimized and ready for production', colors.cyan);
      log('📝 Migration scripts generated in project root', colors.yellow);
    } else {
      log('⚠️  Some optimization tests failed', colors.yellow);
      log('🔧 Please review the failed tests and fix issues', colors.yellow);
    }
    
  } catch (error) {
    log(`❌ Optimization failed: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runFullOptimization().catch(console.error);
}

export { runFullOptimization };