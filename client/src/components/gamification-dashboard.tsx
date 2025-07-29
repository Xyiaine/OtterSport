/**
 * GAMIFICATION DASHBOARD COMPONENT
 * 
 * A comprehensive dashboard displaying all gamification features:
 * - XP and Level Progress
 * - Daily Streak with Protection
 * - Achievement Gallery
 * - Weekly Leaderboards
 * - Life/Heart System
 * - Badge Collection
 */

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LevelUpAnimation, AchievementPopup, XPGainAnimation, StreakAnimation } from '@/components/ui/progress-animations';
import { StreakWarning, LivesWarning } from '@/components/ui/loss-aversion-warnings';
import { ProgressCommitmentDashboard, GoalSetting } from '@/components/ui/progress-commitment';
import { NotificationToast, PersistentReminder } from '@/components/ui/notification-toast';
import { WorkoutRoadmap } from '@/components/ui/workout-roadmap';
import { notificationService } from '@/lib/notifications';
import {
  Trophy,
  Star,
  Flame,
  Heart,
  Shield,
  Medal,
  Crown,
  Zap,
  Target,
  Calendar,
  Clock,
  Users,
} from 'lucide-react';

interface GamificationSummary {
  experiencePoints: number;
  currentLevel: number;
  xpToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  totalMinutes: number;
  livesRemaining: number;
  streakFreezeUses: number;
  weeklyRank: number | null;
  recentAchievements: Achievement[];
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
  requirement: any;
}

interface LeaderboardEntry {
  userId: string;
  weeklyXP: number;
  weeklyWorkouts: number;
  weeklyMinutes: number;
  firstName: string;
  lastName: string;
  currentLevel: number;
}

interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
  isAtRisk: boolean;
  canUseFreeze: boolean;
  streakFreezeUses: number;
}

interface LivesInfo {
  livesRemaining: number;
  maxLives: number;
  livesRefillAt: string | null;
  timeUntilRefill: number | null;
}

