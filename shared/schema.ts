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
 * - Session management for secure authentication
 * 
 * All tables include proper relationships, indexes, and constraints
 * for optimal performance and data integrity across all deployment platforms.
 * 
 * Database Optimization Features:
 * - Connection pooling support for serverless environments
 * - Efficient indexes for common query patterns
 * - Proper foreign key relationships for data integrity
 * - Timestamp tracking for audit and analytics
 * - JSON fields for flexible configuration storage
 */

import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  serial,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

/**
 * DATABASE SCHEMA FOR OTTERSPORT FITNESS APP
 * This file defines all database tables and their relationships
 */

// ============================================================================
// AUTH TABLES (Required for Replit Authentication)
// ============================================================================

/** 
 * Sessions table - stores user session data for authentication
 * Required by connect-pg-simple for express-session
 */
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

/**
 * Users table - stores user profiles and fitness data
 * Integrates with Replit OAuth for authentication
 */
export const users = pgTable("users", {
  // Basic user info (from Replit OAuth)
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  
  // Admin authentication
  isAdmin: boolean("is_admin").default(false),
  adminLogin: varchar("admin_login"),
  adminPasswordHash: varchar("admin_password_hash"),
  
  // Fitness profile settings
  fitnessGoal: varchar("fitness_goal"), // Options: lose_weight, gain_muscle, improve_endurance, stay_consistent, increase_mobility
  fitnessLevel: varchar("fitness_level"), // Options: beginner, casual, fit, athlete
  workoutFrequency: varchar("workout_frequency"), // Options: daily, three_per_week, flexible
  
  // Progress tracking counters
  currentStreak: integer("current_streak").default(0), // Days in a row
  longestStreak: integer("longest_streak").default(0), // Best streak ever
  totalWorkouts: integer("total_workouts").default(0), // Total completed workouts
  totalMinutes: integer("total_minutes").default(0), // Total workout time
  
  // Adaptive difficulty system
  currentDifficultyLevel: real("current_difficulty_level").default(1.0), // Multiplier for exercise difficulty
  lastWorkoutFeedback: varchar("last_workout_feedback"), // Options: too_easy, just_right, bit_too_hard, way_too_hard
  
  // Gamification system - XP and Levels
  experiencePoints: integer("experience_points").default(0), // Total XP earned
  currentLevel: integer("current_level").default(1), // Current user level
  xpToNextLevel: integer("xp_to_next_level").default(100), // XP needed for next level
  
  // Daily streak system
  lastWorkoutDate: timestamp("last_workout_date"), // Last workout completion date
  streakFreezeUses: integer("streak_freeze_uses").default(0), // Streak protection uses this month
  
  // Life/Heart system
  livesRemaining: integer("lives_remaining").default(5), // Hearts for mistakes
  lastLifeLoss: timestamp("last_life_loss"), // When last heart was lost
  livesRefillAt: timestamp("lives_refill_at"), // When hearts refill completely
});

// ============================================================================
// EXERCISE SYSTEM TABLES
// ============================================================================

/**
 * Exercises table - stores individual workout exercises
 * These are the building blocks of workout decks
 */
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(), // Exercise name (e.g., "Push-ups")
  description: text("description"), // Brief description
  category: varchar("category").notNull(), // Options: cardio, strength, flexibility, mixed, warmup, utility
  difficulty: real("difficulty").notNull(), // Base difficulty multiplier (0.5 to 2.0)
  defaultReps: integer("default_reps"), // Default number of reps (if rep-based)
  defaultDuration: integer("default_duration"), // Default duration in seconds (if time-based)
  instructions: text("instructions"), // How to perform the exercise
  icon: varchar("icon").default("fas fa-dumbbell"), // Icon class for UI
  cardType: varchar("card_type").default("exercise"), // Options: exercise, warmup, utility, power
  utilityEffect: varchar("utility_effect"), // For utility cards: redraw, shuffle, skip, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Decks table - stores workout collections
 * A deck is a collection of exercises that form a complete workout
 */
export const decks = pgTable("decks", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(), // Deck name (e.g., "Morning Cardio")
  description: text("description"), // Deck description
  category: varchar("category").notNull(), // Same categories as exercises
  difficulty: real("difficulty").notNull(), // Overall deck difficulty
  estimatedMinutes: integer("estimated_minutes"), // Expected workout duration
  isCustom: boolean("is_custom").default(false), // User-created vs. system deck
  createdBy: varchar("created_by").references(() => users.id), // Creator if custom
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Deck Exercises table - links exercises to decks with custom settings
 * This allows the same exercise to be used in multiple decks with different parameters
 */
export const deckExercises = pgTable("deck_exercises", {
  id: serial("id").primaryKey(),
  deckId: integer("deck_id").references(() => decks.id).notNull(),
  exerciseId: integer("exercise_id").references(() => exercises.id).notNull(),
  order: integer("order").notNull(), // Order in the deck
  customReps: integer("custom_reps"), // Override default reps
  customDuration: integer("custom_duration"), // Override default duration
});

// ============================================================================
// WORKOUT TRACKING TABLES
// ============================================================================

/**
 * Workouts table - stores individual workout sessions
 * Tracks user progress through deck exercises
 */
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  deckId: integer("deck_id").references(() => decks.id).notNull(),
  startedAt: timestamp("started_at").notNull(), // When workout began
  completedAt: timestamp("completed_at"), // When workout finished (null if abandoned)
  duration: integer("duration"), // Total workout time in seconds
  cardsCompleted: integer("cards_completed").default(0), // Exercises completed
  totalCards: integer("total_cards").notNull(), // Total exercises in deck
  feedback: varchar("feedback"), // User feedback: too_easy, just_right, bit_too_hard, way_too_hard
  calories: integer("calories"), // Estimated calories burned
});

