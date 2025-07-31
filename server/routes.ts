/**
 * OTTERSPORT API ROUTES - CLEAN & OPTIMIZED VERSION
 * 
 * Simplified, clean API routes with core functionality only.
 * Removed all redundant/broken imports and optimization endpoints.
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./db";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertDeckSchema, insertWorkoutSchema, insertExerciseSchema, insertDeckExerciseSchema } from "@shared/schema";
import { z } from "zod";
import { setupTotalHealthRoutes } from "./total-health-system";

/**
 * Handles registerroutes functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await registerRoutes(params);
 */
/**
 * Handles registerroutes functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await registerRoutes(params);
 */
/**
 * Handles registerroutes functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await registerRoutes(params);
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication middleware
  await setupAuth(app);
  
  // Simple admin status endpoint
  app.get("/api/admin/status", (req, res) => {
    res.json({ isAdmin: false, adminLogin: null });
  });

  // Register Total Health System routes
  setupTotalHealthRoutes(app);

  // Health endpoint
  app.get('/api/health', (req, res) => {                    
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });
  
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
   * Supports both authenticated and anonymous users during onboarding
   */
  app.patch('/api/user/profile', async (req: any, res) => {
    try {
      let userId = 'anonymous';
      
      // Use authenticated user ID if available, otherwise use anonymous
      if (req.user && req.user.claims && req.user.claims.sub) {
        userId = req.user.claims.sub;
      }
      
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
   * Returns user workout statistics (streak, total workouts, achievements)
   */
  app.get('/api/user/stats', async (req: any, res) => {
    try {
      let userId = 'anonymous';
      if (req.user && req.user.claims && req.user.claims.sub) {
        userId = req.user.claims.sub;
      }
      
      const stats = await storage.getUserStats(userId);
      res.json({ ...stats, isAnonymous: userId === 'anonymous' });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // ============================================================================
  // EXERCISE ROUTES
  // ============================================================================

  /**
   * GET /api/exercises
   * Returns all available exercises
   */
  app.get('/api/exercises', async (req, res) => {
    try {
      const exercises = await storage.getExercises();
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  /**
   * GET /api/exercises/category/:category
   * Returns exercises filtered by category
   */
  app.get('/api/exercises/category/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const exercises = await storage.getExercisesByCategory(category);
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercises by category:", error);
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  /**
   * POST /api/exercises
   * Creates a new exercise (admin only)
   */
  app.post('/api/exercises', async (req, res) => {
    try {
      const exerciseData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(exerciseData);
      res.status(201).json(exercise);
    } catch (error) {
      console.error("Error creating exercise:", error);
      res.status(500).json({ message: "Failed to create exercise" });
    }
  });

  // ============================================================================
  // DECK ROUTES
  // ============================================================================

  /**
   * GET /api/decks
   * Returns all available workout decks
   */
  app.get('/api/decks', async (req, res) => {
    try {
      const decks = await storage.getDecks();
      res.json(decks);
    } catch (error) {
      console.error("Error fetching decks:", error);
      res.status(500).json({ message: "Failed to fetch decks" });
    }
  });

  /**
   * GET /api/decks/:id
   * Returns a specific deck with its exercises
   */
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

  /**
   * POST /api/decks
   * Creates a new workout deck
   */
  app.post('/api/decks', isAuthenticated, async (req: any, res) => {
    try {
      const deckData = insertDeckSchema.parse(req.body);
      const userId = req.user.claims.sub;
      
      const deck = await storage.createDeck({
        ...deckData,
        createdBy: userId,
        isCustom: true
      });
      
      res.status(201).json(deck);
    } catch (error) {
      console.error("Error creating deck:", error);
      res.status(500).json({ message: "Failed to create deck" });
    }
  });

  // ============================================================================
  // WORKOUT ROUTES
  // ============================================================================

  /**
   * POST /api/workouts
   * Creates a new workout session
   */
  app.post('/api/workouts', async (req: any, res) => {
    try {
      const workoutData = insertWorkoutSchema.parse(req.body);
      let userId = 'anonymous';
      
      if (req.user && req.user.claims && req.user.claims.sub) {
        userId = req.user.claims.sub;
      }
      
      const workout = await storage.createWorkout({
        ...workoutData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      res.status(201).json(workout);
    } catch (error) {
      console.error("Error creating workout:", error);
      res.status(500).json({ message: "Failed to create workout" });
    }
  });

  /**
   * PATCH /api/workouts/:id/complete
   * Marks a workout as completed with feedback
   */
  app.patch('/api/workouts/:id/complete', async (req, res) => {
    try {
      const workoutId = parseInt(req.params.id);
      const { feedback, duration, calories } = req.body;
      
      const workout = await storage.completeWorkout(workoutId, feedback, duration, calories);
      
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      res.json(workout);
    } catch (error) {
      console.error("Error completing workout:", error);
      res.status(500).json({ message: "Failed to complete workout" });
    }
  });

  // ============================================================================
  // ACHIEVEMENT ROUTES
  // ============================================================================

  /**
   * GET /api/achievements
   * Returns all available achievements
   */
  app.get('/api/achievements', async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  /**
   * GET /api/user/achievements
   * Returns user's unlocked achievements
   */
  app.get('/api/user/achievements', async (req: any, res) => {
    try {
      let userId = 'anonymous';
      if (req.user && req.user.claims && req.user.claims.sub) {
        userId = req.user.claims.sub;
      }
      
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}