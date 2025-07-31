/**
 * CARD-BATTLE-ANIMATIONS MODULE
 * 
 * This module provides functionality for card-battle-animations.
 * All exports are designed to work seamlessly with the OtterSport application.
 * 
 * Human Developer Guide:
 * - Follow established patterns when modifying this file
 * - Maintain comprehensive test coverage for all functions
 * - Update documentation when adding new functionality
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Exercise } from "@shared/schema";

/**
 * GameCard interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * GameCard interface defines the contract for implementation.
/**
 * GameCard interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * GameCard interface defines the contract for implementation.
 * 
/**
 * defines interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
/**
 * CardPosition interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardPosition
 */
/**
 * EnhancedCardDrawProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
/**
 * GameCard interface defines the contract for implementation.
/**
 * GameCard interface defines the contract for implementation.
/**
 * GameCard interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GameCard
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GameCard
/**
 * CardPosition interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardPosition
 */
/**
 * EnhancedCardDrawProps interface defines the contract for implementation.
/**
 * defines interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedCardDrawProps
 */
/**
 * CardPosition interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardPosition
 */
/**
 * EnhancedCardDrawProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedCardDrawProps
 */
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GameCard
 */
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedCardDrawProps
 */
 */
 * This interface defines the contract for implementation.
/**
 * CardPosition interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardPosition
 */
/**
 * EnhancedCardDrawProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedCardDrawProps
 */
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Handles enhancedcarddraw functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await EnhancedCardDraw(params);
 */
 * @interface GameCard
 */
 * @interface GameCard
 */
 * 
 * This interface defines the contract for implementation.
/**
 * CardPosition interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardPosition
 */
/**
 * EnhancedCardDrawProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedCardDrawProps
 */
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GameCard
 */
 * @interface GameCard
 */
interface GameCard {
  id: string;
  exercise: Exercise;
  points: number;
/**
 * CardPosition interface defines the contract for implementation.
 * 
/**
 * CardPosition interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * CardPlayAnimationProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardPlayAnimationProps
 */
 * @interface CardPosition
 */
/**
 * EnhancedCardDrawProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedCardDrawProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
/**
 * Handles enhancedcarddraw functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await EnhancedCardDraw(params);
 */
 * 
 * @interface CardPosition
 */
/**
 * EnhancedCardDrawProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedCardDrawProps
 */
  difficulty: number;
  type: 'cardio' | 'strength' | 'flexibility' | 'mixed' | 'warmup' | 'utility';
/**
 * Handles enhancedcarddraw functionality for the application
 * 
 * This is a complex function that requires careful attention.
/**
 * CardPlayAnimationProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardPlayAnimationProps
 */
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await EnhancedCardDraw(params);
 */
  combo?: string;
  special?: 'double' | 'block' | 'steal' | 'bonus';
  cardType?: 'exercise' | 'warmup' | 'utility' | 'power';
  utilityEffect?: string;
}

