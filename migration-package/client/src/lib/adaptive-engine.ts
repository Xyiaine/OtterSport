import type { User } from "@shared/schema";

/**
 * ADAPTIVE WORKOUT DIFFICULTY ENGINE
 * 
 * This system automatically adjusts workout difficulty based on user feedback,
 * ensuring optimal challenge levels for consistent progression.
 * 
 * Key Features:
 * - Real-time difficulty adjustment based on user feedback
 * - User fitness level consideration for personalized progression
 * - Consecutive feedback analysis for pattern recognition
 * - Safe difficulty bounds to prevent injury or discouragement
 */

// Feedback types that users can provide after workouts
export type FeedbackType = 'too_easy' | 'just_right' | 'bit_too_hard' | 'way_too_hard';

// Comprehensive adaptive settings returned by the engine
export interface AdaptiveSettings {
  difficultyLevel: number;
  recommendations: {
    adjustDifficulty: boolean;   // Should we adjust exercise difficulty?
    adjustVolume: boolean;       // Should we adjust workout volume?
    adjustRest: boolean;         // Should we adjust rest periods?
    message: string;             // Human-readable recommendation
  };
}

/**
 * Core adaptive engine that adjusts difficulty based on user feedback
 * 
 * This engine analyzes user feedback patterns and fitness levels to calculate
 * optimal difficulty adjustments, ensuring users stay in their optimal challenge zone.
 */
export class AdaptiveEngine {
  private static readonly DIFFICULTY_ADJUSTMENT_RATES = {
    too_easy: 0.15,      // Increase difficulty by 15%
    just_right: 0.0,     // No change
    bit_too_hard: -0.1,  // Decrease difficulty by 10%
    way_too_hard: -0.2   // Decrease difficulty by 20%
  };

  private static readonly MIN_DIFFICULTY = 0.3;
  private static readonly MAX_DIFFICULTY = 2.5;

  /**
   * Calculate new difficulty level based on user feedback
   * 
   * This is the core algorithm that processes user feedback and calculates
   * the optimal difficulty adjustment to maintain appropriate challenge levels.
   * 
   * @param currentDifficulty - Current difficulty multiplier (0.3 to 2.5)
   * @param feedback - User's workout feedback
   * @param consecutiveFeedback - Recent feedback history for pattern analysis
   * @param userLevel - User's fitness level for personalized adjustments
   * @returns New difficulty level clamped to safe bounds
   */
  static calculateNewDifficulty(
    currentDifficulty: number,
    feedback: FeedbackType,
    consecutiveFeedback?: FeedbackType[],
    userLevel?: 'beginner' | 'casual' | 'fit' | 'athlete'
  ): number {
    let adjustmentRate = this.DIFFICULTY_ADJUSTMENT_RATES[feedback];

    // Apply consecutive feedback modifier
    if (consecutiveFeedback && consecutiveFeedback.length >= 2) {
      const lastTwoSame = consecutiveFeedback.slice(-2).every(f => f === feedback);
      if (lastTwoSame && feedback !== 'just_right') {
        // Amplify adjustment if user has given same feedback multiple times
        adjustmentRate *= 1.5;
      }
    }

    // Apply user level modifier
    if (userLevel) {
      const levelModifiers = {
        beginner: 0.8,   // More conservative adjustments
        casual: 0.9,
        fit: 1.0,
        athlete: 1.2     // More aggressive adjustments
      };
      adjustmentRate *= levelModifiers[userLevel];
    }

    const newDifficulty = currentDifficulty * (1 + adjustmentRate);
    
    // Clamp to valid range
    return Math.max(
      this.MIN_DIFFICULTY,
      Math.min(this.MAX_DIFFICULTY, Math.round(newDifficulty * 100) / 100)
    );
  }

