/**
 * CLEAN SEED DATA - Essential cards for complete gameplay
 */

import { db } from "./db";
import { exercises, decks, deckExercises, achievements } from "@shared/schema";
import type { InsertExercise, InsertDeck, InsertDeckExercise, InsertAchievement } from "@shared/schema";

// ESSENTIAL EXERCISE LIBRARY WITH ALL CARD TYPES
const essentialExercises: InsertExercise[] = [
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
    cardType: "exercise"
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
    cardType: "exercise"
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
    cardType: "exercise"
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
    cardType: "exercise"
  },
  {
    name: "Plank Hold",
    description: "Core stability exercise",
    category: "strength",
    difficulty: 0.9,
    defaultReps: null,
    defaultDuration: 45,
    instructions: "Hold plank position, keep core tight and body straight",
    icon: "fas fa-grip-horizontal",
    cardType: "exercise"
  },

  // MUSCLE-SPECIFIC WARMUP CARDS (8 total for targeted injury prevention)
  {
    name: "Shoulder & Chest Prep",
    description: "Prepares shoulders, chest, and triceps for push movements",
    category: "warmup",
    difficulty: 0.5,
    defaultReps: 10,
    defaultDuration: null,
    instructions: "Arm circles, shoulder rolls, wall push-ups, chest stretches. Prepare shoulders and chest for pushing exercises.",
    icon: "fas fa-expand-arrows-alt",
    cardType: "warmup"
  },
  {
    name: "Hip & Glute Activation",
    description: "Activates hip flexors, glutes, and leg muscles for squats",
    category: "warmup",
    difficulty: 0.6,
    defaultReps: 8,
    defaultDuration: null,
    instructions: "Hip circles, glute bridges, leg swings, ankle circles. Activate hips and legs for squatting movements.",
    icon: "fas fa-sync-alt",
    cardType: "warmup"
  },
  {
    name: "Core Stability Prep",
    description: "Activates core muscles and stabilizes spine",
    category: "warmup",
    difficulty: 0.4,
    defaultReps: null,
    defaultDuration: 45,
    instructions: "Gentle core breathing, pelvic tilts, cat-cow stretches. Activate core muscles safely before planks.",
    icon: "fas fa-grip-horizontal",
    cardType: "warmup"
  },
  {
    name: "Cardio System Warmup",
    description: "Gradually increases heart rate for cardio exercises",
    category: "warmup",
    difficulty: 0.7,
    defaultReps: null,
    defaultDuration: 60,
    instructions: "Light marching, gentle arm swings, breathing exercises. Prepare cardiovascular system for high-intensity movement.",
    icon: "fas fa-heartbeat",
    cardType: "warmup"
  },
  {
    name: "Joint Mobility Flow",
    description: "Comprehensive joint preparation for full-body movement",
    category: "warmup",
    difficulty: 0.5,
    defaultReps: null,
    defaultDuration: 60,
    instructions: "Neck rolls, shoulder shrugs, wrist circles, ankle rotations. Prepare all major joints for movement.",
    icon: "fas fa-sync-alt",
    cardType: "warmup"
  },
  {
    name: "Dynamic Movement Prep",
    description: "Movement patterns that mirror workout exercises",
    category: "warmup",
    difficulty: 0.6,
    defaultReps: 5,
    defaultDuration: null,
    instructions: "Air squats, wall push-ups, knee raises, arm swings. Practice movement patterns at low intensity.",
    icon: "fas fa-walking",
    cardType: "warmup"
  },
  {
    name: "Mental Focus Prep",
    description: "Mental preparation and breathing for workout focus",
    category: "warmup",
    difficulty: 0.3,
    defaultReps: null,
    defaultDuration: 30,
    instructions: "Deep breathing, visualization, intention setting. Prepare mind-body connection for effective training.",
    icon: "fas fa-brain",
    cardType: "warmup"
  },
  {
    name: "Injury Prevention Check",
    description: "Quick body scan to identify any limitations before exercising",
    category: "warmup",
    difficulty: 0.4,
    defaultReps: null,
    defaultDuration: 30,
    instructions: "Gentle joint tests, muscle tension check, pain assessment. Ensure body is ready for safe exercise.",
    icon: "fas fa-shield-alt",
    cardType: "warmup"
  },

  // UTILITY CARDS (5 total for strategic gameplay)
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
    utilityEffect: "redraw_hand"
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
    utilityEffect: "shuffle_deck"
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
    utilityEffect: "draw_extra"
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
    utilityEffect: "double_next"
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
    utilityEffect: "skip_draw"
  },

  // POWER CARDS (4 total for high-value strategic cards)
  {
    name: "Explosive Power",
    description: "Maximum intensity power move",
    category: "power",
    difficulty: 2.0,
    defaultReps: 3,
    defaultDuration: null,
    instructions: "Maximum effort explosive movement - give it everything!",
    icon: "fas fa-rocket",
    cardType: "power"
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
    cardType: "power"
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
    cardType: "power"
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
    cardType: "power"
  }
];

