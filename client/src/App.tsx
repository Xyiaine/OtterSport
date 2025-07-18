/**
 * MAIN APP COMPONENT
 * 
 * This is the root component that sets up routing and authentication.
 * It shows different pages based on whether the user is logged in.
 */

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { GameArtistProvider } from "@/contexts/GameArtistContext";
import GameArtistToolbar from "@/components/ui/game-artist-toolbar";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Onboarding from "@/pages/onboarding";
import Workout from "@/pages/workout";
import CardBattle from "@/pages/card-battle";
import Progress from "@/pages/progress";
import DeckCreation from "@/pages/deck-creation";
import GameModes from "@/pages/game-modes";
import GameArtist from "@/pages/game-artist";
import NotFound from "@/pages/not-found";
import BottomNavigation from "@/components/ui/bottom-navigation";

/**
 * Router component that handles page navigation
 * Shows different pages based on authentication state
 */
function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-otter-neutral">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-otter-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-otter-neutral">
      <Switch>
        {!isAuthenticated ? (
          // Show landing page for unauthenticated users
          <Route path="/" component={Landing} />
        ) : (
          // Show app pages for authenticated users
          <>
            <Route path="/" component={Home} />
            <Route path="/onboarding" component={Onboarding} />
            <Route path="/workout/:deckId?" component={Workout} />
            <Route path="/card-battle/:id" component={CardBattle} />
            <Route path="/progress" component={Progress} />
            <Route path="/decks" component={DeckCreation} />
            <Route path="/game-modes/:mode" component={GameModes} />
            <Route path="/game-artist" component={GameArtist} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
      {/* Show bottom navigation only for authenticated users */}
      {isAuthenticated && <BottomNavigation />}
      {/* Game Artist Toolbar */}
      <GameArtistToolbar />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameArtistProvider>
          <Toaster />
          <Router />
        </GameArtistProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
