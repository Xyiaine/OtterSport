import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import OtterCharacter from "@/components/ui/otter-character";
import AIOpponentEmotions, { 
  type EmotionType, 
  triggerEmotion, 
  getEmotionForEvent 
} from "@/components/ui/ai-opponent-emotions";
import ThemedExerciseCard, { 
  getDeckTheme, 
  type DeckTheme 
} from "@/components/ui/themed-exercise-cards";
import StrategicCard from "@/components/ui/strategic-card";
import type { Exercise, Deck } from "@shared/schema";

interface GameCard {
  id: string;
  exercise: Exercise;
  points: number;
  difficulty: number;
  type: 'cardio' | 'strength' | 'flexibility' | 'mixed';
  combo?: string; // For combo mechanics
  special?: 'double' | 'block' | 'steal' | 'bonus'; // Special abilities
}

interface GameState {
  playerScore: number;
  aiScore: number;
  playerHand: GameCard[];
  aiHand: GameCard[];
  deckCards: GameCard[];
  currentTurn: 'player' | 'ai';
  gamePhase: 'drawing' | 'playing' | 'ai-turn' | 'combo-phase' | 'game-over';
  selectedCard: GameCard | null;
  lastPlayedCard: GameCard | null;
  aiLastPlayedCard: GameCard | null;
  aiEmotion: EmotionType;
  deckTheme: DeckTheme;
  comboMultiplier: number;
  playerComboStreak: number;
  aiComboStreak: number;
  specialEffectsActive: string[];
  turnTimer: number;
  maxTurnTime: number;
}

