/**
 * OTTERSPORT MAIN APPLICATION COMPONENT
 * 
 * Root React component that orchestrates the entire OtterSport application.
 * Handles routing, authentication state, and global providers.
 * 
 * Architecture:
 * - React Router (wouter) for client-side navigation
 * - TanStack Query for server state management
 * - Authentication context with Replit OAuth
 * - Game Artist mode for visual customization
 * - Bottom navigation for mobile-first design
 * 
 * Features:
 * - Automatic route protection based on auth state
 * - Loading states during authentication checks
 * - Global toast notifications for user feedback
 * - Tooltip provider for enhanced UX
 * - Game Artist toolbar for visual editing
 * 
 * Page Structure:
 * - Landing: Unauthenticated welcome page
 * - Home: Main dashboard with stats and quick actions
 * - Onboarding: First-time user setup flow
 * - Workout: Exercise session interface
 * - Card Battle: Competitive fitness game mode
 * - Progress: Analytics and achievement tracking
 * - Deck Creation: Custom workout builder
 * - Game Artist: Visual customization tools
 */

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useLocalProfile } from "@/hooks/useLocalProfile";
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
 * ROUTER COMPONENT
 * 
 * Manages application routing and page rendering based on authentication state.
 * Implements route protection to ensure unauthenticated users only see landing page.
 * 
 * Loading State:
 * - Shows spinner while authentication status is being determined
 * - Prevents flash of wrong content during auth checks
 * 
 * Route Protection:
 * - Unauthenticated: Only landing page accessible
 * - Authenticated: Full application with all features
 * - Automatic redirects to appropriate pages
 */
function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasProfile } = useLocalProfile();

  // Show loading spinner while checking authentication status
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
        {!isAuthenticated && !hasProfile ? (
          // Show landing page for new users
          <Route path="/" component={Landing} />
        ) : (
          // Show app pages for authenticated users or users with local profile
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
      {/* Show bottom navigation for authenticated users or users with local profile */}
      {(isAuthenticated || hasProfile) && <BottomNavigation />}
      {/* Game Artist Toolbar */}
      <GameArtistToolbar />
    </div>
  );
}

/**
 * MAIN APP FUNCTION
 * 
 * Sets up all global providers and renders the router component.
 * This is the entry point for the entire React application.
 * 
 * Provider Stack:
 * 1. QueryClientProvider: TanStack Query for server state
 * 2. TooltipProvider: Radix UI tooltips
 * 3. GameArtistProvider: Visual customization context
 * 4. Router: Authentication-aware routing
 * 5. Toaster: Global notification system
 */
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
