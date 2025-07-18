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
import type { Exercise, Deck } from "@shared/schema";

interface GameCard {
  id: string;
  exercise: Exercise;
  points: number;
  difficulty: number;
}

interface GameState {
  playerScore: number;
  aiScore: number;
  playerHand: GameCard[];
  aiHand: GameCard[];
  deckCards: GameCard[];
  currentTurn: 'player' | 'ai';
  gamePhase: 'drawing' | 'playing' | 'ai-turn' | 'game-over';
  selectedCard: GameCard | null;
  lastPlayedCard: GameCard | null;
  aiLastPlayedCard: GameCard | null;
}

export default function CardBattle() {
  const params = useParams();
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
      initializeGame();
    }
  }, [exercises]);

  const initializeGame = () => {
    // Create game cards from exercises (duplicate exercises to make a bigger deck)
    const gameCards: GameCard[] = [];
    exercises.forEach((exercise, index) => {
      // Add 2-3 copies of each exercise to make deck bigger
      for (let i = 0; i < 2; i++) {
        gameCards.push({
          id: `${exercise.id}-${index}-${i}`,
          exercise,
          points: calculatePoints(exercise),
          difficulty: getDifficultyLevel(exercise.category),
        });
      }
    });

    // Shuffle deck
    const shuffledDeck = [...gameCards].sort(() => Math.random() - 0.5);
    
    setGameState(prev => ({
      ...prev,
      playerHand: [],
      aiHand: [],
      deckCards: shuffledDeck,
      gamePhase: 'drawing',
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
    };
    return difficultyMap[category] || 3;
  };

  const drawCards = () => {
    if (gameState.deckCards.length === 0) {
      endGame();
      return;
    }

    // Draw 3 cards for player and AI only if they have no cards
    const cardsToDrawPlayer = gameState.playerHand.length === 0 ? Math.min(3, gameState.deckCards.length) : 0;
    const cardsToDrawAI = gameState.aiHand.length === 0 ? Math.min(3, gameState.deckCards.length - cardsToDrawPlayer) : 0;

    const newPlayerCards = gameState.deckCards.slice(0, cardsToDrawPlayer);
    const newAICards = gameState.deckCards.slice(cardsToDrawPlayer, cardsToDrawPlayer + cardsToDrawAI);
    const remainingDeck = gameState.deckCards.slice(cardsToDrawPlayer + cardsToDrawAI);

    setGameState(prev => ({
      ...prev,
      playerHand: [...prev.playerHand, ...newPlayerCards],
      aiHand: [...prev.aiHand, ...newAICards],
      deckCards: remainingDeck,
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
    
    setGameState(prev => ({
      ...prev,
      playerHand: newPlayerHand,
      lastPlayedCard: card,
      playerScore: prev.playerScore + card.points,
      currentTurn: 'ai',
      gamePhase: 'ai-turn',
      selectedCard: null,
    }));

    // AI plays after a short delay
    setTimeout(() => {
      playAICard();
    }, 1500);
  };

  const playAICard = () => {
    if (gameState.aiHand.length === 0) {
      endGame();
      return;
    }

    // AI strategy: play the highest point card
    const bestCard = gameState.aiHand.reduce((best, current) => 
      current.points > best.points ? current : best
    );

    const newAIHand = gameState.aiHand.filter(c => c.id !== bestCard.id);

    setGameState(prev => ({
      ...prev,
      aiHand: newAIHand,
      aiLastPlayedCard: bestCard,
      aiScore: prev.aiScore + bestCard.points,
      currentTurn: 'player',
      gamePhase: (prev.deckCards.length > 0 && (prev.playerHand.length > 0 || newAIHand.length > 0)) ? 'drawing' : 'game-over',
    }));

    // Check if game should end
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

        {/* Game Phase Indicator */}
        <div className="text-center mb-6">
          <Badge variant="outline" className="px-4 py-2">
            {gameState.gamePhase === 'drawing' && 'Draw Phase - Click the deck to draw cards'}
            {gameState.gamePhase === 'playing' && 'Your Turn - Select a card to play'}
            {gameState.gamePhase === 'ai-turn' && 'AI is thinking...'}
            {gameState.gamePhase === 'game-over' && 'Game Over!'}
          </Badge>
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

        {/* Player Hand */}
        <div className="text-center mb-6">
          <div className="text-sm text-slate-600 mb-2">Your Hand</div>
          <div className="flex justify-center space-x-4 flex-wrap">
            {gameState.playerHand.map((card) => (
              <Card
                key={card.id}
                className={`w-40 cursor-pointer transition-all duration-200 ${
                  gameState.selectedCard?.id === card.id
                    ? 'ring-2 ring-otter-teal border-otter-teal transform scale-105'
                    : 'hover:transform hover:scale-105 hover:shadow-lg'
                } ${gameState.gamePhase !== 'playing' ? 'opacity-50' : ''}`}
                onClick={() => gameState.gamePhase === 'playing' && selectCard(card)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-center">
                    {card.exercise.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-otter-teal mb-2">
                      {card.points} pts
                    </div>
                    <div className="text-xs text-slate-600 mb-2">
                      {card.exercise.category}
                    </div>
                    <div className="text-xs text-slate-500">
                      {card.exercise.defaultReps && `${card.exercise.defaultReps} reps`}
                      {card.exercise.defaultDuration && `${card.exercise.defaultDuration}s`}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Game Actions */}
        <div className="flex justify-center space-x-4 mb-6">
          {gameState.gamePhase === 'playing' && gameState.selectedCard && (
            <Button
              onClick={() => playCard(gameState.selectedCard!)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Play Selected Card
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