  /**
   * Get adaptive settings and recommendations based on user data
   */
  static getAdaptiveSettings(
    user: User,
    recentFeedback: FeedbackType[] = []
  ): AdaptiveSettings {
    const currentDifficulty = user.currentDifficultyLevel || 1.0;
    const lastFeedback = user.lastWorkoutFeedback as FeedbackType;
    
    if (!lastFeedback) {
      return {
        difficultyLevel: currentDifficulty,
        recommendations: {
          adjustDifficulty: false,
          adjustVolume: false,
          adjustRest: false,
          message: "Complete a workout to get personalized recommendations!"
        }
      };
    }

    const newDifficulty = this.calculateNewDifficulty(
      currentDifficulty,
      lastFeedback,
      recentFeedback,
      user.fitnessLevel as any
    );

    const difficultyChanged = Math.abs(newDifficulty - currentDifficulty) > 0.05;
    
    return {
      difficultyLevel: newDifficulty,
      recommendations: this.generateRecommendations(
        currentDifficulty,
        newDifficulty,
        lastFeedback,
        user,
        recentFeedback
      )
    };
  }

  /**
   * Generate specific recommendations based on feedback patterns
   */
  private static generateRecommendations(
    oldDifficulty: number,
    newDifficulty: number,
    lastFeedback: FeedbackType,
    user: User,
    recentFeedback: FeedbackType[]
  ) {
    const difficultyIncrease = newDifficulty > oldDifficulty;
    const difficultyDecrease = newDifficulty < oldDifficulty;
    const significantChange = Math.abs(newDifficulty - oldDifficulty) > 0.1;

    // Analyze feedback patterns
    const feedbackPattern = this.analyzeFeedbackPattern(recentFeedback);
    
    let message: string;
    let adjustDifficulty = significantChange;
    let adjustVolume = false;
    let adjustRest = false;

    switch (lastFeedback) {
      case 'too_easy':
        if (feedbackPattern.consistentEasy >= 2) {
          message = "You're crushing it! 💪 I'm increasing the challenge to keep you growing.";
          adjustVolume = true;
        } else {
          message = "Great work! Let's step it up a notch. 🚀";
        }
        break;

      case 'just_right':
        if (feedbackPattern.stable >= 3) {
          message = "Perfect consistency! 🎯 Let's add a tiny bit more challenge.";
          adjustDifficulty = true;
        } else {
          message = "Excellent! You've found your sweet spot. Keep it up! ⭐";
        }
        break;

      case 'bit_too_hard':
        message = "No worries! 😊 I'm scaling things back to keep you progressing comfortably.";
        adjustRest = true;
        break;

      case 'way_too_hard':
        if (feedbackPattern.consistentHard >= 2) {
          message = "Let's take a step back and rebuild your foundation. 🌱 You've got this!";
          adjustVolume = true;
          adjustRest = true;
        } else {
          message = "That was tough! 💙 I'm making the next workout more manageable.";
          adjustRest = true;
        }
        break;
    }

    // Add personalized touches based on user profile
    if (user.fitnessLevel === 'beginner' && difficultyIncrease) {
      message += " Remember, every step forward is progress! 🌟";
    } else if (user.fitnessLevel === 'athlete' && difficultyDecrease) {
      message += " Even champions need recovery days. 🏆";
    }

    return {
      adjustDifficulty,
      adjustVolume,
      adjustRest,
      message
    };
  }

  /**
   * Analyze patterns in recent feedback
   */
  private static analyzeFeedbackPattern(recentFeedback: FeedbackType[]) {
    const last5 = recentFeedback.slice(-5);
    
    return {
      consistentEasy: this.countConsecutive(last5, 'too_easy'),
      consistentHard: this.countConsecutive(last5, ['bit_too_hard', 'way_too_hard']),
      stable: this.countConsecutive(last5, 'just_right'),
      trending: this.getTrend(last5)
    };
  }

  /**
   * Count consecutive occurrences of specific feedback
   */
  private static countConsecutive(
    feedback: FeedbackType[], 
    target: FeedbackType | FeedbackType[]
  ): number {
    const targets = Array.isArray(target) ? target : [target];
    let count = 0;
    
    for (let i = feedback.length - 1; i >= 0; i--) {
      if (targets.includes(feedback[i])) {
        count++;
      } else {
        break;
      }
    }
    
    return count;
  }

