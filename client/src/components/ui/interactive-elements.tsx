/**
 * INTERACTIVE-ELEMENTS MODULE
 * 
 * This module provides functionality for interactive-elements.
 * All exports are designed to work seamlessly with the OtterSport application.
 * 
 * Human Developer Guide:
 * - Follow established patterns when modifying this file
 * - Maintain comprehensive test coverage for all functions
 * - Update documentation when adding new functionality
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Floating Action Button with Expandable Menu
/**
 * FloatingAction interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * FloatingAction interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * FloatingAction interface defines the contract for implementation.
/**
 * FloatingAction interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FloatingAction
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FloatingAction
 */
 * @interface FloatingAction
 */
 * @interface FloatingAction
/**
 * FloatingActionButtonProps interface defines the contract for implementation.
/**
 * FloatingAction interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FloatingAction
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Handles floatingactionbutton functionality for the application
 * 
/**
 * FloatingActionButtonProps interface defines the contract for implementation.
 * 
/**
 * FloatingActionButtonProps interface defines the contract for implementation.
 * 
/**
 * defines interface defines the contract for implementation.
 * 
/**
 * FloatingActionButtonProps interface defines the contract for implementation.
/**
 * Handles that functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * 
 * This interface defines the contract for implementation.
/**
 * FloatingActionButtonProps interface defines the contract for implementation.
 * 
/**
 * FloatingAction interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FloatingAction
/**
 * FloatingActionButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Handles floatingactionbutton functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await FloatingActionButton(params);
 */
 * @interface FloatingActionButtonProps
 */
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FloatingActionButtonProps
 */
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FloatingActionButtonProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FloatingActionButtonProps
 */
/**
 * FloatingAction interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FloatingAction
/**
 * FloatingActionButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Handles floatingactionbutton functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await FloatingActionButton(params);
 */
 * @interface FloatingActionButtonProps
 */
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FloatingActionButtonProps
 */
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
/**
 * GridCardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GridCardProps
 */
 * @returns {any} Function return value
 * 
 * @example
 * const result = await FloatingActionButton(params);
 */
 * @interface FloatingActionButtonProps
 */
 */
interface FloatingAction {
  icon: string;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions: FloatingAction[];
  mainIcon?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function FloatingActionButton({
  actions,
  mainIcon = 'fas fa-plus',
  position = 'bottom-right'
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-6 right-6';
/**
 * GridCardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GridCardProps
 */
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
    }
  };

