import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Clock, 
  Repeat, 
  Target, 
  Heart,
  Dumbbell,
  Waves,
  Activity,
  Thermometer,
  Settings,
  Timer
} from "lucide-react";

interface Exercise {
  id: number;
  name: string;
  description: string;
  category: string;
  baseReps?: number;
  baseDuration?: number;
  cardType?: string;
}

interface GameCard {
  id: string;
  exercise: Exercise;
  points: number;
  difficulty: number;
  type: 'cardio' | 'strength' | 'flexibility' | 'mixed' | 'warmup' | 'utility';
  combo?: string;
  special?: 'double' | 'block' | 'steal' | 'bonus';
  cardType?: 'exercise' | 'warmup' | 'utility' | 'power';
}

interface ExerciseCardDisplayProps {
  card: GameCard | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  userDifficulty?: number;
}

const typeIcons = {
  cardio: Heart,
  strength: Dumbbell,
  flexibility: Waves,
  mixed: Activity,
  warmup: Thermometer,
  utility: Settings
};

const typeColors = {
  cardio: 'bg-red-100 text-red-800 border-red-200',
  strength: 'bg-blue-100 text-blue-800 border-blue-200',
  flexibility: 'bg-purple-100 text-purple-800 border-purple-200',
  mixed: 'bg-gray-100 text-gray-800 border-gray-200',
  warmup: 'bg-orange-100 text-orange-800 border-orange-200',
  utility: 'bg-teal-100 text-teal-800 border-teal-200'
};

const calculateExerciseParams = (exercise: Exercise, userDifficulty: number = 5): { reps?: number; duration?: number } => {
  // Base multiplier based on user difficulty (1-10 scale)
  const difficultyMultiplier = userDifficulty / 5; // Scale to 0.2-2.0 range
  
  if (exercise.baseReps) {
    // For rep-based exercises (strength, flexibility)
    const baseReps = exercise.baseReps || 10;
    return {
      reps: Math.max(3, Math.round(baseReps * difficultyMultiplier))
    };
  } else {
    // For time-based exercises (cardio, warmup)
    const baseDuration = exercise.baseDuration || 30;
    return {
      duration: Math.max(10, Math.round(baseDuration * difficultyMultiplier))
    };
  }
};

export default function ExerciseCardDisplay({ 
  card, 
  isOpen, 
  onClose, 
  onComplete,
  userDifficulty = 5 
}: ExerciseCardDisplayProps) {
  if (!card) return null;

  const TypeIcon = typeIcons[card.type];
  const typeColorClass = typeColors[card.type];
  const exerciseParams = calculateExerciseParams(card.exercise, userDifficulty);
  const isUtility = card.cardType === 'utility';
  const isWarmup = card.cardType === 'warmup';

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isUtility ? "Utility Card" : isWarmup ? "Warm-up Exercise" : "Exercise Time!"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isUtility 
              ? "Special ability activated" 
              : "Complete this exercise to earn points"}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Large Exercise Card */}
          <Card className={`w-full border-2 ${isUtility ? 'border-blue-400' : isWarmup ? 'border-orange-400' : 'border-teal-400'}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className={`px-3 py-1 ${typeColorClass}`}>
                  <TypeIcon className="w-4 h-4 mr-1" />
                  {card.type}
                </Badge>
                <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                  {isUtility ? 'UTIL' : isWarmup ? 'PREP' : `${card.points} pts`}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Exercise Name */}
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {card.exercise.name}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {card.exercise.description}
                </p>
              </div>

              {/* Exercise Parameters - Only for non-utility cards */}
              {!isUtility && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-teal-600" />
                    Your Target:
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {exerciseParams.reps && (
                      <div className="flex items-center justify-between bg-white rounded-md p-3">
                        <div className="flex items-center">
                          <Repeat className="w-5 h-5 mr-2 text-blue-600" />
                          <span className="font-medium">Repetitions</span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">
                          {exerciseParams.reps}
                        </span>
                      </div>
                    )}
                    
                    {exerciseParams.duration && (
                      <div className="flex items-center justify-between bg-white rounded-md p-3">
                        <div className="flex items-center">
                          <Timer className="w-5 h-5 mr-2 text-green-600" />
                          <span className="font-medium">Duration</span>
                        </div>
                        <span className="text-xl font-bold text-green-600">
                          {exerciseParams.duration}s
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Special Effects for Utility Cards */}
              {isUtility && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Special Effect:</h3>
                  <p className="text-blue-700">{card.exercise.description}</p>
                </div>
              )}

              {/* Warmup Benefits */}
              {isWarmup && (
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-800 mb-2">Preparation Benefit:</h3>
                  <p className="text-orange-700">
                    This warm-up prepares your body for upcoming exercises and helps prevent injury.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isUtility && onComplete && (
              <Button 
                onClick={onComplete} 
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                <Clock className="w-4 h-4 mr-2" />
                Complete Exercise
              </Button>
            )}
            
            <Button 
              variant={isUtility ? "default" : "outline"} 
              onClick={onClose}
              className={isUtility ? "flex-1" : ""}
            >
              {isUtility ? "Continue Game" : "Close"}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}