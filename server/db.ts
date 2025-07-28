/**
 * OTTERSPORT DATABASE CONNECTION & STORAGE LAYER
 * 
 * Configures database connections and storage implementations for OtterSport.
 * Supports both PostgreSQL (production) and in-memory storage (development).
 * 
 * Architecture:
 * - PostgreSQL via Neon serverless for production deployments
 * - In-memory storage for development and testing
 * - Drizzle ORM for type-safe database operations
 * - Connection pooling for serverless environments
 * 
 * Environment Variables:
 * - DATABASE_URL: PostgreSQL connection string (optional)
 * - If not provided, uses in-memory storage with seeded data
 * 
 * Storage Features:
 * - User management with OAuth integration
 * - Exercise library and workout deck management
 * - Progress tracking and gamification data
 * - Achievement system and leaderboards
 * - Session management for authentication
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '@shared/schema';
import { MemoryStorage } from './storage';

/**
 * DATABASE CONNECTION INITIALIZATION
 * 
 * Determines storage backend based on environment configuration.
 * Gracefully falls back to in-memory storage if database connection fails.
 */
let db: any = null;
let pool: any = null;

// Initialize PostgreSQL connection if DATABASE_URL is available
if (process.env.DATABASE_URL) {
  console.log('[DatabaseStorage] Initializing PostgreSQL storage with Drizzle ORM...');
  try {
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema });
    console.log('[DatabaseStorage] PostgreSQL connection established via Neon');
  } catch (error) {
    console.error('[DatabaseStorage] Failed to connect to PostgreSQL:', error);
    console.log('[DatabaseStorage] Falling back to in-memory storage');
    db = null;
  }
} else {
  console.log('Using in-memory storage - data will reset on server restart');
}

/**
 * STORAGE LAYER FACTORY
 * 
 * Creates appropriate storage instance based on database availability:
 * - DatabaseStorage: Full PostgreSQL implementation with all features
 * - MemoryStorage: In-memory implementation for development/testing
 * 
 * The storage layer provides a consistent interface regardless of backend.
 */
export const storage = db ? new (class DatabaseStorage {
  /**
   * DATABASE STORAGE IMPLEMENTATION
   * 
   * PostgreSQL-based storage with full feature support including:
   * - User authentication and profile management
   * - Exercise library and workout tracking
   * - Gamification system with achievements
   * - Real-time analytics and leaderboards
   */
  async getUser(id: string) {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user || undefined;
  }
  
  async upsertUser(userData: any) {
    const now = new Date();
    const userToInsert = {
      ...userData,
      updatedAt: now,
      createdAt: now,
    };
    
    const [user] = await db.insert(schema.users)
      .values(userToInsert)
      .onConflictDoUpdate({
        target: schema.users.id,
        set: { ...userData, updatedAt: now }
      })
      .returning();
    return user;
  }
  
  async updateUserProgress(id: string, updates: any) {
    const [user] = await db.update(schema.users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return user;
  }
  
  async getUserStats(id: string) {
    // Simple implementation for now
    return {
      totalWorkouts: 0,
      currentStreak: 0,
      achievements: 0
    };
  }

  async getWorkout(id: number) {
    console.log(`[Total Health] DatabaseStorage: Getting workout ${id}`);
    const [workout] = await db.select().from(schema.workouts).where(eq(schema.workouts.id, id));
    return workout || undefined;
  }

  async completeWorkout(workoutId: number, feedback: string, duration: number, calories?: number) {
    console.log(`[Total Health] DatabaseStorage: Completing workout ${workoutId}`);
    const now = new Date();
    const [workout] = await db.update(schema.workouts)
      .set({
        completedAt: now,
        feedback,
        duration,
        calories: calories || 0,
        updatedAt: now
      })
      .where(eq(schema.workouts.id, workoutId))
      .returning();
    return workout;
  }

  async createWorkout(workoutData: any) {
    console.log(`[Total Health] DatabaseStorage: Creating workout for user ${workoutData.userId}`);
    const [workout] = await db.insert(schema.workouts)
      .values(workoutData)
      .returning();
    return workout;
  }
  
  async getExercises() {
    return await db.select().from(schema.exercises);
  }
  
  async getExercisesByCategory(category: string) {
    return await db.select().from(schema.exercises).where(eq(schema.exercises.category, category));
  }
  
  async createExercise(exerciseData: any) {
    const [exercise] = await db.insert(schema.exercises).values(exerciseData).returning();
    return exercise;
  }
  
  async getDecks() {
    return await db.select().from(schema.decks);
  }
  
  async getDeck(id: number) {
    const [deck] = await db.select().from(schema.decks).where(eq(schema.decks.id, id));
    return deck || undefined;
  }
  
  async getDeckWithExercises(id: number) {
    const deck = await this.getDeck(id);
    if (!deck) return undefined;
    
    const deckExercisesWithDetails = await db
      .select({
        id: schema.deckExercises.id,
        deckId: schema.deckExercises.deckId,
        exerciseId: schema.deckExercises.exerciseId,
        order: schema.deckExercises.order,
        exercise: schema.exercises
      })
      .from(schema.deckExercises)
      .innerJoin(schema.exercises, eq(schema.deckExercises.exerciseId, schema.exercises.id))
      .where(eq(schema.deckExercises.deckId, id));
    
    return {
      ...deck,
      exercises: deckExercisesWithDetails
    };
  }
  
  async createDeck(deckData: any) {
    const [deck] = await db.insert(schema.decks).values(deckData).returning();
    return deck;
  }
  
  async addExerciseToDeck(deckExerciseData: any) {
    const [deckExercise] = await db.insert(schema.deckExercises).values(deckExerciseData).returning();
    return deckExercise;
  }
  
  async getUserCustomDecks(userId: string) {
    return await db.select().from(schema.decks).where(eq(schema.decks.createdBy, userId));
  }
  
  async createWorkout(workoutData: any) {
    const [workout] = await db.insert(schema.workouts).values(workoutData).returning();
    return workout;
  }
  
  async completeWorkout(workoutId: number, feedback: any, duration?: number, calories?: number) {
    const [workout] = await db.update(schema.workouts)
      .set({ 
        completed: true, 
        completedAt: new Date(),
        duration,
        calories,
        feedback: JSON.stringify(feedback)
      })
      .where(eq(schema.workouts.id, workoutId))
      .returning();
    return workout;
  }
  
  async getUserWorkouts(userId: string, limit?: number) {
    let query = db.select().from(schema.workouts).where(eq(schema.workouts.userId, userId));
    if (limit) {
      query = query.limit(limit);
    }
    return await query;
  }
  
  async getAchievements() {
    return await db.select().from(schema.achievements);
  }
  
  async getUserAchievements(userId: string) {
    return await db
      .select({
        id: schema.userAchievements.id,
        userId: schema.userAchievements.userId,
        achievementId: schema.userAchievements.achievementId,
        unlockedAt: schema.userAchievements.unlockedAt,
        achievement: schema.achievements
      })
      .from(schema.userAchievements)
      .innerJoin(schema.achievements, eq(schema.userAchievements.achievementId, schema.achievements.id))
      .where(eq(schema.userAchievements.userId, userId));
  }
})() : new MemoryStorage();

export { db, pool };