/**
 * Otter Character Component - Minimal Implementation
 * Simple otter character display for the fitness app
 */

import React from 'react';

interface OtterCharacterProps {
  mood?: 'happy' | 'encouraging' | 'proud' | 'excited' | 'cheerful';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const OtterCharacter: React.FC<OtterCharacterProps> = ({
  mood = 'happy',
  size = 'md',
  animated = false,
  className = '',
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-16 h-16';
      case 'lg': return 'w-24 h-24';
      default: return 'w-20 h-20';
    }
  };

  const getMoodEmoji = () => {
    switch (mood) {
      case 'encouraging': return '🦦💪';
      case 'proud': return '🦦🏆';
      case 'excited': return '🦦✨';
      case 'cheerful': return '🦦😊';
      default: return '🦦';
    }
  };

  return (
    <div 
      className={`${getSizeClasses()} ${className} flex items-center justify-center bg-gradient-to-br from-teal-100 to-teal-200 rounded-full border-4 border-teal-300 ${
        animated ? 'animate-bounce' : ''
      }`}
    >
      <div className="text-3xl">
        {getMoodEmoji()}
      </div>
    </div>
  );
};

export default OtterCharacter;