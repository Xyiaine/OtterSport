/**
 * DEVELOPMENT TOOLS AND MONITORING
 * 
 * This file provides comprehensive development tools for monitoring,
 * debugging, and maintaining the OtterSport application.
 */

import { storage } from "./storage";
import { db } from "./db";
import { sql } from "drizzle-orm";
import type { Express } from "express";

/**
 * SYSTEM HEALTH MONITORING
 */
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  timestamp: Date;
  uptime: number;
  memory: {
    used: number;
    total: number;
    external: number;
    rss: number;
  };
  database: {
    connected: boolean;
    responseTime: number;
    stats: {
      users: number;
      exercises: number;
      decks: number;
      workouts: number;
      achievements: number;
    };
  };
  performance: {
    averageResponseTime: number;
    requestsPerSecond: number;
    errors: number;
  };
}

/**
 * PERFORMANCE MONITORING
 */
class PerformanceMonitor {
  private requestTimes: number[] = [];
  private requestCount = 0;
  private errorCount = 0;
  private startTime = Date.now();
  
  recordRequest(duration: number): void {
    this.requestTimes.push(duration);
    this.requestCount++;
    
    // Keep only last 100 requests for moving average
    if (this.requestTimes.length > 100) {
      this.requestTimes.shift();
    }
  }
  
  recordError(): void {
    this.errorCount++;
  }
  
  getStats(): {
    averageResponseTime: number;
    requestsPerSecond: number;
    errors: number;
  } {
    const averageResponseTime = this.requestTimes.length > 0
      ? this.requestTimes.reduce((sum, time) => sum + time, 0) / this.requestTimes.length
      : 0;
    
    const uptimeSeconds = (Date.now() - this.startTime) / 1000;
    const requestsPerSecond = uptimeSeconds > 0 ? this.requestCount / uptimeSeconds : 0;
    
    return {
      averageResponseTime: Number(averageResponseTime.toFixed(2)),
      requestsPerSecond: Number(requestsPerSecond.toFixed(2)),
      errors: this.errorCount,
    };
  }
}

const performanceMonitor = new PerformanceMonitor();

/**
 * HEALTH CHECK FUNCTION
 */
export async function checkSystemHealth(): Promise<SystemHealth> {
  const startTime = Date.now();
  
  try {
    // Test database connectivity
    const dbStart = Date.now();
    const stats = await storage.getStorageStats();
    const dbResponseTime = Date.now() - dbStart;
    
    // Get memory usage
    const memoryUsage = process.memoryUsage();
    
    // Get performance stats
    const performanceStats = performanceMonitor.getStats();
    
    return {
      status: 'healthy',
      timestamp: new Date(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
      },
      database: {
        connected: true,
        responseTime: dbResponseTime,
        stats,
      },
      performance: performanceStats,
    };
  } catch (error) {
    return {
      status: 'error',
      timestamp: new Date(),
      uptime: process.uptime(),
      memory: {
        used: 0,
        total: 0,
        external: 0,
        rss: 0,
      },
      database: {
        connected: false,
        responseTime: -1,
        stats: {
          users: 0,
          exercises: 0,
          decks: 0,
          workouts: 0,
          achievements: 0,
        },
      },
      performance: {
        averageResponseTime: -1,
        requestsPerSecond: -1,
        errors: -1,
      },
    };
  }
}

/**
 * DATABASE ANALYTICS
 */
export class DatabaseAnalytics {
  /**
   * Get comprehensive database statistics
   */
  async getAnalytics(): Promise<{
    overview: {
      totalUsers: number;
      totalExercises: number;
      totalDecks: number;
      totalWorkouts: number;
      totalAchievements: number;
    };
    userActivity: {
      activeUsers: number;
      totalWorkoutsCompleted: number;
      averageWorkoutsPerUser: number;
      topUsers: Array<{
        userId: string;
        workoutCount: number;
        currentStreak: number;
      }>;
    };
    workoutStats: {
      mostPopularDecks: Array<{
        deckName: string;
        workoutCount: number;
      }>;
      averageWorkoutDuration: number;
      feedbackDistribution: {
        tooEasy: number;
        justRight: number;
        tooHard: number;
        wayTooHard: number;
      };
    };
    exerciseStats: {
      exercisesByCategory: {
        cardio: number;
        strength: number;
        flexibility: number;
        mixed: number;
      };
      averageDifficulty: number;
    };
  }> {
    const stats = await storage.getStorageStats();
    
    // This is a simplified version - in a real database, we'd use more complex queries
    return {
      overview: {
        totalUsers: stats.users,
        totalExercises: stats.exercises,
        totalDecks: stats.decks,
        totalWorkouts: stats.workouts,
        totalAchievements: stats.achievements,
      },
      userActivity: {
        activeUsers: stats.users,
        totalWorkoutsCompleted: stats.workouts,
        averageWorkoutsPerUser: stats.users > 0 ? stats.workouts / stats.users : 0,
        topUsers: [], // Would require more complex queries
      },
      workoutStats: {
        mostPopularDecks: [], // Would require more complex queries
        averageWorkoutDuration: 0, // Would require more complex queries
        feedbackDistribution: {
          tooEasy: 0,
          justRight: 0,
          tooHard: 0,
          wayTooHard: 0,
        },
      },
      exerciseStats: {
        exercisesByCategory: {
          cardio: 0,
          strength: 0,
          flexibility: 0,
          mixed: 0,
        },
        averageDifficulty: 0,
      },
    };
  }
}

