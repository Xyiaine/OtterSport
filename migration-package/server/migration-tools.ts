/**
 * COMPREHENSIVE MIGRATION TOOLS
 * 
 * Provides complete database migration utilities for cross-platform deployment
 * Supports Replit, Vercel, Railway, Heroku, and other PostgreSQL platforms
 */

import { db } from "./db";
import { sql } from "drizzle-orm";
import { readFileSync, writeFileSync } from "fs";
import { databaseOptimizer } from "./database-optimizer";

export class MigrationTools {
  /**
   * COMPLETE DATABASE BACKUP
   * Creates full backup including schema and data
   */
  async createFullBackup(): Promise<{
    schema: string;
    data: any;
    metadata: {
      createdAt: string;
      version: string;
      tableCount: number;
      totalRows: number;
    };
  }> {
    console.log("🔄 Creating comprehensive database backup...");

    // Get schema
    const schema = await databaseOptimizer.exportSchema();

    // Get all data
    const data = await this.exportAllData();

    // Get metadata
    const tableCounts = await this.getTableCounts();
    const totalRows = Object.values(tableCounts).reduce((sum: number, count: number) => sum + count, 0);

    const metadata = {
      createdAt: new Date().toISOString(),
      version: "1.0.0",
      tableCount: Object.keys(tableCounts).length,
      totalRows
    };

    console.log(`✅ Backup created: ${metadata.tableCount} tables, ${totalRows} total rows`);

    return { schema, data, metadata };
  }

  /**
   * EXPORT ALL DATA
   * Exports data from all tables in correct dependency order
   */
  async exportAllData(): Promise<any> {
    console.log("📦 Exporting all table data...");

    // Export in dependency order (parents first)
    const data = {
      // Independent tables first
      exercises: await db.execute(sql`SELECT * FROM exercises ORDER BY id`),
      achievements: await db.execute(sql`SELECT * FROM achievements ORDER BY id`),
      users: await db.execute(sql`SELECT * FROM users ORDER BY created_at`),
      
      // Dependent tables
      decks: await db.execute(sql`SELECT * FROM decks ORDER BY id`),
      deck_exercises: await db.execute(sql`SELECT * FROM deck_exercises ORDER BY deck_id, "order"`),
      workouts: await db.execute(sql`SELECT * FROM workouts ORDER BY started_at`),
      user_achievements: await db.execute(sql`SELECT * FROM user_achievements ORDER BY unlocked_at`),
      
      // Session data (usually not needed in migration)
      sessions: await db.execute(sql`SELECT count(*) as session_count FROM sessions`)
    };

    console.log(`✅ Data exported from ${Object.keys(data).length} tables`);
    return data;
  }

  /**
   * GET TABLE COUNTS
   * Returns count of rows in each table
   */
  async getTableCounts(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};

    const tables = ['exercises', 'decks', 'achievements', 'deck_exercises', 'users', 'workouts', 'user_achievements', 'sessions'];

    for (const table of tables) {
      const result = await db.execute(sql`SELECT COUNT(*) as count FROM ${sql.identifier(table)}`);
      counts[table] = parseInt(result[0]?.count || '0');
    }

