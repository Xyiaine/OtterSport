/**
 * DATABASE CONNECTION SETUP
 * 
 * This file configures the database layer for the application.
 * Uses PostgreSQL via Neon serverless when DATABASE_URL is available.
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '@shared/schema';
import { MemoryStorage } from './storage';

let db: any = null;
let pool: any = null;

// If DATABASE_URL is provided, set up PostgreSQL connection
if (process.env.DATABASE_URL) {
  console.log('DATABASE_URL detected - setting up PostgreSQL connection');
  try {
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema });
    console.log('PostgreSQL connection established via Neon');
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error);
    db = null;
  }
} else {
  console.log('Using in-memory storage - data will reset on server restart');
}

// Create storage instance - use database if available, otherwise memory
export const storage = db ? new (class DatabaseStorage {
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
  
  async getExercises() {
    return await db.select().from(schema.exercises);
  }
  
  async getDecks() {
    return await db.select().from(schema.decks);
  }
  
  async getAchievements() {
    return await db.select().from(schema.achievements);
  }
  
  // Add more methods as needed...
})() : new MemoryStorage();

export { db, pool };