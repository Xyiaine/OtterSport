/**
 * GAMIFICATION SERVICE
 * 
 * Handles all gamification features including:
 * - XP and Level calculations
 * - Daily streak tracking with protection
 * - Achievement checking and unlocking
 * - Leaderboard management
 * - Life/Heart system
 * - Badge awarding
 */

import { db, storage } from "./db";
import { 
  users, 
  workouts, 
  achievements, 
  userAchievements, 
  leaderboards,
  badges,
  userBadges,
  xpActivities,
  type User,
  type Workout,
  type Achievement,
  type XpActivity
} from "@shared/schema";
import { eq, and, desc, asc, gte, lte, sql } from "drizzle-orm";

/**
 * XP AND LEVEL SYSTEM
 */

// Level thresholds - exponential growth
const LEVEL_THRESHOLDS = [
  0,     // Level 1: 0 XP
  100,   // Level 2: 100 XP
  250,   // Level 3: 250 XP
  450,   // Level 4: 450 XP
  700,   // Level 5: 700 XP
  1000,  // Level 6: 1000 XP
  1350,  // Level 7: 1350 XP
  1750,  // Level 8: 1750 XP
  2200,  // Level 9: 2200 XP
  2700,  // Level 10: 2700 XP
  3250,  // Level 11: 3250 XP
  3850,  // Level 12: 3850 XP
  4500,  // Level 13: 4500 XP
  5200,  // Level 14: 5200 XP
  5950,  // Level 15: 5950 XP
];

/**
 * Calculate the level for a given XP amount
 */
function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * Calculate XP needed for next level
 */
function calculateXPToNextLevel(xp: number, currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    // Beyond max level - use exponential formula
    const nextLevelXP = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 
      (currentLevel - LEVEL_THRESHOLDS.length + 1) * 1000;
    return Math.max(0, nextLevelXP - xp);
  }
  
  const nextLevelXP = LEVEL_THRESHOLDS[currentLevel];
  return nextLevelXP ? Math.max(0, nextLevelXP - xp) : 0;
}

/**
 * Calculate XP for a workout based on various factors
 */
export async function calculateWorkoutXP(workout: Workout, user: User): Promise<number> {
  // Get XP activities configuration
  const activities = await db
    .select()
    .from(xpActivities)
    .where(eq(xpActivities.isActive, true));

  let totalXP = 0;

  // Base workout completion XP
  const baseWorkout = activities.find(a => a.activityType === 'workout_complete');
  if (baseWorkout) {
    totalXP += baseWorkout.baseXP;
  }

  // Duration bonus
  if (workout.duration) {
    const durationBonus = activities.find(a => a.activityType === 'workout_duration_bonus');
    if (durationBonus) {
      const minutes = Math.floor(workout.duration / 60);
      totalXP += durationBonus.baseXP * minutes;
    }
  }

  // Perfect workout bonus (completed all cards)
  if (workout.cardsCompleted === workout.totalCards) {
    const perfectBonus = activities.find(a => a.activityType === 'perfect_workout');
    if (perfectBonus) {
      totalXP += perfectBonus.baseXP;
    }
  }

  // First workout of the day bonus
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysWorkouts = await db
    .select({ count: sql<number>`count(*)` })
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, user.id),
        gte(workouts.completedAt, today.toISOString())
      )
    );

  if (todaysWorkouts[0].count === 1) {
    const firstDailyBonus = activities.find(a => a.activityType === 'first_daily_workout');
    if (firstDailyBonus) {
      totalXP += firstDailyBonus.baseXP;
    }
  }

  // Streak bonuses
  if (user.currentStreak >= 30) {
    const streak30 = activities.find(a => a.activityType === 'streak_bonus_30');
    if (streak30) totalXP += streak30.baseXP;
  } else if (user.currentStreak >= 7) {
    const streak7 = activities.find(a => a.activityType === 'streak_bonus_7');
    if (streak7) totalXP += streak7.baseXP;
  } else if (user.currentStreak >= 3) {
    const streak3 = activities.find(a => a.activityType === 'streak_bonus_3');
    if (streak3) totalXP += streak3.baseXP;
  }

  return totalXP;
}

