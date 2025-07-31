/**
 * HOME PAGE COMPONENT
 * 
 * Main dashboard for authenticated users displaying:
 * - Otter coach with different expressions based on user status
 * - Big play button for card battle workouts
 * - Player stats (streak, workouts, minutes today)
 * - Workout roadmap progress with completed and upcoming workouts
 * 
 * Features:
 * - Automatic onboarding redirect for new users
 * - Real-time stats fetching with error handling
 * - Animated UI elements for enhanced user experience
 * - Responsive design for mobile and desktop
 */

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// Badge component removed for minimal design
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocalProfile } from "@/hooks/useLocalProfile";
import { apiRequest } from "@/lib/queryClient";
import OtterCharacter from "@/components/ui/otter-character";
import { ExerciseIcon } from "@/components/ui/exercise-icons";
import { Play } from "lucide-react";
import { DeckPlaceholder } from "@/components/ui/card-placeholder";
import type { User, Deck } from "@shared/schema";

// Clean, minimal home page component
export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const { profile, hasProfile } = useLocalProfile();
  const queryClient = useQueryClient();

  /**
   * ONBOARDING REDIRECT LOGIC
   * 
   * Automatically redirects new users to onboarding if they haven't
   * completed their fitness profile setup (either locally or on server).
   */
  useEffect(() => {
    if (!authLoading && !hasProfile) {
      // Small delay to prevent redirect loops during profile updates
      const timer = setTimeout(() => {
        setLocation("/onboarding");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [authLoading, hasProfile, setLocation]);

  // Fetch user stats
  const { data: stats } = useQuery({
    queryKey: ["/api/user/stats"],
    enabled: !!user,
  });

  // Fetch available decks
  const { data: decks = [] } = useQuery<Deck[]>({
    queryKey: ["/api/decks"],
  });

  // Get otter coach mood based on user status
  const getOtterMood = () => {
    const streak = (stats as any)?.currentStreak || 0;
    const totalWorkouts = (stats as any)?.totalWorkouts || 0;
    
    if (totalWorkouts === 0) return 'happy'; // First time user
    if (streak === 0) return 'encouraging'; // Streak broken, be encouraging
    if (streak >= 7) return 'proud'; // Long streak, be proud
    if (streak >= 3) return 'excited'; // Good streak, be excited
    return 'cheerful'; // Default positive mood
  };

  const getOtterMessage = () => {
    const streak = (stats as any)?.currentStreak || 0;
    const totalWorkouts = (stats as any)?.totalWorkouts || 0;
    
    if (totalWorkouts === 0) return "Welcome to OtterSport! Let's start your fitness journey!";
    if (streak === 0) return "Don't worry, we all have off days. Let's get back on track!";
    if (streak >= 7) return `Amazing ${streak}-day streak! You're a fitness champion!`;
    if (streak >= 3) return `${streak} days strong! Keep up the momentum!`;
    return "Ready for another great workout?";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get today's workout based on fitness goal (from profile or user data)
  const getTodaysWorkout = () => {
    const fitnessGoal = profile?.fitnessGoal || (user as any)?.fitnessGoal;
    
    if (fitnessGoal === 'lose_weight') {
      return decks.find(deck => deck.name.toLowerCase().includes('cardio')) || 
             decks.find(deck => deck.category === 'cardio') || 
             decks[0];
    } else if (fitnessGoal === 'gain_muscle') {
      return decks.find(deck => deck.name.toLowerCase().includes('strength')) || 
             decks.find(deck => deck.category === 'strength') || 
             decks[0];
    } else if (fitnessGoal === 'improve_endurance') {
      return decks.find(deck => deck.name.toLowerCase().includes('cardio')) || 
             decks.find(deck => deck.category === 'cardio') || 
             decks[0];
    } else if (fitnessGoal === 'increase_mobility') {
      return decks.find(deck => deck.name.toLowerCase().includes('flexibility')) || 
             decks.find(deck => deck.category === 'flexibility') || 
             decks[0];
    }
    
    // Default to Quick Start or first available deck
    return decks.find(deck => deck.name === "Quick Start") || decks[0];
  };

  const todaysWorkout = getTodaysWorkout();

  const handlePlayCardBattle = () => {
    if (todaysWorkout) {
      setLocation(`/card-battle/${todaysWorkout.id}`);
    } else {
      setLocation('/card-battle');
    }
  };

  // Calculate today's workout minutes
  const getTodaysMinutes = () => {
    // This would ideally come from today's completed workouts
    // For now, return 0 as placeholder
    return 0;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Main Content */}
      <div className="max-w-md mx-auto">
        
        {/* 1. Otter Coach Section - Simplified */}
        <div className="text-center py-8 px-6">
          <div className="mb-6">
            <OtterCharacter 
              mood={getOtterMood()} 
              size="lg" 
              animated={false} 
              className="mx-auto"
            />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-800">
              {getGreeting()}, {(user as any).firstName || "Champion"}!
            </h1>
            <p className="text-slate-600">
              {getOtterMessage()}
            </p>
          </div>
        </div>

        {/* 2. Big Play Button - Simplified */}
        <div className="px-6 mb-8">
          <Button
            onClick={handlePlayCardBattle}
            className="w-full h-16 bg-teal-500 hover:bg-teal-600 text-white text-xl font-bold rounded-xl shadow-lg transition-colors"
          >
            <Play className="w-6 h-6 mr-3" />
            Start Workout
          </Button>
        </div>

        {/* 3. Player Stats - Simplified */}
        <div className="px-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">Your Progress</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-2xl font-bold text-orange-500 mb-1">
                    {(stats as any)?.currentStreak || 0}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">💪</div>
                  <div className="text-2xl font-bold text-teal-500 mb-1">
                    {(stats as any)?.totalWorkouts || 0}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">Workouts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">⏱️</div>
                  <div className="text-2xl font-bold text-blue-500 mb-1">
                    {getTodaysMinutes()}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">Minutes Today</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4. Available Workouts - Simple List */}
        <div className="px-6 pb-32">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6 text-center">Available Workouts</h3>
              <div className="grid grid-cols-2 gap-4">
                {decks.slice(0, 4).map((deck) => (
                  <DeckPlaceholder
                    key={deck.id}
                    deckName={deck.name}
                    cardCount={deck.exerciseIds?.length || 5}
                    size="small"
                    onClick={() => setLocation(`/card-battle/${deck.id}`)}
                    className="hover:scale-105 transition-transform"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
                            className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold cursor-pointer shadow-lg overflow-hidden ${
                              workout.status === "completed" 
                                ? "bg-gradient-to-br from-green-400 to-green-600 text-white" 
                                : workout.status === "current"
                                ? "bg-gradient-to-br from-otter-teal to-teal-600 text-white animate-pulse"
                                : "bg-slate-200 text-slate-400"
                            }`}
                          >
                            {/* SVG-based exercise icons to replace missing images */}
                            {workout.status !== "completed" && workout.status !== "locked" && (
                              <div className="absolute inset-0 rounded-full flex items-center justify-center">
                                <ExerciseIcon 
                                  type={workout.type as any} 
                                  size="md"
                                  className="text-white"
                                  completed={false}
                                />
                              </div>
                            )}
                            {/* Completion checkmark overlay */}
                            {workout.status === "completed" && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="absolute inset-0 rounded-full bg-green-500 flex items-center justify-center"
                              >
                                <CheckCircle className="w-8 h-8 text-white" fill="currentColor" />
                              </motion.div>
                            )}
                            
                            {/* Lock overlay for locked workouts */}
                            {workout.status === "locked" && (
                              <div className="absolute inset-0 rounded-full bg-slate-300 flex items-center justify-center">
                                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-5a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2zM12 9V7a4 4 0 00-8 0v2" />
                                </svg>
                              </div>
                            )}
                            
                            {/* Current exercise icon - will be replaced by game artist logos */}
                            {workout.status !== "completed" && workout.status !== "locked" && (
                              <div className="text-2xl">{workout.icon}</div>
                            )}
                          </motion.div>

                          {/* Workout name and day */}
                          <div className="text-center">
                            <div className={`text-sm font-semibold ${
                              workout.status === "locked" ? "text-slate-400" : "text-slate-800"
                            }`}>
                              Day {workout.day}
                            </div>
                            <div className={`text-xs ${
                              workout.status === "locked" ? "text-slate-400" : "text-slate-600"
                            }`}>
                              {workout.name}
                            </div>
                            {workout.status === "current" && (
                              <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-xs text-otter-teal font-bold mt-1"
                              >
                                START
                              </motion.div>
                            )}
                          </div>

                          {/* Type badge */}
                          <Badge 
                            variant={workout.type === "boss" ? "default" : "secondary"}
                            className={`text-xs ${workout.status === "locked" ? "opacity-50" : ""}`}
                          >
                            {workout.type}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Future workouts preview */}
                  <div className="text-center py-6">
                    <div className="text-slate-400 text-sm">
                      More workouts unlock as you progress...
                    </div>
                    <div className="flex justify-center space-x-2 mt-2">
                      {[1, 2, 3].map((dot) => (
                        <div key={dot} className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}