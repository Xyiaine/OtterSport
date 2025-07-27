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

  // Redirect to onboarding if user hasn't completed setup
  useEffect(() => {
    if (!authLoading && user && !user.fitnessGoal) {
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
      }
    },
  });

  // Fetch available decks
  const { data: decks = [] } = useQuery<Deck[]>({
    queryKey: ["/api/decks"],
  });

  // Get today's recommended deck (prioritize Quick Start, then difficulty-appropriate decks)
  const todaysWorkout = decks.find(deck => deck.name === "Quick Start") || 
                       decks.find(deck => deck.difficulty <= (user?.currentDifficultyLevel || 1.0)) || 
                       decks[0];

  const handleStartWorkout = (deckId?: number) => {
    if (deckId) {
      setLocation(`/workout/${deckId}`);
    } else if (todaysWorkout) {
      setLocation(`/workout/${todaysWorkout.id}`);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getMotivationalMessage = () => {
    const streak = stats?.currentStreak || 0;
    if (streak === 0) return "Let's start building your streak! 🎯";
    if (streak < 3) return "Great start! Keep the momentum going! 💪";
    if (streak < 7) return "You're on fire! Amazing consistency! 🔥";
    return "Incredible streak! You're a fitness champion! 🏆";
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
    <PageTransition direction="right">
      <div className="pt-4 pb-32 px-6 max-w-md mx-auto space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatedCard animationType="lift" className="shadow-sm border-slate-100">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="w-12 h-12"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <OtterCharacter mood="happy" size="sm" />
                </motion.div>
                <div>
                  <motion.h2 
                    className="text-lg font-semibold text-slate-800"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    {getGreeting()}, {user.firstName || "Champion"}!
                  </motion.h2>
                  <motion.p 
                    className="text-sm text-slate-600"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {getMotivationalMessage()}
                  </motion.p>
                </div>
              </div>
            </CardContent>
          </AnimatedCard>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-3 gap-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {[
            { value: stats?.currentStreak || 0, label: "Day Streak", color: "text-otter-teal" },
            { value: stats?.totalWorkouts || 0, label: "Workouts", color: "text-slate-700" },
            { value: stats?.totalMinutes || 0, label: "Minutes", color: "text-emerald-500" }
          ].map((statItem, idx) => (
            <AnimatedCard key={idx} animationType="lift" className="shadow-sm border-slate-100">
              <CardContent className="p-4 text-center">
                <motion.div 
                  className={`text-2xl font-bold ${statItem.color}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + idx * 0.1, type: "spring", stiffness: 200 }}
                >
                  {statItem.value}
                </motion.div>
                <motion.div 
                  className="text-xs text-slate-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 + idx * 0.1 }}
                >
                  {statItem.label}
                </motion.div>
              </CardContent>
            </AnimatedCard>
          ))}
        </motion.div>

        {/* Today's Workout */}
        {todaysWorkout && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6, type: "spring" }}
          >
            <AnimatedCard animationType="glow" className="bg-gradient-to-br from-otter-teal to-teal-600 text-white shadow-lg border-0">
              <CardContent className="p-6 space-y-4">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold text-white">Today's Workout</h3>
                  <p className="text-teal-100 text-sm opacity-90">
                    {todaysWorkout.name} • {todaysWorkout.estimatedMinutes || 15} mins
                  </p>
                  {todaysWorkout.description && (
                    <p className="text-teal-100 text-sm mt-1 opacity-90">
                      {todaysWorkout.description}
                    </p>
                  )}
                </motion.div>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  <AnimatedButton 
                    onClick={() => handleStartWorkout(todaysWorkout.id)}
                    animationType="pulse"
                    className="bg-white text-otter-teal hover:bg-slate-50 transition-colors font-semibold shadow-md"
                  >
                    <i className="fas fa-play mr-2"></i>
                    Start Workout
                  </AnimatedButton>
                </motion.div>
              </CardContent>
            </AnimatedCard>
          </motion.div>
        )}

        {/* Available Decks */}
        <motion.div 
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-slate-800">Available Workouts</h3>
          <div className="space-y-3">
            {decks.map((deck, index) => (
              <motion.div
                key={deck.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.8 + index * 0.1, duration: 0.5 }}
              >
                <AnimatedCard animationType="lift" className="shadow-sm border-slate-100">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-slate-800">{deck.name}</h4>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 2.0 + index * 0.1, type: "spring" }}
                            >
                              <Badge variant="secondary" className="text-xs">
                                {deck.category}
                              </Badge>
                            </motion.div>
                          </div>
                          {deck.description && (
                            <p className="text-sm text-slate-600 mt-1">{deck.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                            <span>{deck.estimatedMinutes || 15} mins</span>
                            <span>Difficulty: {deck.difficulty.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <AnimatedButton 
                          onClick={() => handleStartWorkout(deck.id)}
                          animationType="scale"
                          className="flex-1 bg-otter-teal hover:bg-teal-600 text-white text-sm py-2"
                        >
                          <i className="fas fa-play mr-2"></i>
                          Regular Workout
                        </AnimatedButton>
                        <AnimatedButton 
                          onClick={() => setLocation(`/card-battle/${deck.id}`)}
                          animationType="scale"
                          variant="outline"
                          className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50 text-sm py-2"
                        >
                          <i className="fas fa-layer-group mr-2"></i>
                          Card Battle
                        </AnimatedButton>
                      </div>
                    </div>
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Game Modes */}
        <motion.div 
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-slate-800">Game Modes</h3>
          <div className="grid grid-cols-2 gap-3">
            <AnimatedCard 
              animationType="tilt"
              onClick={() => setLocation('/game-modes/solo')}
              className="shadow-sm border-slate-200 cursor-pointer"
            >
              <CardContent className="p-4 text-center space-y-2">
                <motion.i 
                  className="fas fa-user text-2xl text-slate-400"
                  whileHover={{ scale: 1.2, color: "#14b8a6" }}
                />
                <div className="text-sm font-medium text-slate-700">Solo Play</div>
              </CardContent>
            </AnimatedCard>
            <AnimatedCard 
              animationType="tilt"
              onClick={() => setLocation('/game-modes/ai-challenge')}
              className="shadow-sm border-slate-200 cursor-pointer"
            >
              <CardContent className="p-4 text-center space-y-2">
                <motion.i 
                  className="fas fa-robot text-2xl text-slate-400"
                  whileHover={{ scale: 1.2, color: "#7c3aed" }}
                />
                <div className="text-sm font-medium text-slate-700">AI Challenge</div>
              </CardContent>
            </AnimatedCard>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
