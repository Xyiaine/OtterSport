/**
 * DATABASE STORAGE LAYER
 * 
 * This file handles all database operations for the OtterSport app.
 * It provides a clean interface between the API routes and the database.
 */

import {
  users,
  exercises,
  decks,
  deckExercises,
  workouts,
  achievements,
  userAchievements,
  type User,
  type UpsertUser,
  type Exercise,
  type Deck,
  type DeckExercise,
  type Workout,
  type Achievement,
  type UserAchievement,
  type InsertExercise,
  type InsertDeck,
  type InsertWorkout,
  type InsertDeckExercise,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, count, sql } from "drizzle-orm";

/**
 * Storage interface defining all database operations
 * This makes it easy to test and switch database implementations if needed
 */
export interface IStorage {
  // ============================================================================
  // USER OPERATIONS (Required for Replit Auth)
  // ============================================================================
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // ============================================================================
  // EXERCISE OPERATIONS
  // ============================================================================
  getExercises(): Promise<Exercise[]>;
  getExercisesByCategory(category: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  
  // ============================================================================
  // DECK OPERATIONS
  // ============================================================================
  getDecks(): Promise<Deck[]>;
  getDeck(id: number): Promise<Deck | undefined>;
  getDeckWithExercises(id: number): Promise<(Deck & { exercises: (DeckExercise & { exercise: Exercise })[] }) | undefined>;
  createDeck(deck: InsertDeck): Promise<Deck>;
  addExerciseToDeck(deckExercise: InsertDeckExercise): Promise<DeckExercise>;
  getUserCustomDecks(userId: string): Promise<Deck[]>;
  
  // ============================================================================
  // WORKOUT OPERATIONS
  // ============================================================================
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  completeWorkout(workoutId: number, feedback: string, duration: number, calories?: number): Promise<Workout>;
  getUserWorkouts(userId: string, limit?: number): Promise<Workout[]>;
  getUserStats(userId: string): Promise<{
    totalWorkouts: number;
    totalMinutes: number;
    currentStreak: number;
    longestStreak: number;
    averageRating: number;
  }>;
  
  // ============================================================================
  // ACHIEVEMENT OPERATIONS
  // ============================================================================
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]>;
  unlockAchievement(userId: string, achievementId: number): Promise<UserAchievement>;
  
  // ============================================================================
  // PROGRESS OPERATIONS
  // ============================================================================
  updateUserProgress(userId: string, updates: Partial<User>): Promise<User>;
  updateUserStreak(userId: string): Promise<User>;
}

/**
 * PostgreSQL implementation of the storage interface
 * This class contains all the actual database query logic
 */
export class DatabaseStorage implements IStorage {
  
  // ============================================================================
  // USER OPERATIONS
  // ============================================================================
  
  /**
   * Get a user by their ID
   * Used by authentication system to load user data
   */
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  /**
   * Create or update a user
   * Used during login to sync user data from Replit OAuth
   */
  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // ============================================================================
  // EXERCISE OPERATIONS
  // ============================================================================
  
  /**
   * Get all exercises, sorted by name
   */
  async getExercises(): Promise<Exercise[]> {
    return await db.select().from(exercises).orderBy(exercises.name);
  }

