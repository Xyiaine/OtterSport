/**
 * ENHANCED UI FEEDBACK SYSTEM
 * 
 * Comprehensive feedback components providing real-time user guidance:
 * - Loading states with progress indicators
 * - Success/error notifications with animations
 * - Interactive tooltips and help text
 * - Visual feedback for user actions
 * - Accessibility-compliant feedback
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
// Alert component not in current UI - will use Card for notifications
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, XCircle, AlertCircle, Info, Loader2, Zap, Star } from 'lucide-react';

// Enhanced Loading States with Progress Tracking
interface LoadingStateProps {
  isLoading: boolean;
  progress?: number;
  message?: string;
  showSpinner?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

function EnhancedLoadingState({ 
  isLoading, 
  progress, 
  message = 'Loading...', 
  showSpinner = true,
  size = 'md' 
}: LoadingStateProps) {
  if (!isLoading) return null;

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex items-center justify-center p-6 space-x-3">
      {showSpinner && (
        <Loader2 className={`animate-spin text-blue-500 ${sizeClasses[size]}`} />
      )}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600 font-medium">{message}</p>
        {typeof progress === 'number' && (
          <div className="w-64">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">{progress.toFixed(0)}% complete</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Success/Error Notifications
interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  isVisible: boolean;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

function EnhancedNotification({
  type,
  title,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000,
  action
}: NotificationProps) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    
    if (isVisible && autoClose && onClose) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!show) return null;

  const iconConfig = {
    success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
    error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    warning: { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' }
  };

  const config = iconConfig[type];
  const Icon = config.icon;

  return (
    <div className={`fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300`}>
      <Card className={`${config.bg} ${config.border} border-2 shadow-lg max-w-md`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Icon className={`h-5 w-5 ${config.color} mt-0.5 flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900">{title}</div>
              {message && <div className="text-sm text-gray-700 mt-1">{message}</div>}
              {action && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={action.onClick}
                  className="mt-3 h-8"
                >
                  {action.label}
                </Button>
              )}
            </div>
            {onClose && (
              <button
                onClick={() => {
                  setShow(false);
                  onClose();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Close notification"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Interactive Help Tooltips with Rich Content
interface HelpTooltipProps {
  content: string;
  title?: string;
  trigger: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  showArrow?: boolean;
  interactive?: boolean;
}

function HelpTooltip({ 
  content, 
  title, 
  trigger, 
  side = 'top',
  showArrow = true,
  interactive = false 
}: HelpTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {trigger}
        </TooltipTrigger>
        <TooltipContent 
          side={side}
          className="max-w-xs p-3 bg-gray-900 text-white border-gray-700"
          sideOffset={showArrow ? 5 : 0}
        >
          {title && (
            <div className="font-semibold text-sm mb-1">{title}</div>
          )}
          <div className="text-xs leading-relaxed">{content}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Action Feedback with Visual Confirmations
interface ActionFeedbackProps {
  isActive: boolean;
  type: 'click' | 'hover' | 'focus' | 'success' | 'error';
  children: React.ReactNode;
  feedbackText?: string;
  showBadge?: boolean;
}

function ActionFeedback({ 
  isActive, 
  type, 
  children, 
  feedbackText,
  showBadge = false 
}: ActionFeedbackProps) {
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowFeedback(true);
      if (type === 'success' || type === 'error') {
        const timer = setTimeout(() => setShowFeedback(false), 2000);
        return () => clearTimeout(timer);
      }
    } else {
      setShowFeedback(false);
    }
  }, [isActive, type]);

  const feedbackStyles = {
    click: 'ring-2 ring-blue-300 ring-opacity-50 scale-95',
    hover: 'shadow-lg scale-105 bg-gradient-to-r from-blue-50 to-indigo-50',
    focus: 'ring-2 ring-blue-500 ring-opacity-75',
    success: 'ring-2 ring-green-400 ring-opacity-50 bg-green-50',
    error: 'ring-2 ring-red-400 ring-opacity-50 bg-red-50'
  };

  return (
    <div className="relative">
      <div 
        className={`transition-all duration-200 ${
          showFeedback ? feedbackStyles[type] : ''
        }`}
      >
        {children}
      </div>
      
      {showBadge && showFeedback && feedbackText && (
        <Badge 
          variant={type === 'success' ? 'default' : type === 'error' ? 'destructive' : 'secondary'}
          className="absolute -top-2 -right-2 animate-in zoom-in duration-200"
        >
          {feedbackText}
        </Badge>
      )}
    </div>
  );
}

// Progress Tracking with Milestones
interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  showDetails?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

function ProgressTracker({ 
  currentStep, 
  totalSteps, 
  steps,
  showDetails = true,
  orientation = 'horizontal' 
}: ProgressTrackerProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  if (orientation === 'vertical') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Progress</h3>
          <Badge variant="outline">{currentStep} of {totalSteps}</Badge>
        </div>
        
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < currentStep 
                  ? 'bg-green-500 text-white' 
                  : index === currentStep 
                    ? 'bg-blue-500 text-white animate-pulse'
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {index < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <div className={`text-sm ${
                index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'
              }`}>
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Progress</h3>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{currentStep} of {totalSteps}</Badge>
          <span className="text-sm text-gray-600">
            {progressPercentage.toFixed(0)}%
          </span>
        </div>
      </div>
      
      <Progress value={progressPercentage} className="h-3" />
      
      {showDetails && (
        <div className="text-sm text-gray-600">
          Current: {steps[currentStep - 1] || 'Getting started...'}
        </div>
      )}
    </div>
  );
}

// Performance Feedback Component
interface PerformanceFeedbackProps {
  score?: number;
  metrics?: {
    label: string;
    value: number;
    target?: number;
    unit?: string;
  }[];
  showBadge?: boolean;
}

function PerformanceFeedback({ score, metrics, showBadge = true }: PerformanceFeedbackProps) {
  if (!score && !metrics?.length) return null;

  const getScoreColor = (value: number) => {
    if (value >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (value >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (value >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          Performance Metrics
          {score && showBadge && (
            <Badge 
              variant="outline" 
              className={getScoreColor(score)}
            >
              <Star className="h-3 w-3 mr-1" />
              {score}/100
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {metrics?.map((metric, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{metric.label}</span>
              <span className="font-medium">
                {metric.value}{metric.unit || ''}
                {metric.target && (
                  <span className="text-gray-400 ml-1">
                    / {metric.target}{metric.unit || ''}
                  </span>
                )}
              </span>
            </div>
            {metric.target && (
              <Progress 
                value={(metric.value / metric.target) * 100} 
                className="h-2" 
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Export all components
export {
  EnhancedLoadingState,
  EnhancedNotification, 
  HelpTooltip,
  ActionFeedback,
  ProgressTracker,
  PerformanceFeedback
};