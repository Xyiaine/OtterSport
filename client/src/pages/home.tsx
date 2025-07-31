/**
 * Clean, minimal home page component
 * Simplified design with placeholder cards for game artist implementation
 */

import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocalProfile } from "@/hooks/useLocalProfile";
import { apiRequest } from "@/lib/queryClient";
import OtterCharacter from "@/components/ui/otter-character";
import { Play } from "lucide-react";
import { DeckPlaceholder } from "@/components/ui/card-placeholder";
import type { User, Deck } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const { profile } = useLocalProfile();

  // Fetch decks for workout selection
  const { data: decks = [] } = useQuery<Deck[]>({
    queryKey: ["/api/decks"],
  });

  // Fetch user stats
  const { data: stats } = useQuery({
    queryKey: ["/api/user/stats"],
    enabled: !!user,
  });

  // Simplified greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Simple otter mood based on user activity
  const getOtterMood = () => {
    const workouts = (stats as any)?.totalWorkouts || 0;
    if (workouts === 0) return "encouraging";
    if (workouts < 5) return "happy";
    return "proud";
  };

  // Simple motivational message
  const getOtterMessage = () => {
    const workouts = (stats as any)?.totalWorkouts || 0;
    if (workouts === 0) return "Ready to start your fitness journey?";
    if (workouts < 5) return "Great progress! Keep it up!";
    return "You're doing amazing! Let's keep going!";
  };

  // Handle play button click
  const handlePlayCardBattle = async () => {
    if (decks.length > 0) {
      // Use first available deck or user's preferred deck
      const selectedDeck = decks[0];
      setLocation(`/card-battle/${selectedDeck.id}`);
    } else {
      toast({
        title: "No Workouts Available",
        description: "Please wait while we load your workouts...",
        variant: "destructive",
      });
    }
  };

  // Simple placeholder for minutes calculation
  const getTodaysMinutes = () => {
    // This would normally calculate from today's workout data
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
        
        {/* Otter Coach Section - Simplified */}
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

        {/* Big Play Button - Simplified */}
        <div className="px-6 mb-8">
          <Button
            onClick={handlePlayCardBattle}
            className="w-full h-16 bg-teal-500 hover:bg-teal-600 text-white text-xl font-bold rounded-xl shadow-lg transition-colors"
          >
            <Play className="w-6 h-6 mr-3" />
            Start Workout
          </Button>
        </div>

        {/* Player Stats - Simplified */}
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

        {/* Available Workouts - Simple List with Placeholders */}
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
                    className="hover:scale-105 transition-transform cursor-pointer"
                  />
                ))}
              </div>
              {decks.length === 0 && (
                <div className="text-center text-slate-500">
                  <div className="text-lg mb-2">🏃‍♂️</div>
                  <p>Loading your workout decks...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}