import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { saveOnboardingData } from "@/lib/localStorage";
import OtterCharacter from "@/components/ui/otter-character";

const FITNESS_GOALS = [
  { value: "lose_weight", label: "Lose Weight", icon: "fas fa-weight-scale" },
  { value: "gain_muscle", label: "Gain Muscle", icon: "fas fa-dumbbell" },
  { value: "improve_endurance", label: "Improve Endurance", icon: "fas fa-running" },
  { value: "stay_consistent", label: "Stay Consistent", icon: "fas fa-heart" },
  { value: "increase_mobility", label: "Increase Mobility", icon: "fas fa-spa" },
];

const FITNESS_LEVELS = [
  { value: "beginner", label: "Beginner", description: "New to exercise" },
  { value: "casual", label: "Casual", description: "Exercise occasionally" },
  { value: "fit", label: "Fit", description: "Regular exerciser" },
  { value: "athlete", label: "Athlete", description: "Very experienced" },
];

const WORKOUT_FREQUENCIES = [
  { value: "daily", label: "Daily", description: "Every day" },
  { value: "three_per_week", label: "3x per week", description: "Regular schedule" },
  { value: "flexible", label: "Flexible", description: "When I can" },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      // Save onboarding data to local storage
      saveOnboardingData(profileData);
      
      // Return the profile data (no server call needed for anonymous users)
      return profileData;
    },
    onSuccess: async (profileData) => {
      toast({
        title: "Profile created!",
        description: "Your fitness journey is ready to begin.",
      });
      
      // Navigate to home page
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (step === 1 && selectedGoal) {
      setStep(2);
    } else if (step === 2 && selectedLevel) {
      setStep(3);
    } else if (step === 3 && selectedFrequency) {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const profileData = {
      fitnessGoal: selectedGoal,
      fitnessLevel: selectedLevel,
      workoutFrequency: selectedFrequency,
      currentDifficultyLevel: selectedLevel === "beginner" ? 0.7 : 
                              selectedLevel === "casual" ? 1.0 :
                              selectedLevel === "fit" ? 1.3 : 1.6,
    };

    updateProfileMutation.mutate(profileData);
  };

  const canProceed = () => {
    if (step === 1) return selectedGoal;
    if (step === 2) return selectedLevel;
    if (step === 3) return selectedFrequency;
    return false;
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "What's Your Fitness Goal?";
      case 2: return "What's Your Current Level?";
      case 3: return "How Often Do You Want to Workout?";
      default: return "";
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1: return "Choose your primary focus to personalize your experience";
      case 2: return "This helps us customize your workout intensity";
      case 3: return "We'll adapt your recommendations to your schedule";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-md mx-auto flex flex-col pb-20">
      {/* Header */}
      <div className="text-center space-y-4 mt-8 mb-8">
        <div className="w-16 h-16 mx-auto">
          <OtterCharacter mood="excited" size="sm" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">{getStepTitle()}</h1>
          <p className="text-slate-600 text-sm mt-2">{getStepSubtitle()}</p>
        </div>
        
        {/* Progress indicator */}
        <div className="flex space-x-2 justify-center mt-6">
          {[1, 2, 3].map((stepNum) => (
            <div
              key={stepNum}
              className={`w-2 h-2 rounded-full transition-colors ${
                stepNum <= step ? "bg-otter-teal" : "bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 space-y-4">
        {step === 1 && (
          <div className="space-y-3">
            {FITNESS_GOALS.map((goal) => (
              <Card
                key={goal.value}
                className={`cursor-pointer transition-all ${
                  selectedGoal === goal.value
                    ? "border-otter-teal bg-otter-teal-light"
                    : "border-slate-200 hover:border-otter-teal hover:bg-otter-teal-light"
                }`}
                onClick={() => setSelectedGoal(goal.value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <i className={`${goal.icon} text-slate-500 ${
                      selectedGoal === goal.value ? "text-otter-teal" : ""
                    }`}></i>
                    <span className={`font-medium ${
                      selectedGoal === goal.value ? "text-slate-800" : "text-slate-700"
                    }`}>
                      {goal.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {FITNESS_LEVELS.map((level) => (
              <Card
                key={level.value}
                className={`cursor-pointer transition-all ${
                  selectedLevel === level.value
                    ? "border-otter-teal bg-otter-teal-light"
                    : "border-slate-200 hover:border-otter-teal hover:bg-otter-teal-light"
                }`}
                onClick={() => setSelectedLevel(level.value)}
              >
                <CardContent className="p-4">
                  <div className="space-y-1">
                    <div className={`font-medium ${
                      selectedLevel === level.value ? "text-slate-800" : "text-slate-700"
                    }`}>
                      {level.label}
                    </div>
                    <div className="text-sm text-slate-600">
                      {level.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            {WORKOUT_FREQUENCIES.map((frequency) => (
              <Card
                key={frequency.value}
                className={`cursor-pointer transition-all ${
                  selectedFrequency === frequency.value
                    ? "border-otter-teal bg-otter-teal-light"
                    : "border-slate-200 hover:border-otter-teal hover:bg-otter-teal-light"
                }`}
                onClick={() => setSelectedFrequency(frequency.value)}
              >
                <CardContent className="p-4">
                  <div className="space-y-1">
                    <div className={`font-medium ${
                      selectedFrequency === frequency.value ? "text-slate-800" : "text-slate-700"
                    }`}>
                      {frequency.label}
                    </div>
                    <div className="text-sm text-slate-600">
                      {frequency.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons - Fixed position to avoid overlapping */}
      <div className="sticky bottom-20 bg-white border-t border-slate-200 p-4 -mx-6 mt-8 space-y-3 z-40">
        <Button
          onClick={handleNext}
          disabled={!canProceed() || updateProfileMutation.isPending}
          className="w-full bg-otter-teal hover:bg-teal-600 text-white py-4 font-semibold transition-colors"
        >
          {updateProfileMutation.isPending ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Setting up...</span>
            </div>
          ) : step === 3 ? (
            "Complete Setup"
          ) : (
            "Continue"
          )}
        </Button>
        
        {step > 1 && (
          <Button
            onClick={() => setStep(step - 1)}
            variant="outline"
            className="w-full py-3"
            disabled={updateProfileMutation.isPending}
          >
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