interface CardPosition {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

// Enhanced Card Draw Animation Component
interface EnhancedCardDrawProps {
  card: GameCard;
  fromPosition: CardPosition;
/**
 * CardPlayAnimationProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardPlayAnimationProps
 */
  toPosition: CardPosition;
  isDrawing: boolean;
  onDrawComplete: () => void;
  cardIndex: number;
  drawDelay?: number;
}

export function EnhancedCardDraw({
  card,
  fromPosition,
  toPosition,
  isDrawing,
  onDrawComplete,
  cardIndex,
  drawDelay = 0
}: EnhancedCardDrawProps) {
  const [phase, setPhase] = useState<'deck' | 'moving' | 'hand' | 'flipping'>('deck');

  useEffect(() => {
    if (isDrawing) {
      const timer = setTimeout(() => {
        setPhase('moving');
        setTimeout(() => {
          setPhase('flipping');
          setTimeout(() => {
            setPhase('hand');
            onDrawComplete();
          }, 400);
        }, 800);
      }, drawDelay + cardIndex * 150);

      return () => clearTimeout(timer);
    }
  }, [isDrawing, cardIndex, drawDelay, onDrawComplete]);

  const cardVariants = {
    deck: {
      x: fromPosition.x,
      y: fromPosition.y,
      rotate: fromPosition.rotation,
/**
 * CardPlayAnimationProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardPlayAnimationProps
 */
      scale: fromPosition.scale,
/**
 * Handles cardplayanimation functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await CardPlayAnimation(params);
 */
      rotateY: 0,
      opacity: 1,
      zIndex: 10 + cardIndex,
    },
    moving: {
      x: toPosition.x,
      y: toPosition.y,
      rotate: toPosition.rotation,
      scale: toPosition.scale,
      rotateY: 0,
      opacity: 1,
      zIndex: 20 + cardIndex,
/**
 * CardPlayAnimationProps interface defines the contract for implementation.
/**
 * AnimatedDeckProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AnimatedDeckProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardPlayAnimationProps
 */
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    flipping: {
      x: toPosition.x,
      y: toPosition.y,
      rotate: toPosition.rotation,
      scale: toPosition.scale,
      rotateY: 180,
      opacity: 1,
      zIndex: 20 + cardIndex,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    hand: {
      x: toPosition.x,
      y: toPosition.y,
      rotate: toPosition.rotation,
      scale: toPosition.scale,
      rotateY: 180,
      opacity: 1,
      zIndex: 5 + cardIndex,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="absolute"
      variants={cardVariants}
/**
 * CardPlayAnimationProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardPlayAnimationProps
 */
      animate={phase}
/**
 * Handles cardplayanimation functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
/**
 * AnimatedDeckProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AnimatedDeckProps
 */
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await CardPlayAnimation(params);
 */
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-24 h-32 preserve-3d"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card Back (shows during deck and moving phases) */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            display: phase === 'flipping' || phase === 'hand' ? 'none' : 'block'
/**
 * CardPlayAnimationProps interface defines the contract for implementation.
 * 
/**
 * BattleFieldProps interface defines the contract for implementation.
/**
 * defines interface defines the contract for implementation.
/**
 * defines interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
 * 
/**
 * AnimatedDeckProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AnimatedDeckProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface BattleFieldProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardPlayAnimationProps
 */
          }}
/**
 * Handles cardplayanimation functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await CardPlayAnimation(params);
 */
        >
          <Card className="w-full h-full bg-gradient-to-br from-otter-teal to-otter-teal-dark border border-otter-teal">
            <CardContent className="h-full flex items-center justify-center p-2">
              <div className="text-center text-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 mx-auto mb-1 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <i className="fas fa-otter text-xs"></i>
                </motion.div>
                <p className="text-[10px] font-bold">OtterSport</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card Front (shows during flipping and hand phases) */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            display: phase === 'deck' || phase === 'moving' ? 'none' : 'block'
          }}
        >
          <ExerciseCardMini card={card} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Card Play Animation Component
interface CardPlayAnimationProps {
  card: GameCard;
  fromPosition: CardPosition;
  toPosition: CardPosition;
/**
 * BattleFieldProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface BattleFieldProps
 */
  isPlaying: boolean;
  onPlayComplete: () => void;
  playEffect?: 'normal' | 'special' | 'combo' | 'power';
}

/**
 * AnimatedDeckProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Handles animateddeck functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * @interface AnimatedDeckProps
 */
export function CardPlayAnimation({
  card,
  fromPosition,
  toPosition,
  isPlaying,
  onPlayComplete,
  playEffect = 'normal'
}: CardPlayAnimationProps) {
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      setIsGlowing(true);
      const timer = setTimeout(() => {
        onPlayComplete();
        setIsGlowing(false);
      }, 1200);

      return () => clearTimeout(timer);
/**
 * AnimatedDeckProps interface defines the contract for implementation.
/**
 * BattleFieldProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface BattleFieldProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AnimatedDeckProps
 */
    }
  }, [isPlaying, onPlayComplete]);

  const getEffectColors = () => {
    switch (playEffect) {
      case 'special': return { glow: '#FFD700', particle: '#FFA500' };
      case 'combo': return { glow: '#FF69B4', particle: '#FF1493' };
      case 'power': return { glow: '#8A2BE2', particle: '#9932CC' };
      default: return { glow: '#20B2AA', particle: '#48D1CC' };
    }
  };

  const colors = getEffectColors();

  const cardVariants = {
    hand: {
/**
 * Handles exercisecardmini functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
      x: fromPosition.x,
      y: fromPosition.y,
      rotate: fromPosition.rotation,
      scale: fromPosition.scale,
      opacity: 1,
      zIndex: 10,
    },
    playing: {
      x: toPosition.x,
      y: toPosition.y,
      rotate: 0,
      scale: 1.2,
      opacity: 1,
      zIndex: 50,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
    played: {
      x: toPosition.x,
      y: toPosition.y,
      rotate: 0,
      scale: 1.0,
      opacity: 0.8,
      zIndex: 5,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AnimatePresence>
/**
 * AnimatedDeckProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Handles animateddeck functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * @interface AnimatedDeckProps
/**
 * BattleFieldProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface BattleFieldProps
 */
/**
 * Handles battlefield functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await BattleField(params);
 */
 */
      {isPlaying && (
        <motion.div
          className="absolute"
          variants={cardVariants}
          initial="hand"
          animate="playing"
          exit="played"
        >
          {/* Particle Effects */}
          {isGlowing && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{
/**
/**
 * BattleFieldProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface BattleFieldProps
 */
 * AnimatedDeckProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Handles animateddeck functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * @interface AnimatedDeckProps
 */
                  boxShadow: `0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}, 0 0 60px ${colors.glow}`,
                  backgroundColor: `${colors.glow}20`,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 1,
/**
 * Handles exercisecardmini functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Particle Burst */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: colors.particle,
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 1,
                  }}
                  animate={{
                    x: Math.cos((i * Math.PI * 2) / 8) * 60,
/**
 * Handles exercisecardmini functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
                    y: Math.sin((i * Math.PI * 2) / 8) * 60,
                    scale: [0, 1, 0],
                    opacity: [1, 0.8, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    delay: 0.2,
                  }}
                />
              ))}
            </motion.div>
          )}

          <ExerciseCardMini card={card} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Deck Component with Animation
/**
 * BattleFieldProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface BattleFieldProps
 */
/**
 * Handles battlefield functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await BattleField(params);
 */
interface AnimatedDeckProps {
  cardsRemaining: number;
  isDrawing: boolean;
  deckTheme: string;
}

export function AnimatedDeck({ cardsRemaining, isDrawing, deckTheme }: AnimatedDeckProps) {
  return (
    <div className="relative">
      {/* Deck Stack Effect */}
      {[...Array(Math.min(cardsRemaining, 5))].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            zIndex: 5 - i,
            transform: `translate(${i * 2}px, ${i * -2}px)`,
          }}
          animate={isDrawing && i === 0 ? {
            scale: [1, 1.05, 1],
            y: [0, -5, 0],
          } : {}}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-24 h-32 bg-gradient-to-br from-otter-teal to-otter-teal-dark border border-otter-teal">
            <CardContent className="h-full flex items-center justify-center p-2">
              <div className="text-center text-white">
                <motion.div
                  animate={{ rotate: 360 }}
/**
 * BattleFieldProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface BattleFieldProps
 */
/**
 * Handles battlefield functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await BattleField(params);
 */
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 mx-auto mb-1 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <i className="fas fa-otter text-xs"></i>
                </motion.div>
                <p className="text-[10px] font-bold">OtterSport</p>
                <p className="text-[8px] opacity-90">{cardsRemaining} left</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Mini Exercise Card Component
function ExerciseCardMini({ card }: { card: GameCard }) {
  const getCardBorderColor = () => {
    switch (card.cardType) {
      case 'utility': return 'border-blue-400';
      case 'warmup': return 'border-orange-400';
      case 'power': return 'border-purple-500';
      default: return 'border-otter-teal';
    }
  };

  const getCardBgColor = () => {
    switch (card.cardType) {
      case 'utility': return 'bg-blue-50';
      case 'warmup': return 'bg-orange-50';
      case 'power': return 'bg-purple-50';
      default: return 'bg-white';
    }
  };

  return (
    <Card className={`w-full h-full ${getCardBgColor()} ${getCardBorderColor()} border-2 shadow-lg`}>
      <CardContent className="h-full p-2 flex flex-col">
        {/* Card Header */}
        <div className="text-center mb-1">
          <div className="w-6 h-6 mx-auto mb-1 bg-otter-teal-light rounded-full flex items-center justify-center">
            <i className={`${card.exercise.icon} text-xs text-otter-teal`}></i>
          </div>
          <h4 className="text-[10px] font-bold text-slate-800 leading-tight">
            {card.exercise.name}
          </h4>
        </div>

        {/* Card Type Badge */}
        <div className="flex justify-center mb-1">
          <Badge variant="secondary" className="text-[8px] px-1 py-0">
            {card.cardType || 'exercise'}
          </Badge>
        </div>

        {/* Points */}
        <div className="text-center mt-auto">
          <div className="text-sm font-bold text-otter-teal">{card.points}</div>
          <div className="text-[8px] text-slate-500">pts</div>
        </div>

        {/* Special Effects Indicator */}
        {card.special && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border border-white">
            <div className="text-[8px] text-center leading-[10px]">✨</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Battle Field Animation Component
interface BattleFieldProps {
  playerCard?: GameCard | null;
  aiCard?: GameCard | null;
  isPlayerTurn: boolean;
  showPlayerEffect: boolean;
  showAIEffect: boolean;
}

export function BattleField({
  playerCard,
  aiCard,
  isPlayerTurn,
  showPlayerEffect,
  showAIEffect
}: BattleFieldProps) {
  return (
    <div className="relative w-full h-40 bg-gradient-to-r from-blue-100 via-purple-50 to-blue-100 rounded-lg border-2 border-slate-200 overflow-hidden">
      {/* Battle Field Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-purple-200/30"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Player Side */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <AnimatePresence>
          {playerCard && (
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <ExerciseCardMini card={playerCard} />
              {showPlayerEffect && (
                <motion.div
                  className="absolute inset-0 bg-blue-400/20 rounded-lg"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* VS Indicator */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="text-2xl font-bold text-slate-600"
          animate={{
            scale: isPlayerTurn ? [1, 1.1, 1] : [1, 1.05, 1],
            color: isPlayerTurn ? "#2563eb" : "#dc2626",
          }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          VS
        </motion.div>
      </div>

      {/* AI Side */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <AnimatePresence>
          {aiCard && (
            <motion.div
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <ExerciseCardMini card={aiCard} />
              {showAIEffect && (
                <motion.div
                  className="absolute inset-0 bg-red-400/20 rounded-lg"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Combat Effects */}
      <AnimatePresence>
        {(showPlayerEffect || showAIEffect) && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Lightning Effect */}
            <motion.div
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, rotate: 0 }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-4xl">⚡</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}