import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Image, Palette, Gamepad2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AssetSlot {
  id: string;
  name: string;
  category: string;
  currentImage?: string;
  description: string;
  recommendedSize: string;
}

const assetSlots: AssetSlot[] = [
  // Interface Assets
  { id: "logo", name: "Main Logo", category: "Interface", description: "OtterSport main logo", recommendedSize: "256x256px" },
  { id: "background", name: "Main Background", category: "Interface", description: "App background pattern", recommendedSize: "1920x1080px" },
  { id: "btn-primary", name: "Primary Button", category: "Interface", description: "Main action buttons", recommendedSize: "200x60px" },
  
  // Card Assets
  { id: "card-back", name: "Card Back", category: "Cards", description: "Standard card back design", recommendedSize: "300x420px" },
  { id: "card-frame", name: "Card Frame", category: "Cards", description: "Card border overlay", recommendedSize: "300x420px" },
  
  // Exercise Icons
  { id: "icon-strength", name: "Strength Icon", category: "Exercise Icons", description: "Strength exercise icon", recommendedSize: "64x64px" },
  { id: "icon-cardio", name: "Cardio Icon", category: "Exercise Icons", description: "Cardio exercise icon", recommendedSize: "64x64px" },
  { id: "icon-core", name: "Core Icon", category: "Exercise Icons", description: "Core exercise icon", recommendedSize: "64x64px" },
  { id: "icon-flexibility", name: "Flexibility Icon", category: "Exercise Icons", description: "Flexibility exercise icon", recommendedSize: "64x64px" },
  
  // Characters
  { id: "otter-happy", name: "Otter Coach - Happy", category: "Characters", description: "Happy/encouraging expression", recommendedSize: "512x512px" },
  { id: "otter-proud", name: "Otter Coach - Proud", category: "Characters", description: "Proud/celebrating expression", recommendedSize: "512x512px" },
  { id: "ai-opponent", name: "AI Opponent", category: "Characters", description: "AI opponent character", recommendedSize: "512x512px" },
  
  // Exercise Illustrations
  { id: "pushup-illustration", name: "Push-up", category: "Exercise Art", description: "Push-up exercise illustration", recommendedSize: "400x300px" },
  { id: "squat-illustration", name: "Squat", category: "Exercise Art", description: "Squat exercise illustration", recommendedSize: "400x300px" },
  { id: "plank-illustration", name: "Plank", category: "Exercise Art", description: "Plank exercise illustration", recommendedSize: "400x300px" },
];

export default function GameArtistMode() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploadedAssets, setUploadedAssets] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const categories = Array.from(new Set(assetSlots.map(slot => slot.category)));

  const handleFileUpload = (assetId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);
      setUploadedAssets(prev => ({
        ...prev,
        [assetId]: imageUrl
      }));
      
      toast({
        title: "Asset Uploaded",
        description: `Successfully uploaded ${file.name}`,
      });
    }
  };

  const filteredAssets = selectedCategory 
    ? assetSlots.filter(slot => slot.category === selectedCategory)
    : assetSlots;

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Game Artist Mode</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Upload and manage all visual assets for OtterSport. Click on any asset slot to upload a new image.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              All Assets ({assetSlots.length})
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category} ({assetSlots.filter(slot => slot.category === category).length})
              </Button>
            ))}
          </div>
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map(asset => (
            <Card key={asset.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{asset.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {asset.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Image Preview */}
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                  {uploadedAssets[asset.id] ? (
                    <img 
                      src={uploadedAssets[asset.id]} 
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <Image className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-xs">No image</p>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(asset.id, e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button className="w-full" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>

                {/* Asset Info */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>{asset.description}</p>
                  <p className="font-mono text-primary">{asset.recommendedSize}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Export/Save Section */}
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg border">
          <div className="flex items-center gap-3 mb-4">
            <Gamepad2 className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Asset Management</h2>
          </div>
          <div className="flex gap-4">
            <Button>
              Export Asset Pack
            </Button>
            <Button variant="outline">
              Import Asset Pack
            </Button>
            <Button variant="outline">
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}