  /**
   * Determine if feedback is trending in a direction
   */
  private static getTrend(feedback: FeedbackType[]): 'easier' | 'harder' | 'stable' {
    if (feedback.length < 3) return 'stable';
    
    const weights = {
      way_too_hard: -2,
      bit_too_hard: -1,
      just_right: 0,
      too_easy: 1
    };
    
    const recent = feedback.slice(-3).map(f => weights[f]);
    const trend = recent[2] - recent[0];
    
    if (trend > 0) return 'easier';
    if (trend < 0) return 'harder';
    return 'stable';
  }

  /**
   * Get motivational message based on user progress
   */
  static getMotivationalMessage(
    user: User,
    streak: number,
    totalWorkouts: number
  ): string {
    const messages = {
      newbie: [
        "Welcome to your fitness journey! Every workout counts! 🌟",
        "You're building something amazing, one workout at a time! 💪",
        "Great start! Your future self will thank you! 🚀"
      ],
      building: [
        "Look at you go! The habit is forming! 🔥",
        "Consistency is key, and you're nailing it! 👏",
        "Your dedication is inspiring! Keep it up! ⭐"
      ],
      strong: [
        "You're officially a fitness champion! 🏆",
        "Your commitment is incredible! Nothing can stop you! 💎",
        "You've proven that consistency creates results! 🌟"
      ],
      legendary: [
        "LEGENDARY status achieved! You're unstoppable! 👑",
        "You're not just working out, you're inspiring others! 🌟",
        "Your discipline is next level! Absolutely amazing! 🚀"
      ]
    };

    let category: keyof typeof messages;
    if (totalWorkouts < 5) category = 'newbie';
    else if (totalWorkouts < 20) category = 'building';
    else if (totalWorkouts < 50) category = 'strong';
    else category = 'legendary';

    const categoryMessages = messages[category];
    return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
  }

  /**
   * Calculate optimal workout frequency based on user data
   */
  static getOptimalFrequency(
    user: User,
    recentPerformance: { completionRate: number; averageFeedback: number }
  ): {
    daysPerWeek: number;
    restDayRecommendation: string;
  } {
    const baseFrequency = {
      daily: 6,
      three_per_week: 3,
      flexible: 4
    };

    let recommendedDays = baseFrequency[user.workoutFrequency as keyof typeof baseFrequency] || 4;

    // Adjust based on performance
    if (recentPerformance.completionRate < 0.7) {
      recommendedDays = Math.max(2, recommendedDays - 1);
    } else if (recentPerformance.completionRate > 0.9 && recentPerformance.averageFeedback > 3.5) {
      recommendedDays = Math.min(6, recommendedDays + 1);
    }

    const restDayMessages = {
      2: "Take plenty of rest days to build consistency! 🌱",
      3: "Great balance of work and recovery! 💪",
      4: "You're finding your rhythm! Keep it sustainable! ⚖️",
      5: "Strong routine! Don't forget to rest and recover! 🔄",
      6: "Incredible dedication! Make sure to listen to your body! 👂"
    };

    return {
      daysPerWeek: recommendedDays,
      restDayRecommendation: restDayMessages[recommendedDays as keyof typeof restDayMessages] || restDayMessages[4]
    };
  }
}

/**
 * Helper function to get user-friendly difficulty description
 */
export function getDifficultyDescription(level: number): string {
  if (level < 0.6) return "Very Easy";
  if (level < 0.8) return "Easy";
  if (level < 1.0) return "Gentle";
  if (level < 1.2) return "Moderate";
  if (level < 1.5) return "Challenging";
  if (level < 1.8) return "Hard";
  if (level < 2.1) return "Very Hard";
  return "Extreme";
}

/**
 * Helper function to get color for difficulty level
 */
export function getDifficultyColor(level: number): string {
  if (level < 0.8) return "text-green-500";
  if (level < 1.2) return "text-blue-500";
  if (level < 1.6) return "text-yellow-500";
  if (level < 2.0) return "text-orange-500";
  return "text-red-500";
}
