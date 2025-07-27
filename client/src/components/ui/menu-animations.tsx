import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Enhanced Button with Feedback Animation
interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  className?: string;
  animationType?: 'bounce' | 'pulse' | 'scale' | 'glow' | 'ripple';
}

export function AnimatedButton({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  disabled = false,
  className = '',
  animationType = 'scale'
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    setIsPressed(true);
    
    // Create ripple effect
    if (animationType === 'ripple') {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }

    setTimeout(() => setIsPressed(false), 150);
    onClick?.();
  };

  const getAnimationVariants = () => {
    switch (animationType) {
      case 'bounce':
        return {
          rest: { scale: 1, y: 0 },
          hover: { scale: 1.05, y: -2 },
          pressed: { scale: 0.95, y: 1 }
        };
      case 'pulse':
        return {
          rest: { scale: 1 },
          hover: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1 } },
          pressed: { scale: 0.95 }
        };
      case 'glow':
        return {
          rest: { scale: 1, boxShadow: "0 0 0px rgba(59, 130, 246, 0)" },
          hover: { 
            scale: 1.02, 
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
            transition: { duration: 0.2 }
          },
          pressed: { scale: 0.98 }
        };
      default: // scale
        return {
          rest: { scale: 1 },
          hover: { scale: 1.05 },
          pressed: { scale: 0.95 }
        };
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden"
      variants={getAnimationVariants()}
      initial="rest"
      whileHover={disabled ? "rest" : "hover"}
      animate={isPressed ? "pressed" : "rest"}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        className={`relative ${className}`}
        onClick={handleClick}
      >
        {children}
        
        {/* Ripple Effects */}
        {animationType === 'ripple' && (
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.div
                key={ripple.id}
                className="absolute bg-white/30 rounded-full pointer-events-none"
                style={{
                  left: ripple.x - 10,
                  top: ripple.y - 10,
                  width: 20,
                  height: 20,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>
        )}
      </Button>
    </motion.div>
  );
}

// Enhanced Card with Hover Animations
interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animationType?: 'lift' | 'tilt' | 'glow' | 'flip' | 'slide';
  disabled?: boolean;
}

export function AnimatedCard({
  children,
  className = '',
  onClick,
  animationType = 'lift',
  disabled = false
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getCardVariants = () => {
    switch (animationType) {
      case 'tilt':
        return {
          rest: { rotateY: 0, rotateX: 0, scale: 1 },
          hover: { 
            rotateY: 5, 
            rotateX: 5, 
            scale: 1.02,
            transition: { duration: 0.3 }
          }
        };
      case 'glow':
        return {
          rest: { 
            scale: 1, 
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderColor: "rgba(226, 232, 240, 1)"
          },
          hover: { 
            scale: 1.02, 
            boxShadow: "0 20px 25px rgba(59, 130, 246, 0.15)",
            borderColor: "rgba(59, 130, 246, 0.5)"
          }
        };
      case 'flip':
        return {
          rest: { rotateY: 0, scale: 1 },
          hover: { rotateY: 180, scale: 1.05 }
        };
      case 'slide':
        return {
          rest: { x: 0, y: 0, scale: 1 },
          hover: { x: 5, y: -5, scale: 1.02 }
        };
      default: // lift
        return {
          rest: { 
            y: 0, 
            scale: 1, 
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" 
          },
          hover: { 
            y: -8, 
            scale: 1.02, 
            boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
            transition: { duration: 0.2 }
          }
        };
    }
  };

  return (
    <motion.div
      className={`cursor-${onClick ? 'pointer' : 'default'} ${disabled ? 'opacity-50' : ''}`}
      variants={getCardVariants()}
      initial="rest"
      whileHover={disabled ? "rest" : "hover"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={disabled ? undefined : onClick}
      style={{ perspective: "1000px" }}
    >
      <Card className={`relative overflow-hidden transition-colors duration-200 ${className}`}>
        {children}
        
        {/* Animated Border Glow */}
        {isHovered && animationType === 'glow' && (
          <motion.div
            className="absolute inset-0 border-2 border-blue-400/50 rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </Card>
    </motion.div>
  );
}

// Menu Item with Slide Animation
interface AnimatedMenuItemProps {
  icon: string;
  title: string;
  description?: string;
  badge?: string;
  onClick?: () => void;
  delay?: number;
  isActive?: boolean;
}

export function AnimatedMenuItem({
  icon,
  title,
  description,
  badge,
  onClick,
  delay = 0,
  isActive = false
}: AnimatedMenuItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ x: 10, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <AnimatedCard
        animationType="lift"
        onClick={onClick}
        className={`p-4 cursor-pointer transition-all duration-200 ${
          isActive ? 'bg-otter-teal/10 border-otter-teal' : 'hover:bg-slate-50'
        }`}
      >
        <CardContent className="flex items-center space-x-4 p-0">
          <motion.div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isActive ? 'bg-otter-teal text-white' : 'bg-slate-100 text-slate-600'
            }`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <i className={`${icon} text-xl`}></i>
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">{title}</h3>
              {badge && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: delay + 0.2, type: "spring" }}
                >
                  <Badge variant="secondary">{badge}</Badge>
                </motion.div>
              )}
            </div>
            {description && (
              <p className="text-sm text-slate-600 mt-1">{description}</p>
            )}
          </div>
          
          <motion.div
            className="text-slate-400"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <i className="fas fa-chevron-right"></i>
          </motion.div>
        </CardContent>
      </AnimatedCard>
    </motion.div>
  );
}

// Loading Spinner with Animation
export function AnimatedSpinner({ size = 32, color = "text-otter-teal" }) {
  return (
    <motion.div
      className={`${color}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

// Success/Error Feedback Animation
interface FeedbackAnimationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  show: boolean;
  onClose?: () => void;
}

export function FeedbackAnimation({ type, message, show, onClose }: FeedbackAnimationProps) {
  const getIcon = () => {
    switch (type) {
      case 'success': return 'fas fa-check-circle';
      case 'error': return 'fas fa-times-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'info': return 'fas fa-info-circle';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success': return 'bg-green-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'info': return 'bg-blue-500 text-white';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <motion.div
            className={`p-4 rounded-lg shadow-lg ${getColors()} flex items-center space-x-3 max-w-sm`}
            initial={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
            animate={{ 
              boxShadow: [
                "0 4px 6px rgba(0, 0, 0, 0.1)",
                "0 20px 25px rgba(0, 0, 0, 0.15)",
                "0 4px 6px rgba(0, 0, 0, 0.1)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.i
              className={`${getIcon()} text-lg`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
            <span className="font-medium">{message}</span>
            {onClose && (
              <motion.button
                onClick={onClose}
                className="ml-auto hover:opacity-80"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fas fa-times"></i>
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Page Transition Animation
interface PageTransitionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export function PageTransition({ children, direction = 'right' }: PageTransitionProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -100, opacity: 0 };
      case 'right': return { x: 100, opacity: 0 };
      case 'up': return { y: -100, opacity: 0 };
      case 'down': return { y: 100, opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={getInitialPosition()}
      transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
    >
      {children}
    </motion.div>
  );
}

// Staggered List Animation
interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function StaggeredList({ 
  children, 
  staggerDelay = 0.1,
  direction = 'up' 
}: StaggeredListProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 50, opacity: 0 };
      case 'down': return { y: -50, opacity: 0 };
      case 'left': return { x: 50, opacity: 0 };
      case 'right': return { x: -50, opacity: 0 };
    }
  };

  return (
    <div>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={getInitialPosition()}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ 
            delay: index * staggerDelay,
            duration: 0.5,
            type: "spring",
            stiffness: 100
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}