// ESSENTIAL DECKS
const essentialDecks: InsertDeck[] = [
  {
    name: "Quick Start Warmup Deck",
    description: "Perfect for beginners with comprehensive warmup",
    category: "mixed",
    difficulty: 1,
    estimatedMinutes: 20,
    isCustom: false,
    createdBy: null
  },
  {
    name: "Cardio Power Deck",
    description: "High-energy cardio workout",
    category: "cardio",
    difficulty: 1.4,
    estimatedMinutes: 25,
    isCustom: false,
    createdBy: null
  },
  {
    name: "Strength Builder Deck",
    description: "Build muscle with bodyweight exercises",
    category: "strength",
    difficulty: 1.3,
    estimatedMinutes: 30,
    isCustom: false,
    createdBy: null
  }
];

// ESSENTIAL ACHIEVEMENTS
const essentialAchievements: InsertAchievement[] = [
  {
    name: "First Steps",
    description: "Complete your first workout",
    icon: "fas fa-baby",
    requirement: { type: "total_workouts", value: 1 }
  },
  {
    name: "Warmup Master",
    description: "Complete 10 warmup cards in card battles",
    icon: "fas fa-fire",
    requirement: { type: "warmup_cards", value: 10 }
  },
  {
    name: "Strategic Player",
    description: "Use 5 utility cards in battles",
    icon: "fas fa-brain",
    requirement: { type: "utility_cards", value: 5 }
  },
  {
    name: "Power Player",
    description: "Complete 3 power cards",
    icon: "fas fa-rocket",
    requirement: { type: "power_cards", value: 3 }
  }
];

