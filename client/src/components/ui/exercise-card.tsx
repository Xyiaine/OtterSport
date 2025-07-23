import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { Exercise } from "@shared/schema";

/**
 * EXERCISE CARD COMPONENT
 * 
 * Interactive card component that displays individual exercises during workouts.
 * Handles both rep-based and time-based exercises with built-in timer functionality.
 * 
 * Features:
 * - Smart timer for time-based exercises
 * - Visual feedback and progress indicators
 * - Accessibility-friendly controls
 * - Responsive design for mobile and desktop
 */

interface ExerciseCardProps {
  exercise: Exercise;           // The exercise to display
  reps?: number | null;        // Number of reps (for rep-based exercises)
  duration?: number | null;    // Duration in seconds (for time-based exercises)
  onComplete: () => void;      // Called when exercise is completed
  onSkip: () => void;         // Called when exercise is skipped
}

/**
 * ExerciseCard Component
 * 
 * Renders an interactive exercise card with timer functionality for workouts.
 * Automatically handles different exercise types (reps vs time-based).
 */
export default function ExerciseCard({ 
  exercise, 
  reps, 
  duration, 
  onComplete, 
  onSkip 
}: ExerciseCardProps) {
  // Authentication hook for admin features
  const { user } = useAuth();
  
  // Timer state management for time-based exercises
  const [timer, setTimer] = useState(duration || 0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Check if user is admin (for skip button access)
  const isAdmin = (user as any)?.email?.includes('@replit.com') || 
                 (user as any)?.email?.includes('admin') || 
                 import.meta.env.DEV;

  /**
   * Timer Effect Hook
   * 
   * Manages the countdown timer for time-based exercises.
   * Automatically stops timer when reaching zero and marks exercise as complete.
   */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  /**
   * Timer Control Functions
   * 
   * These functions provide clean interfaces for timer management
   * with proper state validation and user experience considerations.
   */
  const startTimer = () => {
    if (duration && !isCompleted) {
      setIsTimerRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setTimer(duration || 0);
    setIsTimerRunning(false);
    setIsCompleted(false);
  };

  const skipExercise = () => {
    setIsTimerRunning(false);
    setIsCompleted(true);
    onComplete();
  };

  /**
   * Time Formatting Utility
   * 
   * Converts seconds to MM:SS format for better readability.
   * @param seconds - Number of seconds to format
   * @returns Formatted time string (e.g., "2:05")
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Exercise Icon Helper
   * 
   * Returns appropriate icon for the exercise type with fallback.
   * @returns Icon class string for FontAwesome icons
   */
  const getExerciseIcon = (): string => {
    return exercise.icon || "fas fa-dumbbell";
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg border-slate-100 animate-slide-up">
      <CardContent className="p-8 text-center space-y-6 min-h-96 flex flex-col justify-center">
        {/* Exercise Icon */}
        <div className="w-16 h-16 mx-auto bg-otter-teal-light rounded-full flex items-center justify-center">
          <i className={`${getExerciseIcon()} text-2xl text-otter-teal`}></i>
        </div>

        {/* Exercise Info */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-800">{exercise.name}</h2>
          
          {reps && (
            <div className="text-4xl font-bold text-otter-teal">{reps}</div>
          )}
          
          {exercise.instructions && (
            <p className="text-slate-600 text-sm leading-relaxed">
              {exercise.instructions}
            </p>
          )}
        </div>

        {/* Timer Display for Duration-based Exercises */}
        {duration && (
          <div className="space-y-4">
            <div className="text-6xl font-bold text-slate-700">
              {formatTime(timer)}
            </div>
            
            {/* Timer Controls */}
            <div className="flex justify-center space-x-2">
              {!isTimerRunning && timer > 0 && !isCompleted && (
                <Button
                  onClick={startTimer}
                  variant="outline"
                  size="sm"
                  className="hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-600"
                >
                  <i className="fas fa-play mr-1"></i>
                  Start
                </Button>
              )}
              
              {isTimerRunning && (
                <Button
                  onClick={pauseTimer}
                  variant="outline"
                  size="sm"
                  className="hover:bg-amber-50 hover:border-amber-500 hover:text-amber-600"
                >
                  <i className="fas fa-pause mr-1"></i>
                  Pause
                </Button>
              )}
              
              {(timer < (duration || 0) || isCompleted) && (
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  size="sm"
                  className="hover:bg-slate-50"
                >
                  <i className="fas fa-redo mr-1"></i>
                  Reset
                </Button>
              )}
              
              {/* Admin Skip Button for Time-based Exercises */}
              {isAdmin && duration && !isCompleted && (
                <Button
                  onClick={skipExercise}
                  variant="outline"
                  size="sm"
                  className="hover:bg-red-50 hover:border-red-500 hover:text-red-600"
                  title="Admin: Skip timer for testing"
                >
                  <i className="fas fa-fast-forward mr-1"></i>
                  Skip
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Completion Status */}
        {isCompleted && (
          <div className="space-y-2">
            <div className="text-emerald-600 font-semibold">
              <i className="fas fa-check-circle mr-2"></i>
              Time's up! Great job!
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mt-8">
          <Button
            onClick={onComplete}
            className="w-full bg-otter-teal hover:bg-teal-600 text-white py-3 font-semibold transition-all transform hover:scale-105"
          >
            <i className="fas fa-check mr-2"></i>
            Exercise Complete
          </Button>
          
          <div className="flex space-x-3">
            <Button
              onClick={onSkip}
              variant="outline"
              className="flex-1 py-2 hover:bg-slate-50"
            >
              <i className="fas fa-forward mr-2"></i>
              Skip
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
