/**
 * WARMUP CARD SCORING SYSTEM
 * 
 * Dynamic scoring logic that rewards warmup exercises highly in early game
 * and provides massive combo bonuses for completing full warmup sets.
 * 
 * Features:
 * - High initial points for warmup cards (100-150 points)
 * - Decreasing value as more warmup cards are played
 * - Massive combo bonus for playing one of each warmup type
 * - Progressive point reduction after warmup phase
 * - Strategic depth with timing decisions
 */

export interface WarmupScoringState {
  warmupCardsPlayed: string[]; // Names of warmup cards played
  totalCardsPlayed: number;
  gamePhase: 'early' | 'mid' | 'late';
  comboMultiplier: number;
  warmupComboActive: boolean;
}

export interface ScoringResult {
  points: number;
  bonusPoints: number;
  description: string;
  phaseModifier: number;
  comboBonus: number;
}

// Define the warmup card types for combo detection
const WARMUP_TYPES = [
  'Joint Mobility',
  'Dynamic Stretching', 
  'Heart Rate Activation',
  'Mind-Body Connection',
  'Movement Prep'
];

/**
 * Calculate points for playing a card based on current game state
 */
export function calculateCardScore(
  cardName: string,
  cardType: 'warmup' | 'exercise' | 'utility',
  cardCategory: string,
  difficulty: number,
  scoringState: WarmupScoringState
): ScoringResult {
  let basePoints = 0;
  let bonusPoints = 0;
  let description = '';
  let phaseModifier = 1.0;
  let comboBonus = 0;

  // Base points calculation
  if (cardType === 'warmup') {
    basePoints = calculateWarmupPoints(cardName, scoringState);
    description = `Warmup: ${cardName}`;
  } else if (cardType === 'exercise') {
    basePoints = Math.round(difficulty * 20 + getCategoryBonus(cardCategory));
    description = `Exercise: ${cardName}`;
  } else {
    basePoints = 25; // Utility cards base value
    description = `Utility: ${cardName}`;
  }

  // Game phase modifier
  phaseModifier = getPhaseModifier(scoringState.gamePhase, cardType);
  
  // Warmup combo detection
  if (cardType === 'warmup' && !scoringState.warmupCardsPlayed.includes(cardName)) {
    comboBonus = checkWarmupCombo(cardName, scoringState);
  }

  // Final point calculation
  const finalPoints = Math.round(basePoints * phaseModifier) + comboBonus;
  
  return {
    points: finalPoints,
    bonusPoints: comboBonus,
    description: `${description} (${finalPoints} pts)`,
    phaseModifier,
    comboBonus
  };
}

/**
 * Calculate points for warmup cards with diminishing returns
 */
function calculateWarmupPoints(cardName: string, scoringState: WarmupScoringState): number {
  const warmupCount = scoringState.warmupCardsPlayed.length;
  const hasBeenPlayed = scoringState.warmupCardsPlayed.includes(cardName);
  
  // Base warmup points - very high for early game strategy
  let basePoints = 120;
  
  if (hasBeenPlayed) {
    // Repeated warmup cards lose significant value
    basePoints = 30;
  } else {
    // Diminishing returns for each new warmup card
    const diminishingFactor = Math.max(0.3, 1 - (warmupCount * 0.15));
    basePoints = Math.round(basePoints * diminishingFactor);
  }
  
  return basePoints;
}

/**
 * Check for warmup combo completion and award massive bonus
 */
function checkWarmupCombo(cardName: string, scoringState: WarmupScoringState): number {
  const newWarmupSet = [...scoringState.warmupCardsPlayed, cardName];
  const uniqueWarmups = [...new Set(newWarmupSet)];
  
  // Check if we're completing a combo (3+ different warmup types)
  if (uniqueWarmups.length >= 3) {
    const comboSize = uniqueWarmups.length;
    if (comboSize === 3) return 200; // Triple warmup combo
    if (comboSize === 4) return 350; // Quad warmup combo  
    if (comboSize === 5) return 500; // Perfect warmup combo!
  }
  
  return 0;
}

/**
 * Get game phase modifier for scoring
 */
function getPhaseModifier(phase: 'early' | 'mid' | 'late', cardType: string): number {
  if (cardType === 'warmup') {
    switch (phase) {
      case 'early': return 1.5; // 50% bonus in early game
      case 'mid': return 0.8;   // 20% penalty in mid game
      case 'late': return 0.4;  // 60% penalty in late game
    }
  } else if (cardType === 'exercise') {
    switch (phase) {
      case 'early': return 0.9; // Slight penalty early (encourage warmup)
      case 'mid': return 1.2;   // Bonus in mid game
      case 'late': return 1.0;  // Normal value late game
    }
  }
  
  return 1.0; // No modifier for utility cards
}

/**
 * Get category-specific bonus points
 */
function getCategoryBonus(category: string): number {
  switch (category) {
    case 'strength': return 15;
    case 'cardio': return 20;
    case 'flexibility': return 10;
    case 'core': return 12;
    default: return 8;
  }
}

/**
 * Determine game phase based on cards played
 */
export function determineGamePhase(totalCardsPlayed: number, deckSize: number): 'early' | 'mid' | 'late' {
  const progress = totalCardsPlayed / deckSize;
  
  if (progress < 0.3) return 'early';
  if (progress < 0.7) return 'mid';
  return 'late';
}

/**
 * Update scoring state after playing a card
 */
export function updateScoringState(
  currentState: WarmupScoringState,
  playedCard: { name: string; cardType: string },
  deckSize: number
): WarmupScoringState {
  const newState = { ...currentState };
  
  // Update cards played
  newState.totalCardsPlayed += 1;
  
  // Track warmup cards
  if (playedCard.cardType === 'warmup' && !newState.warmupCardsPlayed.includes(playedCard.name)) {
    newState.warmupCardsPlayed.push(playedCard.name);
  }
  
  // Update game phase
  newState.gamePhase = determineGamePhase(newState.totalCardsPlayed, deckSize);
  
  // Check for warmup combo completion
  const uniqueWarmups = [...new Set(newState.warmupCardsPlayed)];
  newState.warmupComboActive = uniqueWarmups.length >= 3;
  
  // Update combo multiplier based on warmup completion
  if (newState.warmupComboActive && newState.comboMultiplier < 1.5) {
    newState.comboMultiplier = 1.5; // 50% bonus for completing warmup combo
  }
  
  return newState;
}

/**
 * Create initial scoring state
 */
export function createInitialScoringState(): WarmupScoringState {
  return {
    warmupCardsPlayed: [],
    totalCardsPlayed: 0,
    gamePhase: 'early',
    comboMultiplier: 1.0,
    warmupComboActive: false
  };
}