/**
 * PROGRESS COMMITMENT SYSTEM
 * 
 * Implements psychological commitment mechanisms including daily/weekly goals,
 * streak milestones, and customizable targets to anchor user progress.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Target, 
  Calendar, 
  Star, 
  Trophy, 
  Flame, 
  CheckCircle, 
  Settings,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';

/**
 * Goal interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Goal interface defines the contract for implementation.
/**
 * Goal interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Goal interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Goal
 */
 * @interface Goal
/**
 * GoalSettingProps interface defines the contract for implementation.
/**
 * defines interface defines the contract for implementation.
 * 
/**
 * Goal interface defines the contract for implementation.
/**
 * Goal interface defines the contract for implementation.
/**
 * Goal interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Goal
/**
 * GoalSettingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GoalSettingProps
 */
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Goal
 */
 * 
/**
 * GoalSettingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GoalSettingProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Goal
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * GoalSettingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GoalSettingProps
/**
 * Handles goalsetting functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 */
 * @interface defines
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GoalSettingProps
 */
 */
 * 
/**
 * GoalSettingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GoalSettingProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Goal
 */
 * @interface Goal
 */
interface Goal {
/**
 * GoalSettingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GoalSettingProps
/**
 * Handles goalsetting functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 */
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
/**
 * GoalSettingProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GoalSettingProps
/**
 * Handles goalsetting functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 */
  target: number;
  current: number;
  unit: 'workouts' | 'minutes' | 'xp' | 'streak';
  description: string;
  reward?: string;
  deadline?: Date;
}

interface GoalSettingProps {
  show: boolean;
  currentGoals: Goal[];
  onSave: (goals: Goal[]) => void;
  onClose: () => void;
}

export function GoalSetting({ show, currentGoals, onSave, onClose }: GoalSettingProps) {
  const [goals, setGoals] = useState<Goal[]>(currentGoals);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const defaultGoals: Partial<Goal>[] = [
    { type: 'daily', target: 1, unit: 'workouts', description: 'Daily workout commitment' },
    { type: 'weekly', target: 5, unit: 'workouts', description: 'Weekly workout target' },
    { type: 'weekly', target: 150, unit: 'minutes', description: 'Weekly exercise minutes' },
    { type: 'monthly', target: 7, unit: 'streak', description: 'Longest streak this month' },
  ];

  const handleSaveGoal = (goal: Goal) => {
    const updatedGoals = goals.map(g => g.id === goal.id ? goal : g);
/**
 * GoalEditorProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GoalEditorProps
 */
    if (!goals.find(g => g.id === goal.id)) {
      updatedGoals.push(goal);
    }
    setGoals(updatedGoals);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
/**
 * GoalEditorProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GoalEditorProps
 */
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Customize Your Goals
          </h2>
          <Button onClick={onClose} variant="ghost" size="sm">✕</Button>
        </div>

        <div className="space-y-4">
          {/* Existing Goals */}
          {goals.map((goal) => (
            <Card key={goal.id} className="border-2 border-gray-200 dark:border-gray-700">
/**
 * GoalEditorProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GoalEditorProps
 */
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={goal.type === 'daily' ? 'default' : goal.type === 'weekly' ? 'secondary' : 'outline'}>
                        {goal.type}
                      </Badge>
                      <span className="font-semibold">{goal.description}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Target: {goal.target} {goal.unit}
                    </p>
                    <Progress 
                      value={(goal.current / goal.target) * 100} 
                      className="h-2 mt-2"
                    />
/**
 * GoalEditorProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Handles goaleditor functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * @interface GoalEditorProps
 */
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditingGoal(goal)}
                      variant="outline"
/**
 * ProgressCommitmentDashboardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressCommitmentDashboardProps
 */
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteGoal(goal.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
/**
 * GoalEditorProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface GoalEditorProps
 */
              </CardContent>
            </Card>
          ))}

          {/* Add New Goal */}
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
            <CardContent className="p-4 text-center">
              <Button
                onClick={() => setEditingGoal({
                  id: `goal-${Date.now()}`,
                  type: 'daily',
                  target: 1,
                  current: 0,
                  unit: 'workouts',
                  description: 'New goal'
/**
 * ProgressCommitmentDashboardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressCommitmentDashboardProps
 */
                })}
/**
 * GoalEditorProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Handles goaleditor functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * @interface GoalEditorProps
 */
                variant="outline"
                className="w-full"
              >
                <Target className="h-4 w-4 mr-2" />
                Add New Goal
              </Button>
            </CardContent>
          </Card>
        </div>
/**
 * ProgressCommitmentDashboardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressCommitmentDashboardProps
 */

/**
 * GoalEditorProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Handles goaleditor functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * @interface GoalEditorProps
 */
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={() => onSave(goals)} className="bg-teal-600 hover:bg-teal-700">
            Save Goals
          </Button>
        </div>
      </motion.div>

      {/* Goal Editor Modal */}
      {editingGoal && (
        <GoalEditor
          goal={editingGoal}
          onSave={handleSaveGoal}
/**
 * ProgressCommitmentDashboardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
/**
 * Handles progresscommitmentdashboard functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * 
 * @interface ProgressCommitmentDashboardProps
 */
          onCancel={() => setEditingGoal(null)}
        />
      )}
    </motion.div>
  );
}

interface GoalEditorProps {
  goal: Goal;
  onSave: (goal: Goal) => void;
  onCancel: () => void;
}

