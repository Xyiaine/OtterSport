/**
 * ENHANCED-FEEDBACK MODULE
 * 
 * This module provides functionality for enhanced-feedback.
 * All exports are designed to work seamlessly with the OtterSport application.
 * 
 * Human Developer Guide:
 * - Follow established patterns when modifying this file
 * - Maintain comprehensive test coverage for all functions
 * - Update documentation when adding new functionality
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// Enhanced Loading States
/**
 * EnhancedLoadingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * EnhancedLoadingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * EnhancedLoadingProps interface defines the contract for implementation.
/**
 * EnhancedLoadingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedLoadingProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
/**
 * EnhancedLoadingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedLoadingProps
 */
 * 
 * @interface EnhancedLoadingProps
 */
 * @interface EnhancedLoadingProps
 */
 * @interface EnhancedLoadingProps
/**
 * Handles enhancedloading functionality for the application
 * 
 * This is a complex function that requires careful attention.
/**
 * EnhancedLoadingProps interface defines the contract for implementation.
 * 
/**
 * EnhancedLoadingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedLoadingProps
/**
 * Handles enhancedloading functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await EnhancedLoading(params);
 */
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedLoadingProps
/**
 * Handles enhancedloading functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await EnhancedLoading(params);
 */
 */
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await EnhancedLoading(params);
 */
 */
/**
 * FeedbackStateProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FeedbackStateProps
 */
