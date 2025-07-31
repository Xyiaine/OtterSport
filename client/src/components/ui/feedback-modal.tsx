/**
 * FEEDBACK-MODAL MODULE
 * 
 * This module provides functionality for feedback-modal.
 * All exports are designed to work seamlessly with the OtterSport application.
 * 
 * Human Developer Guide:
 * - Follow established patterns when modifying this file
 * - Maintain comprehensive test coverage for all functions
 * - Update documentation when adding new functionality
 */

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import OtterCharacter from "@/components/ui/otter-character";

/**
 * FeedbackModalProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * FeedbackModalProps interface defines the contract for implementation.
/**
 * FeedbackModalProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * FeedbackModalProps interface defines the contract for implementation.
 * 
/**
 * defines interface defines the contract for implementation.
 * 
/**
 * FeedbackModalProps interface defines the contract for implementation.
/**
 * FeedbackModalProps interface defines the contract for implementation.
/**
 * FeedbackModalProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FeedbackModalProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FeedbackModalProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FeedbackModalProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FeedbackModalProps
 */
 * @interface FeedbackModalProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface FeedbackModalProps
 */
 * @interface FeedbackModalProps
 */
interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
  workoutStats: {
    cards: number;
    minutes: number;
    calories: number;
  };
/**
 * Handles that functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
  isSubmitting?: boolean;
}

const FEEDBACK_OPTIONS = [
  {
    value: "too_easy",
    label: "Too Easy - I want more challenge!",
    icon: "fas fa-smile",
    color: "emerald",
    description: "The workout was not challenging enough"
/**
 * Handles feedbackmodal functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await FeedbackModal(params);
 */
  },
  {
    value: "just_right",
    label: "Just Right - Perfect difficulty",
    icon: "fas fa-thumbs-up", 
    color: "otter-teal",
    description: "The workout difficulty was perfect"
  },
  {
    value: "bit_too_hard",
    label: "A Bit Too Hard - Scale it back",
    icon: "fas fa-meh",
    color: "amber",
    description: "The workout was slightly too challenging"
  },
  {
/**
 * Handles feedbackmodal functionality for the application
 * 
/**
 * Handles feedbackmodal functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await FeedbackModal(params);
 */
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await FeedbackModal(params);
 */
    value: "way_too_hard",
    label: "Way Too Hard - Much easier please",
    icon: "fas fa-frown",
    color: "red",
    description: "The workout was much too challenging"
  }
];

export default function FeedbackModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  workoutStats, 
  isSubmitting = false 
}: FeedbackModalProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<string>("");

  const handleSubmit = () => {
    if (selectedFeedback) {
      onSubmit(selectedFeedback);
    }
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const baseClasses = "transition-all";
    if (isSelected) {
      switch (color) {
        case "emerald":
          return `${baseClasses} border-emerald-500 bg-emerald-50`;
        case "otter-teal":
          return `${baseClasses} border-otter-teal bg-otter-teal-light`;
        case "amber":
          return `${baseClasses} border-amber-500 bg-amber-50`;
        case "red":
          return `${baseClasses} border-red-500 bg-red-50`;
        default:
          return `${baseClasses} border-slate-200`;
      }
    } else {
      switch (color) {
        case "emerald":
          return `${baseClasses} border-slate-200 hover:border-emerald-500 hover:bg-emerald-50`;
        case "otter-teal":
          return `${baseClasses} border-slate-200 hover:border-otter-teal hover:bg-otter-teal-light`;
        case "amber":
          return `${baseClasses} border-slate-200 hover:border-amber-500 hover:bg-amber-50`;
        case "red":
          return `${baseClasses} border-slate-200 hover:border-red-500 hover:bg-red-50`;
        default:
          return `${baseClasses} border-slate-200 hover:border-slate-300`;
      }
    }
  };

  const getIconColor = (color: string, isSelected: boolean) => {
    if (isSelected) {
      switch (color) {
        case "emerald": return "text-emerald-500";
        case "otter-teal": return "text-otter-teal";
        case "amber": return "text-amber-500";
        case "red": return "text-red-500";
        default: return "text-slate-500";
      }
    }
    return "text-slate-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-md mx-4 rounded-xl">
        <DialogHeader className="text-center space-y-4">
          {/* Celebrating Otter */}
          <div className="w-20 h-20 mx-auto">
            <OtterCharacter mood="proud" size="md" animated />
          </div>
          
          <div>
            <DialogTitle className="text-2xl font-bold text-slate-800">
              Awesome Work! 🎉
            </DialogTitle>
            <p className="text-slate-600 mt-2">
              You completed your workout in {workoutStats.minutes} minutes!
            </p>
          </div>
        </DialogHeader>

        {/* Workout Summary */}
        <Card className="shadow-sm border-slate-100 my-4">
          <CardContent className="p-4">
            <h3 className="font-semibold text-slate-800 mb-3">Workout Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-otter-teal">
                  {workoutStats.cards}
                </div>
                <div className="text-xs text-slate-600">Cards</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-700">
                  {workoutStats.minutes}
                </div>
                <div className="text-xs text-slate-600">Minutes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-500">
                  {workoutStats.calories}
                </div>
                <div className="text-xs text-slate-600">Calories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Question */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 text-center">
            How was that workout?
          </h3>
          <p className="text-sm text-slate-600 text-center">
            Your feedback helps us adjust future workouts for you
          </p>
          
          <div className="space-y-3">
            {FEEDBACK_OPTIONS.map((option) => {
              const isSelected = selectedFeedback === option.value;
              return (
                <Card
                  key={option.value}
                  className={`cursor-pointer ${getColorClasses(option.color, isSelected)}`}
                  onClick={() => setSelectedFeedback(option.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <i className={`${option.icon} ${getIconColor(option.color, isSelected)}`}></i>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          isSelected ? "text-slate-800" : "text-slate-700"
                        }`}>
                          {option.label}
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          {option.description}
                        </div>
                      </div>
                      {isSelected && (
                        <i className="fas fa-check-circle text-otter-teal"></i>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="space-y-3 mt-6">
          <Button
            onClick={handleSubmit}
            disabled={!selectedFeedback || isSubmitting}
            className="w-full bg-otter-teal hover:bg-teal-600 text-white py-3 font-semibold transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </div>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
                Finish & Save Progress
              </>
            )}
          </Button>
          
          {!selectedFeedback && (
            <p className="text-sm text-slate-500 text-center">
              Please select how the workout felt for you
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