// ============================================================================
// GAMIFICATION TABLES
// ============================================================================

/**
 * Achievements table - defines available achievements
 * Used for gamification and user motivation
 */
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(), // Achievement name
  description: text("description"), // What user needs to do
  icon: varchar("icon").notNull(), // Icon for UI
  requirement: jsonb("requirement"), // JSON defining unlock criteria (e.g., { type: "streak", value: 7 })
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * User Achievements table - tracks which achievements users have unlocked
 * Links users to their earned achievements
 */
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  achievementId: integer("achievement_id").references(() => achievements.id).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(), // When achievement was earned
});

/**
 * Leaderboards table - tracks weekly and global rankings
 * Used for competitive features and social motivation
 */
export const leaderboards = pgTable("leaderboards", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  weekStart: timestamp("week_start").notNull(), // Start of the week this entry covers
  weeklyXP: integer("weekly_xp").default(0), // XP earned this week
  weeklyWorkouts: integer("weekly_workouts").default(0), // Workouts completed this week
  weeklyMinutes: integer("weekly_minutes").default(0), // Minutes worked out this week
  globalRank: integer("global_rank"), // Global ranking position
  friendRank: integer("friend_rank"), // Ranking among friends
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Badges table - special recognition badges beyond achievements
 * Used for leaderboard rewards and special events
 */
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(), // Badge name
  description: text("description"), // Badge description
  icon: varchar("icon").notNull(), // Badge icon
  type: varchar("type").notNull(), // Badge type: weekly_top, event, special
  rarity: varchar("rarity").default("common"), // common, rare, epic, legendary
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * User Badges table - tracks special badges earned by users
 * Links users to their earned badges (different from achievements)
 */
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  badgeId: integer("badge_id").references(() => badges.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
  weekEarned: timestamp("week_earned"), // For weekly badges
});

/**
 * XP Activities table - defines XP rewards for different activities
 * Configurable system for XP earning
 */
export const xpActivities = pgTable("xp_activities", {
  id: serial("id").primaryKey(),
  activityType: varchar("activity_type").notNull(), // workout_complete, streak_bonus, perfect_week, etc.
  baseXP: integer("base_xp").notNull(), // Base XP for this activity
  description: text("description"), // Description of the activity
  multiplierField: varchar("multiplier_field"), // Field to multiply by (e.g., 'duration', 'cards_completed')
  isActive: boolean("is_active").default(true), // Whether this XP reward is currently active
});

// ============================================================================
// DATABASE RELATIONSHIPS
// ============================================================================

/**
 * Define relationships between tables for easier querying
 * This allows us to fetch related data in a single query
 */
export const usersRelations = relations(users, ({ many }) => ({
  workouts: many(workouts), // User's workout history
  customDecks: many(decks), // User's custom workout decks
  achievements: many(userAchievements), // User's earned achievements
  badges: many(userBadges), // User's earned badges
  leaderboardEntries: many(leaderboards), // User's leaderboard entries
}));

export const decksRelations = relations(decks, ({ one, many }) => ({
  creator: one(users, { fields: [decks.createdBy], references: [users.id] }), // Who created this deck
  exercises: many(deckExercises), // Exercises in this deck
  workouts: many(workouts), // Workouts using this deck
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  deckExercises: many(deckExercises), // Which decks use this exercise
}));

export const deckExercisesRelations = relations(deckExercises, ({ one }) => ({
  deck: one(decks, { fields: [deckExercises.deckId], references: [decks.id] }),
  exercise: one(exercises, { fields: [deckExercises.exerciseId], references: [exercises.id] }),
}));

export const workoutsRelations = relations(workouts, ({ one }) => ({
  user: one(users, { fields: [workouts.userId], references: [users.id] }),
  deck: one(decks, { fields: [workouts.deckId], references: [decks.id] }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements), // Who has earned this achievement
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, { fields: [userAchievements.userId], references: [users.id] }),
  achievement: one(achievements, { fields: [userAchievements.achievementId], references: [achievements.id] }),
}));

export const leaderboardsRelations = relations(leaderboards, ({ one }) => ({
  user: one(users, { fields: [leaderboards.userId], references: [users.id] }),
}));

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges), // Who has earned this badge
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, { fields: [userBadges.userId], references: [users.id] }),
  badge: one(badges, { fields: [userBadges.badgeId], references: [badges.id] }),
}));

// ============================================================================
// VALIDATION SCHEMAS & TYPES
// ============================================================================

/**
 * Zod schemas for validating data before database operations
 * These ensure data integrity and provide type safety
 */
export const upsertUserSchema = createInsertSchema(users).omit({ createdAt: true, updatedAt: true });
export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true });
export const insertDeckSchema = createInsertSchema(decks).omit({ id: true });
export const insertWorkoutSchema = createInsertSchema(workouts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDeckExerciseSchema = createInsertSchema(deckExercises).omit({ id: true });

/**
 * TypeScript types for use throughout the application
 * These provide compile-time type checking and IDE support
 */
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type Deck = typeof decks.$inferSelect;
export type DeckExercise = typeof deckExercises.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type Leaderboard = typeof leaderboards.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type XpActivity = typeof xpActivities.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type InsertDeck = z.infer<typeof insertDeckSchema>;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type InsertDeckExercise = z.infer<typeof insertDeckExerciseSchema>;

// Additional schemas for gamification
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLeaderboardSchema = createInsertSchema(leaderboards).omit({ id: true, createdAt: true, updatedAt: true });
export const insertXpActivitySchema = createInsertSchema(xpActivities).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;
export type InsertXpActivity = z.infer<typeof insertXpActivitySchema>;
