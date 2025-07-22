/**
 * OPTIMIZED IN-MEMORY STORAGE SYSTEM
 * 
 * This file provides an enhanced in-memory storage implementation designed for:
 * - Fast performance with optimized data structures
 * - Easy database migration when needed
 * - Comprehensive error handling
 * - Detailed logging and debugging
 * - Human-readable maintenance code
 */

import {
  users,
  exercises,
  decks,
  deckExercises,
  workouts,
  achievements,
  userAchievements,
  type User,
  type UpsertUser,
  type Exercise,
  type Deck,
  type DeckExercise,
  type Workout,
  type Achievement,
  type UserAchievement,
  type InsertExercise,
  type InsertDeck,
  type InsertWorkout,
  type InsertDeckExercise,
} from "@shared/schema";

/**
 * STORAGE INTERFACE
 * 
 * This interface defines all storage operations. By keeping this consistent,
 * we can easily switch between memory storage and database storage without
 * changing any other code in the application.
 */
export interface IStorage {
  // User Operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Exercise Operations
  getExercises(): Promise<Exercise[]>;
  getExercisesByCategory(category: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  
  // Deck Operations
  getDecks(): Promise<Deck[]>;
  getDeck(id: number): Promise<Deck | undefined>;
  getDeckWithExercises(id: number): Promise<(Deck & { exercises: (DeckExercise & { exercise: Exercise })[] }) | undefined>;
  createDeck(deck: InsertDeck): Promise<Deck>;
  addExerciseToDeck(deckExercise: InsertDeckExercise): Promise<DeckExercise>;
  getUserCustomDecks(userId: string): Promise<Deck[]>;
  
  // Workout Operations
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  completeWorkout(workoutId: number, feedback: string, duration: number, calories?: number): Promise<Workout>;
  getUserWorkouts(userId: string, limit?: number): Promise<Workout[]>;
  getUserStats(userId: string): Promise<{
    totalWorkouts: number;
    totalMinutes: number;
    currentStreak: number;
    longestStreak: number;
    averageRating: number;
  }>;
  
  // Achievement Operations
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]>;
  unlockAchievement(userId: string, achievementId: number): Promise<UserAchievement>;
  
  // Progress Operations
  updateUserProgress(userId: string, updates: Partial<User>): Promise<User>;
  updateUserStreak(userId: string): Promise<User>;
  
  // Testing and Debugging Operations
  clearAllData(): Promise<void>;
  getStorageStats(): Promise<{
    users: number;
    exercises: number;
    decks: number;
    workouts: number;
    achievements: number;
  }>;
}

/**
 * OPTIMIZED MEMORY STORAGE IMPLEMENTATION
 * 
 * This class provides a high-performance in-memory storage system with:
 * - Indexed data structures for fast lookups
 * - Comprehensive error handling
 * - Detailed logging for debugging
 * - Easy database migration path
 */
export class OptimizedMemoryStorage implements IStorage {
  // Primary data stores using Maps for O(1) lookups
  private users: Map<string, User> = new Map();
  private exercises: Map<number, Exercise> = new Map();
  private decks: Map<number, Deck> = new Map();
  private deckExercises: Map<number, DeckExercise> = new Map();
  private workouts: Map<number, Workout> = new Map();
  private achievements: Map<number, Achievement> = new Map();
  private userAchievements: Map<number, UserAchievement> = new Map();
  
  // Optimization indexes for faster queries
  private exercisesByCategory: Map<string, Set<number>> = new Map();
  private deckExercisesByDeck: Map<number, Set<number>> = new Map();
  private workoutsByUser: Map<string, Set<number>> = new Map();
  private userAchievementsByUser: Map<string, Set<number>> = new Map();
  
  // ID generation
  private nextId = 1;
  
  // Performance tracking
  private queryCount = 0;
  private lastInitTime = Date.now();
  
  constructor() {
    console.log("[Storage] Initializing optimized memory storage...");
    this.initializeDefaultData();
    console.log(`[Storage] Initialized with ${this.exercises.size} exercises, ${this.decks.size} decks`);
  }
  
