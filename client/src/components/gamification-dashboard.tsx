/**
 * Gamification Dashboard - Minimal Implementation
 * Simple component for displaying user progress and achievements
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Badge component removed for minimal design
import { Progress } from "@/components/ui/progress";

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

interface GamificationDashboardProps {
  achievements?: Achievement[];
  userLevel?: number;
  xp?: number;
  xpToNext?: number;
  streakDays?: number;
  totalWorkouts?: number;
}

export default function GamificationDashboard({
  achievements = [],
  userLevel = 1,
  xp = 0,
  xpToNext = 100,
  streakDays = 0,
  totalWorkouts = 0,
}: GamificationDashboardProps) {
  const progressPercentage = (xp / xpToNext) * 100;

  return (
    <div className="space-y-6">
      {/* Level and XP Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Level {userLevel}</span>
            <Badge variant="secondary">{xp} XP</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userLevel + 1}</span>
              <span>{xp}/{xpToNext} XP</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{streakDays}</div>
              <div className="text-sm text-slate-600">Day Streak</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-500">{totalWorkouts}</div>
              <div className="text-sm text-slate-600">Total Workouts</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.length === 0 ? (
              <div className="col-span-full text-center py-8 text-slate-500">
                <div className="text-2xl mb-2">🏆</div>
                <p>No achievements yet</p>
                <p className="text-sm">Complete workouts to unlock achievements!</p>
              </div>
            ) : (
              achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    achievement.unlocked
                      ? "bg-green-50 border-green-200"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{achievement.name}</div>
                    <div className="text-xs text-slate-600">{achievement.description}</div>
                    {achievement.progress !== undefined && achievement.target && (
                      <div className="mt-1">
                        <Progress
                          value={(achievement.progress / achievement.target) * 100}
                          className="h-1"
                        />
                        <div className="text-xs text-slate-500 mt-1">
                          {achievement.progress}/{achievement.target}
                        </div>
                      </div>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="default" className="text-xs">
                      Unlocked
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}