/**
 * DATABASE CONNECTION SETUP
 * 
 * This file configures the database layer for the application.
 * Uses PostgreSQL via Neon serverless when DATABASE_URL is available.
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
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
export const storage = db ? null : new MemoryStorage(); // Will be replaced with DatabaseStorage if db exists

export { db, pool };