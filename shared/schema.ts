/**
 * OTTERSPORT DATABASE SCHEMA
 * 
 * Complete database schema definition using Drizzle ORM with PostgreSQL.
 * This schema supports the full OtterSport application including:
 * - User management and authentication via Replit OAuth
 * - Exercise library with categorization and difficulty scaling
 * - Workout deck creation and management system
 * - Progress tracking with adaptive difficulty algorithms
 * - Achievement system and gamification mechanics
 */

import { pgTable, varchar, integer, text, timestamp, boolean, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Users table - stores user profiles and authentication data
 * Integrated with Replit OAuth for seamless authentication
 */
export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // Replit user ID
  name: varchar("name").notNull(),
  username: varchar("username"),
  email: varchar("email"),
  profileImage: varchar("profile_image"),
  
  // Onboarding and fitness profile
  fitnessGoal: varchar("fitness_goal"), // weight_loss, muscle_gain, endurance, general_fitness
  experienceLevel: varchar("experience_level"), // beginner, intermediate, advanced
  preferredWorkoutDuration: integer("preferred_workout_duration").default(30), // minutes
  workoutFrequency: integer("workout_frequency").default(3), // times per week
  
  // Progress tracking
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  totalWorkouts: integer("total_workouts").default(0),
  totalMinutes: integer("total_minutes").default(0),
  
  // Adaptive difficulty system
  baseDifficultyLevel: decimal("base_difficulty_level", { precision: 3, scale: 2 }).default("1.00"), // 0.50 to 3.00
  currentDifficultyLevel: decimal("current_difficulty_level", { precision: 3, scale: 2 }).default("1.00"),
  lastDifficultyAdjustment: timestamp("last_difficulty_adjustment"),
  
  // Gamification
  totalXP: integer("total_xp").default(0),
  level: integer("level").default(1),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Exercises table - library of workout exercises
 * Supports different card types for game mechanics
 */
export const exercises = pgTable("exercises", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(), // strength, cardio, flexibility, core, warmup
  difficulty: integer("difficulty").notNull(), // 1-5 scale
  
  // Exercise parameters
  defaultReps: integer("default_reps"), // For rep-based exercises
  defaultDuration: integer("default_duration"), // For time-based exercises (seconds)
  instructions: text("instructions").notNull(),
  
  // Card game mechanics
  cardPoints: integer("card_points").default(10), // Points awarded in card battles
  energyCost: integer("energy_cost").default(1), // Energy required to play card
  
  // UI elements
  icon: varchar("icon").default("fas fa-dumbbell"), // Icon class for UI
  cardType: varchar("card_type").default("exercise"), // Options: exercise, warmup, utility, power
  utilityEffect: varchar("utility_effect"), // For utility cards: redraw, shuffle, skip, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Decks table - stores workout collections
 * Collections of exercises that form complete workouts
 */
export const decks = pgTable("decks", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name").notNull(),
  description: text("description"),
  difficulty: integer("difficulty").notNull(), // 1-5 scale
  estimatedDuration: integer("estimated_duration").default(30), // minutes
  category: varchar("category").default("general"), // beginner, cardio, strength, etc.
  isPublic: boolean("is_public").default(true),
  createdBy: varchar("created_by"), // User ID of creator
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Deck-Exercise relationship table
 * Many-to-many relationship between decks and exercises
 */
export const deckExercises = pgTable("deck_exercises", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  deckId: integer("deck_id").notNull(),
  exerciseId: integer("exercise_id").notNull(),
  orderInDeck: integer("order_in_deck").default(0), // Position in deck
  customReps: integer("custom_reps"), // Override default reps for this deck
  customDuration: integer("custom_duration"), // Override default duration
});

/**
 * Workouts table - tracks individual workout sessions
 * Records of completed or in-progress workouts
 */
export const workouts = pgTable("workouts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull(),
  deckId: integer("deck_id"),
  deckName: varchar("deck_name"), // Snapshot of deck name
  
  // Workout session data
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  totalDuration: integer("total_duration"), // seconds
  exercisesCompleted: integer("exercises_completed").default(0),
  totalExercises: integer("total_exercises").default(0),
  
  // Adaptive feedback
  difficultyRating: integer("difficulty_rating"), // 1-5: too easy to too hard
  enjoymentRating: integer("enjoyment_rating"), // 1-5: user satisfaction
  
  // Metadata
  workoutData: json("workout_data"), // Detailed exercise completion data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Achievements table - gamification system
 * Defines available achievements and their criteria
 */
export const achievements = pgTable("achievements", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  icon: varchar("icon").notNull(), // Emoji or icon class
  points: integer("points").default(10), // XP awarded
  criteria: varchar("criteria").notNull(), // Achievement trigger condition
  isSecret: boolean("is_secret").default(false), // Hidden until earned
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * User Achievements table - tracks earned achievements
 * Many-to-many relationship between users and achievements
 */
export const userAchievements = pgTable("user_achievements", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull(),
  achievementId: integer("achievement_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
  progress: json("progress"), // Additional progress data if needed
});

/**
 * Sessions table - stores user session data
 * Used by express-session for authentication
 */
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

/**
 * Zod schemas for type-safe operations
 * Generated from Drizzle table definitions
 */

// User schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectUser = typeof users.$inferSelect;

// Exercise schemas
export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
  createdAt: true,
});
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type SelectExercise = typeof exercises.$inferSelect;

// Deck schemas  
export const insertDeckSchema = createInsertSchema(decks).omit({
  id: true,
  createdAt: true,
});
export type InsertDeck = z.infer<typeof insertDeckSchema>;
export type SelectDeck = typeof decks.$inferSelect;

// Workout schemas
export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type SelectWorkout = typeof workouts.$inferSelect;

// Achievement schemas
export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type SelectAchievement = typeof achievements.$inferSelect;

/**
 * Profile update schema for onboarding
 * Used during user profile setup and updates
 */
export const profileUpdateSchema = z.object({
  fitnessGoal: z.enum(["weight_loss", "muscle_gain", "endurance", "general_fitness"]).optional(),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  preferredWorkoutDuration: z.number().min(10).max(120).optional(),
  workoutFrequency: z.number().min(1).max(7).optional(),
});

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;