  /**
   * Get exercises filtered by category (cardio, strength, etc.)
   */
  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    return await db
      .select()
      .from(exercises)
      .where(eq(exercises.category, category))
      .orderBy(exercises.name);
  }

  /**
   * Create a new exercise
   */
  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [newExercise] = await db.insert(exercises).values(exercise).returning();
    return newExercise;
  }

  // ============================================================================
  // DECK OPERATIONS
  // ============================================================================
  
  /**
   * Get all system decks (excludes user-created custom decks)
   */
  async getDecks(): Promise<Deck[]> {
    return await db
      .select()
      .from(decks)
      .where(eq(decks.isCustom, false))
      .orderBy(decks.name);
  }

  /**
   * Get a single deck by ID
   */
  async getDeck(id: number): Promise<Deck | undefined> {
    const [deck] = await db.select().from(decks).where(eq(decks.id, id));
    return deck;
  }

  /**
   * Get a deck with all its exercises included
   * Used when user wants to start a workout
   */
  async getDeckWithExercises(id: number): Promise<(Deck & { exercises: (DeckExercise & { exercise: Exercise })[] }) | undefined> {
    const deck = await db.query.decks.findFirst({
      where: eq(decks.id, id),
      with: {
        exercises: {
          with: {
            exercise: true,
          },
          orderBy: deckExercises.order,
        },
      },
    });
    return deck;
  }

  /**
   * Create a new workout deck
   */
  async createDeck(deck: InsertDeck): Promise<Deck> {
    const [newDeck] = await db.insert(decks).values(deck).returning();
    return newDeck;
  }

  /**
   * Add an exercise to a deck with custom parameters
   */
  async addExerciseToDeck(deckExercise: InsertDeckExercise): Promise<DeckExercise> {
    const [newDeckExercise] = await db.insert(deckExercises).values(deckExercise).returning();
    return newDeckExercise;
  }

  /**
   * Get all custom decks created by a specific user
   */
  async getUserCustomDecks(userId: string): Promise<Deck[]> {
    return await db
      .select()
      .from(decks)
      .where(and(eq(decks.createdBy, userId), eq(decks.isCustom, true)))
      .orderBy(decks.createdAt);
  }

  // ============================================================================
  // WORKOUT OPERATIONS
  // ============================================================================
  
  /**
   * Start a new workout session
   */
  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const [newWorkout] = await db.insert(workouts).values(workout).returning();
    return newWorkout;
  }

  async completeWorkout(workoutId: number, feedback: string, duration: number, calories?: number): Promise<Workout> {
    const [updatedWorkout] = await db
      .update(workouts)
      .set({
        completedAt: new Date(),
        feedback,
        duration,
        calories,
      })
      .where(eq(workouts.id, workoutId))
      .returning();

    // Update user stats
    const workout = await db.query.workouts.findFirst({
      where: eq(workouts.id, workoutId),
      with: { user: true },
    });

    if (workout?.user) {
      const newTotalWorkouts = (workout.user.totalWorkouts || 0) + 1;
      const newTotalMinutes = (workout.user.totalMinutes || 0) + Math.floor(duration / 60);

      await db
        .update(users)
        .set({
          totalWorkouts: newTotalWorkouts,
          totalMinutes: newTotalMinutes,
          lastWorkoutFeedback: feedback,
        })
        .where(eq(users.id, workout.userId));

      // Update streak
      await this.updateUserStreak(workout.userId);
    }

    return updatedWorkout;
  }

  async getUserWorkouts(userId: string, limit = 10): Promise<Workout[]> {
    return await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(desc(workouts.startedAt))
      .limit(limit);
  }

  async getUserStats(userId: string): Promise<{
    totalWorkouts: number;
    totalMinutes: number;
    currentStreak: number;
    longestStreak: number;
    averageRating: number;
  }> {
    const user = await this.getUser(userId);
    if (!user) {
      return {
        totalWorkouts: 0,
        totalMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageRating: 0,
      };
    }

    // Calculate average rating from workout feedback
    const feedbackQuery = await db
      .select({
        feedback: workouts.feedback,
        count: count(),
      })
      .from(workouts)
      .where(and(eq(workouts.userId, userId), sql`feedback IS NOT NULL`))
      .groupBy(workouts.feedback);

    let averageRating = 0;
    if (feedbackQuery.length > 0) {
      const totalRatings = feedbackQuery.reduce((sum, item) => sum + item.count, 0);
      const weightedSum = feedbackQuery.reduce((sum, item) => {
        const weight = item.feedback === 'too_easy' ? 5 : 
                      item.feedback === 'just_right' ? 4 : 
                      item.feedback === 'bit_too_hard' ? 3 : 2;
        return sum + (weight * item.count);
      }, 0);
      averageRating = Number((weightedSum / totalRatings).toFixed(1));
    }

    return {
      totalWorkouts: user.totalWorkouts || 0,
      totalMinutes: user.totalMinutes || 0,
      currentStreak: user.currentStreak || 0,
      longestStreak: user.longestStreak || 0,
      averageRating,
    };
  }

  // Achievement operations
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements).orderBy(achievements.name);
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    return await db.query.userAchievements.findMany({
      where: eq(userAchievements.userId, userId),
      with: {
        achievement: true,
      },
      orderBy: desc(userAchievements.unlockedAt),
    });
  }

  async unlockAchievement(userId: string, achievementId: number): Promise<UserAchievement> {
    const [newAchievement] = await db
      .insert(userAchievements)
      .values({ userId, achievementId })
      .returning();
    return newAchievement;
  }

  // Progress operations
  async updateUserProgress(userId: string, updates: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async updateUserStreak(userId: string): Promise<User> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if user worked out today
    const todayWorkout = await db
      .select()
      .from(workouts)
      .where(
        and(
          eq(workouts.userId, userId),
          gte(workouts.startedAt, today),
          sql`completed_at IS NOT NULL`
        )
      )
      .limit(1);

    // Check if user worked out yesterday
    const yesterdayWorkout = await db
      .select()
      .from(workouts)
      .where(
        and(
          eq(workouts.userId, userId),
          gte(workouts.startedAt, yesterday),
          sql`started_at < ${today}`,
          sql`completed_at IS NOT NULL`
        )
      )
      .limit(1);

    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    let newStreak = user.currentStreak || 0;

    if (todayWorkout.length > 0) {
      if (yesterdayWorkout.length > 0 || newStreak === 0) {
        newStreak += 1;
      }
    } else if (yesterdayWorkout.length === 0 && newStreak > 0) {
      newStreak = 0;
    }

    const newLongestStreak = Math.max(user.longestStreak || 0, newStreak);

    return await this.updateUserProgress(userId, {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
    });
  }
}

export const storage = new DatabaseStorage();
