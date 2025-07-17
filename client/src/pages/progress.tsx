import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import OtterCharacter from "@/components/ui/otter-character";
import type { UserAchievement, Achievement } from "@shared/schema";

export default function Progress() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch user stats
  const { data: stats } = useQuery({
    queryKey: ["/api/user/stats"],
    enabled: !!user,
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    },
  });

  // Fetch user achievements
  const { data: achievements = [] } = useQuery<(UserAchievement & { achievement: Achievement })[]>({
    queryKey: ["/api/user/achievements"],
    enabled: !!user,
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired", 
          description: "Please log in again",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    },
  });

  // Mock recent workouts for display
  const { data: recentWorkouts = [] } = useQuery({
    queryKey: ["/api/user/workouts"],
    enabled: !!user,
  });

  const getStreakMessage = () => {
    const streak = stats?.currentStreak || 0;
    if (streak === 0) return "Start your fitness journey today! 🌟";
    if (streak < 3) return "Building momentum! Keep going! 💪";
    if (streak < 7) return "Great consistency! You're on fire! 🔥";
    if (streak < 14) return "Amazing dedication! You're unstoppable! ⚡";
    return "Legendary streak! You're a fitness champion! 👑";
  };

  const getProgressLevel = () => {
    const workouts = stats?.totalWorkouts || 0;
    if (workouts < 5) return { level: "Beginner", progress: workouts * 20, nextMilestone: 5 };
    if (workouts < 15) return { level: "Explorer", progress: ((workouts - 5) / 10) * 100, nextMilestone: 15 };
    if (workouts < 30) return { level: "Athlete", progress: ((workouts - 15) / 15) * 100, nextMilestone: 30 };
    if (workouts < 50) return { level: "Champion", progress: ((workouts - 30) / 20) * 100, nextMilestone: 50 };
    return { level: "Legend", progress: 100, nextMilestone: null };
  };

  const progressLevel = getProgressLevel();

  return (
    <div className="pt-4 pb-32 px-6 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto">
          <OtterCharacter mood="proud" size="sm" />
        </div>
        <h1 className="text-xl font-bold text-slate-800">Your Progress</h1>
        <p className="text-slate-600 text-sm">
          {getStreakMessage()}
        </p>
      </div>

      {/* Current Streak */}
      <Card className="bg-gradient-to-br from-otter-teal to-teal-600 text-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <i className="fas fa-fire text-2xl"></i>
            </div>
            <div>
              <div className="text-3xl font-bold">{stats?.currentStreak || 0} Days</div>
              <div className="text-teal-100">Current Streak</div>
              {stats?.longestStreak && stats.longestStreak > (stats.currentStreak || 0) && (
                <div className="text-teal-200 text-sm">
                  Best: {stats.longestStreak} days
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Level */}
      <Card className="shadow-sm border-slate-100">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">Progress Level</h3>
              <Badge variant="secondary" className="mt-1">
                {progressLevel.level}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-otter-teal">
                {stats?.totalWorkouts || 0}
              </div>
              <div className="text-xs text-slate-600">Workouts</div>
            </div>
          </div>
          
          {progressLevel.nextMilestone && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Progress to next level</span>
                <span>{progressLevel.nextMilestone - (stats?.totalWorkouts || 0)} more</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-otter-teal h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressLevel.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-slate-700">
              {stats?.totalMinutes || 0}
            </div>
            <div className="text-xs text-slate-600">Total Minutes</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-slate-700">
              {stats?.averageRating || 0}
            </div>
            <div className="text-xs text-slate-600">Avg Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Recent Achievements</h3>
        
        {achievements.length > 0 ? (
          <div className="space-y-3">
            {achievements.slice(0, 3).map((userAchievement) => (
              <Card key={userAchievement.id} className="shadow-sm border-slate-100">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <i className={`${userAchievement.achievement.icon} text-yellow-600`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">
                        {userAchievement.achievement.name}
                      </div>
                      <div className="text-sm text-slate-600">
                        {userAchievement.achievement.description}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm border-slate-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <i className="fas fa-trophy text-slate-400"></i>
              </div>
              <p className="text-slate-600">No achievements yet</p>
              <p className="text-sm text-slate-500 mt-1">
                Complete workouts to unlock your first achievement!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Weekly Summary */}
      <Card className="shadow-sm border-slate-100">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-slate-800">This Week</h3>
          
          <div className="grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
              // Simple logic to show workout activity (could be enhanced with real data)
              const hasWorkout = index < (stats?.currentStreak || 0) && index < 7;
              return (
                <div
                  key={index}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                    hasWorkout 
                      ? 'bg-otter-teal text-white' 
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
          
          <div className="text-sm text-slate-600 text-center">
            {stats?.currentStreak || 0} workout days this week
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-slate-50 to-otter-teal-light border-slate-100">
        <CardContent className="p-6 text-center space-y-2">
          <div className="w-12 h-12 mx-auto">
            <OtterCharacter mood="encouraging" size="sm" />
          </div>
          <p className="text-slate-700 font-medium">
            {stats?.currentStreak === 0 
              ? "Ready to start your fitness journey? Let's do this!" 
              : "You're doing amazing! Keep up the great work!"
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
