import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import ExerciseCard from "@/components/ui/exercise-card";
import FeedbackModal from "@/components/ui/feedback-modal";
import OtterCharacter from "@/components/ui/otter-character";
import type { Deck, DeckExercise, Exercise, Workout } from "@shared/schema";

type DeckWithExercises = Deck & { 
  exercises: (DeckExercise & { exercise: Exercise })[] 
};

export default function WorkoutPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);

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

  // Initialize workout when deck is loaded
  useEffect(() => {
    if (deck && !currentWorkout && user) {
      const totalCards = deck.exercises.length;
      createWorkoutMutation.mutate({
        deckId: deck.id,
        totalCards,
      });
    }
  }, [deck, currentWorkout, user]);

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleCompleteExercise = () => {
    if (!deck) return;

    const nextIndex = currentCardIndex + 1;
    
    if (nextIndex >= deck.exercises.length) {
      // Workout complete
      setIsWorkoutComplete(true);
      setIsTimerRunning(false);
      setShowFeedback(true);
    } else {
      // Move to next exercise
      setCurrentCardIndex(nextIndex);
    }
  };

  const handleSkipExercise = () => {
    handleCompleteExercise();
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

  const currentExercise = deck.exercises[currentCardIndex];

  return (
    <div className="min-h-screen p-6 max-w-md mx-auto space-y-6">
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
          <p className="text-sm text-slate-600">{formatTime(timer)}</p>
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
            <OtterCharacter mood="excited" size="sm" animated />
          </div>
          <p className="text-sm text-slate-600 font-medium">
            You've got this! Let's crush this workout! 💪
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
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
