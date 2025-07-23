/**
 * API ROUTES FOR OTTERSPORT
 * 
 * This file defines all the HTTP endpoints for the application.
 * Routes are organized by feature: auth, users, exercises, decks, workouts, achievements.
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./db";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertDeckSchema, insertWorkoutSchema, insertExerciseSchema, insertDeckExerciseSchema } from "@shared/schema";
import { z } from "zod";
import { registerTestRoutes } from "./api-test-routes";
import { registerDevelopmentRoutes } from "./development-tools";
import { databaseOptimizer } from "./database-optimizer";
import { migrationTools } from "./migration-tools";
import { gamificationRouter } from "./gamification-routes";
import { processWorkoutCompletion } from "./gamification";
import { 
  calculateCardScore, 
  updateScoringState, 
  createInitialScoringState,
  determineGamePhase,
  type WarmupScoringState,
  type ScoringResult 
} from "./warmup-scoring";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication middleware
  await setupAuth(app);
  
  // Register test routes (development only)
  registerTestRoutes(app);
  
  // Register development monitoring tools
  registerDevelopmentRoutes(app);
  
  // Register migration and optimization tools
  registerMigrationRoutes(app);
  
  // Register code optimization and testing routes
  registerOptimizationRoutes(app);

  // Register gamification routes
  app.use('/api/gamification', gamificationRouter);

  // ============================================================================
  // AUTH ROUTES
  // ============================================================================
  
  /**
   * GET /api/auth/user
   * Returns the current authenticated user's data
   */
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // If user is authenticated, return user data
      if (req.user && req.user.claims && req.user.claims.sub) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        res.json(user);
      } else {
        // Return anonymous user data for non-authenticated users
        res.json({
          id: 'anonymous',
          email: 'anonymous@ottersport.com',
          name: 'Anonymous User',
          isAnonymous: true
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ============================================================================
  // USER ROUTES
  // ============================================================================
  
  /**
   * PATCH /api/user/profile
   * Updates user profile information (fitness goals, preferences, etc.)
   */
  app.patch('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = req.body;
      const user = await storage.updateUserProgress(userId, updates);
      res.json(user);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  /**
   * GET /api/user/stats
   * Returns user fitness statistics (workouts, streaks, etc.)
   */
  app.get('/api/user/stats', async (req: any, res) => {
    try {
      // Return anonymous stats for non-authenticated users
      if (!req.user || !req.user.claims || !req.user.claims.sub) {
        res.json({
          totalWorkouts: 0,
          currentStreak: 0,
          achievements: 0,
          isAnonymous: true
        });
        return;
      }
      
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // ============================================================================
  // EXERCISE ROUTES
  // ============================================================================
  
  /**
   * GET /api/exercises
   * Returns all exercises, optionally filtered by category
   * Query params: category (optional) - filter by exercise category
   */
  app.get('/api/exercises', async (req, res) => {
    try {
      const category = req.query.category as string;
      const exercises = category 
        ? await storage.getExercisesByCategory(category)
        : await storage.getExercises();
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  /**
   * POST /api/exercises
   * Creates a new exercise (authenticated users only)
   */
  app.post('/api/exercises', isAuthenticated, async (req: any, res) => {
    try {
      const exerciseData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(exerciseData);
      res.json(exercise);
    } catch (error) {
      console.error("Error creating exercise:", error);
      res.status(500).json({ message: "Failed to create exercise" });
    }
  });

  // Deck routes
  app.get('/api/decks', async (req, res) => {
    try {
      const decks = await storage.getDecks();
      res.json(decks);
    } catch (error) {
      console.error("Error fetching decks:", error);
      res.status(500).json({ message: "Failed to fetch decks" });
    }
  });

  app.get('/api/decks/:id', async (req, res) => {
    try {
      const deckId = parseInt(req.params.id);
      const deck = await storage.getDeckWithExercises(deckId);
      if (!deck) {
        return res.status(404).json({ message: "Deck not found" });
      }
      res.json(deck);
    } catch (error) {
      console.error("Error fetching deck:", error);
      res.status(500).json({ message: "Failed to fetch deck" });
    }
  });

  app.post('/api/decks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deckData = insertDeckSchema.parse({
        ...req.body,
        createdBy: userId,
        isCustom: true,
      });
      const deck = await storage.createDeck(deckData);
      res.json(deck);
    } catch (error) {
      console.error("Error creating deck:", error);
      res.status(500).json({ message: "Failed to create deck" });
    }
  });

  app.post('/api/decks/:id/exercises', isAuthenticated, async (req: any, res) => {
    try {
      const deckId = parseInt(req.params.id);
      const deckExerciseData = insertDeckExerciseSchema.parse({
        ...req.body,
        deckId,
      });
      const deckExercise = await storage.addExerciseToDeck(deckExerciseData);
      res.json(deckExercise);
    } catch (error) {
      console.error("Error adding exercise to deck:", error);
      res.status(500).json({ message: "Failed to add exercise to deck" });
    }
  });

  app.get('/api/user/decks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const decks = await storage.getUserCustomDecks(userId);
      res.json(decks);
    } catch (error) {
      console.error("Error fetching user decks:", error);
      res.status(500).json({ message: "Failed to fetch user decks" });
    }
  });

  // Workout routes
  app.post('/api/workouts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workoutData = insertWorkoutSchema.parse({
        ...req.body,
        userId,
        startedAt: new Date(),
      });
      const workout = await storage.createWorkout(workoutData);
      res.json(workout);
    } catch (error) {
      console.error("Error creating workout:", error);
      res.status(500).json({ message: "Failed to create workout" });
    }
  });

  app.patch('/api/workouts/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const workoutId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const { feedback, duration, calories } = req.body;
      
      if (!feedback || typeof duration !== 'number') {
        return res.status(400).json({ message: "Feedback and duration are required" });
      }

      // Complete the workout in storage
      const workout = await storage.completeWorkout(workoutId, feedback, duration, calories);
      
      // Process gamification rewards
      const gamificationResponse = await processWorkoutCompletion(workoutId, userId);
      
      res.json({
        workout,
        gamification: gamificationResponse,
      });
    } catch (error) {
      console.error("Error completing workout:", error);
      res.status(500).json({ message: "Failed to complete workout" });
    }
  });

  app.get('/api/user/workouts', async (req: any, res) => {
    try {
      // Return empty workouts for anonymous users
      if (!req.user || !req.user.claims || !req.user.claims.sub) {
        res.json([]);
        return;
      }
      
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const workouts = await storage.getUserWorkouts(userId, limit);
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching user workouts:", error);
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  // ============================================================================
  // CARD BATTLE & WARMUP SCORING ROUTES
  // ============================================================================
  
  /**
   * POST /api/card-battle/score
   * Calculate score for a played card with warmup combo logic
   */
  app.post('/api/card-battle/score', async (req: any, res) => {
    try {
      const { cardName, cardType, cardCategory, difficulty, scoringState } = req.body;
      
      // Calculate points using warmup scoring system
      const result = calculateCardScore(
        cardName,
        cardType,
        cardCategory, 
        difficulty,
        scoringState
      );
      
      res.json(result);
    } catch (error) {
      console.error("Error calculating card score:", error);
      res.status(500).json({ message: "Failed to calculate card score" });
    }
  });

  /**
   * POST /api/card-battle/update-state
   * Update game scoring state after playing a card
   */
  app.post('/api/card-battle/update-state', async (req: any, res) => {
    try {
      const { currentState, playedCard, deckSize } = req.body;
      
      // Update scoring state with warmup logic
      const newState = updateScoringState(currentState, playedCard, deckSize);
      
      res.json(newState);
    } catch (error) {
      console.error("Error updating scoring state:", error);
      res.status(500).json({ message: "Failed to update scoring state" });
    }
  });

  /**
   * GET /api/card-battle/initial-state
   * Get initial scoring state for new game
   */
  app.get('/api/card-battle/initial-state', async (req: any, res) => {
    try {
      const initialState = createInitialScoringState();
      res.json(initialState);
    } catch (error) {
      console.error("Error creating initial state:", error);
      res.status(500).json({ message: "Failed to create initial state" });
    }
  });

  // Achievement routes
  app.get('/api/achievements', async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get('/api/user/achievements', async (req: any, res) => {
    try {
      // Return empty achievements for anonymous users
      if (!req.user || !req.user.claims || !req.user.claims.sub) {
        res.json([]);
        return;
      }
      
      const userId = req.user.claims.sub;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Initialize data route
  app.post('/api/init-data', async (req, res) => {
    try {
      // Create default exercises
      const defaultExercises = [
        { name: "Jumping Jacks", category: "cardio", difficulty: 1.0, defaultReps: 20, instructions: "Jump with feet apart while raising arms overhead, then return to starting position.", icon: "fas fa-running" },
        { name: "Push-ups", category: "strength", difficulty: 1.2, defaultReps: 10, instructions: "Start in plank position, lower chest to ground, then push back up.", icon: "fas fa-dumbbell" },
        { name: "Squats", category: "strength", difficulty: 1.0, defaultReps: 15, instructions: "Stand with feet shoulder-width apart, lower hips back and down, then stand up.", icon: "fas fa-arrows-alt-v" },
        { name: "Plank", category: "strength", difficulty: 1.1, defaultDuration: 30, instructions: "Hold a straight line from head to heels in push-up position.", icon: "fas fa-minus" },
        { name: "Mountain Climbers", category: "cardio", difficulty: 1.3, defaultReps: 20, instructions: "In plank position, alternate bringing knees to chest rapidly.", icon: "fas fa-mountain" },
        { name: "Burpees", category: "mixed", difficulty: 1.8, defaultReps: 5, instructions: "Squat down, jump back to plank, do push-up, jump feet forward, then jump up.", icon: "fas fa-fire" },
        { name: "Lunges", category: "strength", difficulty: 1.1, defaultReps: 12, instructions: "Step forward and lower hips until both knees are at 90 degrees.", icon: "fas fa-walking" },
        { name: "High Knees", category: "cardio", difficulty: 0.9, defaultReps: 20, instructions: "Run in place bringing knees up to hip level.", icon: "fas fa-running" },
      ];

      for (const exerciseData of defaultExercises) {
        await storage.createExercise(exerciseData);
      }

      // Create default decks
      const cardioBlast = await storage.createDeck({
        name: "Cardio Blast",
        description: "Quick cardio workout to get your heart pumping",
        category: "cardio",
        difficulty: 1.0,
        estimatedMinutes: 15,
        isCustom: false,
      });

      const strengthBuilder = await storage.createDeck({
        name: "Strength Builder",
        description: "Build muscle with bodyweight exercises",
        category: "strength",
        difficulty: 1.2,
        estimatedMinutes: 20,
        isCustom: false,
      });

      const quickStart = await storage.createDeck({
        name: "Quick Start",
        description: "Perfect for beginners - easy and effective",
        category: "mixed",
        difficulty: 0.8,
        estimatedMinutes: 10,
        isCustom: false,
      });

      // Add exercises to decks (simplified for brevity)
      const exercises = await storage.getExercises();
      const jumpingJacks = exercises.find(e => e.name === "Jumping Jacks");
      const pushUps = exercises.find(e => e.name === "Push-ups");
      const squats = exercises.find(e => e.name === "Squats");
      const plank = exercises.find(e => e.name === "Plank");

      if (jumpingJacks && pushUps && squats && plank) {
        // Cardio Blast deck
        await storage.addExerciseToDeck({ deckId: cardioBlast.id, exerciseId: jumpingJacks.id, order: 1 });
        await storage.addExerciseToDeck({ deckId: cardioBlast.id, exerciseId: squats.id, order: 2 });
        
        // Quick Start deck  
        await storage.addExerciseToDeck({ deckId: quickStart.id, exerciseId: jumpingJacks.id, order: 1, customReps: 10 });
        await storage.addExerciseToDeck({ deckId: quickStart.id, exerciseId: pushUps.id, order: 2, customReps: 5 });
        await storage.addExerciseToDeck({ deckId: quickStart.id, exerciseId: squats.id, order: 3, customReps: 10 });
        await storage.addExerciseToDeck({ deckId: quickStart.id, exerciseId: plank.id, order: 4, customDuration: 20 });
      }

      res.json({ message: "Data initialized successfully" });
    } catch (error) {
      console.error("Error initializing data:", error);
      res.status(500).json({ message: "Failed to initialize data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

/**
 * REGISTER MIGRATION & OPTIMIZATION ROUTES
 * Provides comprehensive database migration and optimization endpoints
 */
function registerMigrationRoutes(app: Express): void {
  console.log("[Migration] Registering migration and optimization routes...");

  // Database health check
  app.get('/api/migration/health', async (req, res) => {
    try {
      const health = await databaseOptimizer.performHealthCheck();
      res.json(health);
    } catch (error) {
      res.status(500).json({ error: "Health check failed", details: error });
    }
  });

  // Database optimization
  app.post('/api/migration/optimize', async (req, res) => {
    try {
      const optimization = await databaseOptimizer.optimizeDatabase();
      res.json(optimization);
    } catch (error) {
      res.status(500).json({ error: "Optimization failed", details: error });
    }
  });

  // Export schema
  app.get('/api/migration/export-schema', async (req, res) => {
    try {
      const schema = await databaseOptimizer.exportSchema();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=ottersport-schema.json');
      res.send(schema);
    } catch (error) {
      res.status(500).json({ error: "Schema export failed", details: error });
    }
  });

  // Generate migration scripts
  app.get('/api/migration/scripts', async (req, res) => {
    try {
      const scripts = await migrationTools.generatePlatformScripts();
      res.json(scripts);
    } catch (error) {
      res.status(500).json({ error: "Script generation failed", details: error });
    }
  });

  // Full backup
  app.get('/api/migration/backup', async (req, res) => {
    try {
      const backup = await migrationTools.createFullBackup();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=ottersport-backup.json');
      res.json(backup);
    } catch (error) {
      res.status(500).json({ error: "Backup failed", details: error });
    }
  });

  // Migration validation
  app.get('/api/migration/validate', async (req, res) => {
    try {
      const validation = await migrationTools.validateMigrationReadiness();
      res.json(validation);
    } catch (error) {
      res.status(500).json({ error: "Validation failed", details: error });
    }
  });

  // Test migration
  app.post('/api/migration/test', async (req, res) => {
    try {
      const test = await migrationTools.testMigration();
      res.json(test);
    } catch (error) {
      res.status(500).json({ error: "Migration test failed", details: error });
    }
  });

  // Platform compatibility check
  app.get('/api/migration/compatibility', async (req, res) => {
    try {
      const compatibility = await databaseOptimizer.validateMigrationCompatibility();
      res.json(compatibility);
    } catch (error) {
      res.status(500).json({ error: "Compatibility check failed", details: error });
    }
  });

  console.log("[Migration] Migration routes registered successfully");
}

/**
 * REGISTER CODE OPTIMIZATION & TESTING ROUTES
 * Provides comprehensive code optimization and testing endpoints
 */
function registerOptimizationRoutes(app: Express): void {
  console.log("[Optimization] Registering code optimization routes...");

  // Run comprehensive optimization suite
  app.get('/api/optimization/suite', async (req, res) => {
    try {
      const { codeOptimizationTester } = await import("./code-optimization-tester");
      const results = await codeOptimizationTester.runOptimizationSuite();
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Optimization suite failed", details: error });
    }
  });

  // Code quality analysis
  app.get('/api/optimization/code-quality', async (req, res) => {
    try {
      const { codeOptimizationTester } = await import("./code-optimization-tester");
      const results = await codeOptimizationTester.runOptimizationSuite();
      res.json(results.codeQuality);
    } catch (error) {
      res.status(500).json({ error: "Code quality analysis failed", details: error });
    }
  });

  // Performance benchmarks
  app.get('/api/optimization/performance', async (req, res) => {
    try {
      const { codeOptimizationTester } = await import("./code-optimization-tester");
      const results = await codeOptimizationTester.runOptimizationSuite();
      res.json(results.performance);
    } catch (error) {
      res.status(500).json({ error: "Performance benchmarking failed", details: error });
    }
  });

  // Functionality tests
  app.get('/api/optimization/functionality', async (req, res) => {
    try {
      const { codeOptimizationTester } = await import("./code-optimization-tester");
      const results = await codeOptimizationTester.runOptimizationSuite();
      res.json(results.functionality);
    } catch (error) {
      res.status(500).json({ error: "Functionality testing failed", details: error });
    }
  });

  // Security analysis
  app.get('/api/optimization/security', async (req, res) => {
    try {
      const { codeOptimizationTester } = await import("./code-optimization-tester");
      const results = await codeOptimizationTester.runOptimizationSuite();
      res.json(results.security);
    } catch (error) {
      res.status(500).json({ error: "Security analysis failed", details: error });
    }
  });

  console.log("[Optimization] Code optimization routes registered successfully");
}