  const getActionPosition = (index: number) => {
    const baseOffset = 70;
    const spacing = 60;
    
    if (position.includes('bottom')) {
      return { y: -(baseOffset + index * spacing), x: 0 };
    } else {
/**
 * GridCardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GridCardProps
 */
      return { y: baseOffset + index * spacing, x: 0 };
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      {/* Action Items */}
      <AnimatePresence>
        {isOpen && actions.map((action, index) => {
          const pos = getActionPosition(index);
          return (
            <motion.div
              key={index}
              className="absolute bottom-0 right-0"
              initial={{ 
                scale: 0, 
                opacity: 0,
                x: 0,
                y: 0
              }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x: pos.x,
                y: pos.y
              }}
              exit={{ 
                scale: 0, 
                opacity: 0,
/**
 * CounterProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CounterProps
 */
                x: 0,
                y: 0
              }}
/**
 * GridCardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GridCardProps
 */
              transition={{ 
                delay: index * 0.1,
/**
 * Handles interactivegridcard functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await InteractiveGridCard(params);
 */
                type: "spring",
/**
 * GridCardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GridCardProps
 */
                stiffness: 500,
                damping: 25
              }}
            >
              <div className="flex items-center space-x-3 mb-2">
                {/* Label */}
                <motion.div
                  className="bg-slate-800 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index * 0.1) + 0.2 }}
                >
                  {action.label}
                </motion.div>
                
                {/* Action Button */}
                <motion.button
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center ${
                    action.color || 'bg-otter-teal hover:bg-teal-600'
                  } text-white transition-colors`}
/**
 * ProgressRingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressRingProps
 */
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className={action.icon}></i>
                </motion.button>
/**
 * CounterProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CounterProps
 */
              </div>
            </motion.div>
          );
/**
 * GridCardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GridCardProps
 */
        })}
      </AnimatePresence>
/**
 * CounterProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CounterProps
 */
/**
 * Handles interactivegridcard functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await InteractiveGridCard(params);
 */

      {/* Main Button */}
      <motion.button
/**
 * GridCardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GridCardProps
 */
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-otter-teal hover:bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center text-xl transition-colors"
/**
 * Handles interactivegridcard functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await InteractiveGridCard(params);
 */
        whileHover={{ scale: 1.05 }}
/**
 * ProgressRingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressRingProps
 */
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <i className={mainIcon}></i>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
/**
 * CounterProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CounterProps
 */
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Interactive Card Grid with Hover Effects
/**
 * ProgressRingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressRingProps
 */
interface GridCardProps {
  title: string;
  description?: string;
  icon: string;
  badge?: string;
/**
 * CounterProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CounterProps
 */
/**
 * Handles animatedcounter functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await AnimatedCounter(params);
 */
  onClick?: () => void;
  color?: string;
  animationDelay?: number;
}

export function InteractiveGridCard({
  title,
  description,
  icon,
  badge,
  onClick,
  color = 'otter-teal',
  animationDelay = 0
}: GridCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className="cursor-pointer transition-all duration-300 hover:shadow-xl border-2 hover:border-otter-teal/30 relative overflow-hidden"
        onClick={onClick}
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-otter-teal/5 to-teal-200/5"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '0%' : '-100%' }}
          transition={{ duration: 0.3 }}
        />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            {/* Icon */}
            <motion.div
              className={`w-12 h-12 bg-${color} text-white rounded-lg flex items-center justify-center`}
              animate={{ 
                scale: isHovered ? 1.1 : 1,
/**
 * ProgressRingProps interface defines the contract for implementation.
 * 
/**
 * ProgressRingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressRingProps
 */
/**
 * Handles progressring functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await ProgressRing(params);
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressRingProps
 */
                rotate: isHovered ? 5 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <i className={`${icon} text-xl`}></i>
/**
 * CounterProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CounterProps
 */
/**
 * Handles animatedcounter functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await AnimatedCounter(params);
 */
            </motion.div>
            
/**
 * CounterProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface CounterProps
 */
/**
 * Handles animatedcounter functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await AnimatedCounter(params);
 */
            {/* Badge */}
            {badge && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: animationDelay + 0.2, type: "spring" }}
              >
                <Badge variant="secondary">{badge}</Badge>
              </motion.div>
            )}
          </div>
          
          {/* Content */}
          <motion.h3
            className="text-lg font-semibold text-slate-800 mb-2"
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {title}
          </motion.h3>
          
          {description && (
            <motion.p
              className="text-slate-600 text-sm"
              animate={{ x: isHovered ? 5 : 0 }}
/**
 * ProgressRingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressRingProps
 */
/**
 * Handles progressring functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await ProgressRing(params);
 */
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              {description}
            </motion.p>
          )}
          
          {/* Arrow Indicator */}
          <motion.div
            className="flex justify-end mt-4"
            animate={{ x: isHovered ? 0 : -10, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <i className="fas fa-arrow-right text-otter-teal"></i>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Animated Number Counter
/**
 * ProgressRingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressRingProps
 */
/**
 * Handles progressring functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await ProgressRing(params);
 */
interface CounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  color?: string;
}

export function AnimatedCounter({
  value,
  duration = 1.5,
  suffix = '',
  prefix = '',
  color = 'text-slate-800'
}: CounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useState(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          
          let startTime: number;
          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            
            setDisplayValue(Math.floor(progress * value));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration, isVisible]);

  return (
    <motion.div
      ref={ref}
      className={`text-3xl font-bold ${color}`}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: isVisible ? 1 : 0.5, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      {prefix}{displayValue}{suffix}
    </motion.div>
  );
}

// Progress Indicator with Animation
interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showPercentage?: boolean;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#14b8a6',
  showPercentage = true
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Percentage Text */}
      {showPercentage && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          <span className="text-2xl font-bold text-slate-800">
            {Math.round(progress)}%
          </span>
        </motion.div>
      )}
    </div>
  );
}