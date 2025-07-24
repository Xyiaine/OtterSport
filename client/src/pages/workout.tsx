import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import ExerciseCard from "@/components/ui/exercise-card";
import FeedbackModal from "@/components/ui/feedback-modal";
import OtterCharacter from "@/components/ui/otter-character";
import CardDeckSelection from "@/components/ui/card-deck-selection";
import type { Deck, DeckExercise, Exercise, Workout } from "@shared/schema";

/**
 * WORKOUT PAGE COMPONENT
 * 
 * Core workout execution interface that handles the complete workout flow:
 * - Card selection phase for strategic workout planning
 * - Exercise execution with real-time timers and progress tracking
 * - Multi-mode support (solo, AI challenge, collaborative)
 * - Adaptive difficulty integration with user feedback collection
 * 
 * Features:
 * - Smart card-based exercise selection
 * - Real-time workout tracking and analytics
 * - Gamification elements (scoring, challenges)
 * - Responsive design for mobile workout sessions
 * - Comprehensive error handling and offline support
 */

// Extended deck type with exercise relationships
type DeckWithExercises = Deck & { 
  exercises: (DeckExercise & { exercise: Exercise })[] 
};

/**
 * WorkoutPage Component
 * 
 * Main workout execution interface that manages the complete workout lifecycle
 * from exercise selection through completion and feedback collection.
 */
