/**
 * GAME-MODES MODULE
 * 
 * This module provides functionality for game-modes.
 * All exports are designed to work seamlessly with the OtterSport application.
 * 
 * Human Developer Guide:
 * - Follow established patterns when modifying this file
 * - Maintain comprehensive test coverage for all functions
 * - Update documentation when adding new functionality
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Badge component removed for minimal design
import { Progress } from "@/components/ui/progress";
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
import type { Deck, Exercise, DeckExercise } from "@shared/schema";

type DeckWithExercises = Deck & { 
  exercises: (DeckExercise & { exercise: Exercise })[] 
};

/**
 * Handles gamemodespage functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
/**
 * Handles gamemodespage functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
/**
 * Handles gamemodespage functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
export default function GameModesPage() {
  const { mode } = useParams<{ mode: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedDeck, setSelectedDeck] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');

  // Fetch available decks
  const { data: decks = [], isLoading: isLoadingDecks } = useQuery<Deck[]>({
    queryKey: ["/api/decks"],
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
    },
  });

  const startGame = () => {
    if (!selectedDeck) {
      toast({
        title: "Select a workout deck",
        description: "Please choose a deck to start your game",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'solo') {
      setLocation(`/workout/${selectedDeck}?mode=solo&difficulty=${difficulty}`);
    } else if (mode === 'ai-challenge') {
      setLocation(`/workout/${selectedDeck}?mode=ai-challenge&difficulty=${difficulty}`);
    }
  };

  const getGameModeInfo = () => {
    if (mode === 'solo') {
      return {
        title: "Solo Play",
        description: "Complete workouts at your own pace with personalized coaching from your otter companion",
        icon: "fas fa-user",
        features: [
          "Personal adaptive progression",
          "Otter coach motivation",
          "Achievement tracking",
          "Custom difficulty levels"
        ]
      };
    } else if (mode === 'ai-challenge') {
      return {
        title: "AI Challenge",
        description: "Compete against an AI opponent that adapts to your skill level for exciting fitness battles",
        icon: "fas fa-robot",
        features: [
          "Smart AI opponent",
          "Competitive scoring",
          "Dynamic difficulty adjustment",
          "Victory celebrations"
        ]
      };
    }
    return null;
  };

  const modeInfo = getGameModeInfo();

  if (!modeInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Game Mode Not Found</h2>
              <p className="text-slate-600 mb-4">The requested game mode doesn't exist.</p>
              <Button onClick={() => setLocation('/')} className="bg-otter-teal hover:bg-otter-teal-dark">
                Go Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto space-y-6 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="text-slate-600 hover:text-slate-800"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back
          </Button>
        </div>

        {/* Otter Character */}
        <div className="flex justify-center">
          <OtterCharacter mood="excited" size="lg" />
        </div>

        {/* Game Mode Info */}
        <Card className="shadow-lg border-otter-teal">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-otter-teal-light rounded-full flex items-center justify-center mx-auto mb-4">
              <i className={`${modeInfo.icon} text-2xl text-otter-teal`}></i>
            </div>
            <CardTitle className="text-2xl text-slate-800">{modeInfo.title}</CardTitle>
            <p className="text-slate-600">{modeInfo.description}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Features:</h4>
                <ul className="space-y-1">
                  {modeInfo.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-slate-600">
                      <i className="fas fa-check text-otter-teal mr-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Choose Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'easy', label: 'Easy', color: 'bg-green-100 text-green-800 border-green-200' },
                { key: 'normal', label: 'Normal', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                { key: 'hard', label: 'Hard', color: 'bg-red-100 text-red-800 border-red-200' }
              ].map((diff) => (
                <button
                  key={diff.key}
                  onClick={() => setDifficulty(diff.key as any)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    difficulty === diff.key 
                      ? `${diff.color} scale-105` 
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Deck Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Workout Deck</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingDecks ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-otter-teal mx-auto"></div>
                <p className="text-sm text-slate-600 mt-2">Loading decks...</p>
              </div>
            ) : decks.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-slate-600 mb-4">No workout decks available.</p>
                <Button 
                  onClick={() => setLocation('/deck-creation')}
                  variant="outline"
                  size="sm"
                >
                  Create Your First Deck
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {decks.map((deck) => (
                  <button
                    key={deck.id}
                    onClick={() => setSelectedDeck(deck.id)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      selectedDeck === deck.id
                        ? 'border-otter-teal bg-otter-teal-light'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-800">{deck.name}</div>
                        <div className="text-sm text-slate-600">{deck.description}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {deck.category}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {deck.estimatedMinutes || 15} mins
                          </span>
                        </div>
                      </div>
                      {selectedDeck === deck.id && (
                        <i className="fas fa-check-circle text-otter-teal"></i>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Start Game Button */}
        <Button 
          onClick={startGame}
          disabled={!selectedDeck || isLoadingDecks}
          className="w-full bg-otter-teal hover:bg-otter-teal-dark text-white py-3 text-lg font-medium"
        >
          {mode === 'ai-challenge' ? 'Start AI Challenge' : 'Start Solo Play'}
        </Button>
      </div>
    </div>
  );
}