  /**
   * INITIALIZATION WITH DEFAULT DATA
   * 
   * Sets up the application with sample exercises and decks.
   * This data mimics what would be seed data in a database.
   */
  private initializeDefaultData(): void {
    console.log("[Storage] Setting up default fitness data...");
    
    // Create comprehensive exercise library
    const defaultExercises: Omit<Exercise, 'id'>[] = [
      {
        name: "Push-ups",
        description: "Classic upper body strength exercise",
        category: "strength",
        difficulty: 1.0,
        defaultReps: 10,
        defaultDuration: null,
        instructions: "Place hands on ground shoulder-width apart, keep body straight, lower chest to ground then push back up",
        icon: "fas fa-dumbbell",
        createdAt: new Date(),
      },
      {
        name: "Jumping Jacks",
        description: "Full-body cardio exercise",
        category: "cardio",
        difficulty: 0.8,
        defaultReps: 20,
        defaultDuration: 30,
        instructions: "Jump with feet apart while raising arms overhead, then return to starting position",
        icon: "fas fa-running",
        createdAt: new Date(),
      },
      {
        name: "Squats",
        description: "Lower body strength and mobility",
        category: "strength",
        difficulty: 1.2,
        defaultReps: 15,
        defaultDuration: null,
        instructions: "Stand with feet shoulder-width apart, lower hips back and down, then stand up",
        icon: "fas fa-dumbbell",
        createdAt: new Date(),
      },
      {
        name: "Plank",
        description: "Core stability exercise",
        category: "strength",
        difficulty: 1.1,
        defaultReps: null,
        defaultDuration: 30,
        instructions: "Hold a straight line from head to heels in push-up position",
        icon: "fas fa-minus",
        createdAt: new Date(),
      },
      {
        name: "Mountain Climbers",
        description: "High-intensity cardio and core",
        category: "cardio",
        difficulty: 1.3,
        defaultReps: 20,
        defaultDuration: null,
        instructions: "In plank position, alternate bringing knees to chest rapidly",
        icon: "fas fa-mountain",
        createdAt: new Date(),
      },
      {
        name: "Burpees",
        description: "Full-body conditioning exercise",
        category: "mixed",
        difficulty: 1.8,
        defaultReps: 5,
        defaultDuration: null,
        instructions: "Squat down, jump back to plank, do push-up, jump feet forward, then jump up",
        icon: "fas fa-fire",
        createdAt: new Date(),
      },

      // WARMUP CARDS - Essential for warmup combo system
      {
        name: "Joint Mobility",
        description: "Gentle joint rotations to prepare the body",
        category: "warmup",
        difficulty: 0.5,
        defaultReps: null,
        defaultDuration: 60,
        instructions: "Rotate shoulders, hips, ankles, and wrists slowly in both directions",
        icon: "fas fa-sync-alt",
        cardType: "warmup",
        createdAt: new Date(),
      },
      {
        name: "Dynamic Stretching",
        description: "Active movements to increase blood flow",
        category: "warmup", 
        difficulty: 0.6,
        defaultReps: 8,
        defaultDuration: null,
        instructions: "Leg swings, arm circles, torso twists - keep moving!",
        icon: "fas fa-expand-arrows-alt",
        cardType: "warmup",
        createdAt: new Date(),
      },
      {
        name: "Heart Rate Activation", 
        description: "Light cardio to activate cardiovascular system",
        category: "warmup",
        difficulty: 0.7,
        defaultReps: null,
        defaultDuration: 45,
        instructions: "Marching in place, light movements to get blood flowing",
        icon: "fas fa-heartbeat",
        cardType: "warmup",
        createdAt: new Date(),
      },
      {
        name: "Mind-Body Connection",
        description: "Focus and breathing preparation",
        category: "warmup",
        difficulty: 0.4,
        defaultReps: null,
        defaultDuration: 30,
        instructions: "Deep breathing while visualizing your workout",
        icon: "fas fa-brain",
        cardType: "warmup",
        createdAt: new Date(),
      },
      {
        name: "Movement Prep",
        description: "Practice basic movement patterns",
        category: "warmup",
        difficulty: 0.5,
        defaultReps: 5,
        defaultDuration: null,
        instructions: "Air squats, arm swings, gentle movements to prepare",
        icon: "fas fa-walking",
        cardType: "warmup",
        createdAt: new Date(),
      },

      // UTILITY CARDS - Strategic gameplay elements
      {
        name: "Fresh Hand",
        description: "Discard your hand and draw 3 new cards",
        category: "utility",
        difficulty: 0,
        defaultReps: null,
        defaultDuration: null,
        instructions: "Strategic card refresh for better options",
        icon: "fas fa-sync",
        cardType: "utility",
        utilityEffect: "redraw_hand",
        createdAt: new Date(),
      },
      {
        name: "Deck Shuffle",
        description: "Shuffle all played cards back into the deck",
        category: "utility",
        difficulty: 0,
        defaultReps: null,
        defaultDuration: null,
        instructions: "Reset the deck for extended gameplay",
        icon: "fas fa-random",
        cardType: "utility",
        utilityEffect: "shuffle_deck",
        createdAt: new Date(),
      },
      {
        name: "Quick Draw",
        description: "Draw 2 extra cards immediately",
        category: "utility",
        difficulty: 0,
        defaultReps: null,
        defaultDuration: null,
        instructions: "Expand your hand for better options",
        icon: "fas fa-plus-circle",
        cardType: "utility",
        utilityEffect: "draw_extra",
        createdAt: new Date(),
      },
      {
        name: "Energy Boost",
        description: "Next exercise earns double points",
        category: "utility",
        difficulty: 0,
        defaultReps: null,
        defaultDuration: null,
        instructions: "Strategic point multiplier for big scores",
        icon: "fas fa-bolt",
        cardType: "utility",
        utilityEffect: "double_next",
        createdAt: new Date(),
      },
      {
        name: "Strategic Skip",
        description: "Skip turn but draw an extra card",
        category: "utility",
        difficulty: 0,
        defaultReps: null,
        defaultDuration: null,
        instructions: "Sacrifice tempo for card advantage",
        icon: "fas fa-forward",
        cardType: "utility",
        utilityEffect: "skip_draw",
        createdAt: new Date(),
      },

      // POWER CARDS - High-value strategic cards
      {
        name: "Explosive Power",
        description: "Maximum intensity power move",
        category: "power",
        difficulty: 2.0,
        defaultReps: 3,
        defaultDuration: null,
        instructions: "Maximum effort explosive movement - give it everything!",
        icon: "fas fa-rocket",
        cardType: "power",
        createdAt: new Date(),
      },
      {
        name: "Strength Surge",
        description: "Heavy strength focus",
        category: "power",
        difficulty: 1.8,
        defaultReps: 5,
        defaultDuration: null,
        instructions: "Focus on perfect form with challenging resistance",
        icon: "fas fa-dumbbell",
        cardType: "power",
        createdAt: new Date(),
      },
      {
        name: "Endurance Challenge",
        description: "Extended endurance test",
        category: "power", 
        difficulty: 1.6,
        defaultReps: null,
        defaultDuration: 90,
        instructions: "Push your endurance limits with sustained effort",
        icon: "fas fa-stopwatch",
        cardType: "power",
        createdAt: new Date(),
      },
      {
        name: "Flow State",
        description: "Perfect movement sequence",
        category: "power",
        difficulty: 1.5,
        defaultReps: 8,
        defaultDuration: null,
        instructions: "Chain movements together in perfect flow",
        icon: "fas fa-water",
        cardType: "power",
        createdAt: new Date(),
      },
    ];
    
    // Add exercises to storage with indexing
    defaultExercises.forEach(exerciseData => {
      const exercise: Exercise = { ...exerciseData, id: this.getNextId() };
      this.exercises.set(exercise.id, exercise);
      
      // Update category index
      if (!this.exercisesByCategory.has(exercise.category)) {
        this.exercisesByCategory.set(exercise.category, new Set());
      }
      this.exercisesByCategory.get(exercise.category)!.add(exercise.id);
    });
    
    // Create beginner-friendly workout deck
    const quickStartDeck: Deck = {
      id: this.getNextId(),
      name: "Quick Start",
      description: "Perfect for beginners - easy and effective",
      category: "mixed",
      difficulty: 1.0,
      estimatedMinutes: 15,
      isCustom: false,
      createdBy: null,
      createdAt: new Date(),
    };
    
    this.decks.set(quickStartDeck.id, quickStartDeck);
    
    // Add exercises to the deck in a logical order
    const exerciseOrder = [
      { name: "Jumping Jacks", reps: 15, duration: null },
      { name: "Push-ups", reps: 8, duration: null },
      { name: "Squats", reps: 12, duration: null },
      { name: "Plank", reps: null, duration: 20 },
    ];
    
    exerciseOrder.forEach((config, index) => {
      const exercise = Array.from(this.exercises.values()).find(e => e.name === config.name);
      if (exercise) {
        const deckExercise: DeckExercise = {
          id: this.getNextId(),
          deckId: quickStartDeck.id,
          exerciseId: exercise.id,
          order: index + 1,
          customReps: config.reps,
          customDuration: config.duration,
        };
        
        this.deckExercises.set(deckExercise.id, deckExercise);
        
        // Update deck index
        if (!this.deckExercisesByDeck.has(quickStartDeck.id)) {
          this.deckExercisesByDeck.set(quickStartDeck.id, new Set());
        }
        this.deckExercisesByDeck.get(quickStartDeck.id)!.add(deckExercise.id);
      }
    });
    
    console.log(`[Storage] Created ${this.exercises.size} exercises and ${this.decks.size} decks`);
  }
  