/**
 * Update user XP and level after workout completion
 */
export async function updateUserXPAndLevel(userId: string, xpGained: number): Promise<{
  newXP: number;
  newLevel: number;
  leveledUp: boolean;
}> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    throw new Error('User not found');
  }

  const newXP = user.experiencePoints + xpGained;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > user.currentLevel;
  const xpToNextLevel = calculateXPToNextLevel(newXP, newLevel);

  await db
    .update(users)
    .set({
      experiencePoints: newXP,
      currentLevel: newLevel,
      xpToNextLevel: xpToNextLevel,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return {
    newXP,
    newLevel,
    leveledUp,
  };
}

/**
 * STREAK SYSTEM
 */

/**
 * Update daily streak after workout completion
 */
export async function updateDailyStreak(userId: string): Promise<{
  newStreak: number;
  streakMaintained: boolean;
  streakIncreased: boolean;
}> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    throw new Error('User not found');
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  let newStreak = user.currentStreak;
  let streakMaintained = true;
  let streakIncreased = false;

  // If no previous workout date, start streak at 1
  if (!user.lastWorkoutDate) {
    newStreak = 1;
    streakIncreased = true;
  } else {
    const lastWorkoutDate = new Date(user.lastWorkoutDate);
    const lastWorkoutDay = new Date(lastWorkoutDate.getFullYear(), lastWorkoutDate.getMonth(), lastWorkoutDate.getDate());

    // Check if workout is on a new day
    if (today.getTime() > lastWorkoutDay.getTime()) {
      // If workout is today and last workout was yesterday, increment streak
      if (today.getTime() === lastWorkoutDay.getTime() + 24 * 60 * 60 * 1000) {
        newStreak += 1;
        streakIncreased = true;
      }
      // If workout is today but there's a gap, reset streak
      else if (today.getTime() > lastWorkoutDay.getTime() + 24 * 60 * 60 * 1000) {
        newStreak = 1;
        streakMaintained = false;
        streakIncreased = true;
      }
    }
    // If workout is on the same day, streak stays the same (streakMaintained = true)
  }

  // Update longest streak if necessary
  const newLongestStreak = Math.max(user.longestStreak, newStreak);

  await db
    .update(users)
    .set({
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastWorkoutDate: now,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return {
    newStreak,
    streakMaintained,
    streakIncreased,
  };
}

/**
 * Use a streak freeze (protection)
 */
export async function useStreakFreeze(userId: string): Promise<boolean> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    return false;
  }

  // Check if user has freeze uses remaining (max 3 per month)
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  if (user.streakFreezeUses >= 3) {
    return false; // No more freezes available this month
  }

  await db
    .update(users)
    .set({
      streakFreezeUses: user.streakFreezeUses + 1,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return true;
}

/**
 * ACHIEVEMENT SYSTEM
 */

/**
 * Check and award achievements after workout completion
 */
export async function checkAndAwardAchievements(userId: string): Promise<Achievement[]> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    return [];
  }

  // Get all achievements
  const allAchievements = await db
    .select()
    .from(achievements);

  // Get user's existing achievements
  const userExistingAchievements = await db
    .select()
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId));

  const existingAchievementIds = new Set(userExistingAchievements.map(ua => ua.achievementId));
  const newlyAwarded: Achievement[] = [];

  // Check each achievement
  for (const achievement of allAchievements) {
    if (existingAchievementIds.has(achievement.id)) {
      continue; // User already has this achievement
    }

    const requirement = achievement.requirement as any;
    let qualifies = false;

    switch (requirement.type) {
      case 'total_workouts':
        qualifies = user.totalWorkouts >= requirement.value;
        break;
      case 'current_streak':
        qualifies = user.currentStreak >= requirement.value;
        break;
      case 'experience_points':
        qualifies = user.experiencePoints >= requirement.value;
        break;
      case 'current_level':
        qualifies = user.currentLevel >= requirement.value;
        break;
      case 'total_minutes':
        qualifies = user.totalMinutes >= requirement.value;
        break;
      case 'category_workouts':
        // Would need to query workouts table for category-specific counts
        const categoryCount = await getCategoryWorkoutCount(userId, requirement.category);
        qualifies = categoryCount >= requirement.value;
        break;
      case 'perfect_week':
        // Check if user has completed workouts every day for a week
        qualifies = await checkPerfectWeek(userId);
        break;
    }

    if (qualifies) {
      // Award achievement
      await db
        .insert(userAchievements)
        .values({
          userId,
          achievementId: achievement.id,
          unlockedAt: new Date(),
        });

      newlyAwarded.push(achievement);
    }
  }

  return newlyAwarded;
}

