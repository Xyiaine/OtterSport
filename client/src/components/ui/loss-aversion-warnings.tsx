/**
 * LOSS AVERSION WARNING SYSTEM
 * 
 * Implements psychological triggers to prevent users from losing streaks,
 * lives, or progress through strategic warnings and recovery options.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Heart, Flame, Clock, AlertTriangle, Zap } from 'lucide-react';

/**
 * StreakWarningProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * StreakWarningProps interface defines the contract for implementation.
/**
 * StreakWarningProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * StreakWarningProps interface defines the contract for implementation.
 * 
/**
 * defines interface defines the contract for implementation.
 * 
/**
 * StreakWarningProps interface defines the contract for implementation.
/**
 * StreakWarningProps interface defines the contract for implementation.
/**
 * StreakWarningProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface StreakWarningProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface StreakWarningProps
 */
 * 
 * This interface defines the contract for implementation.
/**
 * Handles that functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * All properties and methods should be implemented according to specification.
 * 
 * @interface StreakWarningProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
 * This interface defines the contract for implementation.
/**
 * Handles streakwarning functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await StreakWarning(params);
 */
 * All properties and methods should be implemented according to specification.
 * 
 * @interface StreakWarningProps
 */
 * @interface StreakWarningProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface StreakWarningProps
 */
 * @interface StreakWarningProps
 */
interface StreakWarningProps {
  show: boolean;
/**
 * Handles streakwarning functionality for the application
 * 
/**
 * Handles streakwarning functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await StreakWarning(params);
 */
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await StreakWarning(params);
 */
  streakCount: number;
  hoursRemaining: number;
  onWorkoutNow: () => void;
  onUseFreeze: () => void;
  onDismiss: () => void;
  canUseFreeze: boolean;
}

