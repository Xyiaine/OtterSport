/**
 * CARD-DECK-SELECTION MODULE
 * 
 * This module provides functionality for card-deck-selection.
 * All exports are designed to work seamlessly with the OtterSport application.
 * 
 * Human Developer Guide:
 * - Follow established patterns when modifying this file
 * - Maintain comprehensive test coverage for all functions
 * - Update documentation when adding new functionality
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CardDrawAnimation from "@/components/ui/card-draw-animation";
import ExerciseAnimation from "@/components/ui/exercise-animation";
import type { Deck, DeckExercise, Exercise } from "@shared/schema";

type DeckWithExercises = Deck & { 
  exercises: (DeckExercise & { exercise: Exercise })[] 
};

/**
 * CardDeckSelectionProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * CardDeckSelectionProps interface defines the contract for implementation.
/**
 * CardDeckSelectionProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * CardDeckSelectionProps interface defines the contract for implementation.
 * 
/**
 * defines interface defines the contract for implementation.
 * 
/**
 * CardDeckSelectionProps interface defines the contract for implementation.
/**
 * CardDeckSelectionProps interface defines the contract for implementation.
/**
 * CardDeckSelectionProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardDeckSelectionProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardDeckSelectionProps
 */
 * 
/**
 * Handles that functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardDeckSelectionProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
/**
 * Handles carddeckselection functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await CardDeckSelection(params);
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardDeckSelectionProps
 */
 * @interface CardDeckSelectionProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardDeckSelectionProps
 */
 * @interface CardDeckSelectionProps
 */
interface CardDeckSelectionProps {
/**
 * Handles carddeckselection functionality for the application
 * 
/**
 * Handles carddeckselection functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await CardDeckSelection(params);
 */
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await CardDeckSelection(params);
 */
  deck: DeckWithExercises;
  onCardSelected: (exerciseIndex: number) => void;
  gameMode: string;
  playerHand?: number[];
  aiHandSize?: number;
  deckSize?: number;
}

export default function CardDeckSelection({ 
  deck, 
  onCardSelected,
  gameMode,
  playerHand = [],
  aiHandSize = 0,
  deckSize = 0
}: CardDeckSelectionProps) {
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [revealedCards, setRevealedCards] = useState(false);
  const [currentSelectionPhase, setCurrentSelectionPhase] = useState<'intro' | 'revealing' | 'selecting'>('intro');

  const startCardReveal = () => {
    setCurrentSelectionPhase('revealing');
    setTimeout(() => {
      setRevealedCards(true);
      setTimeout(() => {
        setCurrentSelectionPhase('selecting');
      }, deck.exercises.length * 200 + 1000);
    }, 500);
  };

  const handleCardSelect = (index: number) => {
    if (currentSelectionPhase !== 'selecting') return;
    
    setSelectedCards([index]);
    setTimeout(() => {
      onCardSelected(index);
    }, 600);
  };

  // Get exercises to display (either from hand or all exercises)
  const exercisesToShow = gameMode === 'ai-challenge' && playerHand.length > 0 
    ? playerHand.map(cardIndex => deck.exercises[cardIndex])
    : deck.exercises;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto">
        
        {/* Hand Size Display for AI Challenge */}
        {gameMode === 'ai-challenge' && (
          <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{playerHand.length}</div>
              <div className="text-sm text-gray-600">Your Hand</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">{deckSize}</div>
              <div className="text-sm text-gray-600">Deck</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{aiHandSize}</div>
              <div className="text-sm text-gray-600">AI Hand</div>
            </div>
          </div>
        )}
        
        {/* Intro Phase */}
        <AnimatePresence>
          {currentSelectionPhase === 'intro' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8 py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", duration: 0.8 }}
                className="w-32 h-32 mx-auto bg-otter-teal-light rounded-full flex items-center justify-center"
              >
                <i className="fas fa-cards-blank text-4xl text-otter-teal"></i>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h1 className="text-3xl font-bold text-slate-800 mb-4">
                  {gameMode === 'ai-challenge' ? 'Choose Your Battle Card!' : 'Draw Your Exercise Card!'}
                </h1>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  {gameMode === 'ai-challenge' 
                    ? 'Select the perfect exercise card to outperform the AI opponent!'
                    : 'Pick your exercise card and let the workout magic begin!'
                  }
                </p>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">{deck.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                    {deck.exercises.slice(0, 4).map((deckExercise, index) => (
                      <ExerciseAnimation
                        key={deckExercise.exercise.id}
                        exercise={deckExercise.exercise}
                        isActive={true}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
              >
                <Button
                  onClick={startCardReveal}
                  size="lg"
                  className="bg-otter-teal hover:bg-otter-teal-dark text-white px-8 py-4 text-lg font-semibold"
                >
                  <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎴 Draw Cards
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Reveal and Selection Phase */}
        <AnimatePresence>
          {(currentSelectionPhase === 'revealing' || currentSelectionPhase === 'selecting') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {currentSelectionPhase === 'revealing' ? 'Revealing Your Cards...' : 'Choose Your Exercise Card'}
                </h2>
                <p className="text-slate-600">
                  {currentSelectionPhase === 'selecting' && 'Click on a card to select it for your workout'}
                </p>
              </motion.div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {exercisesToShow.map((deckExercise, displayIndex) => {
                  // Get the actual deck index for AI challenge mode
                  const actualIndex = gameMode === 'ai-challenge' && playerHand.length > 0 
                    ? playerHand[displayIndex] 
                    : displayIndex;
                  
                  return (
                    <motion.div
                      key={deckExercise.exercise.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: selectedCards.includes(actualIndex) ? 1.05 : 1,
                      }}
                      transition={{ 
                        delay: displayIndex * 0.1,
                        duration: 0.5,
                      }}
                      className={`transform transition-all duration-300 relative z-30 ${
                        selectedCards.includes(actualIndex) 
                          ? 'ring-4 ring-otter-teal ring-opacity-50 shadow-2xl' 
                          : currentSelectionPhase === 'selecting' 
                            ? 'hover:scale-105 cursor-pointer' 
                            : ''
                      }`}
                    >
                      <CardDrawAnimation
                        exercise={deckExercise.exercise}
                        reps={deckExercise.customReps || deckExercise.exercise.defaultReps}
                        duration={deckExercise.customDuration || deckExercise.exercise.defaultDuration}
                        onCardSelect={() => handleCardSelect(actualIndex)}
                        isRevealed={revealedCards}
                        cardIndex={displayIndex}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Selection Status */}
              {currentSelectionPhase === 'selecting' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-8"
                >
                  {selectedCards.length === 0 ? (
                    <p className="text-slate-600 font-medium">
                      ✨ Select your exercise card to begin the workout!
                    </p>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="bg-otter-teal-light p-4 rounded-lg inline-block"
                    >
                      <p className="text-otter-teal font-semibold">
                        🎯 Card Selected! Preparing your workout...
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}