export function GamificationDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Psychological trigger states
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [showStreakWarning, setShowStreakWarning] = useState(false);
  const [showLivesWarning, setShowLivesWarning] = useState(false);
  const [showGoalSetting, setShowGoalSetting] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [persistentReminder, setPersistentReminder] = useState(null);
  
  // Animation data
  const [levelUpData, setLevelUpData] = useState({ newLevel: 1, xpGained: 0 });
  const [newAchievement, setNewAchievement] = useState(null);

  // Mock goals data - in real app, this would come from API
  const [userGoals, setUserGoals] = useState([
    {
      id: '1',
      type: 'daily' as const,
      target: 1,
      current: 0,
      unit: 'workouts',
      description: 'Complete daily workout'
    },
    {
      id: '2', 
      type: 'weekly' as const,
      target: 5,
      current: 2,
      unit: 'workouts',
      description: 'Weekly workout target'
    }
  ]);

  // Fetch gamification summary
  const { data: summary, isLoading: summaryLoading } = useQuery<GamificationSummary>({
    queryKey: ['/api/gamification/summary'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/gamification/achievements'],
  });

  // Fetch leaderboard
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/gamification/leaderboard/weekly'],
  });

  // Fetch streak info
  const { data: streakInfo, isLoading: streakLoading } = useQuery<StreakInfo>({
    queryKey: ['/api/gamification/streak'],
  });

  // Fetch lives info
  const { data: livesInfo, isLoading: livesLoading } = useQuery<LivesInfo>({
    queryKey: ['/api/gamification/lives'],
    refetchInterval: 60000, // Refresh every minute
  });
  
  // Initialize notifications
  useEffect(() => {
    notificationService.initialize();
    
    // Listen for notification events
    const handleNotification = (event: any) => {
      setNotifications(prev => [...prev, event.detail]);
    };
    
    window.addEventListener('ottersport-notification', handleNotification);
    return () => window.removeEventListener('ottersport-notification', handleNotification);
  }, []);

  // Check for streak warnings
  useEffect(() => {
    if (streakInfo?.isAtRisk && streakInfo.currentStreak >= 3) {
      notificationService.sendStreakBreakWarning(streakInfo.currentStreak, 12); // Assume 12 hours left
      setShowStreakWarning(true);
    }
  }, [streakInfo]);

  // Check for lives warnings
  useEffect(() => {
    if (livesInfo?.livesRemaining <= 2) {
      notificationService.sendLivesLowWarning(livesInfo.livesRemaining);
      setShowLivesWarning(true);
    }
  }, [livesInfo]);

  // Streak freeze mutation
  const streakFreezeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/gamification/streak/freeze', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Streak Protected! 🛡️",
        description: "Your streak has been frozen for today.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/gamification/streak'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Freeze Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getLevelProgress = () => {
    if (!summary) return 0;
    const levelXP = summary.experiencePoints - (summary.experiencePoints - summary.xpToNextLevel);
    const totalXPForLevel = summary.xpToNextLevel + levelXP;
    return totalXPForLevel > 0 ? (levelXP / totalXPForLevel) * 100 : 0;
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatTimeUntilRefill = (milliseconds: number | null): string => {
    if (!milliseconds) return '';
    const minutes = Math.ceil(milliseconds / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const handleWorkoutNow = () => {
    window.location.href = '/workout';
  };

  const handleUseStreakFreeze = () => {
    streakFreezeMutation.mutate();
    setShowStreakWarning(false);
  };

  const handleNotificationAction = (notification) => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    setNotifications(prev => prev.filter(n => n.id !== notification.id));
  };

  const handleNotificationDismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Notification Toasts */}
      <NotificationToast
        notifications={notifications}
        onDismiss={handleNotificationDismiss}
        onAction={handleNotificationAction}
      />

      {/* Persistent Reminders */}
      {persistentReminder && (
        <PersistentReminder
          show={!!persistentReminder}
          title={persistentReminder.title}
          message={persistentReminder.message}
          type={persistentReminder.type}
          onAction={persistentReminder.onAction}
          onSnooze={persistentReminder.onSnooze}
          onDismiss={() => setPersistentReminder(null)}
        />
      )}

      {/* Progress Animations */}
      <LevelUpAnimation
        show={showLevelUpAnimation}
        newLevel={levelUpData.newLevel}
        xpGained={levelUpData.xpGained}
        onComplete={() => setShowLevelUpAnimation(false)}
      />

      <AchievementPopup
        show={showAchievementPopup}
        achievement={newAchievement || { name: '', description: '', icon: '' }}
        onComplete={() => setShowAchievementPopup(false)}
      />

      {/* Loss Aversion Warnings */}
      <StreakWarning
        show={showStreakWarning}
        streakCount={streakInfo?.currentStreak || 0}
        hoursRemaining={12}
        onWorkoutNow={handleWorkoutNow}
        onUseFreeze={handleUseStreakFreeze}
        onDismiss={() => setShowStreakWarning(false)}
        canUseFreeze={streakInfo?.canUseFreeze || false}
      />

      <LivesWarning
        show={showLivesWarning}
        livesRemaining={livesInfo?.livesRemaining || 5}
        onContinue={() => setShowLivesWarning(false)}
        onRecover={() => {/* Handle life recovery */}}
        onQuit={() => setShowLivesWarning(false)}
        recoveryOptions={[
          { type: 'currency', cost: 10, label: 'Spend 10 coins' },
          { type: 'ad', label: 'Watch ad to recover' }
        ]}
      />

      {/* Goal Setting Modal */}
      <GoalSetting
        show={showGoalSetting}
        currentGoals={userGoals as any}
        onSave={setUserGoals as any}
        onClose={() => setShowGoalSetting(false)}
      />
      {/* Header with XP and Level */}
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Crown className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Level {summary?.currentLevel || 1}</h2>
              <p className="text-muted-foreground">{summary?.experiencePoints || 0} XP</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={getLevelProgress()} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {summary?.xpToNextLevel || 0} XP to Level {(summary?.currentLevel || 1) + 1}
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{summary?.currentStreak || 0}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{summary?.totalWorkouts || 0}</p>
            <p className="text-sm text-muted-foreground">Workouts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{formatTime(summary?.totalMinutes || 0)}</p>
            <p className="text-sm text-muted-foreground">Total Time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">#{summary?.weeklyRank || '--'}</p>
            <p className="text-sm text-muted-foreground">Weekly Rank</p>
          </CardContent>
        </Card>
      </div>

      {/* Lives System */}
      {livesInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Lives Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {Array.from({ length: livesInfo.maxLives }, (_, i) => (
                <Heart
                  key={i}
                  className={`h-6 w-6 ${
                    i < livesInfo.livesRemaining
                      ? 'text-red-500 fill-red-500'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
              <span className="ml-4 text-sm text-muted-foreground">
                {livesInfo.livesRemaining}/{livesInfo.maxLives}
              </span>
              {livesInfo.timeUntilRefill && (
                <span className="ml-4 text-sm text-muted-foreground">
                  Refill in {formatTimeUntilRefill(livesInfo.timeUntilRefill)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="streak">Streak</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress Commitment Dashboard */}
          <ProgressCommitmentDashboard
            goals={userGoals as any}
            onEditGoals={() => setShowGoalSetting(true)}
          />

          {/* Recent Achievements */}
          {summary?.recentAchievements && summary.recentAchievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {summary.recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                        <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <p className="font-semibold">{achievement.name}</p>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Motivation Section */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-2">
                🎯 Stay Committed to Your Goals
              </h3>
              <p className="text-purple-600 dark:text-purple-400 mb-4">
                Consistency is the key to success. Every workout brings you closer to your fitness goals!
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  {summary?.totalWorkouts || 0} workouts completed
                </Badge>
                <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                  Level {summary?.currentLevel || 1} achieved
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {summary?.currentStreak || 0} day streak
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements?.map((achievement: Achievement) => (
              <Card key={achievement.id} className={achievement.unlocked ? 'border-yellow-200' : 'opacity-60'}>
                <CardContent className="p-4 text-center">
                  <div className={`p-3 rounded-full mb-3 mx-auto w-fit ${
                    achievement.unlocked 
                      ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <Trophy className={`h-6 w-6 ${
                      achievement.unlocked 
                        ? 'text-yellow-600 dark:text-yellow-400' 
                        : 'text-gray-400'
                    }`} />
                  </div>
                  <h3 className="font-semibold mb-1">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="text-xs">
                      Unlocked {new Date(achievement.unlockedAt!).toLocaleDateString()}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-gold-500" />
                Weekly Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard?.map((entry: LeaderboardEntry, index: number) => (
                  <div key={entry.userId} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{entry.firstName} {entry.lastName}</p>
                      <p className="text-sm text-muted-foreground">
                        Level {entry.currentLevel} • {entry.weeklyWorkouts} workouts
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{entry.weeklyXP} XP</p>
                      <p className="text-sm text-muted-foreground">{formatTime(entry.weeklyMinutes)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streak" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Daily Streak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-6xl font-bold text-orange-500 mb-2">
                  {streakInfo?.currentStreak || 0}
                </div>
                <p className="text-lg text-muted-foreground">Current Streak</p>
                <p className="text-sm text-muted-foreground">
                  Best: {streakInfo?.longestStreak || 0} days
                </p>
              </div>

              {streakInfo?.isAtRisk && streakInfo?.canUseFreeze && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-semibold text-orange-900 dark:text-orange-100">
                          Streak at Risk!
                        </p>
                        <p className="text-sm text-orange-700 dark:text-orange-200">
                          Use a freeze to protect your streak
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => streakFreezeMutation.mutate()}
                      disabled={streakFreezeMutation.isPending}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {streakFreezeMutation.isPending ? 'Applying...' : 'Use Freeze'}
                    </Button>
                  </div>
                </div>
              )}

              <div className="text-center text-sm text-muted-foreground">
                <p>Streak freezes used this month: {streakInfo?.streakFreezeUses || 0}/3</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          <WorkoutRoadmap
            userLevel={summary?.currentLevel || 1}
            completedWorkouts={['w1-intro', 'w1-cardio']} // Mock completed workouts
            currentStreak={streakInfo?.currentStreak || 0}
            onStartWorkout={(workoutId) => {
              // Navigate to workout with specific ID
              window.location.href = `/workout?id=${workoutId}`;
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}