export async function seedEssentialData(): Promise<void> {
  console.log("[SeedData] Starting essential data seeding...");
  
  try {
    // Clear existing data
    console.log("[SeedData] Clearing existing data...");
    await db.delete(deckExercises);
    await db.delete(decks);
    await db.delete(exercises);
    await db.delete(achievements);
    
    // Insert exercises
    console.log("[SeedData] Inserting exercises...");
    const insertedExercises = await db
      .insert(exercises)
      .values(essentialExercises.map(ex => ({ ...ex, createdAt: new Date() })))
      .returning();
    
    console.log(`[SeedData] Inserted ${insertedExercises.length} exercises`);
    
    // Insert achievements
    console.log("[SeedData] Inserting achievements...");
    const insertedAchievements = await db
      .insert(achievements)
      .values(essentialAchievements.map(ach => ({ ...ach, createdAt: new Date() })))
      .returning();
    
    console.log(`[SeedData] Inserted ${insertedAchievements.length} achievements`);
    
    // Insert decks
    console.log("[SeedData] Inserting decks...");
    const insertedDecks = await db
      .insert(decks)
      .values(essentialDecks.map(deck => ({ ...deck, createdAt: new Date() })))
      .returning();
    
    console.log(`[SeedData] Inserted ${insertedDecks.length} decks`);
    
    // Set up deck exercises
    console.log("[SeedData] Setting up deck exercises...");
    
    // Quick Start Warmup Deck - muscle-specific warmup for strength exercises
    const quickStartExercises = [
      { name: "Joint Mobility Flow", order: 1 },
      { name: "Shoulder & Chest Prep", order: 2 },
      { name: "Hip & Glute Activation", order: 3 },
      { name: "Core Stability Prep", order: 4 },
      { name: "Dynamic Movement Prep", order: 5 },
      { name: "Push-ups", order: 6 },
      { name: "Squats", order: 7 },
      { name: "Plank Hold", order: 8 }
    ];
    
    const quickStartDeck = insertedDecks.find(d => d.name === "Quick Start Warmup Deck");
    if (quickStartDeck) {
      for (const config of quickStartExercises) {
        const exercise = insertedExercises.find(e => e.name === config.name);
        if (exercise) {
          await db.insert(deckExercises).values({
            deckId: quickStartDeck.id,
            exerciseId: exercise.id,
            order: config.order,
            customReps: null,
            customDuration: null
          });
        }
      }
    }
    
    // Cardio Power Deck - cardiovascular and high-intensity movement prep
    const cardioPowerExercises = [
      { name: "Cardio System Warmup", order: 1 },
      { name: "Joint Mobility Flow", order: 2 },
      { name: "Dynamic Movement Prep", order: 3 },
      { name: "Injury Prevention Check", order: 4 },
      { name: "Jumping Jacks", order: 5 },
      { name: "High Knees", order: 6 },
      { name: "Explosive Power", order: 7 },
      { name: "Endurance Challenge", order: 8 }
    ];
    
    const cardioDeck = insertedDecks.find(d => d.name === "Cardio Power Deck");
    if (cardioDeck) {
      for (const config of cardioPowerExercises) {
        const exercise = insertedExercises.find(e => e.name === config.name);
        if (exercise) {
          await db.insert(deckExercises).values({
            deckId: cardioDeck.id,
            exerciseId: exercise.id,
            order: config.order,
            customReps: null,
            customDuration: null
          });
        }
      }
    }
    
    // Strength Builder Deck - comprehensive strength preparation
    const strengthBuilderExercises = [
      { name: "Injury Prevention Check", order: 1 },
      { name: "Shoulder & Chest Prep", order: 2 },
      { name: "Hip & Glute Activation", order: 3 },
      { name: "Core Stability Prep", order: 4 },
      { name: "Mental Focus Prep", order: 5 },
      { name: "Push-ups", order: 6 },
      { name: "Squats", order: 7 },
      { name: "Plank Hold", order: 8 },
      { name: "Strength Surge", order: 9 },
      { name: "Flow State", order: 10 }
    ];
    
    const strengthDeck = insertedDecks.find(d => d.name === "Strength Builder Deck");
    if (strengthDeck) {
      for (const config of strengthBuilderExercises) {
        const exercise = insertedExercises.find(e => e.name === config.name);
        if (exercise) {
          await db.insert(deckExercises).values({
            deckId: strengthDeck.id,
            exerciseId: exercise.id,
            order: config.order,
            customReps: null,
            customDuration: null
          });
        }
      }
    }

    console.log("[SeedData] ✅ Essential seeding completed successfully!");
    console.log(`[SeedData] Summary:`);
    console.log(`  - ${insertedExercises.length} exercises (including muscle-specific warmup, utility, and power cards)`);
    console.log(`  - ${insertedDecks.length} decks with targeted muscle preparation`);
    console.log(`  - ${insertedAchievements.length} achievements`);
    
    console.log("[SeedData] 🎯 Muscle-Specific Warmup Analysis:");
    console.log("  Quick Start Deck: Upper body (shoulders, chest, triceps) + Lower body (hips, glutes, quads) + Core");
    console.log("  Cardio Power Deck: Cardiovascular system + Hip flexors + Full body coordination");
    console.log("  Strength Builder Deck: All major muscle groups with comprehensive injury prevention");
    
  } catch (error) {
    console.error("[SeedData] Error during essential seeding:", error);
    throw error;
  }
}