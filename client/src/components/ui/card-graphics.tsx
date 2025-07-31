/**
 * CARD GRAPHICS COMPONENT
 * 
 * SVG-based card backgrounds and frames to replace missing PNG assets.
 * Provides themed visual elements for the card battle system.
 */

import React from 'react';

/**
 * CardGraphicsProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * CardGraphicsProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * CardGraphicsProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardGraphicsProps
 */
/**
 * CardGraphicsProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardGraphicsProps
 */
/**
 * CardGraphicsProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardGraphicsProps
 */
/**
 * CardGraphicsProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardGraphicsProps
/**
 * Handles cardgraphics functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 */
 * @interface CardGraphicsProps
 */
/**
 * CardGraphicsProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CardGraphicsProps
/**
 * Handles cardgraphics functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 */
 * @interface CardGraphicsProps
/**
 * Handles cardgraphics functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 */
interface CardGraphicsProps {
  type: 'frame' | 'back' | 'background';
  theme?: 'strength' | 'cardio' | 'flexibility' | 'core' | 'utility' | 'warmup';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CardGraphics({ type, theme = 'strength', size = 'md', className = '' }: CardGraphicsProps) {
  const sizeClasses = {
    sm: 'w-20 h-28',
    md: 'w-24 h-36',
    lg: 'w-32 h-48'
  };

  const getThemeColors = () => {
    switch (theme) {
      case 'strength':
        return {
          primary: '#1F2937',
          secondary: '#374151',
          accent: '#6B7280',
          highlight: '#9CA3AF'
        };
      case 'cardio':
        return {
          primary: '#DC2626',
          secondary: '#EF4444',
          accent: '#F87171',
          highlight: '#FCA5A5'
        };
      case 'flexibility':
        return {
          primary: '#7C3AED',
          secondary: '#8B5CF6',
          accent: '#A78BFA',
          highlight: '#C4B5FD'
        };
      case 'core':
        return {
          primary: '#D97706',
          secondary: '#F59E0B',
          accent: '#FBBF24',
          highlight: '#FDE047'
        };
      case 'utility':
        return {
          primary: '#2563EB',
          secondary: '#3B82F6',
          accent: '#60A5FA',
          highlight: '#93C5FD'
        };
      case 'warmup':
        return {
          primary: '#EA580C',
          secondary: '#F97316',
          accent: '#FB923C',
          highlight: '#FDBA74'
        };
      default:
        return {
          primary: '#6B7280',
          secondary: '#9CA3AF',
          accent: '#D1D5DB',
          highlight: '#F3F4F6'
        };
    }
  };

  const colors = getThemeColors();

  const renderCardFrame = () => (
    <svg viewBox="0 0 100 140" className={`${sizeClasses[size]} ${className}`}>
      {/* Outer frame */}
      <rect x="2" y="2" width="96" height="136" rx="8" fill={colors.primary} stroke={colors.accent} strokeWidth="1" />
      
      {/* Inner frame */}
      <rect x="6" y="6" width="88" height="128" rx="6" fill="none" stroke={colors.secondary} strokeWidth="1" />
      
      {/* Corner decorations */}
      <circle cx="15" cy="15" r="3" fill={colors.accent} />
      <circle cx="85" cy="15" r="3" fill={colors.accent} />
      <circle cx="15" cy="125" r="3" fill={colors.accent} />
      <circle cx="85" cy="125" r="3" fill={colors.accent} />
      
      {/* Top decoration */}
      <path d="M30 8 Q50 4 70 8" stroke={colors.highlight} strokeWidth="2" fill="none" />
      
      {/* Bottom decoration */}
      <path d="M30 132 Q50 136 70 132" stroke={colors.highlight} strokeWidth="2" fill="none" />
      
      {/* Side patterns */}
      <line x1="4" y1="30" x2="4" y2="110" stroke={colors.accent} strokeWidth="1" opacity="0.5" />
      <line x1="96" y1="30" x2="96" y2="110" stroke={colors.accent} strokeWidth="1" opacity="0.5" />
    </svg>
  );

  const renderCardBack = () => (
    <svg viewBox="0 0 100 140" className={`${sizeClasses[size]} ${className}`}>
      {/* Background */}
      <rect x="0" y="0" width="100" height="140" rx="8" fill={colors.primary} />
      
      {/* Pattern overlay */}
      <defs>
        <pattern id="cardPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="2" fill={colors.accent} opacity="0.3" />
        </pattern>
      </defs>
      <rect x="4" y="4" width="92" height="132" rx="6" fill="url(#cardPattern)" />
      
      {/* Central logo area */}
      <circle cx="50" cy="70" r="25" fill={colors.secondary} stroke={colors.accent} strokeWidth="2" />
      <circle cx="50" cy="70" r="20" fill="none" stroke={colors.highlight} strokeWidth="1" />
      
      {/* Otter silhouette */}
      <ellipse cx="50" cy="70" rx="12" ry="8" fill={colors.highlight} />
      <circle cx="47" cy="67" r="1" fill={colors.primary} />
      <circle cx="53" cy="67" r="1" fill={colors.primary} />
      
      {/* Corner flourishes */}
      <path d="M10 20 Q15 15 20 20 Q15 25 10 20" fill={colors.accent} opacity="0.7" />
      <path d="M80 20 Q85 15 90 20 Q85 25 80 20" fill={colors.accent} opacity="0.7" />
      <path d="M10 120 Q15 115 20 120 Q15 125 10 120" fill={colors.accent} opacity="0.7" />
      <path d="M80 120 Q85 115 90 120 Q85 125 80 120" fill={colors.accent} opacity="0.7" />
    </svg>
  );

  const renderCardBackground = () => (
    <svg viewBox="0 0 100 140" className={`${sizeClasses[size]} ${className}`}>
      {/* Gradient background */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.secondary} />
          <stop offset="50%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </linearGradient>
      </defs>
      
      <rect x="0" y="0" width="100" height="140" rx="8" fill="url(#bgGradient)" />
      
      {/* Subtle texture overlay */}
      <rect x="0" y="0" width="100" height="140" rx="8" fill={colors.accent} opacity="0.1" />
      
      {/* Content areas */}
      <rect x="8" y="8" width="84" height="20" rx="4" fill="rgba(255,255,255,0.9)" />
      <rect x="8" y="32" width="84" height="60" rx="4" fill="rgba(255,255,255,0.8)" />
      <rect x="8" y="96" width="84" height="36" rx="4" fill="rgba(255,255,255,0.9)" />
    </svg>
  );

  switch (type) {
    case 'frame':
      return renderCardFrame();
    case 'back':
      return renderCardBack();
    case 'background':
      return renderCardBackground();
    default:
      return renderCardFrame();
  }
}

export default CardGraphics;