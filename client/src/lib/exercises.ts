import type { Exercise, DeckExercise } from "@shared/schema";

export interface ExerciseWithSettings extends Exercise {
  reps?: number;
  duration?: number;
  order: number;
}

export interface WorkoutDifficulty {
  multiplier: number;
  description: string;
}

/**
 * Calculate the effective difficulty of an exercise based on user's level
 */
export function calculateExerciseDifficulty(
  exercise: Exercise,
  userDifficultyLevel: number = 1.0,
  customReps?: number,
  customDuration?: number
): { reps?: number; duration?: number } {
  const effectiveMultiplier = exercise.difficulty * userDifficultyLevel;
  
  const result: { reps?: number; duration?: number } = {};
  
  if (exercise.defaultReps) {
    const baseReps = customReps || exercise.defaultReps;
    result.reps = Math.max(1, Math.round(baseReps * effectiveMultiplier));
  }
  
  if (exercise.defaultDuration) {
    const baseDuration = customDuration || exercise.defaultDuration;
    result.duration = Math.max(5, Math.round(baseDuration * effectiveMultiplier));
  }
  
  return result;
}

/**
 * Calculate the overall difficulty of a deck
 */
export function calculateDeckDifficulty(
  exercises: (DeckExercise & { exercise: Exercise })[]
): number {
  if (exercises.length === 0) return 1.0;
  
  const totalDifficulty = exercises.reduce((sum, deckExercise) => {
    return sum + deckExercise.exercise.difficulty;
  }, 0);
  
  return Number((totalDifficulty / exercises.length).toFixed(2));
}

/**
 * Estimate workout duration based on exercises
 */
export function estimateWorkoutDuration(
  exercises: (DeckExercise & { exercise: Exercise })[],
  userDifficultyLevel: number = 1.0
): number {
  let totalSeconds = 0;
  
  exercises.forEach((deckExercise) => {
    const { exercise } = deckExercise;
    const calculated = calculateExerciseDifficulty(
      exercise,
      userDifficultyLevel,
      deckExercise.customReps || undefined,
      deckExercise.customDuration || undefined
    );
    
    if (calculated.duration) {
      totalSeconds += calculated.duration;
    } else if (calculated.reps) {
      // Estimate 2 seconds per rep + 1 second rest
      totalSeconds += calculated.reps * 3;
    } else {
      // Default estimate
      totalSeconds += 30;
    }
    
    // Add transition time between exercises
    totalSeconds += 10;
  });
  
  // Convert to minutes and round up
  return Math.ceil(totalSeconds / 60);
}

/**
 * Filter exercises by category and difficulty
 */
export function filterExercises(
  exercises: Exercise[],
  options: {
    category?: string;
    maxDifficulty?: number;
    minDifficulty?: number;
    excludeIds?: number[];
  } = {}
): Exercise[] {
  return exercises.filter((exercise) => {
    if (options.category && exercise.category !== options.category) {
      return false;
    }
    
    if (options.maxDifficulty && exercise.difficulty > options.maxDifficulty) {
      return false;
    }
    
    if (options.minDifficulty && exercise.difficulty < options.minDifficulty) {
      return false;
    }
    
    if (options.excludeIds && options.excludeIds.includes(exercise.id)) {
      return false;
    }
    
    return true;
  });
}

/**
 * Create a balanced deck based on user preferences
 */
export function createBalancedDeck(
  availableExercises: Exercise[],
  options: {
    targetCards: number;
    category?: string;
    difficulty: number;
    userLevel: 'beginner' | 'casual' | 'fit' | 'athlete';
  }
): Exercise[] {
  const { targetCards, category, difficulty, userLevel } = options;
  
  // Difficulty ranges based on user level
  const difficultyRanges = {
    beginner: { min: 0.5, max: 1.2 },
    casual: { min: 0.8, max: 1.5 },
    fit: { min: 1.0, max: 1.8 },
    athlete: { min: 1.3, max: 2.0 }
  };
  
  const range = difficultyRanges[userLevel];
  const targetDifficulty = difficulty;
  
  // Filter exercises within appropriate difficulty range
  const filteredExercises = filterExercises(availableExercises, {
    category,
    minDifficulty: Math.max(range.min, targetDifficulty - 0.3),
    maxDifficulty: Math.min(range.max, targetDifficulty + 0.3),
  });
  
  if (filteredExercises.length < targetCards) {
    // If not enough exercises, relax the difficulty constraint
    const relaxedExercises = filterExercises(availableExercises, {
      category,
      minDifficulty: range.min,
      maxDifficulty: range.max,
    });
    
    return shuffleArray(relaxedExercises).slice(0, targetCards);
  }
  
  // Select exercises to match target difficulty
  const selectedExercises: Exercise[] = [];
  const shuffled = shuffleArray([...filteredExercises]);
  
  for (let i = 0; i < Math.min(targetCards, shuffled.length); i++) {
    selectedExercises.push(shuffled[i]);
  }
  
  return selectedExercises;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get exercise categories with counts
 */
export function getExerciseCategories(exercises: Exercise[]): { category: string; count: number }[] {
  const categoryMap = new Map<string, number>();
  
  exercises.forEach((exercise) => {
    const count = categoryMap.get(exercise.category) || 0;
    categoryMap.set(exercise.category, count + 1);
  });
  
  return Array.from(categoryMap.entries()).map(([category, count]) => ({
    category,
    count
  }));
}

/**
 * Calculate calories burned estimate
 */
export function estimateCaloriesBurned(
  exercises: (DeckExercise & { exercise: Exercise })[],
  durationMinutes: number,
  userWeight: number = 70 // kg, default average
): number {
  // Base metabolic rate per minute (rough estimate)
  const baseMET = 1.2; // resting metabolic equivalent
  
  // Exercise MET values by category (rough estimates)
  const exerciseMETs = {
    cardio: 8.0,
    strength: 6.0,
    flexibility: 3.0,
    mixed: 7.0
  };
  
  // Calculate weighted MET based on exercise types
  let totalMET = 0;
  let totalExercises = 0;
  
  exercises.forEach((deckExercise) => {
    const category = deckExercise.exercise.category as keyof typeof exerciseMETs;
    const met = exerciseMETs[category] || 6.0;
    totalMET += met * deckExercise.exercise.difficulty;
    totalExercises++;
  });
  
  const averageMET = totalExercises > 0 ? totalMET / totalExercises : 6.0;
  
  // Calories = MET × weight(kg) × time(hours)
  const calories = averageMET * userWeight * (durationMinutes / 60);
  
  return Math.round(calories);
}

/**
 * Get recommended rest time between exercises
 */
export function getRestTime(exercise: Exercise, userLevel: 'beginner' | 'casual' | 'fit' | 'athlete'): number {
  const baseRestTimes = {
    beginner: 60,  // 60 seconds
    casual: 45,    // 45 seconds
    fit: 30,       // 30 seconds
    athlete: 20    // 20 seconds
  };
  
  const baseRest = baseRestTimes[userLevel];
  
  // Adjust based on exercise difficulty
  const difficultyMultiplier = exercise.difficulty;
  
  return Math.round(baseRest * difficultyMultiplier);
}