/**
 * DEBUGGING UTILITIES
 */
export class DebugTools {
  /**
   * Log detailed information about a user
   */
  async debugUser(userId: string): Promise<any> {
    try {
      const user = await storage.getUser(userId);
      const workouts = await storage.getUserWorkouts(userId, 50);
      const stats = await storage.getUserStats(userId);
      const achievements = await storage.getUserAchievements(userId);
      const customDecks = await storage.getUserCustomDecks(userId);
      
      return {
        user,
        workouts,
        stats,
        achievements,
        customDecks,
        summary: {
          totalWorkouts: workouts.length,
          completedWorkouts: workouts.filter(w => w.completedAt).length,
          totalAchievements: achievements.length,
          customDecks: customDecks.length,
        },
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error),
        userId,
      };
    }
  }
  
  /**
   * Analyze deck performance
   */
  async debugDeck(deckId: number): Promise<any> {
    try {
      const deck = await storage.getDeckWithExercises(deckId);
      
      return {
        deck,
        summary: {
          exerciseCount: deck?.exercises.length || 0,
          estimatedTime: deck?.estimatedMinutes || 0,
          difficulty: deck?.difficulty || 0,
        },
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error),
        deckId,
      };
    }
  }
  
  /**
   * Test storage performance
   */
  async performanceTest(iterations = 100): Promise<{
    iterations: number;
    totalTime: number;
    averageTime: number;
    operationsPerSecond: number;
    results: Array<{
      operation: string;
      duration: number;
      success: boolean;
    }>;
  }> {
    const results: Array<{
      operation: string;
      duration: number;
      success: boolean;
    }> = [];
    
    const startTime = Date.now();
    
    for (let i = 0; i < iterations; i++) {
      // Test getting exercises
      const exerciseStart = Date.now();
      try {
        await storage.getExercises();
        results.push({
          operation: 'getExercises',
          duration: Date.now() - exerciseStart,
          success: true,
        });
      } catch (error) {
        results.push({
          operation: 'getExercises',
          duration: Date.now() - exerciseStart,
          success: false,
        });
      }
      
      // Test getting decks
      const deckStart = Date.now();
      try {
        await storage.getDecks();
        results.push({
          operation: 'getDecks',
          duration: Date.now() - deckStart,
          success: true,
        });
      } catch (error) {
        results.push({
          operation: 'getDecks',
          duration: Date.now() - deckStart,
          success: false,
        });
      }
    }
    
    const totalTime = Date.now() - startTime;
    const averageTime = totalTime / (iterations * 2); // 2 operations per iteration
    const operationsPerSecond = ((iterations * 2) / totalTime) * 1000;
    
    return {
      iterations,
      totalTime,
      averageTime,
      operationsPerSecond,
      results,
    };
  }
}

/**
 * REGISTER DEVELOPMENT ROUTES
 */
export function registerDevelopmentRoutes(app: Express): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  
  const analytics = new DatabaseAnalytics();
  const debugTools = new DebugTools();
  
  console.log("[DevTools] Registering development routes...");
  
  /**
   * GET /api/dev/health
   * System health check
   */
  app.get('/api/dev/health', async (req, res) => {
    try {
      const health = await checkSystemHealth();
      res.json(health);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * GET /api/dev/analytics
   * Database analytics
   */
  app.get('/api/dev/analytics', async (req, res) => {
    try {
      const analyticsData = await analytics.getAnalytics();
      res.json(analyticsData);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * GET /api/dev/debug/user/:userId
   * Debug user information
   */
  app.get('/api/dev/debug/user/:userId', async (req, res) => {
    try {
      const userInfo = await debugTools.debugUser(req.params.userId);
      res.json(userInfo);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * GET /api/dev/debug/deck/:deckId
   * Debug deck information
   */
  app.get('/api/dev/debug/deck/:deckId', async (req, res) => {
    try {
      const deckInfo = await debugTools.debugDeck(parseInt(req.params.deckId));
      res.json(deckInfo);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * GET /api/dev/performance
   * Performance testing
   */
  app.get('/api/dev/performance', async (req, res) => {
    try {
      const iterations = parseInt(req.query.iterations as string) || 100;
      const performanceData = await debugTools.performanceTest(iterations);
      res.json(performanceData);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * POST /api/dev/seed
   * Reseed database
   */
  app.post('/api/dev/seed', async (req, res) => {
    try {
      // Import and run seed function
      const { seedDatabase } = await import('./seed-data');
      await seedDatabase();
      
      res.json({
        success: true,
        message: 'Database seeded successfully',
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * Middleware to track request performance
   */
  app.use((req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      performanceMonitor.recordRequest(duration);
      
      if (res.statusCode >= 400) {
        performanceMonitor.recordError();
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
      }
    });
    
    next();
  });
  
  console.log("[DevTools] Development routes registered successfully");
}

/**
 * EXPORT PERFORMANCE MONITOR
 */
export { performanceMonitor };