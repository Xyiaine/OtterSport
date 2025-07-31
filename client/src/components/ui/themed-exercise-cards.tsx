/**
 * THEMED EXERCISE CARDS COMPONENT
 * 
 * Exercise cards with visual themes based on focus area:
 * - Cardio: Energy and movement focused (red/orange theme)
 * - Strength: Power and intensity focused (dark blue/gray theme)  
 * - Flexibility: Flow and grace focused (purple/teal theme)
 * - Core: Stability and balance focused (green/yellow theme)
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Zap, 
  Dumbbell, 
  Waves, 
  Target,
  Timer,
  Flame,
  Activity
} from 'lucide-react';

export type DeckTheme = 'cardio' | 'strength' | 'flexibility' | 'core';

/**
 * Exercise interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Exercise interface defines the contract for implementation.
/**
 * Exercise interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Exercise interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Exercise
 */
 * @interface Exercise
/**
 * ThemedExerciseCardProps interface defines the contract for implementation.
/**
 * defines interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
/**
 * ThemedExerciseCardProps interface defines the contract for implementation.
 * 
/**
 * Exercise interface defines the contract for implementation.
/**
 * Exercise interface defines the contract for implementation.
/**
 * Exercise interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Exercise
 */
 * 
/**
 * ThemedExerciseCardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ThemedExerciseCardProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
/**
 * ThemedExerciseCardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ThemedExerciseCardProps
 */
 * 
 * @interface Exercise
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Exercise
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ThemedExerciseCardProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ThemedExerciseCardProps
 */
 */
 * 
/**
 * ThemedExerciseCardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ThemedExerciseCardProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
/**
 * ThemedExerciseCardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ThemedExerciseCardProps
 */
 * 
 * @interface Exercise
 */
 * @interface Exercise
 */
export interface Exercise {
  id: string;
  name: string;
/**
 * ThemedExerciseCardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ThemedExerciseCardProps
 */
  reps?: number;
  duration?: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  points: number;
  category: string;
  description: string;
}

export interface ThemedExerciseCardProps {
  exercise: Exercise;
  theme: DeckTheme;
  isActive?: boolean;
  isCompleted?: boolean;
  showProgress?: boolean;
  progress?: number;
  onSelect?: (exercise: Exercise) => void;
  onComplete?: (exercise: Exercise) => void;
/**
 * Handles themedexercisecard functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await ThemedExerciseCard(params);
 */
  showDetails?: boolean;
}

const themeConfigs = {
  cardio: {
    name: 'Cardio Blast',
    primaryColor: 'from-red-500 to-orange-500',
    backgroundColor: 'bg-red-50 dark:bg-red-950',
    borderColor: 'border-red-200 dark:border-red-800',
    textColor: 'text-red-700 dark:text-red-300',
    icon: Heart,
    accentColor: 'bg-red-500',
    badgeVariant: 'destructive' as const,
    pattern: 'bg-gradient-to-br from-red-100 via-orange-50 to-red-100'
  },
  strength: {
    name: 'Strength Training',
    primaryColor: 'from-slate-600 to-slate-800',
    backgroundColor: 'bg-slate-50 dark:bg-slate-950',
    borderColor: 'border-slate-300 dark:border-slate-700',
    textColor: 'text-slate-700 dark:text-slate-300',
    icon: Dumbbell,
    accentColor: 'bg-slate-600',
    badgeVariant: 'secondary' as const,
    pattern: 'bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100'
  },
  flexibility: {
    name: 'Flexibility Flow',
    primaryColor: 'from-purple-500 to-teal-500',
/**
 * Handles themedexercisecard functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await ThemedExerciseCard(params);
 */
    backgroundColor: 'bg-purple-50 dark:bg-purple-950',
    borderColor: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-300',
    icon: Waves,
    accentColor: 'bg-purple-500',
/**
 * Handles themedexercisecard functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await ThemedExerciseCard(params);
 */
    badgeVariant: 'outline' as const,
    pattern: 'bg-gradient-to-br from-purple-100 via-teal-50 to-purple-100'
  },
  core: {
    name: 'Core Stability',
    primaryColor: 'from-green-500 to-yellow-500',
    backgroundColor: 'bg-green-50 dark:bg-green-950',
    borderColor: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-300',
    icon: Target,
    accentColor: 'bg-green-500',
    badgeVariant: 'default' as const,
    pattern: 'bg-gradient-to-br from-green-100 via-yellow-50 to-green-100'
  }
};

