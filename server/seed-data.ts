/**
 * DATABASE SEED DATA
 * 
 * This file provides comprehensive seed data for the OtterSport application.
 * It creates default exercises, decks, and achievements for a complete fitness experience.
 */

import { db } from "./db";
import { exercises, decks, deckExercises, achievements, badges, xpActivities } from "@shared/schema";
import type { InsertExercise, InsertDeck, InsertDeckExercise, InsertAchievement, InsertBadge, InsertXpActivity } from "@shared/schema";

/**
 * COMPREHENSIVE EXERCISE LIBRARY
 * 
 * This provides a complete library of exercises across different categories
 * with proper difficulty scaling and clear instructions.
 */
const defaultExercises: InsertExercise[] = [
  // CARDIO EXERCISES
  {
    name: "Jumping Jacks",
    description: "Full-body cardio exercise that gets your heart pumping",
    category: "cardio",
    difficulty: 0.8,
    defaultReps: 20,
    defaultDuration: 30,
    instructions: "Jump with feet apart while raising arms overhead, then return to starting position. Keep a steady rhythm.",
    icon: "fas fa-running",
  },
  {
    name: "High Knees",
    description: "Cardio exercise that targets legs and core",
    category: "cardio",
    difficulty: 0.9,
    defaultReps: 20,
    defaultDuration: 30,
    instructions: "Run in place while lifting knees as high as possible toward your chest. Keep arms pumping.",
    icon: "fas fa-running",
  },
  {
    name: "Mountain Climbers",
    description: "High-intensity cardio and core strengthening",
    category: "cardio",
    difficulty: 1.3,
    defaultReps: 20,
    defaultDuration: null,
    instructions: "Start in plank position, alternate bringing knees to chest rapidly. Keep core tight.",
    icon: "fas fa-mountain",
  },
  {
    name: "Burpees",
    description: "Full-body conditioning exercise",
    category: "mixed",
    difficulty: 1.8,
    defaultReps: 5,
    defaultDuration: null,
    instructions: "Squat down, jump back to plank, do push-up, jump feet forward, then jump up with arms overhead.",
    icon: "fas fa-fire",
  },
  
  // STRENGTH EXERCISES
  {
    name: "Push-ups",
    description: "Classic upper body strength exercise",
    category: "strength",
    difficulty: 1.0,
    defaultReps: 10,
    defaultDuration: null,
    instructions: "Place hands shoulder-width apart, keep body straight, lower chest to ground then push back up.",
    icon: "fas fa-dumbbell",
  },
  {
    name: "Squats",
    description: "Lower body strength and mobility",
    category: "strength",
    difficulty: 1.2,
    defaultReps: 15,
    defaultDuration: null,
    instructions: "Stand with feet shoulder-width apart, lower hips back and down as if sitting in a chair, then stand up.",
    icon: "fas fa-dumbbell",
  },
  {
    name: "Lunges",
    description: "Lower body strength and balance",
    category: "strength",
    difficulty: 1.1,
    defaultReps: 12,
    defaultDuration: null,
    instructions: "Step forward into lunge position, lower back knee toward ground, then return to standing. Alternate legs.",
    icon: "fas fa-dumbbell",
  },
  {
    name: "Plank",
    description: "Core stability and strength",
    category: "strength",
    difficulty: 1.1,
    defaultReps: null,
    defaultDuration: 30,
    instructions: "Hold a straight line from head to heels in push-up position. Keep core tight and breathe steadily.",
    icon: "fas fa-minus",
  },
  
  // FLEXIBILITY EXERCISES
  {
    name: "Arm Circles",
    description: "Shoulder mobility and warm-up",
    category: "flexibility",
    difficulty: 0.5,
    defaultReps: 10,
    defaultDuration: null,
    instructions: "Extend arms to sides, make small circles forward for 10 reps, then backward for 10 reps.",
    icon: "fas fa-sync-alt",
  },
  {
    name: "Leg Swings",
    description: "Hip mobility and flexibility",
    category: "flexibility",
    difficulty: 0.6,
    defaultReps: 10,
    defaultDuration: null,
    instructions: "Hold onto support, swing one leg forward and back, then side to side. Switch legs.",
    icon: "fas fa-sync-alt",
  },
  {
    name: "Shoulder Stretch",
    description: "Upper body flexibility",
    category: "flexibility",
    difficulty: 0.4,
    defaultReps: null,
    defaultDuration: 20,
    instructions: "Pull one arm across your chest, hold with opposite hand. Hold for 20 seconds, then switch arms.",
    icon: "fas fa-hand-paper",
  },
  
  // CORE EXERCISES
  {
    name: "Crunches",
    description: "Abdominal strengthening",
    category: "strength",
    difficulty: 0.8,
    defaultReps: 15,
    defaultDuration: null,
    instructions: "Lie on back, knees bent, lift shoulders off ground by contracting abs. Don't pull on neck.",
    icon: "fas fa-expand-alt",
  },
  {
    name: "Bicycle Crunches",
    description: "Core exercise targeting obliques",
    category: "strength",
    difficulty: 1.0,
    defaultReps: 20,
    defaultDuration: null,
    instructions: "Lie on back, alternate bringing opposite elbow to knee in cycling motion. Keep lower back pressed down.",
    icon: "fas fa-bicycle",
  },
];

