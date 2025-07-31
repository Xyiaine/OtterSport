/**
 * OTTER-CHARACTER MODULE
 * 
 * This module provides functionality for otter-character.
 * All exports are designed to work seamlessly with the OtterSport application.
 * 
 * Human Developer Guide:
 * - Follow established patterns when modifying this file
 * - Maintain comprehensive test coverage for all functions
 * - Update documentation when adding new functionality
 */

/**
 * OtterCharacterProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * OtterCharacterProps interface defines the contract for implementation.
/**
 * OtterCharacterProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * OtterCharacterProps interface defines the contract for implementation.
 * 
/**
 * defines interface defines the contract for implementation.
 * 
/**
 * OtterCharacterProps interface defines the contract for implementation.
/**
 * OtterCharacterProps interface defines the contract for implementation.
/**
 * OtterCharacterProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface OtterCharacterProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface OtterCharacterProps
 */
 * 
/**
 * Handles that functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface OtterCharacterProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
/**
 * Handles ottercharacter functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await OtterCharacter(params);
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface OtterCharacterProps
 */
 * @interface OtterCharacterProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface OtterCharacterProps
 */
 * @interface OtterCharacterProps
 */
interface OtterCharacterProps {
/**
 * Handles ottercharacter functionality for the application
 * 
/**
 * Handles ottercharacter functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await OtterCharacter(params);
 */
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await OtterCharacter(params);
 */
  mood?: 'happy' | 'excited' | 'encouraging' | 'proud' | 'cheerful';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
  showMessage?: boolean;
  message?: string;
}