export default function ThemedExerciseCard({
  exercise,
  theme,
  isActive = false,
  isCompleted = false,
  showProgress = false,
  progress = 0,
  onSelect,
  onComplete,
  showDetails = true
}: ThemedExerciseCardProps) {
  const config = themeConfigs[theme];
  const IconComponent = config.icon;

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < difficulty ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  const handleCardClick = () => {
    if (onSelect && !isCompleted) {
      onSelect(exercise);
    }
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onComplete) {
      onComplete(exercise);
    }
  };

  return (
    <Card
      className={`
        relative overflow-hidden transition-all duration-300 cursor-pointer
        ${config.backgroundColor} ${config.borderColor}
        ${isActive ? 'ring-2 ring-blue-500 shadow-lg scale-105' : ''}
        ${isCompleted ? 'opacity-75 ring-2 ring-green-500' : ''}
        hover:shadow-lg hover:scale-102 transform
      `}
      onClick={handleCardClick}
    >
      {/* Themed Background Pattern */}
      <div className={`absolute inset-0 ${config.pattern} opacity-30`} />
      
      {/* Accent Border */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.primaryColor}`} />
      
      <CardHeader className="relative pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${config.accentColor} text-white`}>
              <IconComponent className="h-4 w-4" />
            </div>
            <div>
              <h3 className={`font-bold text-sm ${config.textColor}`}>
                {exercise.name}
              </h3>
              <Badge variant={config.badgeVariant} size="sm">
                {exercise.category}
              </Badge>
            </div>
          </div>
          
          {/* Points Display */}
          <div className={`text-right`}>
            <div className={`text-lg font-bold ${config.textColor}`}>
              {exercise.points}
            </div>
            <div className="text-xs text-gray-500">points</div>
          </div>
        </div>

        {/* Difficulty Stars */}
        <div className="flex items-center gap-1 mt-2">
          {getDifficultyStars(exercise.difficulty)}
          <span className="text-xs text-gray-500 ml-1">
            Difficulty
          </span>
        </div>
      </CardHeader>

      <CardContent className="relative pt-0">
        {showDetails && (
          <>
            {/* Exercise Details */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              {exercise.reps && (
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {exercise.reps} reps
                  </span>
                </div>
              )}
              {exercise.duration && (
                <div className="flex items-center gap-1">
                  <Timer className="h-3 w-3 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {exercise.duration}s
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 mb-3">
              {exercise.description}
            </p>
          </>
        )}

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">Progress</span>
              <span className={config.textColor}>{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isCompleted && (
            <>
              {!isActive ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
/**
 * Handles to functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
                  onClick={handleCardClick}
                >
                  Select Exercise
                </Button>
              ) : (
                <Button
                  size="sm"
                  className={`flex-1 bg-gradient-to-r ${config.primaryColor} text-white`}
                  onClick={handleComplete}
                >
                  <Flame className="h-3 w-3 mr-1" />
                  Complete
                </Button>
              )}
            </>
          )}
          
          {isCompleted && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-green-600 border-green-600"
              disabled
            >
              ✅ Completed
            </Button>
          )}
        </div>
      </CardContent>

      {/* Theme-specific Visual Elements */}
      {theme === 'cardio' && (
        <div className="absolute top-2 right-2">
          <div className="animate-pulse">
/**
 * Handles to functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
            <Heart className="h-4 w-4 text-red-400 fill-current" />
          </div>
        </div>
      )}
      
      {theme === 'strength' && (
        <div className="absolute top-2 right-2">
          <Dumbbell className="h-4 w-4 text-slate-400" />
        </div>
      )}
/**
 * Handles to functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
      
      {theme === 'flexibility' && (
        <div className="absolute top-2 right-2">
          <div className="animate-bounce">
            <Waves className="h-4 w-4 text-purple-400" />
          </div>
        </div>
      )}
      
      {theme === 'core' && (
        <div className="absolute top-2 right-2">
          <Target className="h-4 w-4 text-green-400" />
        </div>
      )}

      {/* Completion Overlay */}
      {isCompleted && (
        <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
          <div className="bg-green-500 text-white rounded-full p-2">
            <Zap className="h-6 w-6" />
          </div>
        </div>
      )}
    </Card>
  );
}

// Utility function to get theme from deck name or category
export const getDeckTheme = (category: string | undefined): DeckTheme => {
  if (!category) return 'cardio';
  
  const normalized = category.toLowerCase();
  
  if (normalized.includes('cardio') || normalized.includes('aerobic')) {
    return 'cardio';
  } else if (normalized.includes('strength') || normalized.includes('muscle') || normalized.includes('power')) {
    return 'strength';
  } else if (normalized.includes('flexibility') || normalized.includes('stretch') || normalized.includes('yoga')) {
    return 'flexibility';
  } else if (normalized.includes('core') || normalized.includes('abs') || normalized.includes('stability')) {
    return 'core';
  }
  
  return 'cardio'; // default
};