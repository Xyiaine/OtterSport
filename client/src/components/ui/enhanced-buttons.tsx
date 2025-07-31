/**
 * ENHANCED BUTTONS COMPONENT
 * 
 * Improved button components with better visual feedback,
 * loading states, and accessibility features.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/visual-feedback';
import { LucideIcon } from 'lucide-react';

/**
 * EnhancedButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * EnhancedButtonProps interface defines the contract for implementation.
/**
 * EnhancedButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * EnhancedButtonProps interface defines the contract for implementation.
 * 
/**
 * defines interface defines the contract for implementation.
 * 
/**
 * EnhancedButtonProps interface defines the contract for implementation.
/**
 * EnhancedButtonProps interface defines the contract for implementation.
/**
 * EnhancedButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedButtonProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedButtonProps
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
 * @interface EnhancedButtonProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
/**
 * Handles enhancedbutton functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await EnhancedButton(params);
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedButtonProps
 */
 * @interface EnhancedButtonProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedButtonProps
 */
 * @interface EnhancedButtonProps
 */
interface EnhancedButtonProps extends ButtonProps {
/**
 * Handles enhancedbutton functionality for the application
 * 
/**
 * Handles enhancedbutton functionality for the application
 * 
 * This is a complex function that requires careful attention.
/**
 * FloatingActionButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FloatingActionButtonProps
 */
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await EnhancedButton(params);
 */
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await EnhancedButton(params);
 */
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  pulse?: boolean;
/**
 * FloatingActionButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FloatingActionButtonProps
 */
  glow?: boolean;
  successState?: boolean;
}

export function EnhancedButton({
  children,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  pulse = false,
  glow = false,
  successState = false,
  className = '',
/**
 * FloatingActionButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FloatingActionButtonProps
 */
/**
 * ButtonGroupProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ButtonGroupProps
 */
  disabled,
  ...props
}: EnhancedButtonProps) {
  const isDisabled = disabled || loading;

  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.98 },
    hover: { scale: 1.02 }
  };

  const glowClass = glow ? 'shadow-lg shadow-otter-teal/25' : '';
  const pulseClass = pulse ? 'animate-pulse-slow' : '';
  const successClass = successState ? 'bg-green-500 hover:bg-green-600' : '';

  return (
    <motion.div
      variants={buttonVariants}
      initial="initial"
/**
 * FloatingActionButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FloatingActionButtonProps
 */
/**
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
/**
 * ButtonGroupProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ButtonGroupProps
 */
 */
 * FloatingActionButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FloatingActionButtonProps
 */
      whileHover={!isDisabled ? "hover" : undefined}
      whileTap={!isDisabled ? "tap" : undefined}
      className="inline-block"
    >
      <Button
        {...props}
        disabled={isDisabled}
        className={`
          relative overflow-hidden
          ${glowClass}
          ${pulseClass}
          ${successClass}
          ${className}
/**
 * ButtonGroupProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ButtonGroupProps
 */
        `}
      >
        <div className="flex items-center justify-center space-x-2">
          {loading ? (
            <LoadingSpinner size="sm" color="text-white" />
          ) : (
/**
 * FloatingActionButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FloatingActionButtonProps
 */
            <>
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
              {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
/**
 * FloatingActionButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FloatingActionButtonProps
 */
/**
 * ButtonGroupProps interface defines the contract for implementation.
 * 
/**
 * ButtonGroupProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ButtonGroupProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ButtonGroupProps
 */
/**
 * Handles buttongroup functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await ButtonGroup(params);
 */
              <span>{children}</span>
/**
 * Handles floatingactionbutton functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
              {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
            </>
          )}
        </div>
        
        {/* Ripple effect on click */}
        <motion.div
          className="absolute inset-0 bg-white opacity-0"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 2, opacity: 0.1 }}
          transition={{ duration: 0.3 }}
          style={{ borderRadius: 'inherit' }}
        />
      </Button>
    </motion.div>
  );
}

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  variant?: 'primary' | 'secondary';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

export function FloatingActionButton({
  onClick,
  icon: Icon,
  label,
/**
 * ButtonGroupProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ButtonGroupProps
 */
  variant = 'primary',
  position = 'bottom-right',
  className = ''
}: FloatingActionButtonProps) {
  const positionClasses = {
/**
 * Handles buttongroup functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await ButtonGroup(params);
 */
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };
/**
 * ButtonGroupProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ButtonGroupProps
 */

  const variantClasses = {
    primary: 'bg-otter-teal hover:bg-teal-600 text-white shadow-lg',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 shadow-lg border'
  };
/**
 * Handles buttongroup functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await ButtonGroup(params);
 */

  return (
    <motion.button
      onClick={onClick}
      className={`
        ${positionClasses[position]}
        ${variantClasses[variant]}
        w-14 h-14 rounded-full
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110 hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-otter-teal focus:ring-offset-2
        z-50
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      aria-label={label}
      title={label}
    >
      <Icon className="w-6 h-6" />
    </motion.button>
  );
}

interface ButtonGroupProps {
  buttons: Array<{
    id: string;
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
  }>;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function ButtonGroup({ 
  buttons, 
  orientation = 'horizontal', 
  className = '' 
}: ButtonGroupProps) {
  const containerClass = orientation === 'horizontal' 
    ? 'flex flex-row' 
    : 'flex flex-col';

  return (
    <div className={`${containerClass} ${className}`}>
      {buttons.map((button, index) => {
        const { id, label, icon: Icon, onClick, active, disabled } = button;
        const isFirst = index === 0;
        const isLast = index === buttons.length - 1;
        
        const roundingClass = orientation === 'horizontal'
          ? `${isFirst ? 'rounded-l-lg' : ''} ${isLast ? 'rounded-r-lg' : ''}`
          : `${isFirst ? 'rounded-t-lg' : ''} ${isLast ? 'rounded-b-lg' : ''}`;

        return (
          <motion.button
            key={id}
            onClick={onClick}
            disabled={disabled}
            className={`
              px-4 py-2 border
              ${roundingClass}
              ${active 
                ? 'bg-otter-teal text-white border-otter-teal' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-otter-teal focus:ring-offset-2
              ${!isLast && orientation === 'horizontal' ? 'border-r-0' : ''}
              ${!isLast && orientation === 'vertical' ? 'border-b-0' : ''}
            `}
            whileHover={!disabled ? { scale: 1.02 } : undefined}
            whileTap={!disabled ? { scale: 0.98 } : undefined}
          >
            <div className="flex items-center justify-center space-x-2">
              {Icon && <Icon className="w-4 h-4" />}
              <span>{label}</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}