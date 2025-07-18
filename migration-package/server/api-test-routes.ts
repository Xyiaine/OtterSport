/**
 * API TESTING ROUTES
 * 
 * These routes provide comprehensive testing endpoints for the OtterSport API.
 * Use these to validate all functionality and performance.
 */

import type { Express } from "express";
import { runComprehensiveTests } from "./test-suite";
import { storage } from "./storage";

/**
 * Register testing routes
 */
export function registerTestRoutes(app: Express): void {
  // Only enable in development
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  
  console.log("[API] Registering test routes...");
  
  /**
   * GET /api/test/comprehensive
   * Runs the complete test suite
   */
  app.get('/api/test/comprehensive', async (req, res) => {
    try {
      console.log("🧪 Starting comprehensive test suite...");
      const results = await runComprehensiveTests();
      
      res.json({
        success: true,
        message: "Comprehensive test suite completed",
        results,
      });
    } catch (error) {
      console.error("Test suite failed:", error);
      res.status(500).json({
        success: false,
        message: "Test suite failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * GET /api/test/storage-stats
   * Get current storage statistics
   */
  app.get('/api/test/storage-stats', async (req, res) => {
    try {
      const stats = await storage.getStorageStats();
      const memoryUsage = process.memoryUsage();
      
      res.json({
        success: true,
        storageStats: stats,
        memoryUsage: {
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          external: Math.round(memoryUsage.external / 1024 / 1024),
          rss: Math.round(memoryUsage.rss / 1024 / 1024),
        },
        uptime: process.uptime(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * POST /api/test/reset-storage
   * Reset storage to default state (development only)
   */
  app.post('/api/test/reset-storage', async (req, res) => {
    try {
      await storage.clearAllData();
      
      res.json({
        success: true,
        message: "Storage reset successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * GET /api/test/health
   * Simple health check endpoint
   */
  app.get('/api/test/health', (req, res) => {
    res.json({
      success: true,
      message: "OtterSport API is healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      nodeVersion: process.version,
    });
  });
  
  /**
   * GET /api/test/load-test
   * Perform a simple load test
   */
  app.get('/api/test/load-test', async (req, res) => {
    try {
      const iterations = parseInt(req.query.iterations as string) || 100;
      const startTime = Date.now();
      
      console.log(`🔄 Starting load test with ${iterations} iterations...`);
      
      const promises = [];
      for (let i = 0; i < iterations; i++) {
        promises.push(storage.getExercises());
      }
      
      await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      res.json({
        success: true,
        message: `Load test completed`,
        iterations,
        duration,
        averageTime: duration / iterations,
        requestsPerSecond: Math.round((iterations / duration) * 1000),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  console.log("[API] Test routes registered successfully");
}