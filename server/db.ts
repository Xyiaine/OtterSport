import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";
import { eq, inArray } from "drizzle-orm";

/**
 * DATABASE CONNECTION SETUP
 * 
 * This module handles database connectivity for OtterSport using Neon PostgreSQL.
 * Supports both authenticated database connections and in-memory storage fallback.
 */

// Database connection with environment variable
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
const db = sql ? drizzle(sql, { schema }) : null;

/**
 * IStorage interface defines all storage operations needed by the application.
 * This interface is implemented by both database and in-memory storage.
 */
export interface IStorage {
  // User management
  getUser(id: string): Promise<typeof schema.users.$inferSelect | undefined>;
  upsertUser(userData: any): Promise<typeof schema.users.$inferSelect>;
  updateUserProfile(userId: string, profileData: any): Promise<typeof schema.users.$inferSelect | undefined>;
  
  // Exercise management  
  getExercises(): Promise<typeof schema.exercises.$inferSelect[]>;
  createExercise(exerciseData: any): Promise<typeof schema.exercises.$inferSelect>;
  
  // Deck management
  getDecks(): Promise<(typeof schema.decks.$inferSelect & { exercises: Array<{ exercise: typeof schema.exercises.$inferSelect }> })[]>;
  getDeckWithExercises(deckId: number): Promise<(typeof schema.decks.$inferSelect & { exercises: Array<{ exercise: typeof schema.exercises.$inferSelect }> }) | undefined>;
  createDeck(deckData: any): Promise<typeof schema.decks.$inferSelect>;
  
  // Achievement system
  getAchievements(): Promise<typeof schema.achievements.$inferSelect[]>;
  getUserAchievements(userId: string): Promise<typeof schema.userAchievements.$inferSelect[]>;
  awardAchievement(userId: string, achievementId: number): Promise<typeof schema.userAchievements.$inferSelect>;
  
  // Workout tracking
  getWorkouts(userId: string): Promise<typeof schema.workouts.$inferSelect[]>;
  createWorkout(workoutData: any): Promise<typeof schema.workouts.$inferSelect>;
  completeWorkout(workoutId: number, completionData: any): Promise<typeof schema.workouts.$inferSelect | undefined>;
}

/**
 * DatabaseStorage class provides comprehensive functionality for database operations.
 * This class handles all database interactions for the OtterSport application.
 */
class DatabaseStorage implements IStorage {
  
  async getUser(id: string) {
    const [user] = await db!.select().from(schema.users).where(eq(schema.users.id, id));
    return user || undefined;
  }
  
  async upsertUser(userData: any) {
    const now = new Date();
    const userToInsert = {
      ...userData,
      updatedAt: now,
      createdAt: now,
    };
    
    const [user] = await db!.insert(schema.users)
      .values(userToInsert)
      .onConflictDoUpdate({
        target: schema.users.id,
        set: { ...userData, updatedAt: now }
      })
      .returning();
    
    return user;
  }
  
  async updateUserProfile(userId: string, profileData: any) {
    const [user] = await db!.update(schema.users)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(schema.users.id, userId))
      .returning();
    
    return user || undefined;
  }
  
  async getExercises() {
    return await db!.select().from(schema.exercises);
  }
  
  async createExercise(exerciseData: any) {
    const [exercise] = await db!.insert(schema.exercises)
      .values({ ...exerciseData, createdAt: new Date() })
      .returning();
    
    return exercise;
  }
  
  async getDecks() {
    const decks = await db!.select().from(schema.decks);
    
    const decksWithExercises = await Promise.all(
      decks.map(async (deck) => {
        const deckExercises = await db!.select({
          exercise: schema.exercises
        })
        .from(schema.deckExercises)
        .innerJoin(schema.exercises, eq(schema.deckExercises.exerciseId, schema.exercises.id))
        .where(eq(schema.deckExercises.deckId, deck.id));
        
        return {
          ...deck,
          exercises: deckExercises
        };
      })
    );
    
    return decksWithExercises;
  }
  
  async getDeckWithExercises(deckId: number) {
    const [deck] = await db!.select().from(schema.decks).where(eq(schema.decks.id, deckId));
    if (!deck) return undefined;
    
    const deckExercises = await db!.select({
      exercise: schema.exercises
    })
    .from(schema.deckExercises)
    .innerJoin(schema.exercises, eq(schema.deckExercises.exerciseId, schema.exercises.id))
    .where(eq(schema.deckExercises.deckId, deckId));
    
    return {
      ...deck,
      exercises: deckExercises
    };
  }
  
  async createDeck(deckData: any) {
    const [deck] = await db!.insert(schema.decks)
      .values({ ...deckData, createdAt: new Date() })
      .returning();
    
    return deck;
  }
  
  async getAchievements() {
    return await db!.select().from(schema.achievements);
  }
  
  async getUserAchievements(userId: string) {
    return await db!.select().from(schema.userAchievements).where(eq(schema.userAchievements.userId, userId));
  }
  
  async awardAchievement(userId: string, achievementId: number) {
    const [userAchievement] = await db!.insert(schema.userAchievements)
      .values({
        userId,
        achievementId,
        earnedAt: new Date()
      })
      .returning();
    
    return userAchievement;
  }
  
  async getWorkouts(userId: string) {
    return await db!.select().from(schema.workouts).where(eq(schema.workouts.userId, userId));
  }
  
  async createWorkout(workoutData: any) {
    const [workout] = await db!.insert(schema.workouts)
      .values({ ...workoutData, createdAt: new Date() })
      .returning();
    
    return workout;
  }
  
  async completeWorkout(workoutId: number, completionData: any) {
    const [workout] = await db!.update(schema.workouts)
      .set({ 
        ...completionData, 
        completedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(schema.workouts.id, workoutId))
      .returning();
    
    return workout || undefined;
  }
}