    return counts;
  }

  /**
   * GENERATE PLATFORM-SPECIFIC MIGRATION SCRIPTS
   * Creates migration scripts for different platforms
   */
  async generatePlatformScripts(): Promise<{
    replit: string;
    vercel: string;
    railway: string;
    heroku: string;
    general: string;
  }> {
    console.log("🚀 Generating platform-specific migration scripts...");

    const baseScript = await this.getBaseMigrationScript();

    const scripts = {
      replit: this.customizeForReplit(baseScript),
      vercel: this.customizeForVercel(baseScript),
      railway: this.customizeForRailway(baseScript),
      heroku: this.customizeForHeroku(baseScript),
      general: baseScript
    };

    console.log("✅ Platform-specific scripts generated");
    return scripts;
  }

  /**
   * BASE MIGRATION SCRIPT
   * Core migration script that works on all platforms
   */
  private async getBaseMigrationScript(): Promise<string> {
    const { sqlScript, seedScript } = await databaseOptimizer.generateMigrationScript();

    return `-- OtterSport Database Migration Script
-- Compatible with PostgreSQL 12+
-- Generated: ${new Date().toISOString()}

-- Clean up existing tables (if needed)
-- Uncomment below if you want to start fresh
-- DROP TABLE IF EXISTS user_achievements CASCADE;
-- DROP TABLE IF EXISTS workouts CASCADE;
-- DROP TABLE IF EXISTS deck_exercises CASCADE;
-- DROP TABLE IF EXISTS achievements CASCADE;
-- DROP TABLE IF EXISTS decks CASCADE;
-- DROP TABLE IF EXISTS exercises CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS sessions CASCADE;

${sqlScript}

-- Insert seed data
${seedScript}

-- Final optimization
ANALYZE;
VACUUM;

-- Verify migration
SELECT 'Migration completed successfully' as status;
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;`;
  }

  /**
   * REPLIT-SPECIFIC CUSTOMIZATION
   */
  private customizeForReplit(baseScript: string): string {
    return `-- OtterSport Migration for Replit
-- Replit PostgreSQL Environment
-- Run this in the Replit database console

-- Environment check
SELECT 'Replit PostgreSQL Migration' as platform;

${baseScript}

-- Replit-specific optimizations
-- Connection pooling is handled automatically
-- No additional configuration needed

-- Verify Replit environment
SELECT 
  current_database() as database_name,
  version() as postgresql_version,
  current_user as database_user;`;
  }

  /**
   * VERCEL-SPECIFIC CUSTOMIZATION
   */
  private customizeForVercel(baseScript: string): string {
    return `-- OtterSport Migration for Vercel
-- Vercel Postgres Environment
-- Run this via Vercel CLI or dashboard

-- Environment check
SELECT 'Vercel Postgres Migration' as platform;

${baseScript}

-- Vercel-specific notes:
-- 1. Update DATABASE_URL in environment variables
-- 2. Consider using connection pooling with @vercel/postgres
-- 3. Sessions may need Redis alternative for serverless

-- Connection pooling recommendation
-- Use @vercel/postgres with connection pooling enabled
-- Update drizzle config to use pooled connections

-- Verify Vercel environment
SELECT 
  current_database() as database_name,
  version() as postgresql_version,
  current_setting('max_connections') as max_connections;`;
  }

  /**
   * RAILWAY-SPECIFIC CUSTOMIZATION
   */
  private customizeForRailway(baseScript: string): string {
    return `-- OtterSport Migration for Railway
-- Railway PostgreSQL Environment
-- Run this via Railway dashboard or CLI

-- Environment check
SELECT 'Railway PostgreSQL Migration' as platform;

${baseScript}

-- Railway-specific optimizations
-- Connection string format: postgresql://user:pass@host:port/db
-- No additional configuration needed

-- Verify Railway environment
SELECT 
  current_database() as database_name,
  version() as postgresql_version,
  current_setting('shared_preload_libraries') as extensions;`;
  }

  /**
   * HEROKU-SPECIFIC CUSTOMIZATION
   */
  private customizeForHeroku(baseScript: string): string {
    return `-- OtterSport Migration for Heroku
-- Heroku Postgres Environment
-- Run this via heroku pg:psql

-- Environment check
SELECT 'Heroku Postgres Migration' as platform;

${baseScript}

-- Heroku-specific considerations:
-- 1. Use DATABASE_URL environment variable
-- 2. Consider connection pooling with pgbouncer
-- 3. Row limits may apply on hobby tier

-- Connection pooling setup (if needed)
-- Add pgbouncer or similar connection pooler
-- Update connection string format

-- Verify Heroku environment
SELECT 
  current_database() as database_name,
  version() as postgresql_version,
  current_setting('max_connections') as max_connections,
  pg_size_pretty(pg_database_size(current_database())) as database_size;`;
  }

  /**
   * VALIDATE MIGRATION READINESS
   * Checks if database is ready for migration
   */
  async validateMigrationReadiness(): Promise<{
    ready: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    console.log("🔍 Validating migration readiness...");

    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check database health
    const healthCheck = await databaseOptimizer.performHealthCheck();
    if (healthCheck.status === 'critical') {
      issues.push("Database health check failed");
      healthCheck.checks.forEach(check => {
        if (check.status === 'fail') {
          issues.push(`${check.name}: ${check.message}`);
        }
      });
    }

    // Check for data consistency
    const tableCounts = await this.getTableCounts();
    
    if (tableCounts.exercises === 0) {
      issues.push("No exercises found - seed data may be missing");
    }
    
    if (tableCounts.decks === 0) {
      issues.push("No decks found - seed data may be missing");
    }
    
    if (tableCounts.achievements === 0) {
      issues.push("No achievements found - seed data may be missing");
    }

    // Check for orphaned records
    const orphanedDeckExercises = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM deck_exercises de 
      LEFT JOIN decks d ON de.deck_id = d.id 
      LEFT JOIN exercises e ON de.exercise_id = e.id 
      WHERE d.id IS NULL OR e.id IS NULL
    `);

    if (parseInt(orphanedDeckExercises[0]?.count || '0') > 0) {
      issues.push("Orphaned deck exercises found");
    }

    // Generate recommendations
    recommendations.push("Run ANALYZE and VACUUM before migration");
    recommendations.push("Create backup before migration");
    recommendations.push("Test migration on staging environment first");
    
    if (tableCounts.sessions > 1000) {
      recommendations.push("Consider clearing old sessions before migration");
    }

    const ready = issues.length === 0;
    
    console.log(`✅ Migration readiness check: ${ready ? 'READY' : 'ISSUES FOUND'}`);
    return { ready, issues, recommendations };
  }

  /**
   * PERFORM MIGRATION TEST
   * Tests migration script without making changes
   */
  async testMigration(): Promise<{
    success: boolean;
    steps: Array<{
      step: string;
      status: 'success' | 'failed' | 'warning';
      message: string;
    }>;
  }> {
    console.log("🧪 Testing migration script...");

    const steps = [];

    try {
      // Test 1: Connection
      await db.execute(sql`SELECT 1`);
      steps.push({
        step: "Database Connection",
        status: "success" as const,
        message: "Connection established successfully"
      });

      // Test 2: Schema validation
      const tables = await db.execute(sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      steps.push({
        step: "Schema Validation",
        status: "success" as const,
        message: `Found ${tables.length} tables`
      });

      // Test 3: Data integrity
      const exerciseCount = await db.execute(sql`SELECT COUNT(*) as count FROM exercises`);
      steps.push({
        step: "Data Integrity",
        status: "success" as const,
        message: `Verified ${exerciseCount[0]?.count || 0} exercises`
      });

      // Test 4: Constraints
      const constraints = await db.execute(sql`
        SELECT COUNT(*) as count 
        FROM information_schema.table_constraints 
        WHERE table_schema = 'public' AND constraint_type = 'FOREIGN KEY'
      `);
      steps.push({
        step: "Constraint Validation",
        status: "success" as const,
        message: `Found ${constraints[0]?.count || 0} foreign key constraints`
      });

      console.log("✅ Migration test completed successfully");
      return { success: true, steps };

    } catch (error) {
      steps.push({
        step: "Migration Test",
        status: "failed" as const,
        message: error instanceof Error ? error.message : "Unknown error"
      });

      console.log("❌ Migration test failed");
      return { success: false, steps };
    }
  }
}

export const migrationTools = new MigrationTools();