interface EnhancedLoadingProps {
  isLoading: boolean;
  loadingText?: string;
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function EnhancedLoading({ 
  isLoading, 
  loadingText = "Loading...", 
  progress, 
  size = 'md' 
}: EnhancedLoadingProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: "w-6 h-6",
/**
 * FeedbackStateProps interface defines the contract for implementation.
/**
 * defines interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FeedbackStateProps
 */
/**
 * FeedbackStateProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FeedbackStateProps
 */
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
/**
 * FeedbackStateProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FeedbackStateProps
 */
          {/* Spinning Animation */}
          <motion.div
            className={`${sizeClasses[size]} border-4 border-otter-teal/30 border-t-otter-teal rounded-full`}
/**
 * FeedbackStateProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FeedbackStateProps
 */
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
/**
 * Handles feedbackstate functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await FeedbackState(params);
 */
          
          {/* Loading Text */}
          <motion.div
            className="text-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-slate-600 font-medium">
              {loadingText}{dots}
            </p>
          </motion.div>

          {/* Progress Bar */}
          {progress !== undefined && (
/**
 * FeedbackStateProps interface defines the contract for implementation.
 * 
/**
 * FeedbackStateProps interface defines the contract for implementation.
 * 
/**
 * InteractiveButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface InteractiveButtonProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FeedbackStateProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Handles feedbackstate functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await FeedbackState(params);
 */
 * @interface FeedbackStateProps
 */
            <motion.div
              className="w-48"
              initial={{ scaleX: 0 }}
/**
 * Handles feedbackstate functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await FeedbackState(params);
 */
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-slate-500 mt-1 text-center">
                {Math.round(progress)}% complete
              </p>
            </motion.div>
/**
 * InteractiveButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface InteractiveButtonProps
 */
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Enhanced Success/Error States
interface FeedbackStateProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onAction?: () => void;
  actionText?: string;
  show: boolean;
  autoHide?: boolean;
/**
 * InteractiveButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface InteractiveButtonProps
 */
  duration?: number;
}

export function FeedbackState({
  type,
  title,
  message,
  onAction,
  actionText,
  show,
  autoHide = true,
  duration = 3000
}: FeedbackStateProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    if (show && autoHide) {
      const timer = setTimeout(() => setIsVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoHide, duration]);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'fas fa-check-circle',
          color: 'text-green-600',
/**
 * InteractiveButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface InteractiveButtonProps
 */
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'error':
        return {
          icon: 'fas fa-times-circle',
/**
 * InteractiveButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface InteractiveButtonProps
 */
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'warning':
        return {
/**
 * EnhancedFormFieldProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Handles interactivebutton functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await InteractiveButton(params);
 */
 * @interface EnhancedFormFieldProps
 */
          icon: 'fas fa-exclamation-triangle',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'info':
        return {
          icon: 'fas fa-info-circle',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50 max-w-md"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Card className={`${config.bgColor} ${config.borderColor} border-2 shadow-lg`}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <motion.i
/**
 * InteractiveButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface InteractiveButtonProps
 */
                  className={`${config.icon} ${config.color} text-lg mt-0.5`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
/**
 * Handles interactivebutton functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
/**
 * EnhancedFormFieldProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedFormFieldProps
 */
 * @example
 * const result = await InteractiveButton(params);
 */
                />
/**
 * InteractiveButtonProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface InteractiveButtonProps
 */
                <div className="flex-1">
                  <h4 className={`font-semibold ${config.color}`}>{title}</h4>
                  <p className="text-sm text-slate-700 mt-1">{message}</p>
                  {onAction && actionText && (
/**
 * Handles interactivebutton functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
/**
 * EnhancedFormFieldProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedFormFieldProps
 */
 * @example
 * const result = await InteractiveButton(params);
 */
                    <motion.div
                      className="mt-3"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button
                        size="sm"
                        onClick={onAction}
                        className={`${config.color.replace('text-', 'bg-')} text-white hover:opacity-90`}
                      >
                        {actionText}
                      </Button>
                    </motion.div>
                  )}
                </div>
                <motion.button
                  onClick={() => setIsVisible(false)}
                  className="text-slate-400 hover:text-slate-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className="fas fa-times"></i>
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Interactive Button with Multi-State Feedback
interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  className?: string;
  loadingText?: string;
/**
 * EnhancedFormFieldProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedFormFieldProps
 */
  successText?: string;
  errorText?: string;
}

export function InteractiveButton({
  children,
  onClick,
  variant = 'default',
  size = 'default',
/**
 * EnhancedFormFieldProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedFormFieldProps
 */
/**
 * Handles enhancedformfield functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await EnhancedFormField(params);
 */
  disabled = false,
  className = '',
  loadingText = "Processing...",
  successText = "Success!",
  errorText = "Try Again"
}: InteractiveButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleClick = async () => {
    if (!onClick || state === 'loading') return;

    setState('loading');
    
    try {
      await onClick();
      setState('success');
      
      // Reset to idle after success animation
      setTimeout(() => setState('idle'), 2000);
    } catch (error) {
      setState('error');
      toast({
        title: "Action Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      
      // Reset to idle after error
      setTimeout(() => setState('idle'), 3000);
    }
  };

  const getContent = () => {
    switch (state) {
      case 'loading':
        return (
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span>{loadingText}</span>
          </motion.div>
        );
      case 'success':
        return (
          <motion.div
/**
 * EnhancedFormFieldProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedFormFieldProps
 */
/**
 * Handles enhancedformfield functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await EnhancedFormField(params);
 */
            className="flex items-center space-x-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <motion.i
              className="fas fa-check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
            />
            <span>{successText}</span>
          </motion.div>
/**
 * EnhancedFormFieldProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface EnhancedFormFieldProps
 */
/**
 * Handles enhancedformfield functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await EnhancedFormField(params);
 */
        );
      case 'error':
        return (
          <motion.div
            className="flex items-center space-x-2"
            initial={{ x: -10 }}
            animate={{ x: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
          >
            <motion.i
              className="fas fa-exclamation-triangle"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            />
            <span>{errorText}</span>
          </motion.div>
        );
      default:
        return children;
    }
  };

  const getButtonColor = () => {
    switch (state) {
      case 'success':
        return 'bg-green-500 hover:bg-green-600 border-green-500';
      case 'error':
        return 'bg-red-500 hover:bg-red-600 border-red-500';
      default:
        return '';
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || state === 'loading'}
      className={`relative transition-all duration-200 ${getButtonColor()} ${className}`}
      onClick={handleClick}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {getContent()}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}

// Enhanced Form Field with Validation Feedback
interface EnhancedFormFieldProps {
  label: string;
  error?: string;
  success?: boolean;
  children: React.ReactNode;
  required?: boolean;
}

export function EnhancedFormField({ 
  label, 
  error, 
  success = false, 
  children, 
  required = false 
}: EnhancedFormFieldProps) {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="text-sm font-medium text-slate-700 flex items-center space-x-1">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
        {success && (
          <motion.i
            className="fas fa-check-circle text-green-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          />
        )}
      </label>
      
      <motion.div
        className="relative"
        animate={{
          x: error ? [0, -5, 5, 0] : 0
        }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
      
      <AnimatePresence>
        {error && (
          <motion.div
            className="flex items-center space-x-1 text-red-600 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}