export function StreakWarning({ 
  show, 
  streakCount, 
  hoursRemaining, 
  onWorkoutNow, 
  onUseFreeze, 
  onDismiss,
  canUseFreeze 
}: StreakWarningProps) {
  const [timeLeft, setTimeLeft] = useState(hoursRemaining);

  useEffect(() => {
    if (show && hoursRemaining > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - (1/60))); // Update every minute
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [show, hoursRemaining]);

  const getUrgencyLevel = () => {
    if (timeLeft <= 2) return 'critical';
    if (timeLeft <= 6) return 'high';
    return 'medium';
  };

  const urgencyLevel = getUrgencyLevel();
  
  const urgencyStyles = {
    critical: 'from-red-500 to-red-700 border-red-400',
    high: 'from-orange-500 to-orange-700 border-orange-400', 
    medium: 'from-yellow-500 to-yellow-600 border-yellow-400'
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
          >
            {/* Warning Header */}
            <div className="text-center mb-4">
              <motion.div
                className="mx-auto mb-3 p-3 rounded-full bg-red-100 dark:bg-red-900/30 w-fit"
                animate={{ 
                  scale: urgencyLevel === 'critical' ? [1, 1.1, 1] : 1,
                  rotate: urgencyLevel === 'critical' ? [0, -5, 5, 0] : 0
                }}
                transition={{ 
                  repeat: urgencyLevel === 'critical' ? Infinity : 0, 
                  duration: 0.5 
                }}
              >
/**
 * LivesWarningProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface LivesWarningProps
 */
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </motion.div>
              
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                Streak in Danger! 🔥
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300">
                Your {streakCount}-day streak will be lost if you don't work out today
              </p>
            </div>

            {/* Time Remaining */}
            <Card className={`mb-4 border-2 bg-gradient-to-r ${urgencyStyles[urgencyLevel]} text-white`}>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">Time Remaining</span>
                </div>
                <div className="text-2xl font-bold">
                  {Math.floor(timeLeft)} hours {Math.floor((timeLeft % 1) * 60)} minutes
                </div>
                {urgencyLevel === 'critical' && (
                  <p className="text-sm text-red-100 mt-1">
/**
 * LivesWarningProps interface defines the contract for implementation.
/**
 * defines interface defines the contract for implementation.
 * 
/**
 * LivesWarningProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface LivesWarningProps
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
 * @interface LivesWarningProps
 */
                    ⚠️ Critical: Less than 2 hours left!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Streak Value Display */}
            <div className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="h-6 w-6 text-orange-500" />
                <span className="font-bold text-orange-800 dark:text-orange-200">
                  {streakCount} Days of Progress
                </span>
              </div>
              <div className="text-center text-sm text-orange-700 dark:text-orange-300">
                Don't let all your hard work go to waste!
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={onWorkoutNow}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
/**
 * LivesWarningProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface LivesWarningProps
 */
                size="lg"
              >
                <Zap className="h-5 w-5 mr-2" />
/**
 * LivesWarningProps interface defines the contract for implementation.
/**
 * Handles liveswarning functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await LivesWarning(params);
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface LivesWarningProps
 */
                Start Workout Now
              </Button>

              {canUseFreeze && (
                <Button
                  onClick={onUseFreeze}
                  variant="outline"
                  className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Use Streak Freeze (Save for Later)
                </Button>
              )}

              <Button
                onClick={onDismiss}
                variant="ghost"
                className="w-full text-gray-500 hover:text-gray-700"
                size="sm"
              >
                Remind Me Later
/**
 * LivesWarningProps interface defines the contract for implementation.
 * 
/**
 * LivesWarningProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface LivesWarningProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface LivesWarningProps
 */
/**
 * Handles liveswarning functionality for the application
/**
 * ProgressLossWarningProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressLossWarningProps
 */
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await LivesWarning(params);
 */
              </Button>
            </div>

            {/* Motivation Message */}
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
/**
 * Handles liveswarning functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await LivesWarning(params);
 */
              {streakCount >= 30 ? 
                "You're a fitness legend! Don't break your legendary streak!" :
                streakCount >= 7 ?
                "You've built an amazing habit! Keep the momentum going!" :
                "You're doing great! Every day counts towards your goals!"
              }
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface LivesWarningProps {
  show: boolean;
  livesRemaining: number;
  onContinue: () => void;
/**
 * ProgressLossWarningProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressLossWarningProps
 */
  onRecover: () => void;
  onQuit: () => void;
  recoveryOptions: Array<{
    type: 'currency' | 'ad' | 'friend';
    cost?: number;
    label: string;
  }>;
}

export function LivesWarning({ 
  show, 
  livesRemaining, 
  onContinue, 
  onRecover, 
  onQuit, 
  recoveryOptions 
/**
 * ProgressLossWarningProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressLossWarningProps
 */
}: LivesWarningProps) {
  const isCritical = livesRemaining <= 1;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
          >
            {/* Hearts Display */}
            <div className="text-center mb-4">
              <div className="flex justify-center gap-1 mb-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <Heart
                    key={i}
                    className={`h-8 w-8 ${
                      i < livesRemaining
                        ? 'text-red-500 fill-red-500'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              <h2 className={`text-xl font-bold mb-1 ${
                isCritical 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-orange-600 dark:text-orange-400'
              }`}>
                {isCritical ? 'Last Life!' : 'Lives Running Low'}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300">
                {isCritical
/**
 * ProgressLossWarningProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressLossWarningProps
 */
/**
 * Handles progresslosswarning functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await ProgressLossWarning(params);
 */
/**
 * ProgressLossWarningProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressLossWarningProps
 */
                  ? 'One mistake and your workout session ends!'
                  : `Only ${livesRemaining} ${livesRemaining === 1 ? 'life' : 'lives'} remaining. Be careful!`
                }
              </p>
            </div>

            {/* Warning Message */}
            <Card className={`mb-4 border-2 ${
              isCritical 
                ? 'border-red-400 bg-red-50 dark:bg-red-900/20' 
                : 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
            }`}>
              <CardContent className="p-4 text-center">
                <div className={`font-semibold ${
                  isCritical ? 'text-red-700 dark:text-red-300' : 'text-orange-700 dark:text-orange-300'
                }`}>
                  {isCritical
                    ? '⚠️ Focus and make every move count!'
                    : '🎯 Stay focused to preserve your remaining lives!'
                  }
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={onContinue}
                className={`w-full font-semibold py-3 ${
                  isCritical
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
                size="lg"
              >
                Continue Carefully
              </Button>

              {/* Recovery Options */}
              {recoveryOptions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    Or recover a life:
/**
 * ProgressLossWarningProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressLossWarningProps
 */
/**
 * Handles progresslosswarning functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await ProgressLossWarning(params);
 */
                  </p>
                  {recoveryOptions.map((option, index) => (
                    <Button
                      key={index}
                      onClick={onRecover}
/**
 * ProgressLossWarningProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressLossWarningProps
 */
/**
 * Handles progresslosswarning functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await ProgressLossWarning(params);
 */
                      variant="outline"
                      className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      {option.label}
                      {option.cost && (
                        <Badge variant="secondary" className="ml-2">
                          {option.cost} coins
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              )}

              <Button
                onClick={onQuit}
                variant="ghost"
                className="w-full text-gray-500 hover:text-gray-700"
                size="sm"
              >
                End Session (Save Progress)
              </Button>
            </div>

            {/* Encouragement */}
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              {isCritical
                ? "You've got this! Take your time and focus. 💪"
                : "Stay calm and focused. You're doing great! ✨"
              }
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ProgressLossWarningProps {
  show: boolean;
  lossType: 'level' | 'xp' | 'streak' | 'achievement';
  lossAmount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ProgressLossWarning({ 
  show, 
  lossType, 
  lossAmount, 
  onConfirm, 
  onCancel 
}: ProgressLossWarningProps) {
  const getLossMessage = () => {
    switch (lossType) {
      case 'level':
        return `You will lose Level ${lossAmount} and return to the previous level`;
      case 'xp':
        return `You will lose ${lossAmount} XP from your total progress`;
      case 'streak':
        return `Your ${lossAmount}-day streak will be reset to 0`;
      case 'achievement':
        return `This action may affect your achievement progress`;
      default:
        return 'This action may cause you to lose progress';
    }
  };

  const getIcon = () => {
    switch (lossType) {
      case 'level': return <Badge className="h-6 w-6" />;
      case 'xp': return <Zap className="h-6 w-6" />;
      case 'streak': return <Flame className="h-6 w-6" />;
      default: return <AlertTriangle className="h-6 w-6" />;
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
          >
            <div className="text-center mb-4">
              <div className="mx-auto mb-3 p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 w-fit">
                {getIcon()}
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                Warning: Progress Loss
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300">
                {getLossMessage()}
              </p>
            </div>

            <Card className="mb-4 border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="p-4 text-center">
                <p className="text-yellow-700 dark:text-yellow-300 font-semibold">
                  Are you sure you want to continue?
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                  This action cannot be undone
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1 border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                Cancel (Keep Progress)
              </Button>
              <Button
                onClick={onConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Continue Anyway
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}