export default function OtterCharacter({ 
  mood = 'happy', 
  size = 'md', 
  animated = false,
  className = '',
  showMessage = false,
  message
}: OtterCharacterProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20', 
    lg: 'w-32 h-32'
  };

  // Create SVG-based otter character to eliminate image loading issues
  const getOtterSVG = () => {
    const colors = {
      body: '#8B4513',
      belly: '#DEB887', 
      eyes: '#000000',
      nose: '#654321',
      whiskers: '#333333',
      accent: mood === 'excited' ? '#FFD700' : 
              mood === 'proud' ? '#9370DB' : 
              mood === 'encouraging' ? '#32CD32' : '#20B2AA'
    };

    const expressions = {
      happy: { eyeShape: 'normal', mouthCurve: 3, sparkles: false },
      encouraging: { eyeShape: 'determined', mouthCurve: 2, sparkles: false },
      proud: { eyeShape: 'closed', mouthCurve: 4, sparkles: true },
      excited: { eyeShape: 'wide', mouthCurve: 5, sparkles: true },
      cheerful: { eyeShape: 'normal', mouthCurve: 4, sparkles: false }
    };

    const expr = expressions[mood];

    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Background circle with mood color */}
        <circle cx="50" cy="50" r="48" fill={colors.accent} opacity="0.1" />
        
        {/* Otter body */}
        <ellipse cx="50" cy="55" rx="32" ry="25" fill={colors.body} />
        
        {/* Belly/chest area */}
        <ellipse cx="50" cy="58" rx="22" ry="18" fill={colors.belly} />
        
        {/* Head */}
        <ellipse cx="50" cy="40" rx="28" ry="24" fill={colors.body} />
        
        {/* Face area */}
        <ellipse cx="50" cy="43" rx="20" ry="17" fill={colors.belly} />
        
        {/* Ears */}
        <ellipse cx="38" cy="28" rx="6" ry="10" fill={colors.body} />
        <ellipse cx="62" cy="28" rx="6" ry="10" fill={colors.body} />
        <ellipse cx="38" cy="30" rx="3" ry="6" fill={colors.belly} />
        <ellipse cx="62" cy="30" rx="3" ry="6" fill={colors.belly} />
        
        {/* Eyes based on mood */}
        {expr.eyeShape === 'normal' && (
          <>
            <circle cx="43" cy="38" r="3" fill={colors.eyes} />
            <circle cx="57" cy="38" r="3" fill={colors.eyes} />
            <circle cx="44" cy="37" r="1" fill="white" />
            <circle cx="58" cy="37" r="1" fill="white" />
          </>
        )}
        
        {expr.eyeShape === 'determined' && (
          <>
            <path d="M 40 36 L 46 40 L 40 40 Z" fill={colors.eyes} />
            <path d="M 60 36 L 54 40 L 60 40 Z" fill={colors.eyes} />
          </>
        )}
        
        {expr.eyeShape === 'closed' && (
          <>
            <path d="M 40 38 Q 43 36 46 38" stroke={colors.eyes} strokeWidth="2" fill="none" />
            <path d="M 54 38 Q 57 36 60 38" stroke={colors.eyes} strokeWidth="2" fill="none" />
          </>
        )}
        
        {expr.eyeShape === 'wide' && (
          <>
            <circle cx="43" cy="38" r="4" fill="white" />
            <circle cx="57" cy="38" r="4" fill="white" />
            <circle cx="43" cy="38" r="2.5" fill={colors.eyes} />
            <circle cx="57" cy="38" r="2.5" fill={colors.eyes} />
            <circle cx="44" cy="37" r="1" fill="white" />
            <circle cx="58" cy="37" r="1" fill="white" />
          </>
        )}
        
        {/* Nose */}
        <ellipse cx="50" cy="45" rx="2" ry="1.5" fill={colors.nose} />
        
        {/* Mouth with mood-based curve */}
        <path 
          d={`M 46 ${48} Q 50 ${48 + expr.mouthCurve} 54 ${48}`} 
          stroke={colors.eyes} 
          strokeWidth="1.5" 
          fill="none" 
        />
        
        {/* Whiskers */}
        <path d="M 28 42 L 38 44" stroke={colors.whiskers} strokeWidth="1" />
        <path d="M 28 45 L 38 46" stroke={colors.whiskers} strokeWidth="1" />
        <path d="M 28 48 L 38 48" stroke={colors.whiskers} strokeWidth="1" />
        <path d="M 62 44 L 72 42" stroke={colors.whiskers} strokeWidth="1" />
        <path d="M 62 46 L 72 45" stroke={colors.whiskers} strokeWidth="1" />
        <path d="M 62 48 L 72 48" stroke={colors.whiskers} strokeWidth="1" />
        
        {/* Sparkles for proud/excited moods */}
        {expr.sparkles && (
          <>
            <path d="M 25 25 L 27 30 L 32 28 L 27 33 L 25 25" fill={colors.accent} opacity="0.8" />
            <path d="M 75 30 L 77 35 L 82 33 L 77 38 L 75 30" fill={colors.accent} opacity="0.8" />
            <circle cx="20" cy="60" r="2" fill={colors.accent} opacity="0.6" />
            <circle cx="80" cy="55" r="1.5" fill={colors.accent} opacity="0.6" />
          </>
        )}
        
        {/* Mood indicator */}
        <circle cx="75" cy="25" r="8" fill={colors.accent} opacity="0.9" />
        <text x="75" y="30" textAnchor="middle" className="text-xs font-bold" fill="white">
          {mood === 'happy' ? '😊' : 
           mood === 'excited' ? '🎉' : 
           mood === 'proud' ? '👑' : 
           mood === 'encouraging' ? '💪' : '😄'}
        </text>
      </svg>
    );
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className={`
        w-full h-full
        ${animated ? 'animate-bounce' : ''}
        transition-all duration-300 hover:scale-105
      `}>
        {getOtterSVG()}
      </div>
      
      {/* Speech bubble with message */}
      {showMessage && message && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-3 py-2 max-w-xs">
          <div className="text-sm font-medium text-gray-800">{message}</div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        </div>
      )}
    </div>
  );
}
