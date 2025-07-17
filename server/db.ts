/**
 * DATABASE CONNECTION SETUP
 * 
 * This file configures the connection to PostgreSQL using Neon serverless
 * and sets up Drizzle ORM with our schema.
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon to use WebSocket for serverless environment
neonConfig.webSocketConstructor = ws;

// Ensure database URL is provided
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool and database instance
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });