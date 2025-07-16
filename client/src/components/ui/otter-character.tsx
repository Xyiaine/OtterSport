interface OtterCharacterProps {
  mood?: 'happy' | 'excited' | 'encouraging' | 'proud' | 'cheerful';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export default function OtterCharacter({ 
  mood = 'happy', 
  size = 'md', 
  animated = false,
  className = '' 
}: OtterCharacterProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-32 h-32'
  };

  const getOtterColor = () => {
    switch (mood) {
      case 'excited': return 'from-yellow-400 to-orange-400';
      case 'proud': return 'from-purple-400 to-pink-400';
      case 'encouraging': return 'from-green-400 to-teal-400';
      default: return 'from-otter-teal to-teal-500';
    }
  };

  const getExpression = () => {
    switch (mood) {
      case 'excited': return '🎉';
      case 'proud': return '👑';
      case 'encouraging': return '💪';
      case 'cheerful': return '👋';
      default: return '😊';
    }
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className={`
        w-full h-full rounded-full 
        bg-gradient-to-br ${getOtterColor()}
        flex items-center justify-center
        shadow-lg
        ${animated ? 'animate-bounce-gentle' : ''}
        transition-all duration-300 hover:scale-110
      `}>
        {/* Simple otter representation using emoji/icon */}
        <div className="text-white text-2xl font-bold">
          {size === 'sm' ? '🦦' : getExpression()}
        </div>
      </div>
    </div>
  );
}
