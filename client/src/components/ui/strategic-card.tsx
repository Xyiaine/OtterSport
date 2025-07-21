import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Target, 
  Star,
  Heart,
  Dumbbell,
  Waves,
  Activity,
  Thermometer,
  Settings,
  Shuffle,
  Plus,
  Battery,
  FastForward,
  Repeat
} from "lucide-react";

interface GameCard {
  id: string;
  exercise: {
    id: number;
    name: string;
    description: string;
    category: string;
    icon?: string;
  };
  points: number;
  difficulty: number;
  type: 'cardio' | 'strength' | 'flexibility' | 'mixed' | 'warmup' | 'utility';
  combo?: string;
  special?: 'double' | 'block' | 'steal' | 'bonus';
  cardType?: 'exercise' | 'warmup' | 'utility' | 'power';
  utilityEffect?: string;
}

interface StrategicCardProps {
  card: GameCard;
  isSelected?: boolean;
  canPlay?: boolean;
  onSelect?: () => void;
  onPlay?: () => void;
  comboCount?: number;
  showComboHint?: boolean;
}

const specialIcons = {
  double: Zap,
  block: Shield,
  steal: Target,
  bonus: Star
};

const typeIcons = {
  cardio: Heart,
  strength: Dumbbell,
  flexibility: Waves,
  mixed: Activity,
  warmup: Thermometer,
  utility: Settings
};

const utilityIcons = {
  redraw_hand: Repeat,
  shuffle_deck: Shuffle,
  draw_extra: Plus,
  double_next: Battery,
  skip_draw: FastForward
};

const comboColors = {
  energy: 'bg-red-100 text-red-700 border-red-200',
  power: 'bg-blue-100 text-blue-700 border-blue-200', 
  flow: 'bg-purple-100 text-purple-700 border-purple-200',
  stability: 'bg-green-100 text-green-700 border-green-200',
  basic: 'bg-gray-100 text-gray-700 border-gray-200'
};

export default function StrategicCard({ 
  card, 
  isSelected = false, 
  canPlay = true,
  onSelect,
  onPlay,
  comboCount = 0,
  showComboHint = false
}: StrategicCardProps) {
  const SpecialIcon = card.special ? specialIcons[card.special] : null;
  const TypeIcon = typeIcons[card.type];
  const UtilityIcon = card.utilityEffect ? utilityIcons[card.utilityEffect as keyof typeof utilityIcons] : null;
  const comboColorClass = comboColors[card.combo as keyof typeof comboColors] || comboColors.basic;
  
  const isUtility = card.cardType === 'utility';
  const isWarmup = card.cardType === 'warmup';
  
  const cardBorderClass = isUtility 
    ? 'border-2 border-blue-400' 
    : isWarmup 
      ? 'border-2 border-orange-400'
      : card.special 
        ? 'border-2 border-purple-400' 
        : '';

  return (
    <motion.div
      whileHover={{ scale: canPlay ? 1.05 : 1 }}
      whileTap={{ scale: canPlay ? 0.95 : 1 }}
      animate={{
        y: isSelected ? -10 : 0,
        boxShadow: isSelected ? "0 10px 25px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.1)"
      }}
      className={`cursor-pointer transition-all duration-200 ${!canPlay && 'opacity-50'}`}
      onClick={onSelect}
    >
      <Card className={`relative w-32 h-44 ${isSelected ? 'ring-2 ring-blue-500' : ''} ${cardBorderClass}`}>
        {/* Utility Effect Indicator */}
        {isUtility && UtilityIcon && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge className="bg-blue-500 text-white p-1">
              <UtilityIcon size={12} />
            </Badge>
          </div>
        )}
        
        {/* Warmup Indicator */}
        {isWarmup && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge className="bg-orange-500 text-white p-1">
              <Thermometer size={12} />
            </Badge>
          </div>
        )}

        {/* Special Effect Indicator */}
        {card.special && !isUtility && !isWarmup && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge className="bg-purple-500 text-white p-1">
              {SpecialIcon && <SpecialIcon size={12} />}
            </Badge>
          </div>
        )}

        {/* Combo Indicator */}
        {showComboHint && comboCount > 1 && (
          <div className="absolute -top-2 -left-2 z-10">
            <Badge className="bg-orange-500 text-white text-xs">
              🔥{comboCount}
            </Badge>
          </div>
        )}

        <CardHeader className="p-3 pb-1">
          <div className="flex items-center justify-between">
            {/* Points or Utility Label */}
            <Badge variant="outline" className={`text-lg font-bold ${isUtility ? 'bg-blue-50 text-blue-700' : isWarmup ? 'bg-orange-50 text-orange-700' : ''}`}>
              {isUtility ? 'UTIL' : isWarmup ? 'PREP' : card.points}
            </Badge>
            
            {/* Type Icon */}
            <div className="text-gray-500">
              <TypeIcon size={16} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 pt-1">
          <div className="space-y-2">
            {/* Exercise Name */}
            <h4 className="text-xs font-semibold text-center leading-tight">
              {card.exercise.name}
            </h4>

            {/* Difficulty Stars */}
            <div className="flex justify-center">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`text-xs ${i < card.difficulty ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Combo Type */}
            {card.combo && (
              <Badge 
                variant="outline" 
                className={`text-xs w-full justify-center ${comboColorClass}`}
              >
                {card.combo}
              </Badge>
            )}

            {/* Special Ability Description */}
            {card.special && (
              <div className="text-xs text-purple-600 text-center font-medium">
                {card.special === 'double' && 'Double Pts'}
                {card.special === 'block' && 'Shield'}
                {card.special === 'steal' && 'Steal Pts'}
                {card.special === 'bonus' && '+2 Bonus'}
              </div>
            )}
          </div>

          {/* Play Button */}
          {isSelected && canPlay && onPlay && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2"
            >
              <Button 
                size="sm" 
                className="w-full text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay();
                }}
              >
                Play
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}