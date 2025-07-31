import { Card, CardContent } from "@/components/ui/card";

/**
 * Card Placeholder Component
 * 
 * Displays placeholder cards for game artist implementation.
 * These will be replaced with actual artwork by the human game artist.
 */

interface CardPlaceholderProps {
  type: 'exercise' | 'deck' | 'hand' | 'played';
  category?: 'cardio' | 'strength' | 'flexibility' | 'core' | 'warmup' | 'utility';
  size?: 'small' | 'medium' | 'large';
  label?: string;
  onClick?: () => void;
  className?: string;
}

export function CardPlaceholder({ 
  type, 
  category = 'cardio', 
  size = 'medium', 
  label,
  onClick,
  className = ''
}: CardPlaceholderProps) {
  const sizeClasses = {
    small: 'w-16 h-24',
    medium: 'w-24 h-36',
    large: 'w-32 h-48'
  };

  const categoryColors = {
    cardio: 'bg-red-100 border-red-300',
    strength: 'bg-blue-100 border-blue-300',
    flexibility: 'bg-purple-100 border-purple-300',
    core: 'bg-green-100 border-green-300',
    warmup: 'bg-orange-100 border-orange-300',
    utility: 'bg-gray-100 border-gray-300'
  };

  return (
    <Card 
      className={`${sizeClasses[size]} ${categoryColors[category]} cursor-pointer hover:scale-105 transition-transform border-2 border-dashed ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-2 h-full flex flex-col items-center justify-center text-center">
        <div className="text-xs text-gray-600 mb-1">{type.toUpperCase()}</div>
        {label && (
          <div className="text-xs font-medium text-gray-800 break-words">{label}</div>
        )}
        <div className="text-xs text-gray-500 mt-1">
          [{category}]
        </div>
        <div className="text-xs text-gray-400 mt-auto">
          🎨 Artist Asset
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Deck Placeholder Component
 * 
 * Represents a collection of cards as a single placeholder unit
 */
interface DeckPlaceholderProps {
  deckName: string;
  cardCount: number;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
}

export function DeckPlaceholder({ 
  deckName, 
  cardCount, 
  size = 'medium', 
  onClick,
  className = ''
}: DeckPlaceholderProps) {
  const sizeClasses = {
    small: 'w-20 h-28',
    medium: 'w-32 h-44',
    large: 'w-40 h-56'
  };

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      {/* Stack effect with multiple cards */}
      <Card className={`${sizeClasses[size]} absolute top-1 left-1 bg-gray-200 border-2 border-dashed border-gray-400`} />
      <Card className={`${sizeClasses[size]} absolute top-0.5 left-0.5 bg-gray-300 border-2 border-dashed border-gray-500`} />
      
      {/* Main card */}
      <Card className={`${sizeClasses[size]} bg-white border-2 border-dashed border-gray-600 cursor-pointer hover:scale-105 transition-transform relative z-10`}>
        <CardContent className="p-3 h-full flex flex-col items-center justify-center text-center">
          <div className="text-sm font-bold text-gray-700 mb-2">DECK</div>
          <div className="text-xs font-medium text-gray-800 break-words mb-2">{deckName}</div>
          <div className="text-xs text-gray-600 mb-2">{cardCount} cards</div>
          <div className="text-xs text-gray-400 mt-auto">🎨 Artist Asset</div>
        </CardContent>
      </Card>
    </div>
  );
}