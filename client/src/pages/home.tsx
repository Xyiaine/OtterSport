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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import OtterCharacter from "@/components/ui/otter-character";
import { 
  AnimatedButton, 
  AnimatedCard, 
  AnimatedMenuItem,
  PageTransition, 
  StaggeredList,
  AnimatedSpinner
} from "@/components/ui/menu-animations";
import { motion } from "framer-motion";
import type { User, Deck } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  /**
   * ONBOARDING REDIRECT LOGIC
   * 
   * Automatically redirects new users to onboarding if they haven't
   * completed their fitness profile setup. Includes timing safeguards
   * to prevent redirect loops during profile updates.
   */
  useEffect(() => {
    if (!authLoading && user && !(user as any).fitnessGoal) {
      // Small delay to prevent redirect loops during profile updates
      const timer = setTimeout(() => {
        setLocation("/onboarding");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, setLocation]);

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

  // Get today's workout based on fitness goal
  const getTodaysWorkout = () => {
    const fitnessGoal = (user as any)?.fitnessGoal;
    
    if (fitnessGoal === 'lose_weight') {
      return decks.find(deck => deck.name.toLowerCase().includes('cardio')) || 
             decks.find(deck => deck.category === 'cardio') || 
             decks[0];
    } else if (fitnessGoal === 'build_muscle') {
      return decks.find(deck => deck.name.toLowerCase().includes('strength')) || 
             decks.find(deck => deck.category === 'strength') || 
             decks[0];
    } else if (fitnessGoal === 'improve_endurance') {
      return decks.find(deck => deck.name.toLowerCase().includes('cardio')) || 
             decks.find(deck => deck.category === 'cardio') || 
             decks[0];
    } else if (fitnessGoal === 'increase_flexibility') {
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
        <AnimatedSpinner size={32} color="text-otter-teal" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Main Content */}
      <div className="max-w-md mx-auto">
        
        {/* 1. Otter Coach Section */}
        <div className="text-center py-8 px-6">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="mb-6"
          >
            <OtterCharacter 
              mood={getOtterMood()} 
              size="lg" 
              animated={true} 
              className="mx-auto"
            />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-2"
          >
            <h1 className="text-2xl font-bold text-slate-800">
              {getGreeting()}, {(user as any).firstName || "Champion"}!
            </h1>
            <p className="text-slate-600 text-lg">
              {getOtterMessage()}
            </p>
          </motion.div>
        </div>

        {/* 2. Big Play Button */}
        <div className="px-6 mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
          >
            <Button
              onClick={handlePlayCardBattle}
              className="w-full h-20 bg-gradient-to-r from-otter-teal to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-2xl font-bold rounded-2xl shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div>PLAY</div>
                  <div className="text-sm opacity-90">Card Battle</div>
                </div>
              </div>
            </Button>
          </motion.div>
        </div>

        {/* 3. Player Stats */}
        <div className="px-6 mb-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">Your Progress</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { 
                      value: (stats as any)?.currentStreak || 0, 
                      label: "Day Streak", 
                      icon: "🔥",
                      color: "text-orange-500"
                    },
                    { 
                      value: (stats as any)?.totalWorkouts || 0, 
                      label: "Workouts", 
                      icon: "💪",
                      color: "text-otter-teal"
                    },
                    { 
                      value: getTodaysMinutes(), 
                      label: "Minutes Today", 
                      icon: "⏱️",
                      color: "text-blue-500"
                    }
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.1 + idx * 0.1, type: "spring", stiffness: 200 }}
                      className="text-center"
                    >
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 4. Workout Roadmap - Scrollable */}
        <div className="px-6 pb-32">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-6 text-center">Workout Journey</h3>
                
                {/* 
                  DUOLINGO-STYLE WORKOUT ROADMAP
                  
                  FOR GAME ARTIST: 
                  Please create round exercise logo images for the following workout types:
                  - /game-assets/exercises/strength/strength-icon.png (64x64px, round)
                  - /game-assets/exercises/cardio/cardio-icon.png (64x64px, round)  
                  - /game-assets/exercises/flexibility/flexibility-icon.png (64x64px, round)
                  - /game-assets/exercises/core/core-icon.png (64x64px, round)
                  - /game-assets/exercises/boss/boss-icon.png (64x64px, round - special challenge icon)
                  
                  Design Guidelines:
                  - Round logos that work well in circles
                  - Clear, simple icons that are readable at small sizes
                  - Match the OtterSport teal theme (#14b8a6)
                  - Should look good with white backgrounds for completed states
                  - Consider how they'll look with green checkmark overlays when completed
                */}
                <div className="relative px-4">
                  <div className="space-y-8">
                    {[
                      { 
                        name: "Welcome Workout", 
                        status: (stats as any)?.totalWorkouts > 0 ? "completed" : "current",
                        type: "strength",
                        day: 1,
                        icon: "💪",
                        position: "center"
                      },
                      { 
                        name: "First Cardio", 
                        status: (stats as any)?.totalWorkouts > 1 ? "completed" : (stats as any)?.totalWorkouts > 0 ? "current" : "locked",
                        type: "cardio",
                        day: 2,
                        icon: "❤️",
                        position: "left"
                      },
                      { 
                        name: "Flexibility Flow", 
                        status: (stats as any)?.totalWorkouts > 2 ? "completed" : (stats as any)?.totalWorkouts > 1 ? "current" : "locked",
                        type: "flexibility",
                        day: 3,
                        icon: "🤸",
                        position: "right"
                      },
                      { 
                        name: "Core Power", 
                        status: (stats as any)?.totalWorkouts > 3 ? "completed" : (stats as any)?.totalWorkouts > 2 ? "current" : "locked",
                        type: "core",
                        day: 4,
                        icon: "🔥",
                        position: "center"
                      },
                      { 
                        name: "Week 1 Challenge", 
                        status: (stats as any)?.totalWorkouts > 4 ? "completed" : (stats as any)?.totalWorkouts > 3 ? "current" : "locked",
                        type: "boss",
                        day: 5,
                        icon: "👑",
                        position: "center"
                      }
                    ].map((workout, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.4 + idx * 0.15, type: "spring", stiffness: 100 }}
                        className={`relative flex ${
                          workout.position === "left" ? "justify-start pl-8" :
                          workout.position === "right" ? "justify-end pr-8" :
                          "justify-center"
                        }`}
                      >
                        {/* Connecting line to next workout */}
                        {idx < 4 && (
                          <div className={`absolute top-16 w-0.5 h-8 ${
                            workout.status === "completed" ? "bg-green-400" : "bg-slate-300"
                          } ${
                            workout.position === "center" ? "left-1/2 transform -translate-x-px" :
                            workout.position === "left" ? "left-14" :
                            "right-14"
                          }`} />
                        )}
                        
                        {/* Curved connecting line for alternating positions */}
                        {idx < 4 && workout.position !== "center" && (
                          <svg 
                            className={`absolute top-16 ${
                              workout.position === "left" ? "left-14" : "right-14"
                            }`}
                            width="60" 
                            height="32" 
                            viewBox="0 0 60 32"
                          >
                            <path
                              d={workout.position === "left" ? "M 0 0 Q 30 16 60 32" : "M 60 0 Q 30 16 0 32"}
                              stroke={workout.status === "completed" ? "#4ade80" : "#cbd5e1"}
                              strokeWidth="2"
                              fill="none"
                            />
                          </svg>
                        )}

                        <div className="flex flex-col items-center space-y-2">
                          {/* Main exercise circle with placeholder for game artist logo */}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold cursor-pointer shadow-lg overflow-hidden ${
                              workout.status === "completed" 
                                ? "bg-gradient-to-br from-green-400 to-green-600 text-white" 
                                : workout.status === "current"
                                ? "bg-gradient-to-br from-otter-teal to-teal-600 text-white animate-pulse"
                                : "bg-slate-200 text-slate-400"
                            }`}
                          >
                            {/* TODO: GAME ARTIST - Replace with exercise-specific logo images */}
                            {/* Expected format: <img src="/game-assets/exercises/{type}/{workout.type}-icon.png" className="w-12 h-12 rounded-full" /> */}
                            {workout.status !== "completed" && workout.status !== "locked" && (
                              <div className="absolute inset-2 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                <div className="text-xs font-medium text-white/60">{workout.type.toUpperCase()}</div>
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
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
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