  /**
   * UTILITY METHODS
   */
  private getNextId(): number {
    return this.nextId++;
  }
  
  private trackQuery(operation: string): void {
    this.queryCount++;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Storage] Query #${this.queryCount}: ${operation}`);
    }
  }
  
  private validateUserId(userId: string): void {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID provided');
    }
  }
  
  private validateId(id: number): void {
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid ID provided');
    }
  }
  
  // ============================================================================
  // USER OPERATIONS
  // ============================================================================
  
  async getUser(id: string): Promise<User | undefined> {
    this.trackQuery(`getUser(${id})`);
    this.validateUserId(id);
    return this.users.get(id);
  }
  
  async upsertUser(userData: UpsertUser): Promise<User> {
    this.trackQuery(`upsertUser(${userData.id})`);
    this.validateUserId(userData.id);
    
    const existingUser = this.users.get(userData.id);
    const now = new Date();
    
    const user: User = {
      ...userData,
      updatedAt: now,
      createdAt: existingUser?.createdAt || now,
      // Ensure all fitness fields have proper defaults
      fitnessGoal: userData.fitnessGoal || existingUser?.fitnessGoal || null,
      fitnessLevel: userData.fitnessLevel || existingUser?.fitnessLevel || null,
      workoutFrequency: userData.workoutFrequency || existingUser?.workoutFrequency || null,
      currentStreak: userData.currentStreak ?? existingUser?.currentStreak ?? 0,
      longestStreak: userData.longestStreak ?? existingUser?.longestStreak ?? 0,
      totalWorkouts: userData.totalWorkouts ?? existingUser?.totalWorkouts ?? 0,
      totalMinutes: userData.totalMinutes ?? existingUser?.totalMinutes ?? 0,
      currentDifficultyLevel: userData.currentDifficultyLevel ?? existingUser?.currentDifficultyLevel ?? 1.0,
      lastWorkoutFeedback: userData.lastWorkoutFeedback || existingUser?.lastWorkoutFeedback || null,
    };
    
    this.users.set(userData.id, user);
    console.log(`[Storage] User ${userData.id} upserted successfully`);
    return user;
  }
  
  // ============================================================================
  // EXERCISE OPERATIONS
  // ============================================================================
  
  async getExercises(): Promise<Exercise[]> {
    this.trackQuery('getExercises()');
    return Array.from(this.exercises.values()).sort((a, b) => a.name.localeCompare(b.name));
  }
  
  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    this.trackQuery(`getExercisesByCategory(${category})`);
    
    const exerciseIds = this.exercisesByCategory.get(category) || new Set();
    const exercises = Array.from(exerciseIds)
      .map(id => this.exercises.get(id)!)
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));
    
    return exercises;
  }
  
  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    this.trackQuery(`createExercise(${exercise.name})`);
    
    const newExercise: Exercise = {
      ...exercise,
      id: this.getNextId(),
      createdAt: new Date(),
    };
    
    this.exercises.set(newExercise.id, newExercise);
    
    // Update category index
    if (!this.exercisesByCategory.has(newExercise.category)) {
      this.exercisesByCategory.set(newExercise.category, new Set());
    }
    this.exercisesByCategory.get(newExercise.category)!.add(newExercise.id);
    
    console.log(`[Storage] Created exercise: ${newExercise.name} (ID: ${newExercise.id})`);
    return newExercise;
  }
  
  // ============================================================================
  // DECK OPERATIONS
  // ============================================================================
  
  async getDecks(): Promise<Deck[]> {
    this.trackQuery('getDecks()');
    return Array.from(this.decks.values())
      .filter(deck => !deck.isCustom)
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  
  async getDeck(id: number): Promise<Deck | undefined> {
    this.trackQuery(`getDeck(${id})`);
    this.validateId(id);
    return this.decks.get(id);
  }
  
  async getDeckWithExercises(id: number): Promise<(Deck & { exercises: (DeckExercise & { exercise: Exercise })[] }) | undefined> {
    this.trackQuery(`getDeckWithExercises(${id})`);
    this.validateId(id);
    
    const deck = this.decks.get(id);
    if (!deck) {
      return undefined;
    }
    
    // Get deck exercises using index for performance
    const deckExerciseIds = this.deckExercisesByDeck.get(id) || new Set();
    const deckExercisesList = Array.from(deckExerciseIds)
      .map(deId => this.deckExercises.get(deId)!)
      .filter(Boolean)
      .sort((a, b) => a.order - b.order);
    
    // Enrich with exercise data
    const exercises = deckExercisesList.map(de => ({
      ...de,
      exercise: this.exercises.get(de.exerciseId)!,
    }));
    
    return { ...deck, exercises };
  }
  
  async createDeck(deck: InsertDeck): Promise<Deck> {
    this.trackQuery(`createDeck(${deck.name})`);
    
    const newDeck: Deck = {
      ...deck,
      id: this.getNextId(),
      createdAt: new Date(),
    };
    
    this.decks.set(newDeck.id, newDeck);
    console.log(`[Storage] Created deck: ${newDeck.name} (ID: ${newDeck.id})`);
    return newDeck;
  }
  
  async addExerciseToDeck(deckExercise: InsertDeckExercise): Promise<DeckExercise> {
    this.trackQuery(`addExerciseToDeck(deck:${deckExercise.deckId}, exercise:${deckExercise.exerciseId})`);
    
    // Validate deck and exercise exist
    if (!this.decks.has(deckExercise.deckId)) {
      throw new Error(`Deck ${deckExercise.deckId} not found`);
    }
    if (!this.exercises.has(deckExercise.exerciseId)) {
      throw new Error(`Exercise ${deckExercise.exerciseId} not found`);
    }
    
    const newDeckExercise: DeckExercise = {
      ...deckExercise,
      id: this.getNextId(),
    };
    
    this.deckExercises.set(newDeckExercise.id, newDeckExercise);
    
    // Update deck index
    if (!this.deckExercisesByDeck.has(deckExercise.deckId)) {
      this.deckExercisesByDeck.set(deckExercise.deckId, new Set());
    }
    this.deckExercisesByDeck.get(deckExercise.deckId)!.add(newDeckExercise.id);
    
    return newDeckExercise;
  }
  
  async getUserCustomDecks(userId: string): Promise<Deck[]> {
    this.trackQuery(`getUserCustomDecks(${userId})`);
    this.validateUserId(userId);
    
    return Array.from(this.decks.values())
      .filter(deck => deck.createdBy === userId && deck.isCustom)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  // ============================================================================
  // WORKOUT OPERATIONS
  // ============================================================================
  
  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    this.trackQuery(`createWorkout(user:${workout.userId}, deck:${workout.deckId})`);
    
    // Validate deck exists
    if (!this.decks.has(workout.deckId)) {
      throw new Error(`Deck ${workout.deckId} not found`);
    }
    
    const newWorkout: Workout = {
      ...workout,
      id: this.getNextId(),
      cardsCompleted: 0,
    };
    
    this.workouts.set(newWorkout.id, newWorkout);
    
    // Update user index
    if (!this.workoutsByUser.has(workout.userId)) {
      this.workoutsByUser.set(workout.userId, new Set());
    }
    this.workoutsByUser.get(workout.userId)!.add(newWorkout.id);
    
    console.log(`[Storage] Created workout ${newWorkout.id} for user ${workout.userId}`);
    return newWorkout;
  }
  
  async completeWorkout(workoutId: number, feedback: string, duration: number, calories?: number): Promise<Workout> {
    this.trackQuery(`completeWorkout(${workoutId})`);
    this.validateId(workoutId);
    
    const workout = this.workouts.get(workoutId);
    if (!workout) {
      throw new Error(`Workout ${workoutId} not found`);
    }
    
    const updatedWorkout: Workout = {
      ...workout,
      completedAt: new Date(),
      feedback,
      duration,
      calories: calories || undefined,
    };
    
    this.workouts.set(workoutId, updatedWorkout);
    
    // Update user stats
    const user = this.users.get(workout.userId);
    if (user) {
      const newTotalWorkouts = (user.totalWorkouts || 0) + 1;
      const newTotalMinutes = (user.totalMinutes || 0) + Math.floor(duration / 60);
      
      await this.updateUserProgress(workout.userId, {
        totalWorkouts: newTotalWorkouts,
        totalMinutes: newTotalMinutes,
        lastWorkoutFeedback: feedback,
      });
      
      // Update streak
      await this.updateUserStreak(workout.userId);
    }
    
    console.log(`[Storage] Completed workout ${workoutId} for user ${workout.userId}`);
    return updatedWorkout;
  }
  
  async getUserWorkouts(userId: string, limit = 10): Promise<Workout[]> {
    this.trackQuery(`getUserWorkouts(${userId}, limit:${limit})`);
    this.validateUserId(userId);
    
    // Use index for performance
    const workoutIds = this.workoutsByUser.get(userId) || new Set();
    const workouts = Array.from(workoutIds)
      .map(id => this.workouts.get(id)!)
      .filter(Boolean)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, limit);
    
    return workouts;
  }
  
  async getUserStats(userId: string): Promise<{
    totalWorkouts: number;
    totalMinutes: number;
    currentStreak: number;
    longestStreak: number;
    averageRating: number;
  }> {
    this.trackQuery(`getUserStats(${userId})`);
    this.validateUserId(userId);
    
    const user = this.users.get(userId);
    if (!user) {
      return {
        totalWorkouts: 0,
        totalMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageRating: 0,
      };
    }
    
    // Calculate average rating from workout feedback
    const workoutIds = this.workoutsByUser.get(userId) || new Set();
    const userWorkouts = Array.from(workoutIds)
      .map(id => this.workouts.get(id)!)
      .filter(w => w && w.feedback);
    
    let averageRating = 0;
    if (userWorkouts.length > 0) {
      const totalRating = userWorkouts.reduce((sum, workout) => {
        const rating = workout.feedback === 'too_easy' ? 5 : 
                      workout.feedback === 'just_right' ? 4 : 
                      workout.feedback === 'bit_too_hard' ? 3 : 2;
        return sum + rating;
      }, 0);
      averageRating = Number((totalRating / userWorkouts.length).toFixed(1));
    }
    
    return {
      totalWorkouts: user.totalWorkouts || 0,
      totalMinutes: user.totalMinutes || 0,
      currentStreak: user.currentStreak || 0,
      longestStreak: user.longestStreak || 0,
      averageRating,
    };
  }
  
  // ============================================================================
  // ACHIEVEMENT OPERATIONS
  // ============================================================================
  
  async getAchievements(): Promise<Achievement[]> {
    this.trackQuery('getAchievements()');
    return Array.from(this.achievements.values()).sort((a, b) => a.name.localeCompare(b.name));
  }
  
  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    this.trackQuery(`getUserAchievements(${userId})`);
    this.validateUserId(userId);
    
    const achievementIds = this.userAchievementsByUser.get(userId) || new Set();
    const userAchievements = Array.from(achievementIds)
      .map(id => this.userAchievements.get(id)!)
      .filter(Boolean)
      .map(ua => ({
        ...ua,
        achievement: this.achievements.get(ua.achievementId)!,
      }))
      .sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime());
    
    return userAchievements;
  }
  
  async unlockAchievement(userId: string, achievementId: number): Promise<UserAchievement> {
    this.trackQuery(`unlockAchievement(${userId}, ${achievementId})`);
    this.validateUserId(userId);
    this.validateId(achievementId);
    
    if (!this.achievements.has(achievementId)) {
      throw new Error(`Achievement ${achievementId} not found`);
    }
    
    const newAchievement: UserAchievement = {
      id: this.getNextId(),
      userId,
      achievementId,
      unlockedAt: new Date(),
    };
    
    this.userAchievements.set(newAchievement.id, newAchievement);
    
    // Update user index
    if (!this.userAchievementsByUser.has(userId)) {
      this.userAchievementsByUser.set(userId, new Set());
    }
    this.userAchievementsByUser.get(userId)!.add(newAchievement.id);
    
    console.log(`[Storage] Unlocked achievement ${achievementId} for user ${userId}`);
    return newAchievement;
  }
  
  // ============================================================================
  // PROGRESS OPERATIONS
  // ============================================================================
  
  async updateUserProgress(userId: string, updates: Partial<User>): Promise<User> {
    this.trackQuery(`updateUserProgress(${userId})`);
    this.validateUserId(userId);
    
    const user = this.users.get(userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    
    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateUserStreak(userId: string): Promise<User> {
    this.trackQuery(`updateUserStreak(${userId})`);
    this.validateUserId(userId);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Get user workouts using index
    const workoutIds = this.workoutsByUser.get(userId) || new Set();
    const userWorkouts = Array.from(workoutIds)
      .map(id => this.workouts.get(id)!)
      .filter(Boolean);
    
    // Check if user worked out today
    const todayWorkout = userWorkouts.find(w => 
      w.completedAt && 
      w.startedAt >= today
    );
    
    // Check if user worked out yesterday
    const yesterdayWorkout = userWorkouts.find(w => 
      w.completedAt &&
      w.startedAt >= yesterday && 
      w.startedAt < today
    );
    
    const user = this.users.get(userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    
    let newStreak = user.currentStreak || 0;
    
    if (todayWorkout) {
      if (yesterdayWorkout || newStreak === 0) {
        newStreak += 1;
      }
    } else if (!yesterdayWorkout && newStreak > 0) {
      newStreak = 0;
    }
    
    const newLongestStreak = Math.max(user.longestStreak || 0, newStreak);
    
    return await this.updateUserProgress(userId, {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
    });
  }
  
  // ============================================================================
  // TESTING AND DEBUGGING OPERATIONS
  // ============================================================================
  
  async clearAllData(): Promise<void> {
    console.log("[Storage] Clearing all data...");
    
    this.users.clear();
    this.exercises.clear();
    this.decks.clear();
    this.deckExercises.clear();
    this.workouts.clear();
    this.achievements.clear();
    this.userAchievements.clear();
    
    // Clear indexes
    this.exercisesByCategory.clear();
    this.deckExercisesByDeck.clear();
    this.workoutsByUser.clear();
    this.userAchievementsByUser.clear();
    
    this.nextId = 1;
    this.queryCount = 0;
    
    // Reinitialize with default data
    this.initializeDefaultData();
    
    console.log("[Storage] All data cleared and reset");
  }
  
  async getStorageStats(): Promise<{
    users: number;
    exercises: number;
    decks: number;
    workouts: number;
    achievements: number;
  }> {
    const stats = {
      users: this.users.size,
      exercises: this.exercises.size,
      decks: this.decks.size,
      workouts: this.workouts.size,
      achievements: this.achievements.size,
    };
    
    console.log("[Storage] Current stats:", stats);
    console.log(`[Storage] Total queries: ${this.queryCount}`);
    console.log(`[Storage] Uptime: ${Date.now() - this.lastInitTime}ms`);
    
    return stats;
  }
}

// Import database components from the blueprint
import { db } from "./db";
import { eq, and, desc, asc, sql, count } from "drizzle-orm";
import { checkAndSeedDatabase } from "./seed-data";

/**
 * DATABASE STORAGE IMPLEMENTATION
 * 
 * This class provides a PostgreSQL-backed storage system using Drizzle ORM
 * with the same interface as the memory storage for seamless switching.
 */
export class DatabaseStorage implements IStorage {
  constructor() {
    console.log("[DatabaseStorage] Initializing PostgreSQL storage with Drizzle ORM...");
    this.initializeDatabase();
  }
  
  private async initializeDatabase(): Promise<void> {
    try {
      // Import and use clean seed data instead
      const { seedEssentialData } = await import('./seed-data-clean');
      await seedEssentialData();
      console.log("[DatabaseStorage] Database initialization completed");
    } catch (error) {
      console.error("[DatabaseStorage] Database initialization failed:", error);
    }
  }

  // ============================================================================
  // USER OPERATIONS
  // ============================================================================

  async getUser(id: string): Promise<User | undefined> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid user ID provided');
    }

    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (!userData.id || typeof userData.id !== 'string' || userData.id.trim() === '') {
      throw new Error('Invalid user ID provided');
    }

    const now = new Date();
    const userToInsert = {
      ...userData,
      updatedAt: now,
      createdAt: now,
      // Set proper defaults for all fields
      fitnessGoal: userData.fitnessGoal || null,
      fitnessLevel: userData.fitnessLevel || null,
      workoutFrequency: userData.workoutFrequency || null,
      currentStreak: userData.currentStreak ?? 0,
      longestStreak: userData.longestStreak ?? 0,
      totalWorkouts: userData.totalWorkouts ?? 0,
      totalMinutes: userData.totalMinutes ?? 0,
      currentDifficultyLevel: userData.currentDifficultyLevel ?? 1.0,
      lastWorkoutFeedback: userData.lastWorkoutFeedback || null,
    };

    const [user] = await db
      .insert(users)
      .values({
        ...userToInsert,
        email: userToInsert.email ?? null,
        firstName: userToInsert.firstName ?? null,
        lastName: userToInsert.lastName ?? null,
        profileImageUrl: userToInsert.profileImageUrl ?? null,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userToInsert,
          email: userToInsert.email ?? null,
          firstName: userToInsert.firstName ?? null,
          lastName: userToInsert.lastName ?? null,
          profileImageUrl: userToInsert.profileImageUrl ?? null,
          updatedAt: now,
        },
      })
      .returning();

    console.log(`[DatabaseStorage] User ${userData.id} upserted successfully`);
    return user;
  }

  // ============================================================================
  // EXERCISE OPERATIONS
  // ============================================================================

  async getExercises(): Promise<Exercise[]> {
    const exercisesList = await db
      .select()
      .from(exercises)
      .orderBy(asc(exercises.name));
    return exercisesList;
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    const exercisesList = await db
      .select()
      .from(exercises)
      .where(eq(exercises.category, category))
      .orderBy(asc(exercises.name));
    return exercisesList;
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [newExercise] = await db
      .insert(exercises)
      .values({
        ...exercise,
        description: exercise.description ?? null,
        defaultReps: exercise.defaultReps ?? null,
        defaultDuration: exercise.defaultDuration ?? null,
        instructions: exercise.instructions ?? null,
        icon: exercise.icon ?? null,
        createdAt: new Date(),
      })
      .returning();

    console.log(`[DatabaseStorage] Created exercise: ${newExercise.name} (ID: ${newExercise.id})`);
    return newExercise;
  }

  // ============================================================================
  // DECK OPERATIONS
  // ============================================================================

  async getDecks(): Promise<Deck[]> {
    const decksList = await db
      .select()
      .from(decks)
      .where(eq(decks.isCustom, false))
      .orderBy(asc(decks.name));
    return decksList;
  }

  async getDeck(id: number): Promise<Deck | undefined> {
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid ID provided');
    }

    const [deck] = await db.select().from(decks).where(eq(decks.id, id));
    return deck || undefined;
  }

  async getDeckWithExercises(id: number): Promise<(Deck & { exercises: (DeckExercise & { exercise: Exercise })[] }) | undefined> {
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid ID provided');
    }

    const [deck] = await db.select().from(decks).where(eq(decks.id, id));
    if (!deck) return undefined;

    const deckExercisesList = await db
      .select({
        id: deckExercises.id,
        deckId: deckExercises.deckId,
        exerciseId: deckExercises.exerciseId,
        order: deckExercises.order,
        customReps: deckExercises.customReps,
        customDuration: deckExercises.customDuration,
        exercise: {
          id: exercises.id,
          name: exercises.name,
          description: exercises.description,
          category: exercises.category,
          difficulty: exercises.difficulty,
          defaultReps: exercises.defaultReps,
          defaultDuration: exercises.defaultDuration,
          instructions: exercises.instructions,
          icon: exercises.icon,
          createdAt: exercises.createdAt,
        },
      })
      .from(deckExercises)
      .innerJoin(exercises, eq(deckExercises.exerciseId, exercises.id))
      .where(eq(deckExercises.deckId, id))
      .orderBy(asc(deckExercises.order));

    return { ...deck, exercises: deckExercisesList };
  }

  async createDeck(deck: InsertDeck): Promise<Deck> {
    const [newDeck] = await db
      .insert(decks)
      .values({
        ...deck,
        description: deck.description ?? null,
        estimatedMinutes: deck.estimatedMinutes ?? null,
        isCustom: deck.isCustom ?? null,
        createdBy: deck.createdBy ?? null,
        createdAt: new Date(),
      })
      .returning();

    console.log(`[DatabaseStorage] Created deck: ${newDeck.name} (ID: ${newDeck.id})`);
    return newDeck;
  }

  async addExerciseToDeck(deckExercise: InsertDeckExercise): Promise<DeckExercise> {
    const [newDeckExercise] = await db
      .insert(deckExercises)
      .values({
        ...deckExercise,
        customReps: deckExercise.customReps ?? null,
        customDuration: deckExercise.customDuration ?? null,
      })
      .returning();

    return newDeckExercise;
  }

  async getUserCustomDecks(userId: string): Promise<Deck[]> {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Invalid user ID provided');
    }

    const decksList = await db
      .select()
      .from(decks)
      .where(and(eq(decks.createdBy, userId), eq(decks.isCustom, true)))
      .orderBy(asc(decks.createdAt));

    return decksList;
  }

  // ============================================================================
  // WORKOUT OPERATIONS
  // ============================================================================

  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const [newWorkout] = await db
      .insert(workouts)
      .values({
        ...workout,
        completedAt: workout.completedAt ?? null,
        duration: workout.duration ?? null,
        feedback: workout.feedback ?? null,
        calories: workout.calories ?? null,
        cardsCompleted: 0,
      })
      .returning();

    console.log(`[DatabaseStorage] Created workout ${newWorkout.id} for user ${workout.userId}`);
    return newWorkout;
  }

  async completeWorkout(workoutId: number, feedback: string, duration: number, calories?: number): Promise<Workout> {
    if (!workoutId || typeof workoutId !== 'number' || workoutId <= 0) {
      throw new Error('Invalid ID provided');
    }

    const [updatedWorkout] = await db
      .update(workouts)
      .set({
        completedAt: new Date(),
        feedback,
        duration,
        calories: calories ?? null,
      })
      .where(eq(workouts.id, workoutId))
      .returning();

    if (!updatedWorkout) {
      throw new Error("Workout not found");
    }

    // Update user stats
    const [user] = await db.select().from(users).where(eq(users.id, updatedWorkout.userId));
    if (user) {
      const newTotalWorkouts = (user.totalWorkouts || 0) + 1;
      const newTotalMinutes = (user.totalMinutes || 0) + Math.floor(duration / 60);

      await this.updateUserProgress(updatedWorkout.userId, {
        totalWorkouts: newTotalWorkouts,
        totalMinutes: newTotalMinutes,
        lastWorkoutFeedback: feedback,
      });

      await this.updateUserStreak(updatedWorkout.userId);
    }

    console.log(`[DatabaseStorage] Completed workout ${workoutId} for user ${updatedWorkout.userId}`);
    return updatedWorkout;
  }

  async getUserWorkouts(userId: string, limit = 10): Promise<Workout[]> {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Invalid user ID provided');
    }

    const workoutsList = await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(desc(workouts.startedAt))
      .limit(limit);

    return workoutsList;
  }

  async getUserStats(userId: string): Promise<{
    totalWorkouts: number;
    totalMinutes: number;
    currentStreak: number;
    longestStreak: number;
    averageRating: number;
  }> {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Invalid user ID provided');
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return {
        totalWorkouts: 0,
        totalMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageRating: 0,
      };
    }

    // Calculate average rating from workout feedback
    const userWorkouts = await db
      .select()
      .from(workouts)
      .where(and(eq(workouts.userId, userId), sql`${workouts.feedback} IS NOT NULL`));

    let averageRating = 0;
    if (userWorkouts.length > 0) {
      const totalRating = userWorkouts.reduce((sum, workout) => {
        const rating = workout.feedback === 'too_easy' ? 5 : 
                      workout.feedback === 'just_right' ? 4 : 
                      workout.feedback === 'bit_too_hard' ? 3 : 2;
        return sum + rating;
      }, 0);
      averageRating = Number((totalRating / userWorkouts.length).toFixed(1));
    }

    return {
      totalWorkouts: user.totalWorkouts || 0,
      totalMinutes: user.totalMinutes || 0,
      currentStreak: user.currentStreak || 0,
      longestStreak: user.longestStreak || 0,
      averageRating,
    };
  }

  // ============================================================================
  // ACHIEVEMENT OPERATIONS
  // ============================================================================

  async getAchievements(): Promise<Achievement[]> {
    const achievementsList = await db
      .select()
      .from(achievements)
      .orderBy(asc(achievements.name));
    return achievementsList;
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Invalid user ID provided');
    }

    const userAchievementsList = await db
      .select({
        id: userAchievements.id,
        userId: userAchievements.userId,
        achievementId: userAchievements.achievementId,
        unlockedAt: userAchievements.unlockedAt,
        achievement: {
          id: achievements.id,
          name: achievements.name,
          description: achievements.description,
          icon: achievements.icon,
          requirement: achievements.requirement,
          createdAt: achievements.createdAt,
        },
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.unlockedAt));

    return userAchievementsList;
  }

  async unlockAchievement(userId: string, achievementId: number): Promise<UserAchievement> {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Invalid user ID provided');
    }
    if (!achievementId || typeof achievementId !== 'number' || achievementId <= 0) {
      throw new Error('Invalid ID provided');
    }

    const [newAchievement] = await db
      .insert(userAchievements)
      .values({
        userId,
        achievementId,
        unlockedAt: new Date(),
      })
      .returning();

    console.log(`[DatabaseStorage] Unlocked achievement ${achievementId} for user ${userId}`);
    return newAchievement;
  }

  // ============================================================================
  // PROGRESS OPERATIONS
  // ============================================================================

  async updateUserProgress(userId: string, updates: Partial<User>): Promise<User> {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Invalid user ID provided');
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  }

  async updateUserStreak(userId: string): Promise<User> {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Invalid user ID provided');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if user worked out today
    const [todayWorkout] = await db
      .select()
      .from(workouts)
      .where(and(
        eq(workouts.userId, userId),
        sql`${workouts.completedAt} IS NOT NULL`,
        sql`${workouts.startedAt} >= ${today}`
      ))
      .limit(1);

    // Check if user worked out yesterday
    const [yesterdayWorkout] = await db
      .select()
      .from(workouts)
      .where(and(
        eq(workouts.userId, userId),
        sql`${workouts.completedAt} IS NOT NULL`,
        sql`${workouts.startedAt} >= ${yesterday}`,
        sql`${workouts.startedAt} < ${today}`
      ))
      .limit(1);

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      throw new Error("User not found");
    }

    let newStreak = user.currentStreak || 0;

    if (todayWorkout) {
      if (yesterdayWorkout || newStreak === 0) {
        newStreak += 1;
      }
    } else if (!yesterdayWorkout && newStreak > 0) {
      newStreak = 0;
    }

    const newLongestStreak = Math.max(user.longestStreak || 0, newStreak);

    return await this.updateUserProgress(userId, {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
    });
  }

  // ============================================================================
  // TESTING AND DEBUGGING OPERATIONS
  // ============================================================================

  async clearAllData(): Promise<void> {
    console.log("[DatabaseStorage] Clearing all data...");
    
    // Clear in order to respect foreign key constraints
    await db.delete(userAchievements);
    await db.delete(workouts);
    await db.delete(deckExercises);
    await db.delete(decks);
    await db.delete(exercises);
    await db.delete(achievements);
    await db.delete(users);
    
    console.log("[DatabaseStorage] All data cleared");
  }

  async getStorageStats(): Promise<{
    users: number;
    exercises: number;
    decks: number;
    workouts: number;
    achievements: number;
  }> {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [exerciseCount] = await db.select({ count: count() }).from(exercises);
    const [deckCount] = await db.select({ count: count() }).from(decks);
    const [workoutCount] = await db.select({ count: count() }).from(workouts);
    const [achievementCount] = await db.select({ count: count() }).from(achievements);

    const stats = {
      users: userCount.count,
      exercises: exerciseCount.count,
      decks: deckCount.count,
      workouts: workoutCount.count,
      achievements: achievementCount.count,
    };

    console.log("[DatabaseStorage] Current database stats:", stats);
    return stats;
  }
}

// Export the database storage instance
export const storage = new DatabaseStorage();