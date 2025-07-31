/**
 * CARD BATTLE - MINIMAL VERSION
 * 
 * Simplified card battle game with placeholder cards for game artist implementation.
 * Clean, minimal design focused on core gameplay mechanics.
 */

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Badge component removed for minimal design
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { CardPlaceholder, DeckPlaceholder } from "@/components/ui/card-placeholder";
import type { Exercise, Deck } from "@shared/schema";

// Simplified game interfaces
interface GameCard {
  id: string;
  exercise: Exercise;
  points: number;
  type: 'cardio' | 'strength' | 'flexibility' | 'core' | 'warmup' | 'utility';
}

interface GameState {
  playerScore: number;
  aiScore: number;
  playerHand: GameCard[];
  aiHand: GameCard[];
  deckCards: GameCard[];
  currentTurn: 'player' | 'ai';
  gamePhase: 'setup' | 'playing' | 'game-over';
  selectedCard: GameCard | null;
}

export default function CardBattleMinimal() {
  const params = useParams<{ id: string }>();
  const deckId = params.id ? parseInt(params.id) : null;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Simplified game state
  const [gameState, setGameState] = useState<GameState>({
    playerScore: 0,
    aiScore: 0,
    playerHand: [],
    aiHand: [],
    deckCards: [],
    currentTurn: 'player',
    gamePhase: 'setup',
    selectedCard: null,
  });

  // Fetch deck and exercises
  const { data: deck } = useQuery<Deck>({
    queryKey: ["/api/decks", deckId],
    enabled: !!deckId,
  });

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  // Initialize game
  useEffect(() => {
    if (deck && exercises.length > 0) {
      initializeGame();
    }
  }, [deck, exercises]);

  const initializeGame = () => {
    // Create deck cards from exercises
    const deckExercises = exercises.filter(ex => 
      deck?.exerciseIds?.includes(ex.id) || exercises.slice(0, 10)
    );
    
    const cards: GameCard[] = deckExercises.map(exercise => ({
      id: `card-${exercise.id}`,
      exercise,
      points: Math.floor(Math.random() * 20) + 10,
      type: exercise.category as any || 'cardio'
    }));

    // Deal cards
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const playerHand = shuffled.slice(0, 3);
    const aiHand = shuffled.slice(3, 6);
    const remainingCards = shuffled.slice(6);

    setGameState(prev => ({
      ...prev,
      playerHand,
      aiHand,
      deckCards: remainingCards,
      gamePhase: 'playing'
    }));
  };

  const playCard = (card: GameCard) => {
    if (gameState.currentTurn !== 'player') return;

    // Remove card from hand
    const newPlayerHand = gameState.playerHand.filter(c => c.id !== card.id);
    
    // Add points
    const newPlayerScore = gameState.playerScore + card.points;

    setGameState(prev => ({
      ...prev,
      playerHand: newPlayerHand,
      playerScore: newPlayerScore,
      selectedCard: card,
      currentTurn: 'ai'
    }));

    toast({
      title: "Card Played!",
      description: `You played ${card.exercise.name} for ${card.points} points`,
    });

    // AI plays after delay
    setTimeout(playAICard, 1500);
  };

  const playAICard = () => {
    if (gameState.aiHand.length === 0) {
      endGame();
      return;
    }

    const aiCard = gameState.aiHand[0];
    const newAIHand = gameState.aiHand.slice(1);
    const newAIScore = gameState.aiScore + aiCard.points;

    setGameState(prev => ({
      ...prev,
      aiHand: newAIHand,
      aiScore: newAIScore,
      currentTurn: 'player'
    }));

    // Check if game should end
    if (newAIHand.length === 0 && gameState.playerHand.length === 0) {
      setTimeout(endGame, 1000);
    }
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, gamePhase: 'game-over' }));
    
    const winner = gameState.playerScore > gameState.aiScore ? 'player' : 
                   gameState.aiScore > gameState.playerScore ? 'ai' : 'tie';
    
    toast({
      title: winner === 'player' ? "Victory!" : winner === 'ai' ? "AI Wins!" : "It's a Tie!",
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
      gamePhase: 'setup',
      selectedCard: null,
    });
    initializeGame();
  };

  if (!deck || exercises.length === 0) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading card battle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-4"
          >
            ← Back to Home
          </Button>
          
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Card Battle: {deck.name}
          </h1>
          
          <div className="flex justify-center items-center space-x-8 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{gameState.playerScore}</div>
              <div className="text-sm text-slate-600">Your Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg text-slate-500">VS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{gameState.aiScore}</div>
              <div className="text-sm text-slate-600">AI Score</div>
            </div>
          </div>

          {gameState.currentTurn === 'player' && gameState.gamePhase === 'playing' && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">Your Turn</span>
          )}
          {gameState.currentTurn === 'ai' && gameState.gamePhase === 'playing' && (
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">AI Turn</span>
          )}
        </div>

        {/* Game Area */}
        {gameState.gamePhase === 'playing' && (
          <div className="space-y-8">
            {/* AI Hand - Placeholder Cards */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">AI Hand</h3>
              <div className="flex justify-center space-x-2">
                {gameState.aiHand.map((card, idx) => (
                  <CardPlaceholder
                    key={card.id}
                    type="hand"
                    category={card.type}
                    size="medium"
                    label="Hidden"
                  />
                ))}
              </div>
            </div>

            {/* Deck Stack - Placeholder */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">
                Deck ({gameState.deckCards.length} cards)
              </h3>
              <DeckPlaceholder
                deckName="Game Deck"
                cardCount={gameState.deckCards.length}
                size="medium"
                className="mx-auto"
              />
            </div>

            {/* Player Hand - Interactive Placeholder Cards */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Your Hand</h3>
              <div className="flex justify-center space-x-4">
                {gameState.playerHand.map((card) => (
                  <CardPlaceholder
                    key={card.id}
                    type="hand"
                    category={card.type}
                    size="medium"
                    label={card.exercise.name}
                    onClick={() => playCard(card)}
                    className={`cursor-pointer ${
                      gameState.currentTurn === 'player' 
                        ? 'hover:scale-110 hover:shadow-lg' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  />
                ))}
              </div>
              {gameState.currentTurn === 'player' && (
                <p className="text-sm text-slate-600 mt-2">Click a card to play it</p>
              )}
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState.gamePhase === 'game-over' && (
          <div className="text-center space-y-6">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {gameState.playerScore > gameState.aiScore ? '🎉 You Win!' : 
                   gameState.aiScore > gameState.playerScore ? '💪 AI Wins!' : '🤝 Tie Game!'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Your Score:</span>
                    <span className="font-bold text-blue-600">{gameState.playerScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Score:</span>
                    <span className="font-bold text-red-600">{gameState.aiScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difference:</span>
                    <span>{Math.abs(gameState.playerScore - gameState.aiScore)} points</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button onClick={restartGame}>
                Play Again
              </Button>
              <Button variant="outline" onClick={() => setLocation('/')}>
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}