export default function WorkoutPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { canSkipExercises, isAdmin } = useAdmin();
  const queryClient = useQueryClient();

  // Get URL parameters for game mode
  const urlParams = new URLSearchParams(window.location.search);
  const gameMode = urlParams.get('mode') || 'solo';
  const difficulty = urlParams.get('difficulty') || 'normal';

  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  
  // Card selection state
  const [workoutPhase, setWorkoutPhase] = useState<'card-selection' | 'exercise' | 'complete'>('card-selection');
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  
  // Hand management state
  const [playerHand, setPlayerHand] = useState<number[]>([]);
  const [aiHand, setAiHand] = useState<number[]>([]);
  const [deckCards, setDeckCards] = useState<number[]>([]);
  
  // AI Challenge specific state
  const [aiScore, setAiScore] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiProgress, setAiProgress] = useState(0);

  // Fetch deck with exercises
  const { data: deck, isLoading } = useQuery<DeckWithExercises>({
    queryKey: ["/api/decks", deckId],
    enabled: !!deckId,
  });

  // Create workout mutation
  const createWorkoutMutation = useMutation({
    mutationFn: async (workoutData: any) => {
      const response = await apiRequest("POST", "/api/workouts", workoutData);
      return response.json();
    },
    onSuccess: (workout: Workout) => {
      setCurrentWorkout(workout);
      setWorkoutStartTime(new Date());
      startTimer();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to start workout. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Complete workout mutation
  const completeWorkoutMutation = useMutation({
    mutationFn: async ({ workoutId, feedback, duration, calories }: {
      workoutId: number;
      feedback: string;
      duration: number;
      calories?: number;
    }) => {
      const response = await apiRequest("PATCH", `/api/workouts/${workoutId}/complete`, {
        feedback,
        duration,
        calories,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Workout completed! 🎉",
        description: "Great job! Your progress has been saved.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Initialize hands when deck is loaded
  useEffect(() => {
    if (deck && deckCards.length === 0) {
      const allCardIndices = deck.exercises.map((_, index) => index);
      setDeckCards([...allCardIndices]);
      
      if (gameMode === 'ai-challenge') {
        // Deal initial hands for AI challenge mode
        const shuffledCards = [...allCardIndices].sort(() => Math.random() - 0.5);
        setPlayerHand(shuffledCards.slice(0, 5));
        setAiHand(shuffledCards.slice(5, 10));
        setDeckCards(shuffledCards.slice(10));
      }
    }
  }, [deck, gameMode]);

  // Initialize workout when deck is loaded (after card selection)
  useEffect(() => {
    if (deck && !currentWorkout && user && workoutPhase === 'exercise') {
      const totalCards = selectedExercises.length || deck.exercises.length;
      createWorkoutMutation.mutate({
        deckId: deck.id,
        totalCards,
      });
    }
  }, [deck, currentWorkout, user, workoutPhase, selectedExercises]);

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const drawCardFromDeck = () => {
    if (deckCards.length > 0) {
      const drawnCard = deckCards[0];
      setDeckCards(prev => prev.slice(1));
      return drawnCard;
    }
    return null;
  };

  const handleCompleteExercise = () => {
    if (!deck) return;

    // AI Challenge scoring logic
    if (gameMode === 'ai-challenge') {
      const baseScore = difficulty === 'easy' ? 10 : difficulty === 'normal' ? 15 : 20;
      const timeBonus = Math.max(0, 30 - (timer % 60)) / 3;
      const exerciseScore = Math.floor(baseScore + timeBonus);
      
      setPlayerScore(prev => prev + exerciseScore);
      
      // AI draws a card after player completes exercise
      const aiDrawnCard = drawCardFromDeck();
      if (aiDrawnCard !== null) {
        setAiHand(prev => [...prev, aiDrawnCard]);
      }
      
      // Player draws a card after completing exercise
      const playerDrawnCard = drawCardFromDeck();
      if (playerDrawnCard !== null) {
        setPlayerHand(prev => [...prev, playerDrawnCard]);
      }

      // Remove completed card from player's hand
      if (selectedExercises.length > 0) {
        setPlayerHand(prev => prev.filter(card => card !== selectedExercises[currentCardIndex]));
      }
      
      // AI progresses and scores
      const aiSpeed = difficulty === 'easy' ? 0.8 : difficulty === 'normal' ? 1.0 : 1.2;
      const aiProgressIncrement = (100 / deck.exercises.length) * aiSpeed * (0.9 + Math.random() * 0.2);
      setAiProgress(prev => Math.min(100, prev + aiProgressIncrement));
      
      if (aiProgress < 100) {
        const aiExerciseScore = Math.floor(baseScore * 0.9 + Math.random() * 5);
        setAiScore(prev => prev + aiExerciseScore);
      }

      // Check if hands are depleted
      if (playerHand.length <= 1 && deckCards.length === 0) {
        setIsWorkoutComplete(true);
        setIsTimerRunning(false);
        setShowFeedback(true);
        return;
      }

      // Continue to next card selection
      setWorkoutPhase('card-selection');
      setCurrentCardIndex(0);
      return;
    }

    // Solo mode logic
    const nextIndex = currentCardIndex + 1;
    
    if (nextIndex >= (selectedExercises.length || deck.exercises.length)) {
      setIsWorkoutComplete(true);
      setIsTimerRunning(false);
      setShowFeedback(true);
    } else {
      setCurrentCardIndex(nextIndex);
    }
  };

  const handleSkipExercise = () => {
    handleCompleteExercise();
  };

  const handleCardSelection = (exerciseIndex: number) => {
    if (gameMode === 'ai-challenge') {
      // In AI mode, player selects from their hand
      if (playerHand.includes(exerciseIndex)) {
        setSelectedExercises([exerciseIndex]);
        setWorkoutPhase('exercise');
      }
    } else {
      // In solo mode, select from available cards
      setSelectedExercises([exerciseIndex]);
      setWorkoutPhase('exercise');
    }
  };

  const handleFeedbackSubmit = (feedback: string) => {
    if (!currentWorkout || !workoutStartTime) return;

    const duration = Math.floor((Date.now() - workoutStartTime.getTime()) / 1000);
    const estimatedCalories = Math.floor((duration / 60) * 8); // Rough estimate

    completeWorkoutMutation.mutate({
      workoutId: currentWorkout.id,
      feedback,
      duration,
      calories: estimatedCalories,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!deck?.exercises.length) return 0;
    return (currentCardIndex / deck.exercises.length) * 100;
  };

  if (!deckId) {
    setLocation("/");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-otter-teal"></div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-600">Workout not found</p>
            <Button onClick={() => setLocation("/")} className="mt-4">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get current exercise based on selected cards or normal flow
  const currentExercise = selectedExercises.length > 0 
    ? deck.exercises[selectedExercises[currentCardIndex]] 
    : deck.exercises[currentCardIndex];

  // Show card selection phase first
  if (workoutPhase === 'card-selection') {
    return <CardDeckSelection 
      deck={deck} 
      onCardSelected={handleCardSelection}
      gameMode={gameMode}
      playerHand={playerHand}
      aiHandSize={aiHand.length}
      deckSize={deckCards.length}
    />;
  }

  return (
    <div className="min-h-screen p-6 pb-32 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setLocation("/")}
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Exit
        </Button>
        <div className="text-center">
          <h1 className="font-semibold text-slate-800">{deck.name}</h1>
          <p className="text-sm text-slate-600">
            {gameMode === 'ai-challenge' ? 'AI Challenge' : 'Solo Play'} • {formatTime(timer)}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={pauseTimer}
        >
          <i className={`fas ${isTimerRunning ? 'fa-pause' : 'fa-play'}`}></i>
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Card {currentCardIndex + 1} of {deck.exercises.length}</span>
          <span>{deck.estimatedMinutes || 15} min workout</span>
        </div>
        <Progress value={getProgressPercentage()} className="h-2" />
      </div>

      {/* AI Challenge Scoreboard */}
      {gameMode === 'ai-challenge' && (
        <Card className="bg-gradient-to-r from-otter-teal-light to-blue-50 border-otter-teal">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Player Score */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <i className="fas fa-user text-otter-teal"></i>
                  <span className="text-sm font-medium text-slate-700">You</span>
                </div>
                <div className="text-2xl font-bold text-otter-teal">{playerScore}</div>
                <div className="text-xs text-slate-600">points</div>
              </div>
              
              {/* AI Score */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <i className="fas fa-robot text-blue-500"></i>
                  <span className="text-sm font-medium text-slate-700">AI</span>
                </div>
                <div className="text-2xl font-bold text-blue-500">{aiScore}</div>
                <div className="text-xs text-slate-600">points</div>
              </div>
            </div>
            
            {/* AI Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>AI Progress</span>
                <span>{Math.round(aiProgress)}%</span>
              </div>
              <Progress value={aiProgress} className="h-1.5 bg-slate-200">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                     style={{ width: `${aiProgress}%` }} />
              </Progress>
            </div>
            
            {/* Competition Status */}
            <div className="text-center mt-2">
              {playerScore > aiScore ? (
                <span className="text-xs text-green-600 font-medium">🎯 You're in the lead!</span>
              ) : playerScore < aiScore ? (
                <span className="text-xs text-orange-600 font-medium">🔥 AI is ahead - push harder!</span>
              ) : (
                <span className="text-xs text-slate-600 font-medium">⚖️ It's a tie!</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise Card */}
      {currentExercise && (
        <div className="flex-1 flex items-center justify-center">
          <ExerciseCard
            exercise={currentExercise.exercise}
            reps={currentExercise.customReps || currentExercise.exercise.defaultReps}
            duration={currentExercise.customDuration || currentExercise.exercise.defaultDuration}
            onComplete={handleCompleteExercise}
            onSkip={handleSkipExercise}
          />
        </div>
      )}

      {/* Motivational Otter */}
      {currentCardIndex === 0 && (
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto">
            <OtterCharacter 
              mood={gameMode === 'ai-challenge' ? 'competitive' : 'excited'} 
              size="sm" 
              animated 
            />
          </div>
          <p className="text-sm text-slate-600 font-medium">
            {gameMode === 'ai-challenge' 
              ? 'Time to battle! Show that AI who\'s boss! 🏆'
              : 'You\'ve got this! Let\'s crush this workout! 💪'
            }
          </p>
        </div>
      )}

      {/* Action Buttons - Fixed position to avoid overlapping */}
      <div className="sticky bottom-20 bg-white border-t border-slate-200 p-4 -mx-6 space-y-3 z-40">
        <Button
          onClick={handleCompleteExercise}
          className="w-full bg-otter-teal hover:bg-teal-600 text-white py-4 font-semibold"
        >
          <i className="fas fa-check mr-2"></i>
          Exercise Complete
        </Button>
        <div className="flex space-x-3">
          <Button
            onClick={pauseTimer}
            variant="outline"
            className="flex-1 py-3"
          >
            <i className={`fas ${isTimerRunning ? 'fa-pause' : 'fa-play'} mr-2`}></i>
            {isTimerRunning ? 'Pause' : 'Resume'}
          </Button>
          <Button
            onClick={handleSkipExercise}
            variant="outline"
            className="flex-1 py-3"
          >
            <i className="fas fa-forward mr-2"></i>
            Skip
          </Button>
          {/* Admin Skip Button for Timed Exercises */}
          {canSkipExercises && isTimerRunning && (
            <Button
              onClick={() => {
                setTimer(0);
                setIsTimerRunning(false);
                toast({
                  title: "Admin skip activated",
                  description: "Timer skipped for testing purposes",
                });
              }}
              variant="outline"
              className="px-3 py-3 bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
              title="Admin: Skip timer instantly"
            >
              <i className="fas fa-bolt"></i>
            </Button>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmit={handleFeedbackSubmit}
        workoutStats={{
          cards: deck.exercises.length,
          minutes: Math.floor(timer / 60),
          calories: Math.floor((timer / 60) * 8),
        }}
        isSubmitting={completeWorkoutMutation.isPending}
      />
    </div>
  );
}
