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

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  
  // Fitness profile
  fitnessGoal: varchar("fitness_goal"), // lose_weight, gain_muscle, improve_endurance, stay_consistent, increase_mobility
  fitnessLevel: varchar("fitness_level"), // beginner, casual, fit, athlete
  workoutFrequency: varchar("workout_frequency"), // daily, three_per_week, flexible
  
  // Progress tracking
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  totalWorkouts: integer("total_workouts").default(0),
  totalMinutes: integer("total_minutes").default(0),
  
  // Adaptive progression
  currentDifficultyLevel: real("current_difficulty_level").default(1.0),
  lastWorkoutFeedback: varchar("last_workout_feedback"), // too_easy, just_right, bit_too_hard, way_too_hard
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // cardio, strength, flexibility, mixed
  difficulty: real("difficulty").notNull(), // 0.5 to 2.0 multiplier
  defaultReps: integer("default_reps"),
  defaultDuration: integer("default_duration"), // in seconds
  instructions: text("instructions"),
  icon: varchar("icon").default("fas fa-dumbbell"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const decks = pgTable("decks", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  difficulty: real("difficulty").notNull(),
  estimatedMinutes: integer("estimated_minutes"),
  isCustom: boolean("is_custom").default(false),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deckExercises = pgTable("deck_exercises", {
  id: serial("id").primaryKey(),
  deckId: integer("deck_id").references(() => decks.id).notNull(),
  exerciseId: integer("exercise_id").references(() => exercises.id).notNull(),
  order: integer("order").notNull(),
  customReps: integer("custom_reps"),
  customDuration: integer("custom_duration"),
});

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  deckId: integer("deck_id").references(() => decks.id).notNull(),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  duration: integer("duration"), // in seconds
  cardsCompleted: integer("cards_completed").default(0),
  totalCards: integer("total_cards").notNull(),
  feedback: varchar("feedback"), // too_easy, just_right, bit_too_hard, way_too_hard
  calories: integer("calories"),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon").notNull(),
  requirement: jsonb("requirement"), // { type: "streak", value: 7 }
  createdAt: timestamp("created_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  achievementId: integer("achievement_id").references(() => achievements.id).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  workouts: many(workouts),
  customDecks: many(decks),
  achievements: many(userAchievements),
}));

export const decksRelations = relations(decks, ({ one, many }) => ({
  creator: one(users, { fields: [decks.createdBy], references: [users.id] }),
  exercises: many(deckExercises),
  workouts: many(workouts),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  deckExercises: many(deckExercises),
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
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, { fields: [userAchievements.userId], references: [users.id] }),
  achievement: one(achievements, { fields: [userAchievements.achievementId], references: [achievements.id] }),
}));

// Insert schemas
export const upsertUserSchema = createInsertSchema(users);
export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true, createdAt: true });
export const insertDeckSchema = createInsertSchema(decks).omit({ id: true, createdAt: true });
export const insertWorkoutSchema = createInsertSchema(workouts).omit({ id: true });
export const insertDeckExerciseSchema = createInsertSchema(deckExercises).omit({ id: true });

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type Deck = typeof decks.$inferSelect;
export type DeckExercise = typeof deckExercises.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type InsertDeck = z.infer<typeof insertDeckSchema>;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type InsertDeckExercise = z.infer<typeof insertDeckExerciseSchema>;