/**
 * IN-MEMORY STORAGE IMPLEMENTATION
 * 
 * Fallback storage when database is not available.
 * Used for development and testing purposes.
 */
class MemoryStorage implements IStorage {
  private users: Map<string, any> = new Map();
  private exercises: any[] = [];
  private decks: any[] = [];
  private achievements: any[] = [];
  private userAchievements: any[] = [];
  private workouts: any[] = [];
  private idCounter = 1;

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed exercises
    this.exercises = [
      { id: 1, name: "Push-ups", category: "strength", difficulty: 2, defaultReps: 10, defaultDuration: null, instructions: "Standard push-ups", icon: "fas fa-dumbbell", cardType: "exercise", createdAt: new Date() },
      { id: 2, name: "Squats", category: "strength", difficulty: 2, defaultReps: 15, defaultDuration: null, instructions: "Bodyweight squats", icon: "fas fa-dumbbell", cardType: "exercise", createdAt: new Date() },
      { id: 3, name: "Jumping Jacks", category: "cardio", difficulty: 1, defaultReps: 20, defaultDuration: null, instructions: "Classic jumping jacks", icon: "fas fa-running", cardType: "exercise", createdAt: new Date() },
      { id: 4, name: "Plank", category: "core", difficulty: 2, defaultReps: null, defaultDuration: 30, instructions: "Hold plank position", icon: "fas fa-fire", cardType: "exercise", createdAt: new Date() },
      { id: 5, name: "Mountain Climbers", category: "cardio", difficulty: 3, defaultReps: 20, defaultDuration: null, instructions: "High knees mountain climbers", icon: "fas fa-mountain", cardType: "exercise", createdAt: new Date() }
    ];

    // Seed decks
    this.decks = [
      { id: 1, name: "Beginner Workout", description: "Perfect for starting your fitness journey", difficulty: 1, exercises: [{ exercise: this.exercises[0] }, { exercise: this.exercises[1] }, { exercise: this.exercises[2] }], createdAt: new Date() },
      { id: 2, name: "Cardio Blast", description: "High energy cardio session", difficulty: 2, exercises: [{ exercise: this.exercises[2] }, { exercise: this.exercises[4] }], createdAt: new Date() },
      { id: 3, name: "Strength Builder", description: "Build muscle with bodyweight exercises", difficulty: 3, exercises: [{ exercise: this.exercises[0] }, { exercise: this.exercises[1] }, { exercise: this.exercises[3] }], createdAt: new Date() }
    ];

    // Seed achievements
    this.achievements = [
      { id: 1, name: "First Workout", description: "Complete your first workout", icon: "🎯", points: 10, criteria: "complete_workout", createdAt: new Date() },
      { id: 2, name: "Week Warrior", description: "Work out 7 days in a row", icon: "🔥", points: 50, criteria: "streak_7", createdAt: new Date() },
      { id: 3, name: "Card Master", description: "Win 10 card battles", icon: "🃏", points: 100, criteria: "win_battles_10", createdAt: new Date() }
    ];
  }

  async getUser(id: string) {
    return this.users.get(id);
  }

  async upsertUser(userData: any) {
    const existingUser = this.users.get(userData.id);
    const user = { ...existingUser, ...userData, updatedAt: new Date() };
    if (!existingUser) {
      user.createdAt = new Date();
    }
    this.users.set(userData.id, user);
    return user;
  }

  async updateUserProfile(userId: string, profileData: any) {
    const user = this.users.get(userId);
    if (user) {
      const updatedUser = { ...user, ...profileData, updatedAt: new Date() };
      this.users.set(userId, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async getExercises() {
    return [...this.exercises];
  }

  async createExercise(exerciseData: any) {
    const exercise = { id: this.idCounter++, ...exerciseData, createdAt: new Date() };
    this.exercises.push(exercise);
    return exercise;
  }

  async getDecks() {
    return [...this.decks];
  }

  async getDeckWithExercises(deckId: number) {
    return this.decks.find(deck => deck.id === deckId);
  }

  async createDeck(deckData: any) {
    const deck = { id: this.idCounter++, ...deckData, exercises: [], createdAt: new Date() };
    this.decks.push(deck);
    return deck;
  }

  async getAchievements() {
    return [...this.achievements];
  }

  async getUserAchievements(userId: string) {
    return this.userAchievements.filter(ua => ua.userId === userId);
  }

  async awardAchievement(userId: string, achievementId: number) {
    const userAchievement = {
      id: this.idCounter++,
      userId,
      achievementId,
      earnedAt: new Date()
    };
    this.userAchievements.push(userAchievement);
    return userAchievement;
  }

  async getWorkouts(userId: string) {
    return this.workouts.filter(w => w.userId === userId);
  }

  async createWorkout(workoutData: any) {
    const workout = { id: this.idCounter++, ...workoutData, createdAt: new Date() };
    this.workouts.push(workout);
    return workout;
  }

  async completeWorkout(workoutId: number, completionData: any) {
    const workoutIndex = this.workouts.findIndex(w => w.id === workoutId);
    if (workoutIndex >= 0) {
      this.workouts[workoutIndex] = {
        ...this.workouts[workoutIndex],
        ...completionData,
        completedAt: new Date(),
        updatedAt: new Date()
      };
      return this.workouts[workoutIndex];
    }
    return undefined;
  }
}

// Export the appropriate storage implementation
export const storage: IStorage = db ? new DatabaseStorage() : new MemoryStorage();

console.log(`🗄️ Storage initialized: ${db ? 'PostgreSQL Database' : 'In-Memory Storage'}`);
if (!db) {
  console.log('⚠️  DATABASE_URL not found - using in-memory storage for development');
}