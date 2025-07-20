/**
 * NOTIFICATION & NUDGE SYSTEM
 * 
 * Handles push notifications, in-app messages, and psychological nudges
 * to maintain user engagement and motivation.
 */

export interface NotificationData {
  id: string;
  type: 'streak_reminder' | 'low_xp' | 'achievement' | 'level_up' | 'streak_break_warning' | 'lives_low' | 'weekly_goal';
  title: string;
  message: string;
  character?: 'otter' | 'ai_coach';
  urgency: 'low' | 'medium' | 'high';
  actionUrl?: string;
  scheduledFor?: Date;
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private pendingNotifications: NotificationData[] = [];

  async initialize(): Promise<void> {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
    }
  }

  /**
   * STREAK REMINDERS - Daily notifications to maintain streaks
   */
  scheduleStreakReminder(currentStreak: number): void {
    const messages = this.getStreakMessages(currentStreak);
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    const notification: NotificationData = {
      id: `streak-reminder-${Date.now()}`,
      type: 'streak_reminder',
      title: "🔥 Don't Break Your Streak!",
      message: randomMessage,
      character: 'otter',
      urgency: 'high',
      actionUrl: '/workout',
      scheduledFor: this.getNextReminderTime(),
    };

    this.scheduleNotification(notification);
  }

  private getStreakMessages(streak: number): string[] {
    if (streak >= 30) {
      return [
        `Your ${streak}-day streak is legendary! Don't let it slip away today! 👑`,
        `You're a fitness champion with ${streak} days! Keep the momentum going! ⚡`,
        `${streak} days of dedication! You're unstoppable - finish strong today! 🚀`,
      ];
    } else if (streak >= 7) {
      return [
        `Week ${Math.floor(streak / 7)} complete! Don't break your ${streak}-day streak now! 🌟`,
        `Your ${streak}-day streak is impressive! One more workout to keep it alive! 💪`,
        `You've got ${streak} days of momentum - don't stop now! 🔥`,
      ];
    } else if (streak >= 3) {
      return [
        `${streak} days and counting! You're building a habit - keep it up! 🎯`,
        `Your ${streak}-day streak is growing strong! Don't miss today! 💚`,
        `Day ${streak} streak - you're on fire! Time for another workout! 🏃‍♂️`,
      ];
    } else {
      return [
        `Start your fitness journey today! Every champion begins with day 1! 🌱`,
        `Ready for another workout? Your future self will thank you! ✨`,
        `Let's get moving! Your otter coach is waiting for you! 🦦`,
      ];
    }
  }

  /**
   * LOW XP NUDGES - Competitive motivation based on progress
   */
  sendLowXPNudge(currentXP: number, friendXP?: number, targetXP?: number): void {
    let message = '';
    
    if (friendXP && currentXP < friendXP) {
      const gap = friendXP - currentXP;
      message = `You're just ${gap} XP behind your friend! One workout could close the gap! 🏆`;
    } else if (targetXP) {
      const needed = targetXP - currentXP;
      message = `Only ${needed} XP to your next level! You're so close! ⬆️`;
    } else {
      message = `Time to earn some XP! Your fitness journey awaits! 💎`;
    }

    const notification: NotificationData = {
      id: `low-xp-${Date.now()}`,
      type: 'low_xp',
      title: '🎯 XP Opportunity!',
      message,
      character: 'otter',
      urgency: 'medium',
      actionUrl: '/workout',
    };

    this.showNotification(notification);
  }

  /**
   * STREAK BREAK WARNINGS - Loss aversion tactics
   */
  sendStreakBreakWarning(streak: number, hoursLeft: number): void {
    const messages = [
      `⚠️ Your ${streak}-day streak expires in ${hoursLeft} hours! Don't let it slip away!`,
      `🚨 Time is running out! Save your ${streak}-day streak with a quick workout!`,
      `⏰ Only ${hoursLeft} hours left to maintain your ${streak}-day streak!`,
    ];

    const notification: NotificationData = {
      id: `streak-warning-${Date.now()}`,
      type: 'streak_break_warning',
      title: '🔥 Streak in Danger!',
      message: messages[Math.floor(Math.random() * messages.length)],
      character: 'otter',
      urgency: 'high',
      actionUrl: '/workout',
    };

    this.showNotification(notification);
  }

  /**
   * LIVES LOW WARNING - Urgency for life system
   */
  sendLivesLowWarning(livesRemaining: number): void {
    if (livesRemaining <= 1) {
      const notification: NotificationData = {
        id: `lives-critical-${Date.now()}`,
        type: 'lives_low',
        title: '💔 Last Life!',
        message: 'One mistake left! Focus and make it count! You got this! 💪',
        character: 'otter',
        urgency: 'high',
      };
      this.showNotification(notification);
    } else if (livesRemaining <= 2) {
      const notification: NotificationData = {
        id: `lives-low-${Date.now()}`,
        type: 'lives_low',
        title: '❤️ Lives Running Low',
        message: `Only ${livesRemaining} lives left! Be careful with your next moves! 🎯`,
        character: 'otter',
        urgency: 'medium',
      };
      this.showNotification(notification);
    }
  }

  /**
   * ACHIEVEMENT CELEBRATIONS
   */
  celebrateAchievement(achievementName: string, description: string): void {
    const notification: NotificationData = {
      id: `achievement-${Date.now()}`,
      type: 'achievement',
      title: '🏆 Achievement Unlocked!',
      message: `${achievementName}: ${description}`,
      character: 'otter',
      urgency: 'low',
      actionUrl: '/progress?tab=achievements',
    };

    this.showNotification(notification);
  }

  /**
   * LEVEL UP CELEBRATIONS
   */
  celebrateLevelUp(newLevel: number, xpGained: number): void {
    const notification: NotificationData = {
      id: `level-up-${Date.now()}`,
      type: 'level_up',
      title: '⬆️ Level Up!',
      message: `Congratulations! You reached Level ${newLevel} with ${xpGained} XP! 🌟`,
      character: 'otter',
      urgency: 'low',
      actionUrl: '/progress',
    };

    this.showNotification(notification);
  }

  /**
   * WEEKLY GOAL REMINDERS
   */
  sendWeeklyGoalReminder(progress: number, target: number, daysLeft: number): void {
    const percentage = Math.round((progress / target) * 100);
    const remaining = target - progress;

    let message = '';
    if (percentage >= 80) {
      message = `You're ${percentage}% to your weekly goal! Just ${remaining} workouts to go! 🎯`;
    } else if (percentage >= 50) {
      message = `Halfway there! ${remaining} more workouts needed in ${daysLeft} days! 💪`;
    } else {
      message = `${remaining} workouts needed in ${daysLeft} days to reach your weekly goal! 📈`;
    }

    const notification: NotificationData = {
      id: `weekly-goal-${Date.now()}`,
      type: 'weekly_goal',
      title: '📅 Weekly Goal Check',
      message,
      character: 'ai_coach',
      urgency: 'medium',
      actionUrl: '/workout',
    };

    this.showNotification(notification);
  }

  /**
   * NOTIFICATION DISPLAY METHODS
   */
  private async showNotification(notification: NotificationData): Promise<void> {
    // Store in-app notification
    this.pendingNotifications.push(notification);
    
    // Show browser notification if permitted
    if (this.permission === 'granted' && 'Notification' in window) {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/game-assets/interface/logo.png',
        badge: '/game-assets/interface/logo.png',
        tag: notification.type,
        requireInteraction: notification.urgency === 'high',
      });

      browserNotification.onclick = () => {
        if (notification.actionUrl) {
          window.focus();
          window.location.href = notification.actionUrl;
        }
        browserNotification.close();
      };
    }

    // Emit custom event for in-app handling
    window.dispatchEvent(new CustomEvent('ottersport-notification', {
      detail: notification
    }));
  }

  private scheduleNotification(notification: NotificationData): void {
    if (notification.scheduledFor) {
      const delay = notification.scheduledFor.getTime() - Date.now();
      if (delay > 0) {
        setTimeout(() => {
          this.showNotification(notification);
        }, delay);
      }
    }
  }

  private getNextReminderTime(): Date {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    
    // Schedule for 6 PM the next day if no workout completed
    tomorrow.setHours(18, 0, 0, 0);
    return tomorrow;
  }

  /**
   * PUBLIC METHODS FOR COMPONENT INTEGRATION
   */
  getPendingNotifications(): NotificationData[] {
    return this.pendingNotifications;
  }

  dismissNotification(id: string): void {
    this.pendingNotifications = this.pendingNotifications.filter(n => n.id !== id);
  }

  clearAllNotifications(): void {
    this.pendingNotifications = [];
  }
}

export const notificationService = new NotificationService();