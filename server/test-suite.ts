/**
 * COMPREHENSIVE TEST SUITE FOR OTTERSPORT
 * 
 * This file provides comprehensive testing for all application components:
 * - Storage operations (both memory and database)
 * - API endpoints
 * - Authentication flow
 * - Performance benchmarks
 * - Error handling
 */

import { storage } from './storage';
import type { InsertExercise, InsertDeck, InsertWorkout } from '@shared/schema';

/**
 * TEST RESULTS INTERFACE
 */
interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  error?: string;
  data?: any;
}

interface TestSuite {
  name: string;
  results: TestResult[];
  totalTime: number;
  passed: number;
  failed: number;
}

/**
 * COMPREHENSIVE TEST RUNNER
 */
export class OtterSportTestRunner {
  private results: TestSuite[] = [];
  
  /**
   * Run all tests and return comprehensive results
   */
  async runAllTests(): Promise<{
    suites: TestSuite[];
    totalTests: number;
    passed: number;
    failed: number;
    totalTime: number;
  }> {
    console.log("🧪 Starting comprehensive OtterSport test suite...");
    
    const startTime = Date.now();
    
    // Run all test suites
    await this.testStorageOperations();
    await this.testUserManagement();
    await this.testExerciseOperations();
    await this.testDeckOperations();
    await this.testWorkoutFlow();
    await this.testPerformance();
    await this.testErrorHandling();
    
    const totalTime = Date.now() - startTime;
    const totalTests = this.results.reduce((sum, suite) => sum + suite.results.length, 0);
    const passed = this.results.reduce((sum, suite) => sum + suite.passed, 0);
    const failed = this.results.reduce((sum, suite) => sum + suite.failed, 0);
    
    console.log(`\n📊 TEST SUMMARY:`);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Total Time: ${totalTime}ms`);
    
    return {
      suites: this.results,
      totalTests,
      passed,
      failed,
      totalTime,
    };
  }
  
  private async runTest(name: string, testFn: () => Promise<any>): Promise<TestResult> {
    const start = Date.now();
    
    try {
      const data = await testFn();
      const duration = Date.now() - start;
      
      console.log(`✅ ${name} (${duration}ms)`);
      return {
        name,
        success: true,
        duration,
        data,
      };
    } catch (error) {
      const duration = Date.now() - start;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      console.log(`❌ ${name} (${duration}ms): ${errorMessage}`);
      return {
        name,
        success: false,
        duration,
        error: errorMessage,
      };
    }
  }
  
  private addSuite(name: string, results: TestResult[]): void {
    const totalTime = results.reduce((sum, r) => sum + r.duration, 0);
    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    this.results.push({
      name,
      results,
      totalTime,
      passed,
      failed,
    });
    
    console.log(`\n📁 ${name}: ${passed}/${results.length} passed (${totalTime}ms)`);
  }
  
  // ============================================================================
  // STORAGE OPERATIONS TESTS
  // ============================================================================
  
  private async testStorageOperations(): Promise<void> {
    console.log("\n🗄️ Testing Storage Operations...");
    
    const results = await Promise.all([
      this.runTest("Initialize storage", async () => {
        const stats = await storage.getStorageStats();
        if (stats.exercises === 0) throw new Error("No exercises found");
        if (stats.decks === 0) throw new Error("No decks found");
        return stats;
      }),
      
      this.runTest("Get all exercises", async () => {
        const exercises = await storage.getExercises();
        if (exercises.length === 0) throw new Error("No exercises returned");
        return exercises.length;
      }),
      
      this.runTest("Get exercises by category", async () => {
        const cardioExercises = await storage.getExercisesByCategory("cardio");
        const strengthExercises = await storage.getExercisesByCategory("strength");
        return {
          cardio: cardioExercises.length,
          strength: strengthExercises.length,
        };
      }),
      
      this.runTest("Get all decks", async () => {
        const decks = await storage.getDecks();
        if (decks.length === 0) throw new Error("No decks returned");
        return decks.length;
      }),
      
      this.runTest("Get deck with exercises", async () => {
        const decks = await storage.getDecks();
        const deck = await storage.getDeckWithExercises(decks[0].id);
        if (!deck) throw new Error("Deck not found");
        if (!deck.exercises || deck.exercises.length === 0) {
          throw new Error("Deck has no exercises");
        }
        return deck.exercises.length;
      }),
    ]);
    
    this.addSuite("Storage Operations", results);
  }
  
  // ============================================================================
  // USER MANAGEMENT TESTS
  // ============================================================================
  
  private async testUserManagement(): Promise<void> {
    console.log("\n👤 Testing User Management...");
    
    const testUserId = "test-user-" + Date.now();
    
    const results = await Promise.all([
      this.runTest("Create new user", async () => {
        const user = await storage.upsertUser({
          id: testUserId,
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          profileImageUrl: null,
        });
        if (user.id !== testUserId) throw new Error("User ID mismatch");
        return user;
      }),
      
      this.runTest("Get user", async () => {
        const user = await storage.getUser(testUserId);
        if (!user) throw new Error("User not found");
        return user;
      }),
      
      this.runTest("Update user progress", async () => {
        const updatedUser = await storage.updateUserProgress(testUserId, {
          fitnessGoal: "lose_weight",
          fitnessLevel: "beginner",
          currentStreak: 5,
        });
        if (updatedUser.fitnessGoal !== "lose_weight") throw new Error("Update failed");
        return updatedUser;
      }),
      
      this.runTest("Get user stats", async () => {
        const stats = await storage.getUserStats(testUserId);
        if (typeof stats.totalWorkouts !== "number") throw new Error("Invalid stats");
        return stats;
      }),
    ]);
    
    this.addSuite("User Management", results);
  }
  
  // ============================================================================
  // EXERCISE OPERATIONS TESTS
  // ============================================================================
  
  private async testExerciseOperations(): Promise<void> {
    console.log("\n💪 Testing Exercise Operations...");
    
    const testExercise: InsertExercise = {
      name: "Test Exercise",
      description: "A test exercise",
      category: "strength",
      difficulty: 1.0,
      defaultReps: 10,
      defaultDuration: null,
      instructions: "Test instructions",
      icon: "fas fa-test",
    };
    
    const results = await Promise.all([
      this.runTest("Create exercise", async () => {
        const exercise = await storage.createExercise(testExercise);
        if (exercise.name !== testExercise.name) throw new Error("Exercise name mismatch");
        return exercise;
      }),
      
      this.runTest("Get exercises includes new exercise", async () => {
        const exercises = await storage.getExercises();
        const found = exercises.find(e => e.name === testExercise.name);
        if (!found) throw new Error("New exercise not found in list");
        return found;
      }),
      
      this.runTest("Get exercises by category includes new exercise", async () => {
        const exercises = await storage.getExercisesByCategory("strength");
        const found = exercises.find(e => e.name === testExercise.name);
        if (!found) throw new Error("New exercise not found in category");
        return found;
      }),
    ]);
    
    this.addSuite("Exercise Operations", results);
  }
  
  // ============================================================================
  // DECK OPERATIONS TESTS
  // ============================================================================
  
  private async testDeckOperations(): Promise<void> {
    console.log("\n🎯 Testing Deck Operations...");
    
    const testUserId = "test-deck-user-" + Date.now();
    
    // Create test user first
    await storage.upsertUser({
      id: testUserId,
      email: "decktest@example.com",
      firstName: "Deck",
      lastName: "Tester",
      profileImageUrl: null,
    });
    
    const testDeck: InsertDeck = {
      name: "Test Deck",
      description: "A test deck",
      category: "mixed",
      difficulty: 1.2,
      estimatedMinutes: 20,
      isCustom: true,
      createdBy: testUserId,
    };
    
    const results: TestResult[] = [];
    
    // Create deck
    const createResult = await this.runTest("Create custom deck", async () => {
      const deck = await storage.createDeck(testDeck);
      if (deck.name !== testDeck.name) throw new Error("Deck name mismatch");
      return deck;
    });
    results.push(createResult);
    
    let createdDeck = createResult.data;
    
    // Add exercises to deck
    if (createdDeck) {
      const exercises = await storage.getExercises();
      const addExerciseResult = await this.runTest("Add exercise to deck", async () => {
        const deckExercise = await storage.addExerciseToDeck({
          deckId: createdDeck.id,
          exerciseId: exercises[0].id,
          order: 1,
          customReps: 15,
          customDuration: null,
        });
        return deckExercise;
      });
      results.push(addExerciseResult);
    }
    
    // Get user custom decks
    const userDecksResult = await this.runTest("Get user custom decks", async () => {
      const decks = await storage.getUserCustomDecks(testUserId);
      const found = decks.find(d => d.name === testDeck.name);
      if (!found) throw new Error("Custom deck not found");
      return decks;
    });
    results.push(userDecksResult);
    
    this.addSuite("Deck Operations", results);
  }
  
  // ============================================================================
  // WORKOUT FLOW TESTS
  // ============================================================================
  
  private async testWorkoutFlow(): Promise<void> {
    console.log("\n🏃 Testing Workout Flow...");
    
    const testUserId = "test-workout-user-" + Date.now();
    
    // Create test user
    await storage.upsertUser({
      id: testUserId,
      email: "workouttest@example.com",
      firstName: "Workout",
      lastName: "Tester",
      profileImageUrl: null,
    });
    
    const decks = await storage.getDecks();
    const testDeck = decks[0];
    
    const testWorkout: InsertWorkout = {
      userId: testUserId,
      deckId: testDeck.id,
      startedAt: new Date(),
      totalCards: 4,
      completedAt: null,
      duration: null,
      cardsCompleted: 0,
      feedback: null,
      calories: null,
    };
    
    const results: TestResult[] = [];
    
    // Create workout
    const createResult = await this.runTest("Create workout", async () => {
      const workout = await storage.createWorkout(testWorkout);
      if (workout.userId !== testUserId) throw new Error("User ID mismatch");
      return workout;
    });
    results.push(createResult);
    
    let createdWorkout = createResult.data;
    
    // Complete workout
    if (createdWorkout) {
      const completeResult = await this.runTest("Complete workout", async () => {
        const workout = await storage.completeWorkout(
          createdWorkout.id,
          "just_right",
          900, // 15 minutes
          150 // calories
        );
        if (!workout.completedAt) throw new Error("Workout not marked as completed");
        return workout;
      });
      results.push(completeResult);
    }
    
    // Get user workouts
    const userWorkoutsResult = await this.runTest("Get user workouts", async () => {
      const workouts = await storage.getUserWorkouts(testUserId);
      if (workouts.length === 0) throw new Error("No workouts found");
      return workouts;
    });
    results.push(userWorkoutsResult);
    
    // Update user streak
    const streakResult = await this.runTest("Update user streak", async () => {
      const user = await storage.updateUserStreak(testUserId);
      if (user.currentStreak === 0) throw new Error("Streak not updated");
      return user;
    });
    results.push(streakResult);
    
    // Get updated user stats
    const statsResult = await this.runTest("Get updated user stats", async () => {
      const stats = await storage.getUserStats(testUserId);
      if (stats.totalWorkouts === 0) throw new Error("Stats not updated");
      return stats;
    });
    results.push(statsResult);
    
    this.addSuite("Workout Flow", results);
  }
  
  // ============================================================================
  // PERFORMANCE TESTS
  // ============================================================================
  
  private async testPerformance(): Promise<void> {
    console.log("\n⚡ Testing Performance...");
    
    const results = await Promise.all([
      this.runTest("Bulk user creation (100 users)", async () => {
        const startTime = Date.now();
        const promises = [];
        
        for (let i = 0; i < 100; i++) {
          promises.push(storage.upsertUser({
            id: `perf-user-${i}`,
            email: `perf${i}@example.com`,
            firstName: `User${i}`,
            lastName: "Test",
            profileImageUrl: null,
          }));
        }
        
        await Promise.all(promises);
        const duration = Date.now() - startTime;
        
        if (duration > 1000) throw new Error(`Too slow: ${duration}ms`);
        return { users: 100, duration };
      }),
      
      this.runTest("Bulk exercise queries (1000 queries)", async () => {
        const startTime = Date.now();
        const promises = [];
        
        for (let i = 0; i < 1000; i++) {
          promises.push(storage.getExercises());
        }
        
        await Promise.all(promises);
        const duration = Date.now() - startTime;
        
        return { queries: 1000, duration, avgPerQuery: duration / 1000 };
      }),
      
      this.runTest("Memory usage check", async () => {
        const stats = await storage.getStorageStats();
        const memoryUsage = process.memoryUsage();
        
        return {
          storageStats: stats,
          memoryUsage: {
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
            external: Math.round(memoryUsage.external / 1024 / 1024),
          },
        };
      }),
    ]);
    
    this.addSuite("Performance", results);
  }
  
  // ============================================================================
  // ERROR HANDLING TESTS
  // ============================================================================
  
  private async testErrorHandling(): Promise<void> {
    console.log("\n🚨 Testing Error Handling...");
    
    const results = await Promise.all([
      this.runTest("Invalid user ID", async () => {
        try {
          await storage.getUser("");
          throw new Error("Should have thrown error");
        } catch (error) {
          if (error instanceof Error && error.message.includes("Invalid user ID")) {
            return "Correctly handled invalid user ID";
          }
          throw error;
        }
      }),
      
      this.runTest("Invalid deck ID", async () => {
        try {
          await storage.getDeck(-1);
          throw new Error("Should have thrown error");
        } catch (error) {
          if (error instanceof Error && error.message.includes("Invalid ID")) {
            return "Correctly handled invalid deck ID";
          }
          throw error;
        }
      }),
      
      this.runTest("Non-existent workout completion", async () => {
        try {
          await storage.completeWorkout(99999, "just_right", 900);
          throw new Error("Should have thrown error");
        } catch (error) {
          if (error instanceof Error && error.message.includes("not found")) {
            return "Correctly handled non-existent workout";
          }
          throw error;
        }
      }),
      
      this.runTest("Non-existent user progress update", async () => {
        try {
          await storage.updateUserProgress("non-existent-user", { currentStreak: 5 });
          throw new Error("Should have thrown error");
        } catch (error) {
          if (error instanceof Error && error.message.includes("not found")) {
            return "Correctly handled non-existent user";
          }
          throw error;
        }
      }),
    ]);
    
    this.addSuite("Error Handling", results);
  }
}

/**
 * EXPORT TEST RUNNER FUNCTION
 */
export async function runComprehensiveTests(): Promise<any> {
  const testRunner = new OtterSportTestRunner();
  return await testRunner.runAllTests();
}