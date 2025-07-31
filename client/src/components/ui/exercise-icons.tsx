/**
 * EXERCISE ICONS COMPONENT
 * 
 * SVG-based exercise icons to replace missing PNG assets.
 * Provides consistent, scalable icons for all exercise types.
 */

import React from 'react';

interface ExerciseIconProps {
  type: 'strength' | 'cardio' | 'flexibility' | 'core' | 'warmup' | 'utility';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  completed?: boolean;
}

export function ExerciseIcon({ type, size = 'md', className = '', completed = false }: ExerciseIconProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const getIconSVG = () => {
    const baseProps = {
      viewBox: "0 0 64 64",
      className: `${sizeClasses[size]} ${className}`,
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2"
    };

    switch (type) {
      case 'strength':
        return (
          <svg {...baseProps}>
            {/* Dumbbell icon */}
            <circle cx="16" cy="32" r="8" fill={completed ? "#10B981" : "#6B7280"} />
            <circle cx="48" cy="32" r="8" fill={completed ? "#10B981" : "#6B7280"} />
            <rect x="20" y="28" width="24" height="8" rx="2" fill={completed ? "#10B981" : "#6B7280"} />
            <rect x="12" y="24" width="8" height="16" rx="2" fill={completed ? "#059669" : "#4B5563"} />
            <rect x="44" y="24" width="8" height="16" rx="2" fill={completed ? "#059669" : "#4B5563"} />
          </svg>
        );
      
      case 'cardio':
        return (
          <svg {...baseProps}>
            {/* Heart with pulse icon */}
            <path 
              d="M32 54c-8-8-20-16-20-28 0-8 6-14 14-14 4 0 8 2 10 6 2-4 6-6 10-6 8 0 14 6 14 14 0 12-12 20-20 28" 
              fill={completed ? "#EF4444" : "#6B7280"}
              stroke={completed ? "#DC2626" : "#4B5563"}
            />
            {/* Pulse line */}
            <path 
              d="M8 32 L16 32 L20 24 L24 40 L28 16 L32 48 L36 20 L40 36 L44 28 L48 32 L56 32" 
              stroke={completed ? "#DC2626" : "#4B5563"}
              strokeWidth="2"
              fill="none"
            />
          </svg>
        );
      
      case 'flexibility':
        return (
          <svg {...baseProps}>
            {/* Yoga pose figure */}
            <circle cx="32" cy="16" r="6" fill={completed ? "#8B5CF6" : "#6B7280"} />
            <path 
              d="M32 22 L32 40 M20 30 L44 30 M26 44 L32 40 L38 44" 
              stroke={completed ? "#7C3AED" : "#4B5563"}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Meditation lines */}
            <path d="M16 12 Q20 8 24 12" stroke={completed ? "#A78BFA" : "#9CA3AF"} strokeWidth="1" />
            <path d="M40 12 Q44 8 48 12" stroke={completed ? "#A78BFA" : "#9CA3AF"} strokeWidth="1" />
          </svg>
        );
      
      case 'core':
        return (
          <svg {...baseProps}>
            {/* Abs/core icon */}
            <ellipse cx="32" cy="32" rx="20" ry="24" fill={completed ? "#F59E0B" : "#6B7280"} stroke={completed ? "#D97706" : "#4B5563"} />
            {/* Core muscle lines */}
            <line x1="24" y1="20" x2="24" y2="44" stroke={completed ? "#92400E" : "#374151"} strokeWidth="2" />
            <line x1="32" y1="20" x2="32" y2="44" stroke={completed ? "#92400E" : "#374151"} strokeWidth="2" />
            <line x1="40" y1="20" x2="40" y2="44" stroke={completed ? "#92400E" : "#374151"} strokeWidth="2" />
            <line x1="20" y1="28" x2="44" y2="28" stroke={completed ? "#92400E" : "#374151"} strokeWidth="1" />
            <line x1="20" y1="36" x2="44" y2="36" stroke={completed ? "#92400E" : "#374151"} strokeWidth="1" />
          </svg>
        );
      
      case 'warmup':
        return (
          <svg {...baseProps}>
            {/* Warm-up figure with movement lines */}
            <circle cx="32" cy="20" r="6" fill={completed ? "#F97316" : "#6B7280"} />
            <path 
              d="M32 26 L32 45 M24 35 L40 35" 
              stroke={completed ? "#EA580C" : "#4B5563"}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Movement/energy lines */}
            <path d="M16 24 L20 28 M48 24 L44 28" stroke={completed ? "#FB923C" : "#9CA3AF"} strokeWidth="2" />
            <path d="M16 32 L20 36 M48 32 L44 36" stroke={completed ? "#FB923C" : "#9CA3AF"} strokeWidth="2" />
            <path d="M16 40 L20 44 M48 40 L44 44" stroke={completed ? "#FB923C" : "#9CA3AF"} strokeWidth="2" />
          </svg>
        );
      
      case 'utility':
        return (
          <svg {...baseProps}>
            {/* Utility/tool icon */}
            <rect x="20" y="12" width="24" height="16" rx="4" fill={completed ? "#3B82F6" : "#6B7280"} stroke={completed ? "#2563EB" : "#4B5563"} />
            <circle cx="28" cy="20" r="2" fill={completed ? "#1D4ED8" : "#374151"} />
            <circle cx="36" cy="20" r="2" fill={completed ? "#1D4ED8" : "#374151"} />
            {/* Tool elements */}
            <rect x="24" y="32" width="4" height="20" rx="2" fill={completed ? "#3B82F6" : "#6B7280"} />
            <rect x="36" y="32" width="4" height="20" rx="2" fill={completed ? "#3B82F6" : "#6B7280"} />
            <rect x="30" y="36" width="4" height="16" rx="2" fill={completed ? "#2563EB" : "#4B5563"} />
          </svg>
        );
      
      default:
        return (
          <svg {...baseProps}>
            <circle cx="32" cy="32" r="24" fill={completed ? "#10B981" : "#6B7280"} stroke={completed ? "#059669" : "#4B5563"} />
            <path d="M24 32 L30 38 L40 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
    }
  };

  return (
    <div className={`inline-flex items-center justify-center ${completed ? 'animate-pulse' : ''}`}>
      {getIconSVG()}
    </div>
  );
}

// Specific exercise type icons for easy import
export const StrengthIcon = (props: Omit<ExerciseIconProps, 'type'>) => <ExerciseIcon type="strength" {...props} />;
export const CardioIcon = (props: Omit<ExerciseIconProps, 'type'>) => <ExerciseIcon type="cardio" {...props} />;
export const FlexibilityIcon = (props: Omit<ExerciseIconProps, 'type'>) => <ExerciseIcon type="flexibility" {...props} />;
export const CoreIcon = (props: Omit<ExerciseIconProps, 'type'>) => <ExerciseIcon type="core" {...props} />;
export const WarmupIcon = (props: Omit<ExerciseIconProps, 'type'>) => <ExerciseIcon type="warmup" {...props} />;
export const UtilityIcon = (props: Omit<ExerciseIconProps, 'type'>) => <ExerciseIcon type="utility" {...props} />;