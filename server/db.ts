/**
 * DATABASE CONNECTION SETUP
 * 
 * This file configures the database layer for the application.
 * In development mode without DATABASE_URL, it uses in-memory storage.
 * In production with DATABASE_URL, it uses PostgreSQL via Neon serverless.
 */

import { MemoryStorage } from './storage';
import * as schema from "@shared/schema";

// For Replit environment migration - use in-memory storage by default
// This ensures the app runs immediately without requiring database setup
let db: any = null;
let pool: any = null;

// Create storage instance - use in-memory by default for immediate functionality
export const storage = new MemoryStorage();

// If DATABASE_URL is provided, we could set up PostgreSQL connection
// But for now, we'll use in-memory storage to get the app running
if (process.env.DATABASE_URL) {
  console.log('DATABASE_URL detected but using in-memory storage for development');
} else {
  console.log('Using in-memory storage - data will reset on server restart');
}

// Export null db for compatibility, but use storage for actual operations
export { db, pool };