/**
 * Get workout count for a specific category
 */
async function getCategoryWorkoutCount(userId: string, category: string): Promise<number> {
  // This would require joining with decks table to get category
  // For now, return 0 - would implement with proper deck category tracking
  return 0;
}

/**
 * Check if user has a perfect week (7 consecutive days with workouts)
 */
async function checkPerfectWeek(userId: string): Promise<boolean> {
  // Check last 7 days for consecutive workouts
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentWorkouts = await db
    .select({
      completedAt: workouts.completedAt
    })
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.completedAt, sevenDaysAgo.toISOString())
      )
    )
    .orderBy(desc(workouts.completedAt));

  // Check if there's at least one workout each day for 7 consecutive days
  const workoutDays = new Set();
  recentWorkouts.forEach(workout => {
    if (workout.completedAt) {
      const date = new Date(workout.completedAt);
      const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      workoutDays.add(dayKey);
    }
  });

  return workoutDays.size >= 7;
}

/**
 * LIFE/HEART SYSTEM
 */

/**
 * Deduct a life from user for mistake/failure
 */
export async function deductLife(userId: string): Promise<{
  livesRemaining: number;
  canContinue: boolean;
}> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    throw new Error('User not found');
  }

  const newLives = Math.max(0, user.livesRemaining - 1);
  const now = new Date();

  await db
    .update(users)
    .set({
      livesRemaining: newLives,
      lastLifeLoss: now,
      // Set refill time if all lives are lost (refill in 30 minutes)
      livesRefillAt: newLives === 0 ? new Date(now.getTime() + 30 * 60 * 1000) : user.livesRefillAt,
      updatedAt: now,
    })
    .where(eq(users.id, userId));

  return {
    livesRemaining: newLives,
    canContinue: newLives > 0,
  };
}

/**
 * Restore lives if refill time has passed
 */
export async function checkAndRestoreLives(userId: string): Promise<number> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    return 0;
  }

  const now = new Date();
  
  // If lives are full, no need to check
  if (user.livesRemaining >= 5) {
    return user.livesRemaining;
  }

  // If refill time has passed, restore all lives
  if (user.livesRefillAt && now >= new Date(user.livesRefillAt)) {
    await db
      .update(users)
      .set({
        livesRemaining: 5,
        livesRefillAt: null,
        updatedAt: now,
      })
      .where(eq(users.id, userId));
    
    return 5;
  }

  return user.livesRemaining;
}

/**
 * LEADERBOARD SYSTEM
 */

/**
 * Update weekly leaderboard entry
 */
export async function updateWeeklyLeaderboard(userId: string, xpGained: number, workoutMinutes: number): Promise<void> {
  const now = new Date();
  const weekStart = getWeekStart(now);

  // Check if entry exists for this week
  const existingEntry = await db
    .select()
    .from(leaderboards)
    .where(
      and(
        eq(leaderboards.userId, userId),
        eq(leaderboards.weekStart, weekStart)
      )
    );

  if (existingEntry.length > 0) {
    // Update existing entry
    await db
      .update(leaderboards)
      .set({
        weeklyXP: existingEntry[0].weeklyXP + xpGained,
        weeklyWorkouts: existingEntry[0].weeklyWorkouts + 1,
        weeklyMinutes: existingEntry[0].weeklyMinutes + workoutMinutes,
      })
      .where(eq(leaderboards.id, existingEntry[0].id));
  } else {
    // Create new entry
    await db
      .insert(leaderboards)
      .values({
        userId,
        weekStart,
        weeklyXP: xpGained,
        weeklyWorkouts: 1,
        weeklyMinutes: workoutMinutes,
      });
  }
}

