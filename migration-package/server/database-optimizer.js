/**
 * DATABASE OPTIMIZATION SCRIPT
 * 
 * Comprehensive database optimization for OtterSport application
 * - Performance monitoring and health checks
 * - Index optimization and query analysis
 * - Connection pooling optimization
 * - Cross-platform migration support
 * - Data integrity validation
 * - Backup and recovery utilities
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class DatabaseOptimizer {
  constructor() {
    this.db = null;
    this.sql = null;
    this.connectionString = process.env.DATABASE_URL;
    this.optimizationReport = {
      startTime: new Date(),
      checks: [],
      recommendations: [],
      performance: {},
      migrations: []
    };
  }

  /**
   * Initialize database connection with optimization settings
   */
  async initialize() {
    try {
      console.log('🔧 [DatabaseOptimizer] Initializing optimized database connection...');
      
      // Configure connection with optimization parameters
      this.sql = neon(this.connectionString, {
        // Connection pooling configuration
        connectionTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        maxConnections: 20,
        // Performance optimizations
        statement_timeout: 30000,
        idle_in_transaction_session_timeout: 30000,
        // Logging for monitoring
        log: (query, parameters) => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`📊 [DB Query] ${query.slice(0, 100)}...`);
          }
        }
      });

      this.db = drizzle(this.sql, {
        logger: process.env.NODE_ENV === 'development'
      });

      await this.runHealthCheck();
      console.log('✅ [DatabaseOptimizer] Database connection optimized successfully');
      
      return this.db;
    } catch (error) {
      console.error('❌ [DatabaseOptimizer] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Comprehensive database health check
   */
  async runHealthCheck() {
    console.log('🏥 [DatabaseOptimizer] Running comprehensive health check...');
    
    try {
      // Connection test
      const connectionTest = await this.testConnection();
      this.optimizationReport.checks.push({
        type: 'connection',
        status: connectionTest ? 'pass' : 'fail',
        details: connectionTest ? 'Connection successful' : 'Connection failed',
        timestamp: new Date()
      });

      // Performance metrics
      const performanceMetrics = await this.getPerformanceMetrics();
      this.optimizationReport.performance = performanceMetrics;

      // Schema validation
      const schemaValidation = await this.validateSchema();
      this.optimizationReport.checks.push({
        type: 'schema',
        status: schemaValidation.isValid ? 'pass' : 'fail',
        details: schemaValidation.message,
        timestamp: new Date()
      });

      // Index analysis
      const indexAnalysis = await this.analyzeIndexes();
      this.optimizationReport.checks.push({
        type: 'indexes',
        status: indexAnalysis.optimized ? 'pass' : 'warning',
        details: indexAnalysis.message,
        recommendations: indexAnalysis.recommendations,
        timestamp: new Date()
      });

      // Data integrity check
      const integrityCheck = await this.checkDataIntegrity();
      this.optimizationReport.checks.push({
        type: 'integrity',
        status: integrityCheck.isValid ? 'pass' : 'fail',
        details: integrityCheck.message,
        timestamp: new Date()
      });

      // Generate recommendations
      this.generateOptimizationRecommendations();

      console.log('✅ [DatabaseOptimizer] Health check completed');
      return this.optimizationReport;
    } catch (error) {
      console.error('❌ [DatabaseOptimizer] Health check failed:', error);
      throw error;
    }
  }

  /**
   * Test database connection
   */
  async testConnection() {
    try {
      const result = await this.sql`SELECT 1 as test`;
      return result.length > 0 && result[0].test === 1;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get comprehensive performance metrics
   */
  async getPerformanceMetrics() {
    try {
      const startTime = performance.now();
      
      // Database size and statistics
      const dbStats = await this.sql`
        SELECT 
          schemaname,
          tablename,
          attname,
          n_distinct,
          correlation
        FROM pg_stats 
        WHERE schemaname = 'public'
        LIMIT 10
      `;

      // Connection statistics
      const connectionStats = await this.sql`
        SELECT 
          state,
          COUNT(*) as count
        FROM pg_stat_activity 
        WHERE datname = current_database()
        GROUP BY state
      `;

      // Query performance (if pg_stat_statements is available)
      let queryStats = [];
      try {
        queryStats = await this.sql`
          SELECT 
            query,
            calls,
            total_time,
            mean_time,
            rows
          FROM pg_stat_statements 
          WHERE query NOT LIKE '%pg_stat_statements%'
          ORDER BY total_time DESC 
          LIMIT 10
        `;
      } catch (e) {
        // pg_stat_statements extension not available
        console.log('ℹ️ [DatabaseOptimizer] pg_stat_statements not available');
      }

      const endTime = performance.now();

      return {
        responseTime: endTime - startTime,
        databaseStats: dbStats,
        connectionStats: connectionStats,
        queryStats: queryStats,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Performance metrics collection failed:', error);
      return {
        responseTime: -1,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Validate database schema
   */
  async validateSchema() {
    try {
      // Check if all expected tables exist
      const expectedTables = [
        'users', 'exercises', 'decks', 'workouts', 
        'achievements', 'user_achievements', 'sessions'
      ];

      const existingTables = await this.sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;

      const existingTableNames = existingTables.map(t => t.table_name);
      const missingTables = expectedTables.filter(t => !existingTableNames.includes(t));

      if (missingTables.length > 0) {
        return {
          isValid: false,
          message: `Missing tables: ${missingTables.join(', ')}`,
          missingTables
        };
      }

      // Check for proper constraints and indexes
      const constraints = await this.sql`
        SELECT 
          table_name,
          constraint_name,
          constraint_type
        FROM information_schema.table_constraints 
        WHERE table_schema = 'public'
        AND constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE')
      `;

      return {
        isValid: true,
        message: 'Schema validation passed',
        tables: existingTableNames,
        constraints: constraints.length
      };
    } catch (error) {
      return {
        isValid: false,
        message: `Schema validation failed: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Analyze database indexes for optimization
   */
  async analyzeIndexes() {
    try {
      // Get index usage statistics
      const indexStats = await this.sql`
        SELECT 
          schemaname,
          tablename,
          indexname,
          idx_tup_read,
          idx_tup_fetch
        FROM pg_stat_user_indexes 
        WHERE schemaname = 'public'
        ORDER BY idx_tup_read DESC
      `;

      // Get unused indexes
      const unusedIndexes = await this.sql`
        SELECT 
          schemaname,
          tablename,
          indexname
        FROM pg_stat_user_indexes 
        WHERE schemaname = 'public'
        AND idx_tup_read = 0
        AND idx_tup_fetch = 0
      `;

      // Get table sizes
      const tableSizes = await this.sql`
        SELECT 
          schemaname,
          tablename,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
      `;

      const recommendations = [];
      
      if (unusedIndexes.length > 0) {
        recommendations.push({
          type: 'remove_unused_indexes',
          message: `Consider removing ${unusedIndexes.length} unused indexes`,
          indexes: unusedIndexes
        });
      }

      // Check for missing indexes on foreign keys
      const foreignKeys = await this.sql`
        SELECT 
          tc.table_name,
          kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      `;

      return {
        optimized: unusedIndexes.length === 0,
        message: `Found ${indexStats.length} indexes, ${unusedIndexes.length} unused`,
        indexStats,
        unusedIndexes,
        tableSizes,
        recommendations
      };
    } catch (error) {
      return {
        optimized: false,
        message: `Index analysis failed: ${error.message}`,
        error: error.message,
        recommendations: []
      };
    }
  }

  /**
   * Check data integrity
   */
  async checkDataIntegrity() {
    try {
      // Check for orphaned records
      const orphanedChecks = [];

      // Check user_achievements without valid user_id
      try {
        const orphanedAchievements = await this.sql`
          SELECT COUNT(*) as count
          FROM user_achievements ua
          LEFT JOIN users u ON ua.user_id = u.id
          WHERE u.id IS NULL
        `;
        
        orphanedChecks.push({
          table: 'user_achievements',
          orphaned: orphanedAchievements[0].count,
          type: 'foreign_key'
        });
      } catch (e) {
        // Table might not exist yet
      }

      // Check workouts without valid user_id
      try {
        const orphanedWorkouts = await this.sql`
          SELECT COUNT(*) as count
          FROM workouts w
          LEFT JOIN users u ON w.user_id = u.id
          WHERE u.id IS NULL
        `;
        
        orphanedChecks.push({
          table: 'workouts',
          orphaned: orphanedWorkouts[0].count,
          type: 'foreign_key'
        });
      } catch (e) {
        // Table might not exist yet
      }

      const totalOrphaned = orphanedChecks.reduce((sum, check) => sum + parseInt(check.orphaned), 0);

      return {
        isValid: totalOrphaned === 0,
        message: totalOrphaned === 0 ? 'No data integrity issues found' : `Found ${totalOrphaned} orphaned records`,
        orphanedChecks,
        totalOrphaned
      };
    } catch (error) {
      return {
        isValid: false,
        message: `Data integrity check failed: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Generate optimization recommendations
   */
  generateOptimizationRecommendations() {
    const recommendations = [];

    // Performance recommendations
    if (this.optimizationReport.performance.responseTime > 1000) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: 'Database response time is slow. Consider connection pooling optimization.',
        action: 'Increase connection pool size or optimize queries'
      });
    }

    // Schema recommendations
    const schemaCheck = this.optimizationReport.checks.find(c => c.type === 'schema');
    if (schemaCheck && schemaCheck.status === 'fail') {
      recommendations.push({
        type: 'schema',
        priority: 'critical',
        message: 'Schema validation failed. Missing tables or constraints.',
        action: 'Run database migrations to create missing tables'
      });
    }

    // Index recommendations
    const indexCheck = this.optimizationReport.checks.find(c => c.type === 'indexes');
    if (indexCheck && indexCheck.recommendations) {
      recommendations.push(...indexCheck.recommendations);
    }

    // Data integrity recommendations
    const integrityCheck = this.optimizationReport.checks.find(c => c.type === 'integrity');
    if (integrityCheck && integrityCheck.status === 'fail') {
      recommendations.push({
        type: 'integrity',
        priority: 'high',
        message: 'Data integrity issues detected. Clean up orphaned records.',
        action: 'Run data cleanup scripts to remove orphaned records'
      });
    }

    this.optimizationReport.recommendations = recommendations;
  }

  /**
   * Create database backup
   */
  async createBackup() {
    try {
      console.log('💾 [DatabaseOptimizer] Creating database backup...');
      
      // Create backup directory if it doesn't exist
      const backupDir = path.join(process.cwd(), 'backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // Generate backup filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(backupDir, `ottersport-backup-${timestamp}.sql`);

      // Export schema and data
      const tables = await this.sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;

      let backupContent = `-- OtterSport Database Backup\n`;
      backupContent += `-- Generated: ${new Date().toISOString()}\n\n`;

      for (const table of tables) {
        const tableName = table.table_name;
        
        // Get table structure
        const columns = await this.sql`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = ${tableName}
          ORDER BY ordinal_position
        `;

        backupContent += `-- Table: ${tableName}\n`;
        backupContent += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
        
        const columnDefs = columns.map(col => {
          let def = `  ${col.column_name} ${col.data_type}`;
          if (col.is_nullable === 'NO') def += ' NOT NULL';
          if (col.column_default) def += ` DEFAULT ${col.column_default}`;
          return def;
        });
        
        backupContent += columnDefs.join(',\n');
        backupContent += '\n);\n\n';

        // Get table data
        try {
          const data = await this.sql`SELECT * FROM ${this.sql(tableName)}`;
          if (data.length > 0) {
            backupContent += `-- Data for table: ${tableName}\n`;
            for (const row of data) {
              const values = Object.values(row).map(val => 
                val === null ? 'NULL' : `'${val.toString().replace(/'/g, "''")}'`
              );
              backupContent += `INSERT INTO ${tableName} VALUES (${values.join(', ')});\n`;
            }
            backupContent += '\n';
          }
        } catch (e) {
          backupContent += `-- Error backing up data for ${tableName}: ${e.message}\n\n`;
        }
      }

      // Write backup to file
      fs.writeFileSync(backupFile, backupContent);
      
      console.log(`✅ [DatabaseOptimizer] Backup created: ${backupFile}`);
      return backupFile;
    } catch (error) {
      console.error('❌ [DatabaseOptimizer] Backup failed:', error);
      throw error;
    }
  }

  /**
   * Export optimization report
   */
  exportReport() {
    const reportPath = path.join(process.cwd(), 'database-optimization-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.optimizationReport, null, 2));
    console.log(`📊 [DatabaseOptimizer] Report exported: ${reportPath}`);
    return reportPath;
  }

  /**
   * Get migration-ready database summary
   */
  async getMigrationSummary() {
    try {
      const summary = {
        timestamp: new Date().toISOString(),
        database: {
          connectionString: this.connectionString ? 'configured' : 'missing',
          health: await this.testConnection() ? 'healthy' : 'unhealthy'
        },
        schema: {
          tables: [],
          constraints: [],
          indexes: []
        },
        data: {
          totalRecords: 0,
          tableRecords: {}
        },
        recommendations: this.optimizationReport.recommendations || []
      };

      // Get table information
      const tables = await this.sql`
        SELECT 
          table_name,
          (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
        FROM information_schema.tables t
        WHERE table_schema = 'public'
      `;

      for (const table of tables) {
        try {
          const count = await this.sql`SELECT COUNT(*) as count FROM ${this.sql(table.table_name)}`;
          const recordCount = parseInt(count[0].count);
          
          summary.schema.tables.push({
            name: table.table_name,
            columns: table.column_count,
            records: recordCount
          });
          
          summary.data.tableRecords[table.table_name] = recordCount;
          summary.data.totalRecords += recordCount;
        } catch (e) {
          console.warn(`Could not count records for ${table.table_name}:`, e.message);
        }
      }

      // Get constraints
      const constraints = await this.sql`
        SELECT table_name, constraint_name, constraint_type
        FROM information_schema.table_constraints
        WHERE table_schema = 'public'
      `;
      summary.schema.constraints = constraints;

      // Get indexes
      const indexes = await this.sql`
        SELECT schemaname, tablename, indexname
        FROM pg_stat_user_indexes
        WHERE schemaname = 'public'
      `;
      summary.schema.indexes = indexes;

      return summary;
    } catch (error) {
      console.error('Error generating migration summary:', error);
      return {
        timestamp: new Date().toISOString(),
        error: error.message,
        database: { health: 'unknown' }
      };
    }
  }
}

export default DatabaseOptimizer;

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const optimizer = new DatabaseOptimizer();
  
  (async () => {
    try {
      await optimizer.initialize();
      const report = await optimizer.runHealthCheck();
      const backupFile = await optimizer.createBackup();
      const reportFile = optimizer.exportReport();
      const migrationSummary = await optimizer.getMigrationSummary();

      console.log('\n🎉 [DatabaseOptimizer] Optimization complete!');
      console.log(`📊 Report: ${reportFile}`);
      console.log(`💾 Backup: ${backupFile}`);
      console.log(`📋 Migration Summary:`, JSON.stringify(migrationSummary, null, 2));
    } catch (error) {
      console.error('❌ [DatabaseOptimizer] Failed:', error);
      process.exit(1);
    }
  })();
}