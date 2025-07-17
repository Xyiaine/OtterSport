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
import type { User, Deck } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to onboarding if user hasn't completed setup
  useEffect(() => {
    if (!authLoading && user && !user.fitnessGoal) {
      setLocation("/onboarding");
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

  // Get today's recommended deck (simple logic for now)
  const todaysWorkout = decks.find(deck => 
    deck.name === "Quick Start" || deck.difficulty <= (user?.currentDifficultyLevel || 1.0)
  ) || decks[0];

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-otter-teal"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pt-4 pb-32 px-6 max-w-md mx-auto space-y-6">
      {/* Welcome Section */}
      <Card className="shadow-sm border-slate-100">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12">
              <OtterCharacter mood="happy" size="sm" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                {getGreeting()}, {user.firstName || "Champion"}!
              </h2>
              <p className="text-sm text-slate-600">
                {getMotivationalMessage()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-otter-teal">
              {stats?.currentStreak || 0}
            </div>
            <div className="text-xs text-slate-600">Day Streak</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-700">
              {stats?.totalWorkouts || 0}
            </div>
            <div className="text-xs text-slate-600">Workouts</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-500">
              {stats?.totalMinutes || 0}
            </div>
            <div className="text-xs text-slate-600">Minutes</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Workout */}
      {todaysWorkout && (
        <Card className="bg-gradient-to-br from-otter-teal to-teal-600 text-white shadow-lg">
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Today's Workout</h3>
              <p className="text-teal-100 text-sm">
                {todaysWorkout.name} • {todaysWorkout.estimatedMinutes || 15} mins
              </p>
              {todaysWorkout.description && (
                <p className="text-teal-100 text-sm mt-1">
                  {todaysWorkout.description}
                </p>
              )}
            </div>
            <Button 
              onClick={() => handleStartWorkout(todaysWorkout.id)}
              className="bg-white text-otter-teal hover:bg-slate-50 transition-colors font-semibold"
            >
              <i className="fas fa-play mr-2"></i>
              Start Workout
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Available Decks */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Available Workouts</h3>
        <div className="space-y-3">
          {decks.map((deck) => (
            <Card 
              key={deck.id} 
              className="shadow-sm border-slate-100 hover:border-otter-teal hover:bg-otter-teal-light transition-all cursor-pointer"
              onClick={() => handleStartWorkout(deck.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-slate-800">{deck.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {deck.category}
                      </Badge>
                    </div>
                    {deck.description && (
                      <p className="text-sm text-slate-600 mt-1">{deck.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                      <span>{deck.estimatedMinutes || 15} mins</span>
                      <span>Difficulty: {deck.difficulty.toFixed(1)}</span>
                    </div>
                  </div>
                  <i className="fas fa-chevron-right text-slate-400"></i>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Game Modes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Game Modes</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="shadow-sm border-slate-200 hover:border-otter-teal hover:bg-otter-teal-light transition-all cursor-pointer"
            onClick={() => setLocation('/game-modes/solo')}
          >
            <CardContent className="p-4 text-center space-y-2">
              <i className="fas fa-user text-2xl text-slate-400"></i>
              <div className="text-sm font-medium text-slate-700">Solo Play</div>
            </CardContent>
          </Card>
          <Card 
            className="shadow-sm border-slate-200 hover:border-otter-teal hover:bg-otter-teal-light transition-all cursor-pointer"
            onClick={() => setLocation('/game-modes/ai-challenge')}
          >
            <CardContent className="p-4 text-center space-y-2">
              <i className="fas fa-robot text-2xl text-slate-400"></i>
              <div className="text-sm font-medium text-slate-700">AI Challenge</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