/**
 * Get weekly leaderboard
 */
export async function getWeeklyLeaderboard(limit: number = 50): Promise<any[]> {
  const weekStart = getWeekStart(new Date());

  return await db
    .select({
      userId: leaderboards.userId,
      weeklyXP: leaderboards.weeklyXP,
      weeklyWorkouts: leaderboards.weeklyWorkouts,
      weeklyMinutes: leaderboards.weeklyMinutes,
      firstName: users.firstName,
      lastName: users.lastName,
      currentLevel: users.currentLevel,
    })
    .from(leaderboards)
    .innerJoin(users, eq(leaderboards.userId, users.id))
    .where(eq(leaderboards.weekStart, weekStart))
    .orderBy(desc(leaderboards.weeklyXP))
    .limit(limit);
}

/**
 * Get the start of the week (Monday)
 */
function getWeekStart(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const weekStart = new Date(date.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

/**
 * COMPLETE WORKOUT GAMIFICATION
 * 
 * Main function to handle all gamification when a workout is completed
 */
export async function processWorkoutCompletion(workoutId: number, userId: string): Promise<{
  xpGained: number;
  newLevel: number;
  leveledUp: boolean;
  newStreak: number;
  streakIncreased: boolean;
  newAchievements: Achievement[];
  livesRestored: number;
}> {
  // Total Health System - Workout Completion Monitoring
  console.log(`[Total Health] Processing workout completion - ID: ${workoutId}, User: ${userId}`);
  
  // Health Check: Verify database connection
  if (!db && !storage) {
    console.error('[Total Health] Critical Error: No database or storage available');
    throw new Error('Database connection failed - Total Health System preventing data loss');
  }

  let workout: any;
  let user: any;

  try {
    // Use database if available, otherwise use storage interface
    if (db) {
      console.log('[Total Health] Using PostgreSQL database for workout retrieval');
      const [workoutResult] = await db
        .select()
        .from(workouts)
        .where(eq(workouts.id, workoutId));
      workout = workoutResult;

      const [userResult] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));
      user = userResult;
    } else {
      console.log('[Total Health] Using in-memory storage for workout retrieval');
      // Use storage interface for in-memory operations
      workout = await storage.getWorkout?.(workoutId);
      user = await storage.getUser?.(userId);
    }

    // Health Check: Validate workout data
    if (!workout) {
      console.error(`[Total Health] Workout not found - ID: ${workoutId}`);
      throw new Error('Workout not found - Total Health System preventing invalid operation');
    }

    // Health Check: Validate user data
    if (!user) {
      console.error(`[Total Health] User not found - ID: ${userId}`);
      throw new Error('User not found - Total Health System preventing invalid operation');
    }

    console.log(`[Total Health] Successfully retrieved workout and user data`);
  } catch (error) {
    console.error(`[Total Health] Error retrieving workout/user data:`, error);
    throw new Error(`Failed to retrieve workout data - Total Health System error: ${error.message}`);
  }

  // Calculate and award XP
  const xpGained = await calculateWorkoutXP(workout, user);
  const { newLevel, leveledUp } = await updateUserXPAndLevel(userId, xpGained);

  // Update streak
  const { newStreak, streakIncreased } = await updateDailyStreak(userId);

  // Check for new achievements
  const newAchievements = await checkAndAwardAchievements(userId);

  // Update leaderboard
  const workoutMinutes = workout.duration ? Math.floor(workout.duration / 60) : 0;
  await updateWeeklyLeaderboard(userId, xpGained, workoutMinutes);

  // Check and restore lives if needed
  const livesRestored = await checkAndRestoreLives(userId);

  return {
    xpGained,
    newLevel,
    leveledUp,
    newStreak,
    streakIncreased,
    newAchievements,
    livesRestored,
  };
}