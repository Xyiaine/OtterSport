import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Image, 
  Palette, 
  Gamepad2, 
  Eye, 
  EyeOff,
  Settings,
  Monitor,
  Layers,
  Paintbrush,
  Play,
  Home,
  Activity,
  BarChart3,
  CreditCard,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGameArtist } from "@/contexts/GameArtistContext";
import { useLocation } from "wouter";
import VisualEditor from "@/components/ui/visual-editor";

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
  const [showVisualEditor, setShowVisualEditor] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const { 
    isGameArtistMode, 
    setGameArtistMode, 
    visualElements, 
    currentScreen,
    getElementsForScreen,
    exportVisualPack,
    importVisualPack,
    resetToDefaults 
  } = useGameArtist();

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

  const filteredElements = selectedCategory 
    ? visualElements.filter(el => el.category === selectedCategory)
    : visualElements;

  const categories = Array.from(new Set(visualElements.map(el => el.category)));
  const currentScreenElements = getElementsForScreen(currentScreen);

  const appPages = [
    { path: '/', name: 'Landing', icon: Home, elements: getElementsForScreen('/').length },
    { path: '/home', name: 'Home', icon: Home, elements: getElementsForScreen('/home').length },
    { path: '/workout', name: 'Workout', icon: Activity, elements: getElementsForScreen('/workout').length },
    { path: '/progress', name: 'Progress', icon: BarChart3, elements: getElementsForScreen('/progress').length },
    { path: '/decks', name: 'Deck Creation', icon: CreditCard, elements: getElementsForScreen('/decks').length },
    { path: '/game-modes/battle', name: 'Battle Mode', icon: Zap, elements: getElementsForScreen('/game-modes/battle').length },
  ];

  const handleImportPack = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importVisualPack(file);
      toast({
        title: "Visual Pack Imported",
        description: "Successfully imported visual pack",
      });
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Paintbrush className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Game Artist Mode</h1>
              <Badge variant={isGameArtistMode ? "default" : "secondary"}>
                {isGameArtistMode ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={isGameArtistMode} 
                  onCheckedChange={setGameArtistMode}
                />
                <Label>Enable Game Artist Mode</Label>
              </div>
              <Button onClick={() => setShowVisualEditor(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Visual Editor
              </Button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Advanced visual editing system for OtterSport. Navigate through screens, edit elements in real-time, and manage visual assets.
          </p>
        </div>

        {/* Live Screen Navigation */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Live Screen Navigation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {appPages.map((page) => {
              const Icon = page.icon;
              const isCurrentScreen = currentScreen === page.path;
              return (
                <Card 
                  key={page.path} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isCurrentScreen ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setLocation(page.path)}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold text-sm">{page.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {page.elements} elements
                    </p>
                    {isCurrentScreen && (
                      <Badge className="mt-2 text-xs">Current</Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Current Screen Elements */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Current Screen Elements ({currentScreenElements.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentScreenElements.map((element) => (
              <Card key={element.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{element.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {element.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-3">
                    {element.type === 'image' && (
                      <img 
                        src={element.currentValue} 
                        alt={element.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                    {element.type === 'color' && (
                      <div 
                        className="w-20 h-20 rounded-full border-2 border-white shadow-lg"
                        style={{ backgroundColor: element.currentValue }}
                      />
                    )}
                    {element.type === 'text' && (
                      <p className="text-center font-medium">{element.currentValue}</p>
                    )}
                    {element.type === 'background' && (
                      <div 
                        className="w-full h-full rounded-lg"
                        style={{ background: element.currentValue }}
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{element.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Visual Elements by Category</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              All Elements ({visualElements.length})
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category} ({visualElements.filter(el => el.category === category).length})
              </Button>
            ))}
          </div>
        </div>

        {/* Visual Elements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredElements.map(element => (
            <Card key={element.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{element.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {element.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {element.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Preview */}
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                  {element.type === 'image' && (
                    <img 
                      src={element.currentValue} 
                      alt={element.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {element.type === 'color' && (
                    <div 
                      className="w-20 h-20 rounded-full border-2 border-white shadow-lg"
                      style={{ backgroundColor: element.currentValue }}
                    />
                  )}
                  {element.type === 'background' && (
                    <div 
                      className="w-full h-full rounded-lg"
                      style={{ background: element.currentValue }}
                    />
                  )}
                  {element.type === 'text' && (
                    <div className="text-center p-4">
                      <p className="text-sm font-medium">{element.currentValue}</p>
                    </div>
                  )}
                  {element.type === 'icon' && (
                    <div className="text-center">
                      <i className={`${element.currentValue} text-3xl text-gray-600`} />
                    </div>
                  )}
                </div>

                {/* Element Info */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>{element.description}</p>
                  <p className="font-mono text-primary">Screen: {element.screenPath}</p>
                  {element.recommendedSize && (
                    <p className="font-mono text-primary">Size: {element.recommendedSize}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Export/Save Section */}
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg border">
          <div className="flex items-center gap-3 mb-4">
            <Gamepad2 className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Visual Pack Management</h2>
          </div>
          <div className="flex gap-4">
            <Button onClick={exportVisualPack}>
              Export Visual Pack
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportPack}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline">
                Import Visual Pack
              </Button>
            </div>
            <Button variant="outline" onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
      
      {/* Visual Editor Modal */}
      {showVisualEditor && (
        <VisualEditor onClose={() => setShowVisualEditor(false)} />
      )}
    </div>
  );
}