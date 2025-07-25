/**
 * GAMIFICATION API ROUTES
 * 
 * Handles all gamification-related endpoints:
 * - XP and level management
 * - Achievement system
 * - Leaderboards  
 * - Daily streak tracking
 * - Life/Heart system
 * - Badge management
 */

import { Router, Request, Response } from "express";
import { db } from "./db";
import { 
  users, 
  achievements, 
  userAchievements,
  leaderboards,
  badges,
  userBadges,
  xpActivities
} from "@shared/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import * as gamification from "./gamification";

export const gamificationRouter = Router();

/**
 * XP AND LEVEL ENDPOINTS
 */

// Get user's current XP and level info
gamificationRouter.get("/xp", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      // Return anonymous user data for unauthenticated users
      return res.json({
        experiencePoints: 0,
        currentLevel: 1,
        xpToNextLevel: 100,
        isAnonymous: true
      });
    }

    const [user] = await db
      .select({
        experiencePoints: users.experiencePoints,
        currentLevel: users.currentLevel,
        xpToNextLevel: users.xpToNextLevel,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user XP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get XP activities configuration
gamificationRouter.get("/xp-activities", async (req: Request, res: Response) => {
  try {
    const activities = await db
      .select()
      .from(xpActivities)
      .where(eq(xpActivities.isActive, true));

    res.json(activities);
  } catch (error) {
    console.error("Error fetching XP activities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * ACHIEVEMENT ENDPOINTS
 */

// Get all achievements with user progress
gamificationRouter.get("/achievements", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      // Return all achievements with unlocked=false for anonymous users
      const allAchievements = await db.select().from(achievements);
      const achievementsWithProgress = allAchievements.map(achievement => ({
        ...achievement,
        unlocked: false,
        unlockedAt: null,
        isAnonymous: true
      }));
      return res.json(achievementsWithProgress);
    }

    // Get all achievements
    const allAchievements = await db
      .select()
      .from(achievements);

    // Get user's unlocked achievements
    const userUnlocked = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));

    const unlockedIds = new Set(userUnlocked.map(ua => ua.achievementId));

    // Combine data
    const achievementsWithProgress = allAchievements.map(achievement => ({
      ...achievement,
      unlocked: unlockedIds.has(achievement.id),
      unlockedAt: userUnlocked.find(ua => ua.achievementId === achievement.id)?.unlockedAt || null,
    }));

    res.json(achievementsWithProgress);
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's unlocked achievements only
gamificationRouter.get("/achievements/unlocked", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const unlockedAchievements = await db
      .select({
        id: achievements.id,
        name: achievements.name,
        description: achievements.description,
        icon: achievements.icon,
        unlockedAt: userAchievements.unlockedAt,
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.unlockedAt));

    res.json(unlockedAchievements);
  } catch (error) {
    console.error("Error fetching unlocked achievements:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * STREAK ENDPOINTS
 */

// Get user's streak information
gamificationRouter.get("/streak", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [user] = await db
      .select({
        currentStreak: users.currentStreak,
        longestStreak: users.longestStreak,
        lastWorkoutDate: users.lastWorkoutDate,
        streakFreezeUses: users.streakFreezeUses,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate if streak is at risk (no workout yesterday)
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    
    let isAtRisk = false;
    if (user.lastWorkoutDate) {
      const lastWorkout = new Date(user.lastWorkoutDate);
      const lastWorkoutDay = new Date(lastWorkout.getFullYear(), lastWorkout.getMonth(), lastWorkout.getDate());
      isAtRisk = lastWorkoutDay < yesterdayStart && user.currentStreak > 0;
    }

    res.json({
      ...user,
      isAtRisk,
      canUseFreeze: user.streakFreezeUses < 3, // Max 3 per month
    });
  } catch (error) {
    console.error("Error fetching streak info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Use streak freeze
gamificationRouter.post("/streak/freeze", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const success = await gamification.useStreakFreeze(userId);
    
    if (success) {
      res.json({ message: "Streak freeze applied successfully" });
    } else {
      res.status(400).json({ message: "No streak freezes remaining this month" });
    }
  } catch (error) {
    console.error("Error applying streak freeze:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * LEADERBOARD ENDPOINTS
 */

// Get main leaderboard (redirects to weekly)
gamificationRouter.get("/leaderboard", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const leaderboard = await gamification.getWeeklyLeaderboard(limit);
    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get weekly leaderboard
gamificationRouter.get("/leaderboard/weekly", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const leaderboard = await gamification.getWeeklyLeaderboard(limit);

    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching weekly leaderboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's current weekly rank
gamificationRouter.get("/leaderboard/my-rank", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get current week's leaderboard to find user's position
    const leaderboard = await gamification.getWeeklyLeaderboard(1000); // Get more entries to find rank
    const userRank = leaderboard.findIndex(entry => entry.userId === userId) + 1;

    const userEntry = leaderboard.find(entry => entry.userId === userId);

    res.json({
      rank: userRank || null,
      weeklyXP: userEntry?.weeklyXP || 0,
      weeklyWorkouts: userEntry?.weeklyWorkouts || 0,
      weeklyMinutes: userEntry?.weeklyMinutes || 0,
      totalParticipants: leaderboard.length,
    });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * LIFE/HEART SYSTEM ENDPOINTS
 */

// Get user's current lives
gamificationRouter.get("/lives", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check and restore lives if needed
    const livesRemaining = await gamification.checkAndRestoreLives(userId);

    const [user] = await db
      .select({
        livesRemaining: users.livesRemaining,
        livesRefillAt: users.livesRefillAt,
        lastLifeLoss: users.lastLifeLoss,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      livesRemaining: livesRemaining,
      maxLives: 5,
      livesRefillAt: user.livesRefillAt,
      timeUntilRefill: user.livesRefillAt ? 
        Math.max(0, new Date(user.livesRefillAt).getTime() - Date.now()) : null,
    });
  } catch (error) {
    console.error("Error fetching lives info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Deduct a life (for mistakes/failures)
gamificationRouter.post("/lives/deduct", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await gamification.deductLife(userId);
    res.json(result);
  } catch (error) {
    console.error("Error deducting life:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * BADGES ENDPOINTS
 */

// Get all badges
gamificationRouter.get("/badges", async (req: Request, res: Response) => {
  try {
    const allBadges = await db
      .select()
      .from(badges)
      .orderBy(badges.rarity, badges.name);

    res.json(allBadges);
  } catch (error) {
    console.error("Error fetching badges:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's earned badges
gamificationRouter.get("/badges/earned", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const earnedBadges = await db
      .select({
        id: badges.id,
        name: badges.name,
        description: badges.description,
        icon: badges.icon,
        type: badges.type,
        rarity: badges.rarity,
        earnedAt: userBadges.earnedAt,
        weekEarned: userBadges.weekEarned,
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.earnedAt));

    res.json(earnedBadges);
  } catch (error) {
    console.error("Error fetching earned badges:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * GAMIFICATION SUMMARY ENDPOINT
 */

// Get complete gamification status for user
gamificationRouter.get("/summary", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      // Return anonymous user gamification data
      return res.json({
        experiencePoints: 0,
        currentLevel: 1,
        xpToNextLevel: 100,
        currentStreak: 0,
        longestStreak: 0,
        totalWorkouts: 0,
        totalMinutes: 0,
        livesRemaining: 3,
        streakFreezeUses: 0,
        weeklyRank: null,
        recentAchievements: [],
        isAnonymous: true
      });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get recent achievements (last 5)
    const recentAchievements = await db
      .select({
        name: achievements.name,
        description: achievements.description,
        icon: achievements.icon,
        unlockedAt: userAchievements.unlockedAt,
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.unlockedAt))
      .limit(5);

    // Get weekly rank
    const leaderboard = await gamification.getWeeklyLeaderboard(100);
    const weeklyRank = leaderboard.findIndex(entry => entry.userId === userId) + 1;

    // Check and restore lives
    const currentLives = await gamification.checkAndRestoreLives(userId);

    res.json({
      // XP and Level
      experiencePoints: user.experiencePoints,
      currentLevel: user.currentLevel,
      xpToNextLevel: user.xpToNextLevel,
      
      // Streaks
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      
      // Progress
      totalWorkouts: user.totalWorkouts,
      totalMinutes: user.totalMinutes,
      
      // Gamification
      livesRemaining: currentLives,
      streakFreezeUses: user.streakFreezeUses,
      weeklyRank: weeklyRank || null,
      
      // Recent achievements
      recentAchievements,
    });
  } catch (error) {
    console.error("Error fetching gamification summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});