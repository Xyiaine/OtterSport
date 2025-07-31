/**
 * AI OPPONENT EMOTIONS COMPONENT
 * 
 * Dynamic AI opponent with emotional expressions based on game state:
 * - Confident when winning
 * - Determined when losing  
 * - Focused during exercise selection
 * - Celebratory when scoring points
 * - Frustrated when player performs well
 */

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export type EmotionType = 
  | 'neutral'
  | 'confident' 
  | 'determined'
  | 'focused'
  | 'celebratory'
  | 'frustrated'
  | 'thinking'
  | 'surprised';

/**
 * AIOpponentProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * AIOpponentProps interface defines the contract for implementation.
/**
 * AIOpponentProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * AIOpponentProps interface defines the contract for implementation.
 * 
/**
 * defines interface defines the contract for implementation.
 * 
/**
 * AIOpponentProps interface defines the contract for implementation.
/**
 * AIOpponentProps interface defines the contract for implementation.
/**
 * AIOpponentProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AIOpponentProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AIOpponentProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AIOpponentProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AIOpponentProps
 */
 * @interface AIOpponentProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AIOpponentProps
 */
 * @interface AIOpponentProps
 */
export interface AIOpponentProps {
  currentEmotion: EmotionType;
  playerScore: number;
  aiScore: number;
  isAITurn: boolean;
  deckType: 'cardio' | 'strength' | 'flexibility' | 'core';
  onEmotionChange?: (emotion: EmotionType) => void;
}

const emotionConfigs = {
  neutral: {
    expression: '😐',
    color: 'bg-gray-100',
    message: 'Ready to play!',
    animation: 'animate-none'
  },
  confident: {
    expression: '😏',
    color: 'bg-green-100',
    message: 'I\'ve got this!',
    animation: 'animate-pulse'
  },
  determined: {
    expression: '😤',
    color: 'bg-orange-100',
    message: 'Time to step up!',
/**
 * Handles that functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
    animation: 'animate-bounce'
  },
  focused: {
    expression: '🤔',
    color: 'bg-blue-100',
    message: 'Choosing my move...',
    animation: 'animate-pulse'
  },
  celebratory: {
    expression: '🎉',
/**
 * Handles aiopponentemotions functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await AIOpponentEmotions(params);
 */
    color: 'bg-yellow-100',
    message: 'Excellent move!',
    animation: 'animate-bounce'
  },
  frustrated: {
    expression: '😠',
    color: 'bg-red-100',
    message: 'Nice one...',
    animation: 'animate-pulse'
  },
  thinking: {
    expression: '🧠',
    color: 'bg-purple-100',
    message: 'Let me think...',
    animation: 'animate-spin'
  },
/**
 * Handles aiopponentemotions functionality for the application
 * 
/**
 * Handles aiopponentemotions functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await AIOpponentEmotions(params);
 */
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await AIOpponentEmotions(params);
 */
  surprised: {
    expression: '😲',
    color: 'bg-pink-100',
    message: 'Didn\'t see that coming!',
    animation: 'animate-bounce'
  }
};

export default function AIOpponentEmotions({
  currentEmotion,
  playerScore,
  aiScore,
  isAITurn,
  deckType,
  onEmotionChange
}: AIOpponentProps) {
  const [displayedEmotion, setDisplayedEmotion] = useState<EmotionType>(currentEmotion);
  const [speechBubbleVisible, setSpeechBubbleVisible] = useState(false);

  // Determine emotion based on game state
  useEffect(() => {
    let newEmotion: EmotionType = 'neutral';

    if (isAITurn) {
      newEmotion = 'thinking';
    } else if (aiScore > playerScore + 2) {
      newEmotion = 'confident';
    } else if (playerScore > aiScore + 2) {
      newEmotion = 'determined';
    } else if (Math.abs(aiScore - playerScore) <= 1) {
      newEmotion = 'focused';
    }

    // Override with provided emotion if different
    if (currentEmotion !== displayedEmotion) {
      newEmotion = currentEmotion;
    }

    if (newEmotion !== displayedEmotion) {
      setDisplayedEmotion(newEmotion);
      setSpeechBubbleVisible(true);
      onEmotionChange?.(newEmotion);

      // Hide speech bubble after delay
      const timer = setTimeout(() => setSpeechBubbleVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentEmotion, playerScore, aiScore, isAITurn, displayedEmotion, onEmotionChange]);

  const config = emotionConfigs[displayedEmotion];
  const scoreAdvantage = aiScore - playerScore;

  return (
    <div className="relative">
      <Card className={`transition-all duration-500 ${config.color} border-2 hover:shadow-lg`}>
        <CardContent className="p-6">
          {/* AI Avatar with Emotion */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`text-6xl ${config.animation}`}>
              {config.expression}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">
                AI Coach Otter
              </h3>
              <Badge 
                variant={deckType === 'cardio' ? 'default' : 
                        deckType === 'strength' ? 'destructive' :
                        deckType === 'flexibility' ? 'secondary' : 'outline'}
                className="mt-1"
              >
                {deckType.charAt(0).toUpperCase() + deckType.slice(1)} Specialist
              </Badge>
            </div>
          </div>

          {/* Score Display */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {aiScore}
              </div>
              <div className="text-sm text-gray-600">AI Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {playerScore}
              </div>
              <div className="text-sm text-gray-600">Your Score</div>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">AI Confidence</span>
              <span className={`font-semibold ${
                scoreAdvantage > 0 ? 'text-green-600' : 
                scoreAdvantage < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {scoreAdvantage > 2 ? 'High' : 
                 scoreAdvantage > 0 ? 'Good' :
                 scoreAdvantage < -2 ? 'Low' : 'Moderate'}
              </span>
            </div>
            <Progress 
              value={Math.max(0, Math.min(100, 50 + (scoreAdvantage * 10)))}
              className="h-2"
            />
          </div>

          {/* Turn Indicator */}
          {isAITurn && (
            <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
              <span className="text-blue-700 font-medium">AI is thinking...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Speech Bubble */}
      {speechBubbleVisible && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-white border-2 border-gray-300 rounded-lg px-4 py-2 shadow-lg relative animate-fade-in">
            <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
              {config.message}
            </p>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-300"></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Emotion trigger utilities
export const triggerEmotion = (
  emotion: EmotionType,
  setCurrentEmotion: (emotion: EmotionType) => void,
  duration: number = 2000
) => {
  setCurrentEmotion(emotion);
  setTimeout(() => setCurrentEmotion('neutral'), duration);
};

export const getEmotionForEvent = (
  event: 'player_good_exercise' | 'ai_good_exercise' | 'tie' | 'game_start',
  aiScore: number,
  playerScore: number
): EmotionType => {
  switch (event) {
    case 'player_good_exercise':
      return playerScore > aiScore ? 'frustrated' : 'surprised';
    case 'ai_good_exercise':
      return 'celebratory';
    case 'tie':
      return 'focused';
    case 'game_start':
      return 'confident';
    default:
      return 'neutral';
  }
};