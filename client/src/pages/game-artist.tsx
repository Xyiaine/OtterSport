/**
 * Game Artist Tools - Minimal Implementation
 * Simple interface for managing visual assets and placeholder components
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Badge component removed for minimal design
import { CardPlaceholder, DeckPlaceholder } from "@/components/ui/card-placeholder";

export default function GameArtist() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Assets", count: 12 },
    { id: "cardio", name: "Cardio Cards", count: 3 },
    { id: "strength", name: "Strength Cards", count: 3 },
    { id: "flexibility", name: "Flexibility Cards", count: 3 },
    { id: "core", name: "Core Cards", count: 3 },
  ];

  const placeholderCards = [
    { id: 1, category: "cardio", name: "Running Card", status: "needs-artwork" },
    { id: 2, category: "cardio", name: "Jumping Jacks", status: "needs-artwork" },
    { id: 3, category: "cardio", name: "Burpees", status: "needs-artwork" },
    { id: 4, category: "strength", name: "Push-ups", status: "needs-artwork" },
    { id: 5, category: "strength", name: "Squats", status: "needs-artwork" },
    { id: 6, category: "strength", name: "Planks", status: "needs-artwork" },
    { id: 7, category: "flexibility", name: "Stretching", status: "needs-artwork" },
    { id: 8, category: "flexibility", name: "Yoga Flow", status: "needs-artwork" },
    { id: 9, category: "flexibility", name: "Balance", status: "needs-artwork" },
    { id: 10, category: "core", name: "Crunches", status: "needs-artwork" },
    { id: 11, category: "core", name: "Russian Twists", status: "needs-artwork" },
    { id: 12, category: "core", name: "Mountain Climbers", status: "needs-artwork" },
  ];

  const filteredCards = selectedCategory === "all" 
    ? placeholderCards 
    : placeholderCards.filter(card => card.category === selectedCategory);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-4"
          >
            ← Back to Home
          </Button>
          
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Game Artist Workshop
          </h1>
          <p className="text-slate-600">
            Visual asset management and placeholder card system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Asset Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className="w-full justify-between"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{category.count}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Deck Preview */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Deck Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <DeckPlaceholder
                    deckName="Cardio Blast"
                    cardCount={5}
                    size="medium"
                    className="mx-auto"
                  />
                  <DeckPlaceholder
                    deckName="Strength Builder"
                    cardCount={7}
                    size="medium"
                    className="mx-auto"
                  />
                  <DeckPlaceholder
                    deckName="Flexibility Flow"
                    cardCount={4}
                    size="medium"
                    className="mx-auto"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Asset Grid */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {categories.find(c => c.id === selectedCategory)?.name || "All Assets"}
                </CardTitle>
                <p className="text-sm text-slate-600">
                  Click on any placeholder card to see implementation details
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredCards.map((card) => (
                    <div key={card.id} className="text-center space-y-2">
                      <CardPlaceholder
                        type="hand"
                        category={card.category as any}
                        size="medium"
                        label={card.name}
                        className="hover:scale-105 transition-transform cursor-pointer"
                      />
                      <div className="text-xs text-slate-600">{card.name}</div>
                      <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-300 px-2 py-1 rounded">
                        Needs Artwork
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Implementation Guide */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Implementation Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Card Design Specs</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Card dimensions: 200x280px (standard playing card ratio)</li>
                    <li>• Rounded corners: 12px radius</li>
                    <li>• Category colors: Cardio (red), Strength (blue), Flexibility (purple), Core (green)</li>
                    <li>• Include exercise illustration and name text</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Deck Design Specs</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Deck back design: 200x280px with OtterSport branding</li>
                    <li>• Card stack visualization with slight shadow/depth</li>
                    <li>• Category-specific deck themes matching card colors</li>
                    <li>• Card count indicator overlay</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">File Organization</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Save assets in /game-assets/cards/ directory</li>
                    <li>• Use PNG format with transparent backgrounds</li>
                    <li>• Name files: category-exercise-name.png (e.g., cardio-running.png)</li>
                    <li>• Include both light and dark theme variants</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}