/**
 * Deck Creation Page - Minimal Implementation
 * Simple interface for creating workout decks with placeholder cards
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Badge component removed for minimal design
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CardPlaceholder } from "@/components/ui/card-placeholder";
import type { Exercise, Deck } from "@shared/schema";

interface DeckExercise {
  exerciseId: number;
  exercise: Exercise;
  reps?: number;
  duration?: number;
  order: number;
}

export default function DeckCreation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [deckName, setDeckName] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<DeckExercise[]>([]);

  // Fetch available exercises
  const { data: exercises = [], isLoading } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  // Create deck mutation
  const createDeckMutation = useMutation({
    mutationFn: async (deckData: { name: string; exerciseIds: number[] }) => {
      return apiRequest("/api/decks", "POST", deckData);
    },
    onSuccess: () => {
      toast({
        title: "Deck Created",
        description: `Successfully created deck: ${deckName}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/decks"] });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Deck",
        description: error.message || "Failed to create deck",
        variant: "destructive",
      });
    },
  });

  const addExercise = (exercise: Exercise) => {
    if (selectedExercises.find(e => e.exerciseId === exercise.id)) {
      toast({
        title: "Exercise Already Added",
        description: `${exercise.name} is already in your deck`,
        variant: "destructive",
      });
      return;
    }

    const newExercise: DeckExercise = {
      exerciseId: exercise.id,
      exercise,
      order: selectedExercises.length,
    };

    setSelectedExercises([...selectedExercises, newExercise]);
  };

  const removeExercise = (exerciseId: number) => {
    setSelectedExercises(prev => 
      prev.filter(e => e.exerciseId !== exerciseId)
        .map((e, index) => ({ ...e, order: index }))
    );
  };

  const handleCreateDeck = () => {
    if (!deckName.trim()) {
      toast({
        title: "Deck Name Required",
        description: "Please enter a name for your deck",
        variant: "destructive",
      });
      return;
    }

    if (selectedExercises.length === 0) {
      toast({
        title: "No Exercises Selected",
        description: "Please add at least one exercise to your deck",
        variant: "destructive",
      });
      return;
    }

    createDeckMutation.mutate({
      name: deckName,
      exerciseIds: selectedExercises.map(e => e.exerciseId),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading exercises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-4"
          >
            ← Back to Home
          </Button>
          
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Create New Workout Deck
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deck Builder */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Deck</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Deck Name Input */}
                <div>
                  <Label htmlFor="deckName">Deck Name</Label>
                  <Input
                    id="deckName"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    placeholder="Enter deck name..."
                    className="mt-1"
                  />
                </div>

                {/* Selected Exercises */}
                <div>
                  <Label>Selected Exercises ({selectedExercises.length})</Label>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                    {selectedExercises.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <div className="text-2xl mb-2">🏃‍♂️</div>
                        <p>No exercises selected</p>
                        <p className="text-sm">Add exercises from the right panel</p>
                      </div>
                    ) : (
                      selectedExercises.map((deckExercise) => (
                        <div key={deckExercise.exerciseId} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div className="flex items-center space-x-2">
                            <CardPlaceholder
                              type="hand"
                              category={deckExercise.exercise.category as any}
                              size="small"
                              label={deckExercise.exercise.name}
                            />
                            <div>
                              <div className="font-medium text-sm">{deckExercise.exercise.name}</div>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {deckExercise.exercise.category}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeExercise(deckExercise.exerciseId)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Create Button */}
                <Button
                  onClick={handleCreateDeck}
                  disabled={createDeckMutation.isPending}
                  className="w-full"
                >
                  {createDeckMutation.isPending ? "Creating..." : "Create Deck"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Available Exercises */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Available Exercises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                  {exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between p-3 border rounded hover:bg-slate-50"
                    >
                      <div className="flex items-center space-x-3">
                        <CardPlaceholder
                          type="hand"
                          category={exercise.category as any}
                          size="small"
                          label={exercise.name}
                        />
                        <div>
                          <div className="font-medium">{exercise.name}</div>
                          <div className="text-sm text-slate-600">{exercise.description}</div>
                          <span className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-1 rounded mt-1 inline-block">
                            {exercise.category}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addExercise(exercise)}
                        disabled={selectedExercises.some(e => e.exerciseId === exercise.id)}
                      >
                        {selectedExercises.some(e => e.exerciseId === exercise.id) ? "Added" : "Add"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}