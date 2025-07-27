import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AnimatedToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  show: boolean;
  onClose?: () => void;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function AnimatedToast({
  type,
  title,
  description,
  show,
  onClose,
  duration = 4000,
  position = 'top-right'
}: AnimatedToastProps) {
  const [isVisible, setIsVisible] = useState(show);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setIsVisible(show);
    if (show) {
      setProgress(100);
      
      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 50));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 50);

      // Auto close
      const closeTimer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(closeTimer);
      };
    }
  }, [show, duration, onClose]);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'fas fa-check-circle',
          iconColor: 'text-green-500',
          bgColor: 'bg-white',
          borderColor: 'border-green-200',
          progressColor: 'bg-green-500'
        };
      case 'error':
        return {
          icon: 'fas fa-times-circle',
          iconColor: 'text-red-500',
          bgColor: 'bg-white',
          borderColor: 'border-red-200',
          progressColor: 'bg-red-500'
        };
      case 'warning':
        return {
          icon: 'fas fa-exclamation-triangle',
          iconColor: 'text-yellow-500',
          bgColor: 'bg-white',
          borderColor: 'border-yellow-200',
          progressColor: 'bg-yellow-500'
        };
      case 'info':
        return {
          icon: 'fas fa-info-circle',
          iconColor: 'text-blue-500',
          bgColor: 'bg-white',
          borderColor: 'border-blue-200',
          progressColor: 'bg-blue-500'
        };
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
    }
  };

  const getInitialPosition = () => {
    if (position.includes('right')) return { x: 100, opacity: 0 };
    if (position.includes('left')) return { x: -100, opacity: 0 };
    if (position.includes('top')) return { y: -100, opacity: 0 };
    return { y: 100, opacity: 0 };
  };

  const config = getTypeConfig();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed ${getPositionClasses()} z-50 max-w-sm w-full`}
          initial={getInitialPosition()}
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={getInitialPosition()}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Card className={`${config.bgColor} ${config.borderColor} border-2 shadow-xl overflow-hidden`}>
            {/* Progress Bar */}
            <motion.div
              className={`h-1 ${config.progressColor}`}
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
            
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {/* Animated Icon */}
                <motion.div
                  className="flex-shrink-0"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.1, 
                    type: "spring", 
                    stiffness: 500,
                    damping: 15
                  }}
                >
                  <motion.i
                    className={`${config.icon} ${config.iconColor} text-xl`}
                    animate={{
                      scale: type === 'error' ? [1, 1.2, 1] : 1
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: type === 'error' ? 1 : 0
                    }}
                  />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <motion.h4
                    className="font-semibold text-slate-900 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {title}
                  </motion.h4>
                  {description && (
                    <motion.p
                      className="text-slate-600 text-xs mt-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {description}
                    </motion.p>
                  )}
                </div>

                {/* Close Button */}
                <motion.button
                  onClick={() => {
                    setIsVisible(false);
                    onClose?.();
                  }}
                  className="flex-shrink-0 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <i className="fas fa-times text-xs"></i>
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toast Provider Hook for Multiple Toasts
interface ToastData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

export function useAnimatedToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 4000);

    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: 1,
              y: index * 10 // Slight stagger effect
            }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <AnimatedToast
              type={toast.type}
              title={toast.title}
              description={toast.description}
              show={true}
              onClose={() => removeToast(toast.id)}
              duration={toast.duration}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return { showToast, removeToast, ToastContainer };
}

// Quick notification functions
export const toast = {
  success: (title: string, description?: string, duration?: number) => ({
    type: 'success' as const,
    title,
    description,
    duration
  }),
  error: (title: string, description?: string, duration?: number) => ({
    type: 'error' as const,
    title,
    description,
    duration
  }),
  warning: (title: string, description?: string, duration?: number) => ({
    type: 'warning' as const,
    title,
    description,
    duration
  }),
  info: (title: string, description?: string, duration?: number) => ({
    type: 'info' as const,
    title,
    description,
    duration
  })
};