import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Exercise } from "@shared/schema";

interface CardDrawAnimationProps {
  exercise: Exercise;
  reps?: number | null;
  duration?: number | null;
  onCardSelect: () => void;
  isRevealed: boolean;
  cardIndex: number;
}

export default function CardDrawAnimation({
  exercise,
  reps,
  duration,
  onCardSelect,
  isRevealed,
  cardIndex
}: CardDrawAnimationProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSelectButton, setShowSelectButton] = useState(false);

  useEffect(() => {
    if (isRevealed) {
      const timer = setTimeout(() => {
        setIsFlipped(true);
        setTimeout(() => setShowSelectButton(true), 600);
      }, cardIndex * 200); // Stagger reveal based on card position
      
      return () => clearTimeout(timer);
    }
  }, [isRevealed, cardIndex]);

  const cardVariants = {
    hidden: {
      y: -100,
      rotate: -15,
      opacity: 0,
      scale: 0.8,
    },
    revealed: {
      y: 0,
      rotate: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: cardIndex * 0.1,
      },
    },
    selected: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const flipVariants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      className="relative perspective-1000"
      variants={cardVariants}
      initial="hidden"
      animate={isRevealed ? "revealed" : "hidden"}
      whileHover="selected"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-full h-64 preserve-3d cursor-pointer"
        animate={isFlipped ? "back" : "front"}
        variants={flipVariants}
        onClick={isFlipped ? onCardSelect : undefined}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card Back (Initially visible) */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Card className="w-full h-full bg-gradient-to-br from-otter-teal to-otter-teal-dark border-2 border-otter-teal shadow-xl">
            <CardContent className="h-full flex items-center justify-center p-6">
              <div className="text-center text-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <i className="fas fa-otter text-2xl"></i>
                </motion.div>
                <h3 className="text-lg font-bold">OtterSport</h3>
                <p className="text-sm opacity-90">Exercise Card</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card Front (Exercise details) */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <Card className="w-full h-full bg-white border-2 border-otter-teal shadow-xl hover:shadow-2xl transition-shadow">
            <CardContent className="h-full p-6 flex flex-col">
              {/* Exercise Icon and Title */}
              <div className="text-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                  className="w-16 h-16 mx-auto mb-3 bg-otter-teal-light rounded-full flex items-center justify-center"
                >
                  <i className={`${exercise.icon} text-2xl text-otter-teal`}></i>
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="text-xl font-bold text-slate-800 mb-2"
                >
                  {exercise.name}
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="text-sm text-slate-600"
                >
                  {exercise.description}
                </motion.p>
              </div>

              {/* Exercise Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="flex-1 space-y-4"
              >
                {/* Reps/Duration */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex justify-center items-center space-x-6">
                    {reps && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-otter-teal">{reps}</div>
                        <div className="text-xs text-slate-600">reps</div>
                      </div>
                    )}
                    {duration && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-otter-teal">{duration}s</div>
                        <div className="text-xs text-slate-600">duration</div>
                      </div>
                    )}
                    {!reps && !duration && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-otter-teal">Hold</div>
                        <div className="text-xs text-slate-600">form</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Badge */}
                <div className="flex justify-center">
                  <span className="px-3 py-1 bg-otter-teal-light text-otter-teal text-xs font-medium rounded-full">
                    {exercise.category}
                  </span>
                </div>
              </motion.div>

              {/* Select Button */}
              <AnimatePresence>
                {showSelectButton && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCardSelect();
                      }}
                      className="w-full bg-otter-teal hover:bg-otter-teal-dark text-white py-3 font-semibold"
                    >
                      <motion.span
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        Select This Card
                      </motion.span>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}