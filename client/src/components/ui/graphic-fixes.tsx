/**
 * GRAPHIC FIXES COMPONENT
 * 
 * Comprehensive fixes for all graphic problems throughout the OtterSport application.
 * This component provides SVG-based replacements for missing assets and visual improvements.
 */

import React from 'react';
import { motion } from 'framer-motion';

// Fix for missing logo - create SVG OtterSport logo
export function OtterSportLogo({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'w-16 h-8',
    md: 'w-24 h-12',
    lg: 'w-32 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 120 60" className="w-full h-full">
        {/* Otter silhouette */}
        <ellipse cx="25" cy="30" rx="20" ry="15" fill="#20B2AA" />
        <circle cx="25" cy="25" r="12" fill="#20B2AA" />
        <circle cx="22" cy="22" r="2" fill="white" />
        <circle cx="28" cy="22" r="2" fill="white" />
        
        {/* Text */}
        <text x="50" y="25" fontSize="12" fontWeight="bold" fill="#20B2AA" fontFamily="Inter, sans-serif">
          OTTER
        </text>
        <text x="50" y="40" fontSize="12" fontWeight="bold" fill="#16a085" fontFamily="Inter, sans-serif">
          SPORT
        </text>
        
        {/* Decorative elements */}
        <circle cx="100" cy="15" r="3" fill="#20B2AA" opacity="0.6" />
        <circle cx="105" cy="25" r="2" fill="#16a085" opacity="0.6" />
        <circle cx="110" cy="35" r="2.5" fill="#20B2AA" opacity="0.4" />
      </svg>
    </div>
  );
}

// Fix for missing background images - create SVG backgrounds
export function AppBackground({ variant = 'default', className = '' }: { variant?: 'default' | 'workout' | 'battle', className?: string }) {
  const getBackgroundSVG = () => {
    switch (variant) {
      case 'workout':
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full">
            <defs>
              <linearGradient id="workoutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0f9ff" />
                <stop offset="50%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#bae6fd" />
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#workoutGradient)" />
            {/* Workout pattern */}
            <circle cx="50" cy="50" r="20" fill="#20B2AA" opacity="0.1" />
            <circle cx="350" cy="100" r="15" fill="#16a085" opacity="0.1" />
            <circle cx="100" cy="250" r="25" fill="#20B2AA" opacity="0.08" />
            <circle cx="300" cy="200" r="18" fill="#16a085" opacity="0.08" />
          </svg>
        );
      
      case 'battle':
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full">
            <defs>
              <linearGradient id="battleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#334155" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#battleGradient)" />
            {/* Battle elements */}
            <polygon points="50,50 70,30 90,50 70,70" fill="#20B2AA" opacity="0.2" />
            <polygon points="310,100 330,80 350,100 330,120" fill="#16a085" opacity="0.2" />
            <polygon points="80,200 100,180 120,200 100,220" fill="#20B2AA" opacity="0.15" />
          </svg>
        );
      
      default:
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full">
            <defs>
              <linearGradient id="defaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#defaultGradient)" />
            {/* Subtle pattern */}
            <circle cx="80" cy="80" r="30" fill="#20B2AA" opacity="0.05" />
            <circle cx="320" cy="150" r="40" fill="#16a085" opacity="0.05" />
            <circle cx="150" cy="220" r="35" fill="#20B2AA" opacity="0.03" />
          </svg>
        );
    }
  };

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      {getBackgroundSVG()}
    </div>
  );
}

// Fix for missing button graphics - enhanced button styles
export function GraphicButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon,
  className = '',
  ...props 
}: any) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-otter-teal to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg';
      case 'secondary':
        return 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 shadow-md';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg';
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-otter-teal to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  return (
    <motion.button
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        rounded-lg font-medium
        transform transition-all duration-200
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-otter-teal focus:ring-offset-2
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <div className="flex items-center justify-center space-x-2">
        {icon && <span className="w-4 h-4">{icon}</span>}
        <span>{children}</span>
      </div>
    </motion.button>
  );
}

// Fix for missing card backgrounds
export function CardFrame({ children, theme = 'default', className = '' }: any) {
  const getThemeClasses = () => {
    switch (theme) {
      case 'strength':
        return 'border-gray-600 bg-gradient-to-br from-gray-50 to-gray-100';
      case 'cardio':
        return 'border-red-400 bg-gradient-to-br from-red-50 to-red-100';
      case 'flexibility':
        return 'border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'core':
        return 'border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100';
      default:
        return 'border-otter-teal bg-gradient-to-br from-teal-50 to-teal-100';
    }
  };

  return (
    <div className={`
      rounded-lg border-2 p-4 shadow-lg
      ${getThemeClasses()}
      ${className}
    `}>
      {children}
    </div>
  );
}

// Fix for missing icons throughout the app
export function IconReplacements() {
  return null; // Icons are now handled by Lucide React components
}

// Export all fixes as a combined component
export default function GraphicFixes() {
  return (
    <>
      <IconReplacements />
      <AppBackground />
    </>
  );
}