/**
 * WORKOUT DECK CONFIGURATIONS
 * 
 * Pre-built workout decks for different fitness levels and goals.
 */
const defaultDecks: InsertDeck[] = [
  {
    name: "Quick Start",
    description: "Perfect for beginners - easy and effective",
    category: "mixed",
    difficulty: 1.0,
    estimatedMinutes: 15,
    isCustom: false,
    createdBy: null,
  },
  {
    name: "Cardio Blast",
    description: "High-energy cardio workout to get your heart pumping",
    category: "cardio",
    difficulty: 1.4,
    estimatedMinutes: 20,
    isCustom: false,
    createdBy: null,
  },
  {
    name: "Strength Builder",
    description: "Build muscle and strength with bodyweight exercises",
    category: "strength",
    difficulty: 1.3,
    estimatedMinutes: 25,
    isCustom: false,
    createdBy: null,
  },
  {
    name: "Flexibility Focus",
    description: "Improve mobility and reduce tension",
    category: "flexibility",
    difficulty: 0.6,
    estimatedMinutes: 12,
    isCustom: false,
    createdBy: null,
  },
];

/**
 * ACHIEVEMENT SYSTEM
 * 
 * Gamification elements to motivate users and track progress.
 */
const defaultAchievements: InsertAchievement[] = [
  {
    name: "First Steps",
    description: "Complete your first workout",
    icon: "fas fa-baby",
    requirement: { type: "total_workouts", value: 1 },
  },
  {
    name: "Streak Starter",
    description: "Complete workouts for 3 days in a row",
    icon: "fas fa-fire",
    requirement: { type: "current_streak", value: 3 },
  },
  {
    name: "Week Warrior",
    description: "Complete workouts for 7 days in a row",
    icon: "fas fa-trophy",
    requirement: { type: "current_streak", value: 7 },
  },
  {
    name: "Streak Master",
    description: "Complete workouts for 30 days in a row",
    icon: "fas fa-crown",
    requirement: { type: "current_streak", value: 30 },
  },
  {
    name: "Century Club",
    description: "Complete 100 total workouts",
    icon: "fas fa-medal",
    requirement: { type: "total_workouts", value: 100 },
  },
  {
    name: "Cardio King",
    description: "Complete 25 cardio workouts",
    icon: "fas fa-heart",
    requirement: { type: "category_workouts", category: "cardio", value: 25 },
  },
  {
    name: "Strength Master",
    description: "Complete 25 strength workouts",
    icon: "fas fa-dumbbell",
    requirement: { type: "category_workouts", category: "strength", value: 25 },
  },
  {
    name: "Flexibility Friend",
    description: "Complete 15 flexibility workouts",
    icon: "fas fa-leaf",
    requirement: { type: "category_workouts", category: "flexibility", value: 15 },
  },
  {
    name: "Time Keeper",
    description: "Log 10 hours of total workout time",
    icon: "fas fa-clock",
    requirement: { type: "total_minutes", value: 600 },
  },
  {
    name: "Level Up",
    description: "Reach level 5",
    icon: "fas fa-star",
    requirement: { type: "current_level", value: 5 },
  },
  {
    name: "XP Hunter",
    description: "Earn 1000 experience points",
    icon: "fas fa-bolt",
    requirement: { type: "experience_points", value: 1000 },
  },
  {
    name: "Perfect Week",
    description: "Complete workouts every day for a full week",
    icon: "fas fa-gem",
    requirement: { type: "perfect_week", value: 1 },
  },
];

/**
 * XP ACTIVITIES SYSTEM
 * 
 * Defines how users earn experience points for various activities.
 */