export default function CardBattle() {
  const params = useParams<{ id: string }>();
  const deckId = params.id ? parseInt(params.id) : null;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    playerScore: 0,
    aiScore: 0,
    playerHand: [],
    aiHand: [],
    deckCards: [],
    currentTurn: 'player',
    gamePhase: 'drawing',
    selectedCard: null,
    lastPlayedCard: null,
    aiLastPlayedCard: null,
    aiEmotion: 'confident',
    deckTheme: 'cardio',
    comboMultiplier: 1,
    playerComboStreak: 0,
    aiComboStreak: 0,
    specialEffectsActive: [],
    turnTimer: 10, // Only for AI turns
    maxTurnTime: 10 // 10 seconds for AI
  });

  // Fetch deck with exercises
  const { data: deckWithExercises } = useQuery<Deck & { exercises: Array<{ exercise: Exercise }> }>({
    queryKey: ["/api/decks", deckId],
    enabled: !!deckId,
  });

  const deck = deckWithExercises;
  const exercises = deckWithExercises?.exercises?.map(item => item.exercise) || [];

  // Initialize game when exercises load
  useEffect(() => {
    if (exercises.length > 0 && gameState.deckCards.length === 0) {
      const theme = getDeckTheme(deck?.name || '');
      setGameState(prev => ({ 
        ...prev, 
        deckTheme: theme,
        aiEmotion: getEmotionForEvent('game_start', 0, 0)
      }));
      initializeGame();
    }
  }, [exercises, deck]);

  // AI Timer Effect (10 seconds for AI turns only)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.gamePhase === 'ai-turn' && gameState.turnTimer > 0) {
      interval = setInterval(() => {
        setGameState(prev => {
          if (prev.turnTimer <= 1) {
            // AI turn timer expired, force AI to play
            setTimeout(() => playAICard(), 100);
            return { ...prev, turnTimer: 10 }; // Reset to 10 seconds for AI
          }
          return { ...prev, turnTimer: prev.turnTimer - 1 };
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [gameState.gamePhase, gameState.turnTimer]);

  const initializeGame = () => {
    // Create enhanced game cards with strategic mechanics
    const gameCards: GameCard[] = [];
    exercises.forEach((exercise, index) => {
      // Add multiple copies with variations for strategy
      for (let i = 0; i < 3; i++) {
        const baseCard: GameCard = {
          id: `${exercise.id}-${index}-${i}-${Date.now()}`,
          exercise,
          points: calculatePoints(exercise),
          difficulty: getDifficultyLevel(exercise.category),
          type: getExerciseType(exercise.category),
          combo: getComboType(exercise.category),
          special: getRandomSpecial(0.15) // 15% chance for special abilities
        };
        gameCards.push(baseCard);
      }
    });
    
    // Add special power cards for deeper strategy (10% of deck)
    const powerCardCount = Math.max(2, Math.floor(gameCards.length * 0.1));
    for (let i = 0; i < powerCardCount; i++) {
      const powerCard: GameCard = {
        id: `power-${i}-${Date.now()}`,
        exercise: createPowerExercise(i),
        points: Math.floor(Math.random() * 3) + 4, // 4-6 points
        difficulty: Math.floor(Math.random() * 3) + 3, // 3-5 difficulty
        type: 'mixed',
        combo: 'power',
        special: ['double', 'block', 'steal', 'bonus'][Math.floor(Math.random() * 4)] as any
      };
      gameCards.push(powerCard);
    }

    // Shuffle deck thoroughly
    const shuffledDeck = [...gameCards].sort(() => Math.random() - 0.5);
    
    setGameState(prev => ({
      ...prev,
      playerHand: [],
      aiHand: [],
      deckCards: shuffledDeck,
      playerScore: 0,
      aiScore: 0,
      currentTurn: 'player',
      gamePhase: 'drawing',
      selectedCard: null,
      lastPlayedCard: null,
      aiLastPlayedCard: null,
    }));
  };

  const calculatePoints = (exercise: Exercise): number => {
    const baseDifficulty = getDifficultyLevel(exercise.category);
    const intensityMultiplier = exercise.defaultReps ? exercise.defaultReps / 10 : 1;
    const durationMultiplier = exercise.defaultDuration ? exercise.defaultDuration / 30 : 1;
    
    return Math.round(baseDifficulty * Math.max(intensityMultiplier, durationMultiplier));
  };

  const getDifficultyLevel = (category: string): number => {
    const difficultyMap: { [key: string]: number } = {
      'cardio': 3,
      'strength': 4,
      'flexibility': 2,
      'balance': 2,
      'endurance': 4,
      'mixed': 3,
    };
    return difficultyMap[category] || 3;
  };

  // Strategic Helper Functions
  const getExerciseType = (category: string): 'cardio' | 'strength' | 'flexibility' | 'mixed' => {
    const typeMap: { [key: string]: 'cardio' | 'strength' | 'flexibility' | 'mixed' } = {
      'cardio': 'cardio',
      'strength': 'strength', 
      'flexibility': 'flexibility',
      'balance': 'flexibility',
      'endurance': 'cardio',
      'mixed': 'mixed'
    };
    return typeMap[category] || 'mixed';
  };

  const getComboType = (category: string): string => {
    const comboMap: { [key: string]: string } = {
      'cardio': 'energy',
      'strength': 'power',
      'flexibility': 'flow',
      'balance': 'stability'
    };
    return comboMap[category] || 'basic';
  };

  const getRandomSpecial = (chance: number): 'double' | 'block' | 'steal' | 'bonus' | undefined => {
    if (Math.random() < chance) {
      const specials: ('double' | 'block' | 'steal' | 'bonus')[] = ['double', 'block', 'steal', 'bonus'];
      return specials[Math.floor(Math.random() * specials.length)];
    }
    return undefined;
  };

  const createPowerExercise = (index: number): Exercise => {
    const powerExercises = [
      { name: "Power Boost", description: "Amplify your next move", category: "mixed", icon: "fas fa-bolt" },
      { name: "Shield Block", description: "Defend against next attack", category: "mixed", icon: "fas fa-shield-alt" },
      { name: "Energy Steal", description: "Take points from opponent", category: "mixed", icon: "fas fa-magnet" },
      { name: "Bonus Round", description: "Extra points this turn", category: "mixed", icon: "fas fa-star" },
    ];
    const base = powerExercises[index % powerExercises.length];
    return {
      id: index + 1000,
      name: base.name,
      description: base.description,
      category: base.category,
      difficulty: 2,
      defaultReps: null,
      defaultDuration: null,
      instructions: base.description,
      icon: base.icon,
      createdAt: new Date()
    };
  };

  const checkComboBonus = (playedCard: GameCard, hand: GameCard[]): number => {
    if (!playedCard.combo) return 1;
    
    const sameComboCards = hand.filter(card => card.combo === playedCard.combo);
    if (sameComboCards.length >= 1) {
      return 1.5; // 50% bonus for combo
    }
    
    // Triple combo bonus
    if (sameComboCards.length >= 2) {
      return 2.0; // 100% bonus for triple combo
    }
    
    return 1;
  };

  const applySpecialEffect = (card: GameCard, currentGameState: GameState): Partial<GameState> => {
    if (!card.special) return {};
    
    switch (card.special) {
      case 'double':
        return { comboMultiplier: 2 };
      case 'block':
        return { specialEffectsActive: [...currentGameState.specialEffectsActive, 'shield'] };
      case 'steal':
        const stolenPoints = Math.min(3, currentGameState.aiScore);
        return { 
          playerScore: currentGameState.playerScore + stolenPoints,
          aiScore: currentGameState.aiScore - stolenPoints
        };
      case 'bonus':
        return { playerScore: currentGameState.playerScore + 2 };
      default:
        return {};
    }
  };

  const drawCards = () => {
    if (gameState.deckCards.length === 0) {
      endGame();
      return;
    }

    // Calculate how many cards each player needs (up to 3 cards max in hand)
    const playerNeedsCards = Math.max(0, 3 - gameState.playerHand.length);
    const aiNeedsCards = Math.max(0, 3 - gameState.aiHand.length);
    
    // Draw cards for player first
    const cardsToDrawPlayer = Math.min(playerNeedsCards, gameState.deckCards.length);
    const newPlayerCards = gameState.deckCards.slice(0, cardsToDrawPlayer);
    
    // Draw cards for AI from remaining deck
    const remainingAfterPlayer = gameState.deckCards.slice(cardsToDrawPlayer);
    const cardsToDrawAI = Math.min(aiNeedsCards, remainingAfterPlayer.length);
    const newAICards = remainingAfterPlayer.slice(0, cardsToDrawAI);
    
    // Final remaining deck after both players draw
    const finalRemainingDeck = remainingAfterPlayer.slice(cardsToDrawAI);

    setGameState(prev => ({
      ...prev,
      playerHand: [...prev.playerHand, ...newPlayerCards],
      aiHand: [...prev.aiHand, ...newAICards],
      deckCards: finalRemainingDeck,
      gamePhase: 'playing',
    }));
  };

  const selectCard = (card: GameCard) => {
    setGameState(prev => ({
      ...prev,
      selectedCard: card,
    }));
  };

  const playCard = (card: GameCard) => {
    if (gameState.gamePhase !== 'playing') return;

    // Remove card from player hand
    const newPlayerHand = gameState.playerHand.filter(c => c.id !== card.id);
    
    // Calculate combo bonus
    const comboBonus = checkComboBonus(card, gameState.playerHand);
    const specialEffects = applySpecialEffect(card, gameState);
    
    // Calculate final points with all bonuses
    let finalPoints = Math.round(card.points * comboBonus * gameState.comboMultiplier);
    
    // Check for combo streak
    const isCombo = comboBonus > 1;
    const newComboStreak = isCombo ? gameState.playerComboStreak + 1 : 0;
    
    // Streak bonus for consecutive combos
    if (newComboStreak >= 2) {
      finalPoints += newComboStreak; // Extra points for streak
      toast({
        title: `🔥 ${newComboStreak}x Combo Streak!`,
        description: `+${newComboStreak} streak bonus points!`
      });
    }
    
    // Special effect notifications
    if (card.special) {
      const effectMessages = {
        double: "⚡ Double Points Next Turn!",
        block: "🛡️ Shield Activated!",
        steal: `🎯 Stole ${Math.min(3, gameState.aiScore)} points!`,
        bonus: "⭐ Bonus Points Gained!"
      };
      toast({
        title: effectMessages[card.special],
        description: `${card.exercise.name} special effect activated!`
      });
    }
    
    const baseNewScore = (specialEffects.playerScore !== undefined) 
      ? specialEffects.playerScore 
      : gameState.playerScore + finalPoints;
    
    // Trigger AI emotion based on player's strategic move
    const aiEmotion = getEmotionForEvent(
      'player_good_exercise', // Use standard event type
      specialEffects.aiScore || gameState.aiScore, 
      baseNewScore
    );
    
    setGameState(prev => ({
      ...prev,
      playerHand: newPlayerHand,
      lastPlayedCard: card,
      playerScore: baseNewScore,
      playerComboStreak: newComboStreak,
      currentTurn: 'ai',
      gamePhase: 'ai-turn',
      selectedCard: null,
      aiEmotion,
      comboMultiplier: 1, // Reset multiplier after use
      turnTimer: 10, // Reset to 10 seconds for AI
      ...specialEffects
    }));

    // AI plays after strategic delay
    setTimeout(() => {
      playAICard();
    }, isCombo ? 2000 : 1500); // Longer delay for combos to show effect
  };

  const playAICard = () => {
    if (gameState.aiHand.length === 0) {
      endGame();
      return;
    }

    // Enhanced AI strategy with multiple tactics
    let selectedCard: GameCard;
    const currentScore = gameState.aiScore;
    const playerScore = gameState.playerScore;
    const scoreDiff = playerScore - currentScore;
    
    if (scoreDiff > 5) {
      // Losing badly - play special cards or combos
      const specialCard = gameState.aiHand.find(card => card.special);
      const comboCard = gameState.aiHand.find(card => 
        gameState.aiHand.filter(c => c.combo === card.combo).length > 1
      );
      selectedCard = specialCard || comboCard || gameState.aiHand.reduce((best, current) => 
        current.points > best.points ? current : best
      );
    } else if (scoreDiff < -3) {
      // Winning - play defensively, save good cards
      selectedCard = gameState.aiHand.reduce((worst, current) => 
        current.points < worst.points ? current : worst
      );
    } else {
      // Close game - balanced strategy
      const goodCards = gameState.aiHand.filter(card => card.points >= 4);
      selectedCard = goodCards.length > 0 
        ? goodCards[Math.floor(Math.random() * goodCards.length)]
        : gameState.aiHand[Math.floor(Math.random() * gameState.aiHand.length)];
    }

    const newAIHand = gameState.aiHand.filter(c => c.id !== selectedCard.id);
    
    // Calculate AI combo bonus
    const aiComboBonus = checkComboBonus(selectedCard, gameState.aiHand);
    const aiSpecialEffects = applySpecialEffect(selectedCard, gameState);
    let aiFinalPoints = Math.round(selectedCard.points * aiComboBonus);
    
    // AI combo streak
    const isAICombo = aiComboBonus > 1;
    const newAIComboStreak = isAICombo ? gameState.aiComboStreak + 1 : 0;
    if (newAIComboStreak >= 2) {
      aiFinalPoints += newAIComboStreak;
    }
    
    const baseNewAIScore = (aiSpecialEffects.aiScore !== undefined)
      ? aiSpecialEffects.aiScore
      : gameState.aiScore + aiFinalPoints;
    
    // Trigger AI emotion after playing with strategy context
    const aiEmotion = getEmotionForEvent('ai_good_exercise', baseNewAIScore, gameState.playerScore);

    setGameState(prev => ({
      ...prev,
      aiHand: newAIHand,
      aiLastPlayedCard: selectedCard,
      aiScore: baseNewAIScore,
      aiComboStreak: newAIComboStreak,
      currentTurn: 'player',
      gamePhase: (prev.deckCards.length > 0 && (prev.playerHand.length > 0 || newAIHand.length > 0)) ? 'drawing' : 'game-over',
      aiEmotion,
      turnTimer: 10, // Keep at 10 seconds for next AI turn
      ...aiSpecialEffects
    }));

    // Check if game should end - no cards left in deck and both players have no cards
    if (gameState.deckCards.length === 0 && newAIHand.length === 0 && gameState.playerHand.length === 0) {
      setTimeout(() => endGame(), 1000);
    }
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'game-over',
    }));

    const winner = gameState.playerScore > gameState.aiScore ? 'player' : 
                   gameState.aiScore > gameState.playerScore ? 'ai' : 'tie';
    
    toast({
      title: winner === 'player' ? "🎉 Victory!" : 
             winner === 'ai' ? "💪 AI Wins!" : "🤝 It's a Tie!",
      description: `Final Score - You: ${gameState.playerScore}, AI: ${gameState.aiScore}`,
    });
  };

  const restartGame = () => {
    setGameState({
      playerScore: 0,
      aiScore: 0,
      playerHand: [],
      aiHand: [],
      deckCards: [],
      currentTurn: 'player',
      gamePhase: 'drawing',
      selectedCard: null,
      lastPlayedCard: null,
      aiLastPlayedCard: null,
      aiEmotion: 'confident',
      deckTheme: gameState.deckTheme,
      comboMultiplier: 1,
      playerComboStreak: 0,
      aiComboStreak: 0,
      specialEffectsActive: [],
      turnTimer: 10,
      maxTurnTime: 10
    });
    initializeGame();
  };

  if (!deck || exercises.length === 0) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-otter-teal mx-auto mb-4"></div>
          <p className="text-slate-600">Loading card battle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Card Battle: {deck.name}
          </h1>
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{gameState.playerScore}</div>
              <div className="text-sm text-slate-600">Your Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg text-slate-500">VS</div>
              <div className="text-xs text-slate-400">Cards Left: {gameState.deckCards.length}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{gameState.aiScore}</div>
              <div className="text-sm text-slate-600">AI Score</div>
            </div>
          </div>
        </div>

        {/* AI Opponent Display */}
        <div className="flex justify-center mb-6">
          <AIOpponentEmotions 
            currentEmotion={gameState.aiEmotion}
            playerScore={gameState.playerScore}
            aiScore={gameState.aiScore}
            isAITurn={gameState.gamePhase === 'ai-turn'}
            deckType={gameState.deckTheme}
            onEmotionChange={(emotion) => setGameState(prev => ({ ...prev, aiEmotion: emotion }))}
          />
        </div>

        {/* Game Phase Indicator with AI Timer */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center space-x-4">
            <Badge variant="outline" className="px-4 py-2">
              {gameState.gamePhase === 'drawing' && 'Draw Phase - Click the deck to draw cards'}
              {gameState.gamePhase === 'playing' && 'Your Turn - Select and play a card when ready'}
              {gameState.gamePhase === 'ai-turn' && `AI is thinking... ${gameState.turnTimer}s`}
              {gameState.gamePhase === 'combo-phase' && 'Combo Effect!'}
              {gameState.gamePhase === 'game-over' && 'Game Over!'}
            </Badge>
            
            {/* AI Timer Visual */}
            {gameState.gamePhase === 'ai-turn' && (
              <div className="w-12 h-12 relative">
                <div className="absolute inset-0 rounded-full border-3 border-gray-200">
                  <div 
                    className="absolute inset-0 rounded-full border-3 border-red-500 border-t-transparent animate-spin"
                    style={{
                      animationDuration: `${gameState.turnTimer}s`,
                      animationTimingFunction: 'linear'
                    }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-red-600">
                  {gameState.turnTimer}
                </div>
              </div>
            )}
          </div>
          
          {/* Combo Streak Display */}
          {(gameState.playerComboStreak > 0 || gameState.aiComboStreak > 0) && (
            <div className="mt-2 flex justify-center space-x-4">
              {gameState.playerComboStreak > 0 && (
                <Badge variant="default" className="bg-blue-500">
                  🔥 Player {gameState.playerComboStreak}x Combo
                </Badge>
              )}
              {gameState.aiComboStreak > 0 && (
                <Badge variant="destructive">
                  🔥 AI {gameState.aiComboStreak}x Combo
                </Badge>
              )}
            </div>
          )}
          
          {/* Special Effects Active */}
          {gameState.specialEffectsActive.length > 0 && (
            <div className="mt-2">
              <div className="flex justify-center space-x-2">
                {gameState.specialEffectsActive.map((effect, index) => (
                  <Badge key={index} variant="outline" className="bg-purple-50">
                    {effect === 'shield' && '🛡️ Shield'}
                    {effect === 'double' && '⚡ Double'}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Last Played Cards */}
        {(gameState.lastPlayedCard || gameState.aiLastPlayedCard) && (
          <div className="flex justify-center space-x-8 mb-6">
            {gameState.lastPlayedCard && (
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-2">You Played:</div>
                <Card className="w-32 border-blue-200 bg-blue-50">
                  <CardContent className="p-3">
                    <div className="text-xs font-semibold text-blue-700">
                      {gameState.lastPlayedCard.exercise.name}
                    </div>
                    <div className="text-lg font-bold text-blue-600 mt-1">
                      {gameState.lastPlayedCard.points} pts
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {gameState.aiLastPlayedCard && (
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-2">AI Played:</div>
                <Card className="w-32 border-red-200 bg-red-50">
                  <CardContent className="p-3">
                    <div className="text-xs font-semibold text-red-700">
                      {gameState.aiLastPlayedCard.exercise.name}
                    </div>
                    <div className="text-lg font-bold text-red-600 mt-1">
                      {gameState.aiLastPlayedCard.points} pts
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* AI Hand (face down) */}
        <div className="text-center mb-6">
          <div className="text-sm text-slate-600 mb-2">AI Hand ({gameState.aiHand.length} cards)</div>
          <div className="flex justify-center space-x-2">
            {gameState.aiHand.map((_, index) => (
              <div
                key={index}
                className="w-16 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg border-2 border-slate-600 shadow-lg"
              />
            ))}
          </div>
        </div>

        {/* Deck */}
        <div className="text-center mb-6">
          <div className="text-sm text-slate-600 mb-2">Deck ({gameState.deckCards.length} cards remaining)</div>
          <div className="flex justify-center">
            {gameState.deckCards.length > 0 ? (
              <div
                className={`w-24 h-32 bg-gradient-to-br from-otter-teal to-teal-700 rounded-lg border-2 border-teal-600 shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl ${
                  gameState.gamePhase === 'drawing' ? 'animate-pulse' : ''
                }`}
                onClick={drawCards}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-white text-center">
                    <i className="fas fa-layer-group text-2xl mb-1"></i>
                    <div className="text-xs font-semibold">DRAW</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-24 h-32 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                <div className="text-slate-400 text-center">
                  <i className="fas fa-times text-xl mb-1"></i>
                  <div className="text-xs">Empty</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Player Hand with Strategic Cards */}
        <div className="text-center mb-6">
          <div className="text-sm text-slate-600 mb-2">Your Hand</div>
          <div className="flex justify-center space-x-3 flex-wrap gap-y-4">
            {gameState.playerHand.map((card) => {
              const comboCount = gameState.playerHand.filter(c => c.combo === card.combo).length;
              return (
                <StrategicCard
                  key={card.id}
                  card={card}
                  isSelected={gameState.selectedCard?.id === card.id}
                  canPlay={gameState.gamePhase === 'playing'}
                  onSelect={() => gameState.gamePhase === 'playing' && selectCard(card)}
                  onPlay={() => playCard(card)}
                  comboCount={comboCount}
                  showComboHint={comboCount > 1}
                />
              );
            })}
          </div>
          
          {/* Enhanced Hand Strategy Hints */}
          {gameState.gamePhase === 'playing' && gameState.playerHand.length > 0 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="text-center space-y-2">
                <div className="text-sm text-blue-700 font-medium flex items-center justify-center space-x-2">
                  <span>💡</span>
                  <span>Strategic Tips</span>
                </div>
                <div className="text-xs text-blue-600">
                  Take your time to analyze your cards! Look for combo matches and special abilities for maximum points.
                </div>
                <div className="flex justify-center space-x-2 mt-2">
                  {gameState.comboMultiplier > 1 && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                      ⚡ {gameState.comboMultiplier}x Multiplier Active
                    </Badge>
                  )}
                  {gameState.playerHand.some(card => card.special) && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                      ✨ Special Cards Available
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Game Actions */}
        <div className="flex justify-center space-x-4 mb-6">
          {gameState.gamePhase === 'drawing' && (
            <Button
              onClick={drawCards}
              className="bg-otter-teal hover:bg-teal-600 text-white px-8 py-3"
              disabled={gameState.deckCards.length === 0}
            >
              🎴 Draw Cards
            </Button>
          )}

          {gameState.gamePhase === 'ai-turn' && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-otter-teal"></div>
              <span className="text-slate-600">AI is playing...</span>
            </div>
          )}

          {gameState.gamePhase === 'game-over' && (
            <div className="space-x-4">
              <Button
                onClick={restartGame}
                className="bg-otter-teal hover:bg-teal-600 text-white px-8 py-3"
              >
                Play Again
              </Button>
              <Button
                onClick={() => setLocation('/')}
                variant="outline"
                className="px-8 py-3"
              >
                Back to Home
              </Button>
            </div>
          )}
        </div>

        {/* Game Over Stats */}
        {gameState.gamePhase === 'game-over' && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">
                {gameState.playerScore > gameState.aiScore ? '🎉 Victory!' : 
                 gameState.aiScore > gameState.playerScore ? '💪 AI Wins!' : '🤝 Tie Game!'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Your Score:</span>
                  <span className="font-bold text-blue-600">{gameState.playerScore}</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Score:</span>
                  <span className="font-bold text-red-600">{gameState.aiScore}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Difference:</span>
                  <span>{Math.abs(gameState.playerScore - gameState.aiScore)} points</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}