import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Zap,
  Wand2,
  Save,
  Download,
  Upload as UploadIcon,
  RotateCcw,
  Grid,
  Maximize2,
  Minimize2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGameArtist } from "@/contexts/GameArtistContext";
import { useLocation } from "wouter";
import { useAdmin } from "@/hooks/useAdmin";
import AdminLogin from "@/components/ui/admin-login";
import VisualEditor from "@/components/ui/visual-editor";
import ColorPaletteManager from "@/components/ui/color-palette-manager";
import LayerPanel from "@/components/ui/layer-panel";
import AnimationTimeline from "@/components/ui/animation-timeline";
import AssetLibrary from "@/components/ui/asset-library";
import ThemeManager from "@/components/ui/theme-manager";
import GameArtistPerformanceMonitor from "@/components/ui/game-artist-performance-monitor";
import GameArtistAdvancedTools from "@/components/ui/game-artist-advanced-tools";

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
  const [activeTab, setActiveTab] = useState('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);
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
    resetToDefaults,
    previewMode,
    setPreviewMode,
    gridMode,
    setGridMode,
    layerPanelOpen,
    setLayerPanelOpen,
    undo,
    redo,
    canUndo,
    canRedo,
    currentTheme,
    applyTheme,
    animationSpeed,
    setAnimationSpeed
  } = useGameArtist();

  const handleFileUpload = (assetId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
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
    input.click();
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

  const getScreenName = (path: string) => {
    const page = appPages.find(p => p.path === path);
    return page ? page.name : path;
  };

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
    <div className={`min-h-screen p-6 bg-gray-50 dark:bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className={`${isFullscreen ? 'max-w-none' : 'max-w-7xl'} mx-auto`}>
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Paintbrush className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Game Artist Mode</h1>
              <Badge variant={isGameArtistMode ? "default" : "secondary"}>
                {isGameArtistMode ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="outline" className="ml-2">
                {getScreenName(currentScreen)}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Advanced visual editing system for OtterSport. Navigate through screens, edit elements in real-time, and manage visual assets.
          </p>
          
          {/* Quick Actions Bar */}
          <div className="flex items-center gap-2 mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border">
            <Button
              variant={previewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              variant={gridMode ? "default" : "outline"}
              size="sm"
              onClick={() => setGridMode(!gridMode)}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={layerPanelOpen ? "default" : "outline"}
              size="sm"
              onClick={() => setLayerPanelOpen(!layerPanelOpen)}
            >
              <Layers className="h-4 w-4 mr-2" />
              Layers
            </Button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
            >
              <RotateCcw className="h-4 w-4 mr-2 scale-x-[-1]" />
              Redo
            </Button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
            <Button
              variant="outline"
              size="sm"
              onClick={exportVisualPack}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) importVisualPack(file);
                };
                input.click();
              }}
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div className="flex gap-6">
          {/* Sidebar - Layer Panel */}
          {layerPanelOpen && (
            <div className="w-80 shrink-0">
              <LayerPanel />
            </div>
          )}
          
          {/* Main Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="assets">Assets</TabsTrigger>
                <TabsTrigger value="themes">Themes</TabsTrigger>
                <TabsTrigger value="animation">Animation</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Overview content */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{visualElements.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Elements</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{currentScreenElements.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Current Screen</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{currentTheme}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Active Theme</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Changes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {canUndo && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          You have recent changes available
                        </div>
                      )}
                      {!canUndo && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          No recent changes
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="colors">
                <ColorPaletteManager />
              </TabsContent>

              <TabsContent value="assets">
                <AssetLibrary />
              </TabsContent>

              <TabsContent value="themes">
                <ThemeManager />
              </TabsContent>

              <TabsContent value="animation">
                <AnimationTimeline />
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                <GameArtistAdvancedTools />
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <GameArtistPerformanceMonitor />
              </TabsContent>
            </Tabs>
          </div>
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

        {/* Asset Upload Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Asset Upload Center
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full h-20"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (event) => {
                      const file = (event.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const imageUrl = URL.createObjectURL(file);
                        toast({
                          title: "Asset Uploaded",
                          description: `Successfully uploaded ${file.name}`,
                        });
                      }
                    };
                    input.click();
                  }}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2" />
                  Upload Asset
                </Button>
              </CardContent>
            </Card>
            {filteredAssets.map((slot) => (
              <Card key={slot.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{slot.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                      {uploadedAssets[slot.id] ? (
                        <img 
                          src={uploadedAssets[slot.id]} 
                          alt={slot.name}
                          className="max-w-full max-h-full object-contain rounded"
                        />
                      ) : (
                        <div className="text-center text-gray-500">
                          <Image className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-sm">No asset uploaded</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{slot.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {slot.recommendedSize}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleFileUpload(slot.id)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Visual Pack Management */}
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
