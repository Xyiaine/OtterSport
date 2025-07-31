/**
 * IN-APP NOTIFICATION TOAST SYSTEM
 * 
 * Displays character-based messages, nudges, and psychological triggers
 * as toast notifications within the app interface.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Flame, Star, Heart, Trophy, Zap, Shield, Clock } from 'lucide-react';
import { NotificationData } from '@/lib/notifications';

/**
 * NotificationToastProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Handles notificationtoast functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
/**
 * NotificationToastProps interface defines the contract for implementation.
/**
 * NotificationToastProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Handles notificationtoast functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
/**
 * NotificationToastProps interface defines the contract for implementation.
 * 
/**
 * defines interface defines the contract for implementation.
 * 
/**
 * NotificationToastProps interface defines the contract for implementation.
/**
 * NotificationToastProps interface defines the contract for implementation.
/**
 * NotificationToastProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Handles notificationtoast functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * @interface NotificationToastProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface NotificationToastProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface NotificationToastProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface NotificationToastProps
 */
 * @interface NotificationToastProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface NotificationToastProps
 */
 * @interface NotificationToastProps
 */
interface NotificationToastProps {
  notifications: NotificationData[];
  onDismiss: (id: string) => void;
  onAction: (notification: NotificationData) => void;
}

export function NotificationToast({ notifications, onDismiss, onAction }: NotificationToastProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'streak_reminder': return <Flame className="h-5 w-5 text-orange-500" />;
      case 'low_xp': return <Star className="h-5 w-5 text-yellow-500" />;
      case 'achievement': return <Trophy className="h-5 w-5 text-gold-500" />;
      case 'level_up': return <Zap className="h-5 w-5 text-purple-500" />;
      case 'streak_break_warning': return <Shield className="h-5 w-5 text-red-500" />;
      case 'lives_low': return <Heart className="h-5 w-5 text-red-500" />;
      case 'weekly_goal': return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <Star className="h-5 w-5 text-gray-500" />;
    }
  };

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-400 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-blue-400 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getCharacterEmoji = (character?: string) => {
    switch (character) {
      case 'otter': return '🦦';
      case 'ai_coach': return '🤖';
      default: return '💫';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
/**
 * PersistentReminderProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface PersistentReminderProps
 */
            transition={{ 
              type: "spring", 
              damping: 20, 
              delay: index * 0.1 
            }}
          >
            <Card className={`border-2 ${getUrgencyStyle(notification.urgency)} shadow-lg`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
                          {notification.title}
                        </h4>
/**
 * PersistentReminderProps interface defines the contract for implementation.
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
 * @interface PersistentReminderProps
 */
/**
 * PersistentReminderProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface PersistentReminderProps
 */
                        {notification.character && (
                          <span className="text-xs">
                            {getCharacterEmoji(notification.character)}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={() => onDismiss(notification.id)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {notification.message}
                    </p>
/**
 * PersistentReminderProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface PersistentReminderProps
 */
                    
                    {notification.urgency && (
/**
 * Handles persistentreminder functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await PersistentReminder(params);
 */
/**
 * PersistentReminderProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface PersistentReminderProps
 */
                      <Badge 
                        variant={notification.urgency === 'high' ? 'destructive' : 
                                notification.urgency === 'medium' ? 'default' : 'secondary'}
                        className="text-xs mb-2"
                      >
                        {notification.urgency === 'high' ? 'Urgent' : 
                         notification.urgency === 'medium' ? 'Important' : 'Info'}
                      </Badge>
                    )}
                    
                    {notification.actionUrl && (
                      <Button
                        onClick={() => onAction(notification)}
                        size="sm"
                        className="w-full text-xs"
                      >
/**
 * PersistentReminderProps interface defines the contract for implementation.
 * 
/**
 * PersistentReminderProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface PersistentReminderProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
/**
 * Handles persistentreminder functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await PersistentReminder(params);
 */
 * 
 * @interface PersistentReminderProps
 */
                        Take Action
                      </Button>
/**
 * Handles persistentreminder functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await PersistentReminder(params);
 */
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface PersistentReminderProps {
  show: boolean;
  title: string;
  message: string;
  type: 'streak_danger' | 'lives_critical' | 'goal_reminder';
  onAction: () => void;
  onSnooze: () => void;
  onDismiss: () => void;
}

export function PersistentReminder({ 
  show, 
  title, 
  message, 
  type, 
  onAction, 
  onSnooze, 
  onDismiss 
}: PersistentReminderProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  const getTypeStyle = () => {
    switch (type) {
      case 'streak_danger': return 'from-red-500 to-orange-500';
      case 'lives_critical': return 'from-red-600 to-pink-600';
      case 'goal_reminder': return 'from-blue-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'streak_danger': return <Flame className="h-5 w-5" />;
      case 'lives_critical': return <Heart className="h-5 w-5" />;
      case 'goal_reminder': return <Clock className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-40`}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
        >
          <Card className={`bg-gradient-to-r ${getTypeStyle()} text-white shadow-2xl`}>
            <CardContent className="p-4">
              {isMinimized ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon()}
                    <span className="font-semibold text-sm">Reminder Active</span>
                  </div>
                  <Button
                    onClick={() => setIsMinimized(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    Expand
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon()}
                      <h3 className="font-bold">{title}</h3>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => setIsMinimized(true)}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 h-6 w-6 p-0"
                      >
                        –
                      </Button>
                      <Button
                        onClick={onDismiss}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-4 text-white/90">
                    {message}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={onAction}
                      className="flex-1 bg-white text-gray-800 hover:bg-gray-100"
                      size="sm"
                    >
                      Take Action
                    </Button>
                    <Button
                      onClick={onSnooze}
                      variant="outline"
                      className="border-white text-white hover:bg-white/20"
                      size="sm"
                    >
                      Snooze
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}