function GoalEditor({ goal, onSave, onCancel }: GoalEditorProps) {
  const [editedGoal, setEditedGoal] = useState(goal);

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-60 p-4"
      initial={{ opacity: 0 }}
/**
 * ProgressCommitmentDashboardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ProgressCommitmentDashboardProps
 */
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h3 className="text-xl font-bold mb-4">Edit Goal</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={editedGoal.description}
              onChange={(e) => setEditedGoal({...editedGoal, description: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="type">Period</Label>
            <Select
              value={editedGoal.type}
              onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                setEditedGoal({...editedGoal, type: value})
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
/**
 * ProgressCommitmentDashboardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
/**
 * Handles progresscommitmentdashboard functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * 
 * @interface ProgressCommitmentDashboardProps
 */
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="unit">Unit</Label>
            <Select
              value={editedGoal.unit}
              onValueChange={(value: 'workouts' | 'minutes' | 'xp' | 'streak') => 
                setEditedGoal({...editedGoal, unit: value})
              }
            >
              <SelectTrigger>
                <SelectValue />
/**
 * ProgressCommitmentDashboardProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
/**
 * Handles progresscommitmentdashboard functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * 
 * @interface ProgressCommitmentDashboardProps
 */
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="workouts">Workouts</SelectItem>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="xp">XP</SelectItem>
                <SelectItem value="streak">Streak Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="target">Target: {editedGoal.target}</Label>
            <Slider
              value={[editedGoal.target]}
              onValueChange={(value) => setEditedGoal({...editedGoal, target: value[0]})}
              max={editedGoal.unit === 'minutes' ? 300 : editedGoal.unit === 'xp' ? 1000 : 30}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={() => onSave(editedGoal)}>
            Save
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ProgressCommitmentDashboardProps {
  goals: Goal[];
  onEditGoals: () => void;
}

export function ProgressCommitmentDashboard({ goals, onEditGoals }: ProgressCommitmentDashboardProps) {
  const getTodaysGoals = () => goals.filter(g => g.type === 'daily');
  const getWeeklyGoals = () => goals.filter(g => g.type === 'weekly');
  const getMonthlyGoals = () => goals.filter(g => g.type === 'monthly');

  const getGoalIcon = (unit: string) => {
    switch (unit) {
      case 'workouts': return <Target className="h-4 w-4" />;
      case 'minutes': return <Clock className="h-4 w-4" />;
      case 'xp': return <Star className="h-4 w-4" />;
      case 'streak': return <Flame className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600 dark:text-green-400';
    if (percentage >= 80) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Your Commitments
        </h2>
        <Button onClick={onEditGoals} variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Customize Goals
        </Button>
      </div>

      {/* Today's Goals */}
      {getTodaysGoals().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              Today's Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getTodaysGoals().map((goal) => {
              const percentage = Math.min((goal.current / goal.target) * 100, 100);
              const isCompleted = percentage >= 100;
              
              return (
                <div key={goal.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-600'}`}>
                      {isCompleted ? 
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" /> : 
                        getGoalIcon(goal.unit)
                      }
                    </div>
                    <div>
                      <p className="font-semibold">{goal.description}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {goal.current}/{goal.target} {goal.unit}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getProgressColor(percentage)}`}>
                      {Math.round(percentage)}%
                    </p>
                    {isCompleted && (
                      <Badge variant="secondary" className="text-xs">
                        ✅ Complete
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Weekly Goals */}
      {getWeeklyGoals().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5" />
              This Week's Targets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getWeeklyGoals().map((goal) => {
              const percentage = Math.min((goal.current / goal.target) * 100, 100);
              
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getGoalIcon(goal.unit)}
                      <span className="font-semibold">{goal.description}</span>
                    </div>
                    <span className={`font-bold ${getProgressColor(percentage)}`}>
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-3" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 text-right">
                    {Math.round(percentage)}% complete
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Streak Milestones */}
      <Card className="border-2 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-orange-600 dark:text-orange-400">
            <Flame className="h-5 w-5" />
            Streak Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[3, 7, 14, 30, 60, 100].map((milestone) => {
              const currentStreak = goals.find(g => g.unit === 'streak')?.current || 0;
              const achieved = currentStreak >= milestone;
              const isNext = !achieved && currentStreak < milestone && 
                            (currentStreak >= (milestone === 3 ? 0 : [3, 7, 14, 30, 60].find(m => m < milestone) || 0));
              
              return (
                <div key={milestone} className={`flex items-center justify-between p-3 rounded-lg ${
                  achieved ? 'bg-orange-100 dark:bg-orange-900/30' : 
                  isNext ? 'bg-yellow-100 dark:bg-yellow-900/30' : 
                  'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      achieved ? 'bg-orange-500' : isNext ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}>
                      {achieved ? 
                        <Trophy className="h-4 w-4 text-white" /> :
                        <Flame className="h-4 w-4 text-white" />
                      }
                    </div>
                    <span className="font-semibold">
                      {milestone} Day Streak
                    </span>
                  </div>
                  <div>
                    {achieved && (
                      <Badge className="bg-orange-500 hover:bg-orange-600">
                        Achieved! 🎉
                      </Badge>
                    )}
                    {isNext && (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                        Next Goal
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Commitment Quote */}
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20">
        <CardContent className="p-4 text-center">
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            "A goal without a plan is just a wish."
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your commitment to these goals shapes your fitness journey. Stay consistent!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}