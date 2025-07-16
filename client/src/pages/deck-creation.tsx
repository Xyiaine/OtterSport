import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { Exercise, Deck } from "@shared/schema";

interface DeckExercise {
  exerciseId: number;
  exercise: Exercise;
  reps?: number;
  duration?: number;
  order: number;
}

export default function DeckCreation() {
  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [deckCategory, setDeckCategory] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState([15]);
  const [deckExercises, setDeckExercises] = useState<DeckExercise[]>([]);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch available exercises
  const { data: availableExercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  // Fetch user's custom decks
  const { data: userDecks = [] } = useQuery<Deck[]>({
    queryKey: ["/api/user/decks"],
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

  // Create deck mutation
  const createDeckMutation = useMutation({
    mutationFn: async (deckData: any) => {
      const response = await apiRequest("POST", "/api/decks", deckData);
      return response.json();
    },
    onSuccess: async (newDeck: Deck) => {
      // Add exercises to the deck
      for (const deckExercise of deckExercises) {
        await apiRequest("POST", `/api/decks/${newDeck.id}/exercises`, {
          exerciseId: deckExercise.exerciseId,
          order: deckExercise.order,
          customReps: deckExercise.reps,
          customDuration: deckExercise.duration,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["/api/user/decks"] });
      toast({
        title: "Deck created! 🎉",
        description: "Your custom workout deck has been saved.",
      });
      
      // Reset form
      setDeckName("");
      setDeckDescription("");
      setDeckCategory("");
      setEstimatedMinutes([15]);
      setDeckExercises([]);
    },
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
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create deck. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addExercise = (exercise: Exercise) => {
    const newExercise: DeckExercise = {
      exerciseId: exercise.id,
      exercise,
      reps: exercise.defaultReps || undefined,
      duration: exercise.defaultDuration || undefined,
      order: deckExercises.length + 1,
    };
    setDeckExercises([...deckExercises, newExercise]);
    setShowExerciseSelector(false);
  };

  const removeExercise = (index: number) => {
    const updated = deckExercises.filter((_, i) => i !== index);
    // Update order
    const reordered = updated.map((ex, i) => ({ ...ex, order: i + 1 }));
    setDeckExercises(reordered);
  };

  const updateExercise = (index: number, field: 'reps' | 'duration', value: number) => {
    const updated = [...deckExercises];
    updated[index] = { ...updated[index], [field]: value };
    setDeckExercises(updated);
  };

  const canCreateDeck = () => {
    return deckName.trim() && deckCategory && deckExercises.length >= 3;
  };

  const handleCreateDeck = () => {
    if (!canCreateDeck()) return;

    const difficulty = deckExercises.reduce((avg, ex) => avg + ex.exercise.difficulty, 0) / deckExercises.length;

    createDeckMutation.mutate({
      name: deckName.trim(),
      description: deckDescription.trim(),
      category: deckCategory,
      difficulty: Number(difficulty.toFixed(1)),
      estimatedMinutes: estimatedMinutes[0],
    });
  };

  return (
    <div className="pt-4 pb-24 px-6 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto bg-otter-teal-light rounded-full flex items-center justify-center">
          <i className="fas fa-plus text-otter-teal"></i>
        </div>
        <h1 className="text-xl font-bold text-slate-800">Create Custom Deck</h1>
        <p className="text-slate-600 text-sm">Design your perfect workout</p>
      </div>

      {/* Deck Details Form */}
      <Card className="shadow-sm border-slate-100">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deckName">Deck Name</Label>
            <Input
              id="deckName"
              placeholder="My Awesome Workout"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="focus-ring"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deckDescription">Description (Optional)</Label>
            <Textarea
              id="deckDescription"
              placeholder="A quick and effective workout for..."
              value={deckDescription}
              onChange={(e) => setDeckDescription(e.target.value)}
              className="focus-ring resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={deckCategory} onValueChange={setDeckCategory}>
              <SelectTrigger className="focus-ring">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="flexibility">Flexibility</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Estimated Duration: {estimatedMinutes[0]} minutes</Label>
            <Slider
              value={estimatedMinutes}
              onValueChange={setEstimatedMinutes}
              min={5}
              max={45}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>5 min</span>
              <span>45 min</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">
            Exercises ({deckExercises.length})
          </h3>
          {deckExercises.length >= 3 && (
            <div className="text-xs text-emerald-600 flex items-center">
              <i className="fas fa-check mr-1"></i>
              Ready to create
            </div>
          )}
        </div>

        {deckExercises.length > 0 ? (
          <div className="space-y-3">
            {deckExercises.map((deckExercise, index) => (
              <Card key={index} className="shadow-sm border-slate-100">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <i className={`${deckExercise.exercise.icon} text-slate-400`}></i>
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">
                          {deckExercise.exercise.name}
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          {deckExercise.exercise.defaultReps && (
                            <div className="flex items-center space-x-2">
                              <Label className="text-xs">Reps:</Label>
                              <Input
                                type="number"
                                value={deckExercise.reps || deckExercise.exercise.defaultReps}
                                onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                                className="w-16 h-8 text-xs"
                                min="1"
                              />
                            </div>
                          )}
                          {deckExercise.exercise.defaultDuration && (
                            <div className="flex items-center space-x-2">
                              <Label className="text-xs">Sec:</Label>
                              <Input
                                type="number"
                                value={deckExercise.duration || deckExercise.exercise.defaultDuration}
                                onChange={(e) => updateExercise(index, 'duration', parseInt(e.target.value))}
                                className="w-16 h-8 text-xs"
                                min="5"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExercise(index)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 ml-2"
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm border-slate-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <i className="fas fa-dumbbell text-slate-400"></i>
              </div>
              <p className="text-slate-600">No exercises added yet</p>
              <p className="text-sm text-slate-500 mt-1">
                Add at least 3 exercises to create your deck
              </p>
            </CardContent>
          </Card>
        )}

        {/* Add Exercise Button */}
        {!showExerciseSelector ? (
          <Button
            onClick={() => setShowExerciseSelector(true)}
            variant="outline"
            className="w-full border-2 border-dashed border-slate-300 hover:border-otter-teal hover:text-otter-teal py-4"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Exercise
          </Button>
        ) : (
          <Card className="shadow-sm border-otter-teal">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-800">Select Exercise</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExerciseSelector(false)}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableExercises
                  .filter(ex => !deckExercises.some(de => de.exerciseId === ex.id))
                  .map((exercise) => (
                    <Button
                      key={exercise.id}
                      variant="ghost"
                      className="w-full justify-start p-3 h-auto"
                      onClick={() => addExercise(exercise)}
                    >
                      <div className="flex items-center space-x-3">
                        <i className={`${exercise.icon} text-slate-400`}></i>
                        <div className="text-left">
                          <div className="font-medium text-slate-800">{exercise.name}</div>
                          <div className="text-sm text-slate-600">
                            {exercise.category} • Difficulty: {exercise.difficulty}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Button */}
      <div className="space-y-3">
        <Button
          onClick={handleCreateDeck}
          disabled={!canCreateDeck() || createDeckMutation.isPending}
          className="w-full bg-otter-teal hover:bg-teal-600 text-white py-4 font-semibold"
        >
          {createDeckMutation.isPending ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Creating...</span>
            </div>
          ) : (
            <>
              <i className="fas fa-save mr-2"></i>
              Create Deck
            </>
          )}
        </Button>
        {!canCreateDeck() && (
          <p className="text-sm text-slate-500 text-center">
            {!deckName.trim() ? "Enter a deck name" :
             !deckCategory ? "Select a category" :
             "Add at least 3 exercises"}
          </p>
        )}
      </div>

      {/* User's Custom Decks */}
      {userDecks.length > 0 && (
        <div className="space-y-4 border-t border-slate-200 pt-6">
          <h3 className="font-semibold text-slate-800">Your Custom Decks</h3>
          <div className="space-y-3">
            {userDecks.map((deck) => (
              <Card key={deck.id} className="shadow-sm border-slate-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800">{deck.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                          {deck.category}
                        </span>
                        <span className="text-xs text-slate-500">
                          {deck.estimatedMinutes} min
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <i className="fas fa-chevron-right text-slate-400"></i>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
