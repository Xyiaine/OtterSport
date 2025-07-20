/**
 * VISUAL PROGRESS & CELEBRATION ANIMATIONS
 * 
 * Provides engaging visual feedback for user achievements, level ups,
 * and progress milestones with confetti, animations, and visual rewards.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Flame, Crown, Zap, Heart } from 'lucide-react';

interface ConfettiProps {
  show: boolean;
  onComplete?: () => void;
}

export function Confetti({ show, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)],
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);

      // Clear after animation
      setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);
    }
  }, [show, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{ 
            backgroundColor: particle.color,
            left: particle.x,
            top: particle.y,
          }}
          initial={{ y: -10, rotate: 0 }}
          animate={{ 
            y: window.innerHeight + 10,
            rotate: 360,
            x: particle.x + (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 2.5,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

interface LevelUpAnimationProps {
  show: boolean;
  newLevel: number;
  xpGained: number;
  onComplete?: () => void;
}

export function LevelUpAnimation({ show, newLevel, xpGained, onComplete }: LevelUpAnimationProps) {
  useEffect(() => {
    if (show) {
      // Play celebration sound if available
      const audio = new Audio('/game-assets/sounds/level-up.mp3');
      audio.play().catch(() => {/* Ignore if sound not available */});

      // Auto-hide after animation
      setTimeout(() => {
        onComplete?.();
      }, 4000);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center max-w-md mx-4"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <motion.div
              className="mb-6"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Crown className="h-16 w-16 mx-auto text-yellow-500" />
            </motion.div>
            
            <motion.h2
              className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              LEVEL UP!
            </motion.h2>
            
            <motion.div
              className="text-6xl font-bold text-gray-800 dark:text-white mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {newLevel}
            </motion.div>
            
            <motion.p
              className="text-gray-600 dark:text-gray-300 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              You earned {xpGained} XP and reached Level {newLevel}!
            </motion.p>
            
            <motion.div
              className="flex items-center justify-center gap-2 text-yellow-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5 }}
            >
              <Star className="h-5 w-5 fill-yellow-500" />
              <span className="font-semibold">New abilities unlocked!</span>
              <Star className="h-5 w-5 fill-yellow-500" />
            </motion.div>
          </motion.div>
          
          <Confetti show={show} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AchievementPopupProps {
  show: boolean;
  achievement: {
    name: string;
    description: string;
    icon: string;
  };
  onComplete?: () => void;
}

export function AchievementPopup({ show, achievement, onComplete }: AchievementPopupProps) {
  useEffect(() => {
    if (show) {
      // Play achievement sound
      const audio = new Audio('/game-assets/sounds/achievement.mp3');
      audio.play().catch(() => {/* Ignore if sound not available */});

      // Auto-hide after 3 seconds
      setTimeout(() => {
        onComplete?.();
      }, 3000);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-4 rounded-lg shadow-lg z-30 max-w-sm"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Trophy className="h-8 w-8" />
            </motion.div>
            <div>
              <h3 className="font-bold text-sm">Achievement Unlocked!</h3>
              <h4 className="font-semibold">{achievement.name}</h4>
              <p className="text-xs text-yellow-100">{achievement.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface XPGainAnimationProps {
  show: boolean;
  xpGained: number;
  reason: string;
  onComplete?: () => void;
}

export function XPGainAnimation({ show, xpGained, reason, onComplete }: XPGainAnimationProps) {
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        onComplete?.();
      }, 2000);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-teal-400 to-blue-500 text-white px-4 py-2 rounded-full shadow-lg z-30"
          initial={{ y: -50, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-5 w-5" />
            </motion.div>
            <div className="text-center">
              <div className="font-bold">+{xpGained} XP</div>
              <div className="text-xs text-teal-100">{reason}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface StreakAnimationProps {
  show: boolean;
  streakCount: number;
  onComplete?: () => void;
}

export function StreakAnimation({ show, streakCount, onComplete }: StreakAnimationProps) {
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        onComplete?.();
      }, 2500);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-30"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
        >
          <motion.div
            className="text-orange-500 mb-2"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <Flame className="h-16 w-16 mx-auto" />
          </motion.div>
          <motion.div
            className="text-4xl font-bold text-orange-600 dark:text-orange-400"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {streakCount} Day Streak!
          </motion.div>
          <motion.p
            className="text-gray-600 dark:text-gray-400 mt-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            You're on fire! Keep it up! 🔥
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface LifeLostAnimationProps {
  show: boolean;
  livesRemaining: number;
  onComplete?: () => void;
}

export function LifeLostAnimation({ show, livesRemaining, onComplete }: LifeLostAnimationProps) {
  useEffect(() => {
    if (show) {
      // Play heart break sound
      const audio = new Audio('/game-assets/sounds/life-lost.mp3');
      audio.play().catch(() => {/* Ignore if sound not available */});

      setTimeout(() => {
        onComplete?.();
      }, 1500);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-30"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          exit={{ scale: 0 }}
        >
          <motion.div
            className="text-red-500 mb-2"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: 3, duration: 0.2 }}
          >
            <Heart className="h-12 w-12 mx-auto" />
          </motion.div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            Life Lost!
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {livesRemaining} {livesRemaining === 1 ? 'life' : 'lives'} remaining
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Progress Bar with Smooth Animation
interface AnimatedProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export function AnimatedProgressBar({ 
  value, 
  max, 
  className = '', 
  showPercentage = false,
  color = 'blue' 
}: AnimatedProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className={`relative ${className}`}>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <motion.div
          className={`h-3 rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      {showPercentage && (
        <div className="absolute right-2 top-0 text-xs font-medium text-gray-600 dark:text-gray-400">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}