const defaultXpActivities: InsertXpActivity[] = [
  {
    activityType: "workout_complete",
    baseXP: 50,
    description: "Complete a workout",
    multiplierField: null,
    isActive: true,
  },
  {
    activityType: "workout_duration_bonus",
    baseXP: 2,
    description: "Bonus XP per minute of workout",
    multiplierField: "duration_minutes",
    isActive: true,
  },
  {
    activityType: "streak_bonus_3",
    baseXP: 25,
    description: "3-day streak bonus",
    multiplierField: null,
    isActive: true,
  },
  {
    activityType: "streak_bonus_7",
    baseXP: 100,
    description: "7-day streak bonus",
    multiplierField: null,
    isActive: true,
  },
  {
    activityType: "streak_bonus_30",
    baseXP: 500,
    description: "30-day streak bonus",
    multiplierField: null,
    isActive: true,
  },
  {
    activityType: "perfect_workout",
    baseXP: 25,
    description: "Complete workout with all exercises",
    multiplierField: null,
    isActive: true,
  },
  {
    activityType: "difficulty_bonus",
    baseXP: 10,
    description: "Bonus for high difficulty workouts",
    multiplierField: "difficulty_level",
    isActive: true,
  },
  {
    activityType: "first_daily_workout",
    baseXP: 15,
    description: "First workout of the day",
    multiplierField: null,
    isActive: true,
  },
];

/**
 * BADGES SYSTEM
 * 
 * Special recognition badges for achievements and events.
 */
const defaultBadges: InsertBadge[] = [
  {
    name: "Top Performer",
    description: "Finished in top 10 this week",
    icon: "fas fa-medal",
    type: "weekly_top",
    rarity: "rare",
  },
  {
    name: "Weekly Champion",
    description: "Finished #1 this week",
    icon: "fas fa-trophy",
    type: "weekly_top",
    rarity: "epic",
  },
  {
    name: "Early Bird",
    description: "Completed 10 morning workouts",
    icon: "fas fa-sun",
    type: "special",
    rarity: "common",
  },
  {
    name: "Night Owl",
    description: "Completed 10 evening workouts",
    icon: "fas fa-moon",
    type: "special",
    rarity: "common",
  },
  {
    name: "Comeback Kid",
    description: "Returned after 30+ day break",
    icon: "fas fa-phoenix-rising",
    type: "special",
    rarity: "rare",
  },
  {
    name: "Perfectionist",
    description: "Completed 20 workouts without losing a life",
    icon: "fas fa-diamond",
    type: "special",
    rarity: "legendary",
  },
];

/**
 * DECK EXERCISE CONFIGURATIONS
 * 
 * Defines which exercises go in which decks and their order.
 */
const deckExerciseConfigurations = {
  "Quick Start": [
    { exerciseName: "Arm Circles", order: 1, customReps: 10, customDuration: null },
    { exerciseName: "Jumping Jacks", order: 2, customReps: 15, customDuration: null },
    { exerciseName: "Push-ups", order: 3, customReps: 8, customDuration: null },
    { exerciseName: "Squats", order: 4, customReps: 12, customDuration: null },
    { exerciseName: "Plank", order: 5, customReps: null, customDuration: 20 },
    { exerciseName: "Shoulder Stretch", order: 6, customReps: null, customDuration: 15 },
  ],
  "Cardio Blast": [
    { exerciseName: "Jumping Jacks", order: 1, customReps: 25, customDuration: null },
    { exerciseName: "High Knees", order: 2, customReps: 20, customDuration: null },
    { exerciseName: "Mountain Climbers", order: 3, customReps: 15, customDuration: null },
    { exerciseName: "Burpees", order: 4, customReps: 8, customDuration: null },
    { exerciseName: "Jumping Jacks", order: 5, customReps: 20, customDuration: null },
  ],
  "Strength Builder": [
    { exerciseName: "Push-ups", order: 1, customReps: 12, customDuration: null },
    { exerciseName: "Squats", order: 2, customReps: 18, customDuration: null },
    { exerciseName: "Lunges", order: 3, customReps: 16, customDuration: null },
    { exerciseName: "Plank", order: 4, customReps: null, customDuration: 45 },
    { exerciseName: "Crunches", order: 5, customReps: 20, customDuration: null },
    { exerciseName: "Bicycle Crunches", order: 6, customReps: 16, customDuration: null },
  ],
  "Flexibility Focus": [
    { exerciseName: "Arm Circles", order: 1, customReps: 15, customDuration: null },
    { exerciseName: "Leg Swings", order: 2, customReps: 12, customDuration: null },
    { exerciseName: "Shoulder Stretch", order: 3, customReps: null, customDuration: 30 },
    { exerciseName: "Shoulder Stretch", order: 4, customReps: null, customDuration: 30 },
  ],
};

