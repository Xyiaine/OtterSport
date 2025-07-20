/**
 * DUOLINGO-STYLE WORKOUT ROADMAP
 * 
 * Visual progress tracking system showing completed workouts and upcoming ones
 * connected with path lines, similar to Duolingo's lesson progression.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  Lock, 
  Crown, 
  Star, 
  Flame,
  Trophy,
  Dumbbell,
  Heart,
  Zap
} from 'lucide-react';

interface WorkoutNode {
  id: string;
  title: string;
  description: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'core' | 'boss';
  status: 'completed' | 'current' | 'locked' | 'available';
  difficulty: 'easy' | 'medium' | 'hard' | 'boss';
  xpReward: number;
  estimatedMinutes: number;
  position: { x: number; y: number };
  requirements?: string[];
  isBonus?: boolean;
  streakMultiplier?: number;
}

interface WorkoutRoadmapProps {
  userLevel: number;
  completedWorkouts: string[];
  currentStreak: number;
  onStartWorkout: (workoutId: string) => void;
}

export function WorkoutRoadmap({ userLevel, completedWorkouts, currentStreak, onStartWorkout }: WorkoutRoadmapProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Generate workout nodes based on user level and progress
  const generateWorkoutNodes = (): WorkoutNode[] => {
    const nodes: WorkoutNode[] = [];
    const pathWidth = 300;
    const nodeSpacing = 120;
    
    // Week 1 - Beginner Path
    nodes.push({
      id: 'w1-intro',
      title: 'Welcome Workout',
      description: 'Your fitness journey begins here!',
      type: 'strength',
      status: completedWorkouts.includes('w1-intro') ? 'completed' : 'available',
      difficulty: 'easy',
      xpReward: 15,
      estimatedMinutes: 10,
      position: { x: 150, y: 50 }
    });

    nodes.push({
      id: 'w1-cardio',
      title: 'First Steps',
      description: 'Light cardio to get your heart pumping',
      type: 'cardio',
      status: completedWorkouts.includes('w1-cardio') ? 'completed' : 
             completedWorkouts.includes('w1-intro') ? 'available' : 'locked',
      difficulty: 'easy',
      xpReward: 20,
      estimatedMinutes: 15,
      position: { x: 80, y: 170 }
    });

    nodes.push({
      id: 'w1-flexibility',
      title: 'Stretch & Flow',
      description: 'Flexibility and mobility basics',
      type: 'flexibility',
      status: completedWorkouts.includes('w1-flexibility') ? 'completed' :
             completedWorkouts.includes('w1-intro') ? 'available' : 'locked',
      difficulty: 'easy',
      xpReward: 20,
      estimatedMinutes: 15,
      position: { x: 220, y: 170 }
    });

    // Week 2 - Building Strength
    nodes.push({
      id: 'w2-strength',
      title: 'Power Up',
      description: 'Build your foundation strength',
      type: 'strength',
      status: completedWorkouts.includes('w2-strength') ? 'completed' :
             (completedWorkouts.includes('w1-cardio') && completedWorkouts.includes('w1-flexibility')) ? 'available' : 'locked',
      difficulty: 'medium',
      xpReward: 30,
      estimatedMinutes: 20,
      position: { x: 150, y: 290 }
    });

    // Week 2 Boss Challenge
    nodes.push({
      id: 'w2-boss',
      title: 'Week 2 Challenge',
      description: 'Test your progress with this boss workout!',
      type: 'boss',
      status: completedWorkouts.includes('w2-boss') ? 'completed' :
             completedWorkouts.includes('w2-strength') ? 'available' : 'locked',
      difficulty: 'boss',
      xpReward: 75,
      estimatedMinutes: 25,
      position: { x: 150, y: 410 }
    });

    // Week 3 - Advanced Path Split
    nodes.push({
      id: 'w3-hiit',
      title: 'HIIT Master',
      description: 'High-intensity interval training',
      type: 'cardio',
      status: completedWorkouts.includes('w3-hiit') ? 'completed' :
             completedWorkouts.includes('w2-boss') ? 'available' : 'locked',
      difficulty: 'hard',
      xpReward: 40,
      estimatedMinutes: 25,
      position: { x: 80, y: 530 }
    });

    nodes.push({
      id: 'w3-core',
      title: 'Core Crusher',
      description: 'Strengthen your core foundation',
      type: 'core',
      status: completedWorkouts.includes('w3-core') ? 'completed' :
             completedWorkouts.includes('w2-boss') ? 'available' : 'locked',
      difficulty: 'hard',
      xpReward: 40,
      estimatedMinutes: 25,
      position: { x: 220, y: 530 }
    });

    // Bonus Nodes (appear with streak bonuses)
    if (currentStreak >= 7) {
      nodes.push({
        id: 'bonus-streak',
        title: 'Streak Warrior',
        description: 'Special bonus for your consistency!',
        type: 'strength',
        status: completedWorkouts.includes('bonus-streak') ? 'completed' : 'available',
        difficulty: 'medium',
        xpReward: 50,
        estimatedMinutes: 20,
        position: { x: 300, y: 290 },
        isBonus: true,
        streakMultiplier: 1.5
      });
    }

    return nodes;
  };

  const workoutNodes = generateWorkoutNodes();

  const getNodeIcon = (node: WorkoutNode) => {
    if (node.status === 'completed') {
      return <CheckCircle className="h-8 w-8 text-green-500" />;
    }
    
    switch (node.type) {
      case 'strength': return <Dumbbell className="h-6 w-6" />;
      case 'cardio': return <Heart className="h-6 w-6" />;
      case 'flexibility': return <Star className="h-6 w-6" />;
      case 'core': return <Zap className="h-6 w-6" />;
      case 'boss': return <Crown className="h-8 w-8 text-yellow-500" />;
      default: return <Circle className="h-6 w-6" />;
    }
  };

  const getNodeStyle = (node: WorkoutNode) => {
    switch (node.status) {
      case 'completed':
        return 'bg-green-100 border-green-400 text-green-700 dark:bg-green-900/30 dark:border-green-600 dark:text-green-300';
      case 'current':
        return 'bg-blue-100 border-blue-400 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-300 ring-2 ring-blue-300';
      case 'available':
        return node.isBonus 
          ? 'bg-purple-100 border-purple-400 text-purple-700 dark:bg-purple-900/30 dark:border-purple-600 dark:text-purple-300 animate-pulse'
          : 'bg-blue-50 border-blue-300 text-blue-600 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40';
      case 'locked':
        return 'bg-gray-100 border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      case 'boss': return 'bg-purple-600';
      default: return 'bg-gray-500';
    }
  };

  // Generate connecting paths between nodes
  const generatePaths = () => {
    const connections = [
      ['w1-intro', 'w1-cardio'],
      ['w1-intro', 'w1-flexibility'],
      ['w1-cardio', 'w2-strength'],
      ['w1-flexibility', 'w2-strength'],
      ['w2-strength', 'w2-boss'],
      ['w2-boss', 'w3-hiit'],
      ['w2-boss', 'w3-core'],
    ];

    if (currentStreak >= 7) {
      connections.push(['w2-strength', 'bonus-streak']);
    }

    return connections.map(([from, to]) => {
      const fromNode = workoutNodes.find(n => n.id === from);
      const toNode = workoutNodes.find(n => n.id === to);
      
      if (!fromNode || !toNode) return null;

      const isPathActive = completedWorkouts.includes(from);
      const pathColor = isPathActive ? '#10B981' : '#D1D5DB';
      
      return (
        <motion.line
          key={`${from}-${to}`}
          x1={fromNode.position.x + 30}
          y1={fromNode.position.y + 30}
          x2={toNode.position.x + 30}
          y2={toNode.position.y + 30}
          stroke={pathColor}
          strokeWidth={isPathActive ? 4 : 2}
          strokeDasharray={isPathActive ? '0' : '5,5'}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Your Fitness Journey
            </h2>
            <Badge variant="secondary">
              {completedWorkouts.length} / {workoutNodes.length} Complete
            </Badge>
          </div>
          <Progress 
            value={(completedWorkouts.length / workoutNodes.length) * 100} 
            className="h-3"
          />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Advanced</span>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Canvas */}
      <Card className="relative overflow-auto">
        <CardContent className="p-6">
          <div className="relative w-full" style={{ height: '650px' }}>
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
              {generatePaths()}
            </svg>
            
            {workoutNodes.map((node, index) => (
              <motion.div
                key={node.id}
                className={`absolute w-16 h-16 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${getNodeStyle(node)}`}
                style={{ 
                  left: node.position.x,
                  top: node.position.y,
                  zIndex: 2
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (node.status === 'available') {
                    onStartWorkout(node.id);
                  } else {
                    setSelectedNode(selectedNode === node.id ? null : node.id);
                  }
                }}
              >
                {node.status === 'locked' ? (
                  <Lock className="h-6 w-6" />
                ) : (
                  getNodeIcon(node)
                )}
                
                {/* Bonus indicator */}
                {node.isBonus && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      ★
                    </div>
                  </div>
                )}

                {/* Streak multiplier indicator */}
                {node.streakMultiplier && (
                  <div className="absolute -bottom-2 -right-2">
                    <div className="bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      <Flame className="h-3 w-3" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Node Labels */}
            {workoutNodes.map((node) => (
              <div
                key={`label-${node.id}`}
                className="absolute text-center text-xs font-medium"
                style={{
                  left: node.position.x - 20,
                  top: node.position.y + 70,
                  width: '100px',
                  zIndex: 3
                }}
              >
                <div className={`px-2 py-1 rounded ${
                  node.status === 'completed' ? 'bg-green-100 text-green-700' :
                  node.status === 'available' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {node.title}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Node Details */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {(() => {
            const node = workoutNodes.find(n => n.id === selectedNode);
            if (!node) return null;
            
            return (
              <Card className="border-2 border-blue-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        {getNodeIcon(node)}
                        {node.title}
                        {node.isBonus && (
                          <Badge className="bg-purple-500 text-white">Bonus</Badge>
                        )}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {node.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getDifficultyColor(node.difficulty)}`} />
                      <span className="text-sm font-medium capitalize">
                        {node.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {node.xpReward}
                        {node.streakMultiplier && (
                          <span className="text-orange-500">×{node.streakMultiplier}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">XP Reward</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {node.estimatedMinutes}
                      </div>
                      <div className="text-xs text-gray-500">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600 capitalize">
                        {node.type}
                      </div>
                      <div className="text-xs text-gray-500">Type</div>
                    </div>
                  </div>

                  {node.status === 'available' && (
                    <Button 
                      onClick={() => onStartWorkout(node.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      Start Workout
                    </Button>
                  )}

                  {node.status === 'completed' && (
                    <div className="text-center text-green-600 font-semibold">
                      ✅ Completed!
                    </div>
                  )}

                  {node.status === 'locked' && (
                    <div className="text-center text-gray-500">
                      🔒 Complete previous workouts to unlock
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })()}
        </motion.div>
      )}

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-5 w-5 text-blue-500" />
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-gray-500" />
              <span className="text-sm">Locked</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <span className="text-sm">Boss Challenge</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}