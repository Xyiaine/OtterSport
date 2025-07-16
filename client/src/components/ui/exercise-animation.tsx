import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { Exercise } from "@shared/schema";

interface ExerciseAnimationProps {
  exercise: Exercise;
  isActive: boolean;
}

// Exercise animation components for different categories
const StrengthAnimation = ({ exercise, isActive }: { exercise: Exercise; isActive: boolean }) => (
  <div className="relative w-24 h-24 mx-auto">
    <motion.div
      animate={isActive ? {
        scale: [1, 1.1, 1],
        rotate: [0, -5, 5, 0],
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center"
    >
      <motion.i
        className={`${exercise.icon} text-white text-2xl`}
        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
      />
    </motion.div>
    {/* Strength effect particles */}
    {isActive && (
      <>
        <motion.div
          className="absolute top-0 left-0 w-2 h-2 bg-red-400 rounded-full"
          animate={{
            x: [0, 20, -10, 0],
            y: [0, -15, -5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-2 h-2 bg-red-600 rounded-full"
          animate={{
            x: [0, -15, 10, 0],
            y: [0, -20, -8, 0],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
        />
      </>
    )}
  </div>
);

const CardioAnimation = ({ exercise, isActive }: { exercise: Exercise; isActive: boolean }) => (
  <div className="relative w-24 h-24 mx-auto">
    <motion.div
      animate={isActive ? {
        scale: [1, 0.95, 1.05, 1],
      } : {}}
      transition={{ duration: 0.8, repeat: Infinity }}
      className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center"
    >
      <motion.i
        className={`${exercise.icon} text-white text-2xl`}
        animate={isActive ? { 
          scale: [1, 1.3, 1],
          rotate: [0, 360],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
    {/* Cardio pulse rings */}
    {isActive && (
      <>
        <motion.div
          className="absolute inset-0 border-4 border-orange-400 rounded-full"
          animate={{
            scale: [1, 1.5],
            opacity: [0.7, 0],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 border-4 border-red-400 rounded-full"
          animate={{
            scale: [1, 1.3],
            opacity: [0.5, 0],
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        />
      </>
    )}
  </div>
);

const CoreAnimation = ({ exercise, isActive }: { exercise: Exercise; isActive: boolean }) => (
  <div className="relative w-24 h-24 mx-auto">
    <motion.div
      animate={isActive ? {
        rotateY: [0, 180, 360],
      } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center"
    >
      <motion.i
        className={`${exercise.icon} text-white text-2xl`}
        animate={isActive ? { 
          scale: [1, 1.1, 1],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
    {/* Core stability lines */}
    {isActive && (
      <>
        <motion.div
          className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-400"
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-0 left-1/2 w-0.5 h-full bg-purple-400"
          animate={{
            scaleY: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </>
    )}
  </div>
);

const FlexibilityAnimation = ({ exercise, isActive }: { exercise: Exercise; isActive: boolean }) => (
  <div className="relative w-24 h-24 mx-auto">
    <motion.div
      animate={isActive ? {
        rotate: [0, 15, -15, 0],
        scale: [1, 1.05, 1],
      } : {}}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="w-full h-full bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center"
    >
      <motion.i
        className={`${exercise.icon} text-white text-2xl`}
        animate={isActive ? { 
          rotate: [0, -15, 15, 0],
        } : {}}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
    {/* Flexibility flow lines */}
    {isActive && (
      <>
        <motion.div
          className="absolute inset-2 border-2 border-green-400 rounded-full"
          animate={{
            rotate: [0, 360],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-4 border-2 border-teal-400 rounded-full"
          animate={{
            rotate: [360, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </>
    )}
  </div>
);

const DefaultAnimation = ({ exercise, isActive }: { exercise: Exercise; isActive: boolean }) => (
  <div className="relative w-24 h-24 mx-auto">
    <motion.div
      animate={isActive ? {
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-full h-full bg-gradient-to-br from-otter-teal to-otter-teal-dark rounded-lg flex items-center justify-center"
    >
      <motion.i
        className={`${exercise.icon} text-white text-2xl`}
        animate={isActive ? { 
          scale: [1, 1.2, 1],
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>
    {/* Generic sparkle effects */}
    {isActive && (
      <>
        <motion.div
          className="absolute top-2 right-2 w-1 h-1 bg-yellow-400 rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-2 left-2 w-1 h-1 bg-yellow-400 rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
        />
      </>
    )}
  </div>
);

export default function ExerciseAnimation({ exercise, isActive }: ExerciseAnimationProps) {
  const getAnimationComponent = () => {
    const category = exercise.category.toLowerCase();
    
    switch (category) {
      case 'strength':
        return <StrengthAnimation exercise={exercise} isActive={isActive} />;
      case 'cardio':
        return <CardioAnimation exercise={exercise} isActive={isActive} />;
      case 'core':
        return <CoreAnimation exercise={exercise} isActive={isActive} />;
      case 'flexibility':
        return <FlexibilityAnimation exercise={exercise} isActive={isActive} />;
      default:
        return <DefaultAnimation exercise={exercise} isActive={isActive} />;
    }
  };

  return (
    <Card className="bg-slate-50 border-slate-200">
      <CardContent className="p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {getAnimationComponent()}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4"
          >
            <h4 className="font-medium text-slate-800 mb-1">{exercise.name}</h4>
            <p className="text-xs text-slate-600 uppercase tracking-wide">
              {exercise.category} Exercise
            </p>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}