/**
 * SEED DATABASE FUNCTION
 * 
 * Populates the database with comprehensive default data.
 */
export async function seedDatabase(): Promise<void> {
  console.log("[SeedData] Starting database seeding...");
  
  try {
    // Clear existing data
    console.log("[SeedData] Clearing existing data...");
    await db.delete(deckExercises);
    await db.delete(decks);
    await db.delete(exercises);
    await db.delete(achievements);
    await db.delete(badges);
    await db.delete(xpActivities);
    
    // Insert exercises
    console.log("[SeedData] Inserting exercises...");
    const insertedExercises = await db
      .insert(exercises)
      .values(defaultExercises.map(ex => ({ ...ex, createdAt: new Date() })))
      .returning();
    
    console.log(`[SeedData] Inserted ${insertedExercises.length} exercises`);
    
    // Insert achievements
    console.log("[SeedData] Inserting achievements...");
    const insertedAchievements = await db
      .insert(achievements)
      .values(defaultAchievements.map(ach => ({ ...ach, createdAt: new Date() })))
      .returning();
    
    console.log(`[SeedData] Inserted ${insertedAchievements.length} achievements`);
    
    // Insert XP activities
    console.log("[SeedData] Inserting XP activities...");
    const insertedXpActivities = await db
      .insert(xpActivities)
      .values(defaultXpActivities)
      .returning();
    
    console.log(`[SeedData] Inserted ${insertedXpActivities.length} XP activities`);
    
    // Insert badges
    console.log("[SeedData] Inserting badges...");
    const insertedBadges = await db
      .insert(badges)
      .values(defaultBadges.map(badge => ({ ...badge, createdAt: new Date() })))
      .returning();
    
    console.log(`[SeedData] Inserted ${insertedAchievements.length} achievements`);
    
    // Insert decks
    console.log("[SeedData] Inserting decks...");
    const insertedDecks = await db
      .insert(decks)
      .values(defaultDecks.map(deck => ({ ...deck, createdAt: new Date() })))
      .returning();
    
    console.log(`[SeedData] Inserted ${insertedDecks.length} decks`);
    
    // Insert deck exercises
    console.log("[SeedData] Inserting deck exercises...");
    for (const deck of insertedDecks) {
      const exerciseConfig = deckExerciseConfigurations[deck.name as keyof typeof deckExerciseConfigurations];
      
      if (exerciseConfig) {
        const deckExercisesToInsert: InsertDeckExercise[] = [];
        
        for (const config of exerciseConfig) {
          const exercise = insertedExercises.find(ex => ex.name === config.exerciseName);
          if (exercise) {
            deckExercisesToInsert.push({
              deckId: deck.id,
              exerciseId: exercise.id,
              order: config.order,
              customReps: config.customReps,
              customDuration: config.customDuration,
            });
          }
        }
        
        if (deckExercisesToInsert.length > 0) {
          await db.insert(deckExercises).values(deckExercisesToInsert);
          console.log(`[SeedData] Added ${deckExercisesToInsert.length} exercises to deck "${deck.name}"`);
        }
      }
    }
    
    console.log("[SeedData] Database seeding completed successfully!");
    
    // Print summary
    console.log("\n🎯 DATABASE SEEDING SUMMARY:");
    console.log(`   Exercises: ${insertedExercises.length}`);
    console.log(`   Decks: ${insertedDecks.length}`);
    console.log(`   Achievements: ${insertedAchievements.length}`);
    console.log(`   Total deck exercises: ${Object.values(deckExerciseConfigurations).flat().length}`);
    
  } catch (error) {
    console.error("[SeedData] Error during database seeding:", error);
    throw error;
  }
}

/**
 * CHECK IF DATABASE NEEDS SEEDING
 * 
 * Checks if the database is empty and needs to be seeded.
 */
export async function checkAndSeedDatabase(): Promise<void> {
  try {
    const [exerciseCount] = await db
      .select({ count: exercises.id })
      .from(exercises);
    
    if (!exerciseCount || exerciseCount.count === 0) {
      console.log("[SeedData] Database appears to be empty, seeding...");
      await seedDatabase();
    } else {
      console.log(`[SeedData] Database already contains ${exerciseCount.count} exercises, skipping seeding`);
    }
  } catch (error) {
    console.error("[SeedData] Error checking database state:", error);
    // If there's an error, try seeding anyway
    await seedDatabase();
  }
}