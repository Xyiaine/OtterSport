/**
 * VISUAL EDITOR COMPONENT
 * 
 * This component provides a comprehensive visual editing interface for the game artist mode.
 * It allows real-time editing of visual elements across all screens of the application.
 */

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Image, 
  Palette, 
  Type, 
  Monitor,
  Save,
  Eye,
  EyeOff,
  RotateCcw,
  Download,
  Upload as UploadIcon,
  Settings,
  Layers,
  Paintbrush
} from "lucide-react";
import { useGameArtist } from "@/contexts/GameArtistContext";
import { useToast } from "@/hooks/use-toast";

/**
 * VisualEditorProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
/**
 * Handles visualeditor functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * All properties and methods should be implemented according to specification.
 * 
/**
 * VisualEditorProps interface defines the contract for implementation.
/**
 * VisualEditorProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
/**
 * Handles visualeditor functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * All properties and methods should be implemented according to specification.
 * 
/**
 * VisualEditorProps interface defines the contract for implementation.
 * 
/**
 * defines interface defines the contract for implementation.
 * 
/**
 * VisualEditorProps interface defines the contract for implementation.
/**
 * VisualEditorProps interface defines the contract for implementation.
/**
 * VisualEditorProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
/**
 * Handles visualeditor functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * All properties and methods should be implemented according to specification.
 * 
 * @interface VisualEditorProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface VisualEditorProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface VisualEditorProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface VisualEditorProps
 */
 * @interface VisualEditorProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface VisualEditorProps
 */
 * @interface VisualEditorProps
 */
interface VisualEditorProps {
  onClose: () => void;
}

export default function VisualEditor({ onClose }: VisualEditorProps) {
  const { 
    visualElements, 
    updateVisualElement, 
    currentScreen, 
    getElementsForScreen,
    selectedElement,
    setSelectedElement,
    exportVisualPack,
    importVisualPack,
    resetToDefaults
  } = useGameArtist();
  
  const [activeTab, setActiveTab] = useState('current-screen');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const currentScreenElements = getElementsForScreen(currentScreen);
  const categories = Array.from(new Set(visualElements.map(el => el.category)));

  const filteredElements = visualElements.filter(element => {
    const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         element.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || element.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (elementId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      updateVisualElement(elementId, result);
      toast({
        title: "Image Updated",
        description: `Successfully updated ${visualElements.find(el => el.id === elementId)?.name}`,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleColorChange = (elementId: string, color: string) => {
    updateVisualElement(elementId, color);
  };

  const handleTextChange = (elementId: string, text: string) => {
    updateVisualElement(elementId, text);
  };

  const handleImportPack = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importVisualPack(file);
      toast({
        title: "Visual Pack Imported",
        description: "Successfully imported visual pack",
      });
    }
  };

  const handleExportPack = () => {
    exportVisualPack();
    toast({
      title: "Visual Pack Exported",
      description: "Successfully exported visual pack",
    });
  };

  const handleResetDefaults = () => {
    resetToDefaults();
    toast({
      title: "Reset Complete",
      description: "All visual elements reset to defaults",
    });
  };

  const renderElementEditor = (element: any) => {
    return (
      <Card 
        key={element.id} 
        className={`mb-4 ${selectedElement === element.id ? 'ring-2 ring-primary' : ''}`}
        onClick={() => setSelectedElement(element.id)}
      >
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
          <p className="text-xs text-gray-500">{element.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preview */}
          <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
            {element.type === 'image' && (
              <img 
                src={element.currentValue} 
                alt={element.name}
                className="w-full h-full object-cover"
              />
            )}
            {element.type === 'color' && (
              <div 
                className="w-full h-full rounded-lg border-2 border-white"
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
                <p className="text-lg font-semibold">{element.currentValue}</p>
              </div>
            )}
            {element.type === 'icon' && (
              <div className="text-center">
                <i className={`${element.currentValue} text-4xl text-gray-600`} />
              </div>
            )}
          </div>

          {/* Editor Controls */}
          {element.type === 'image' && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">Upload New Image</Label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(element.id, file);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" size="sm" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
              </div>
              {element.recommendedSize && (
                <p className="text-xs text-gray-500">
                  Recommended size: {element.recommendedSize}
                </p>
              )}
            </div>
          )}

          {element.type === 'color' && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={element.currentValue}
                  onChange={(e) => handleColorChange(element.id, e.target.value)}
                  className="w-12 h-8 rounded border cursor-pointer"
                />
                <Input
                  value={element.currentValue}
                  onChange={(e) => handleColorChange(element.id, e.target.value)}
                  className="flex-1 text-xs"
                  placeholder="#000000"
                />
              </div>
            </div>
          )}

          {element.type === 'background' && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">Background</Label>
              <Input
                value={element.currentValue}
                onChange={(e) => handleColorChange(element.id, e.target.value)}
                className="text-xs"
                placeholder="CSS background value"
              />
              <p className="text-xs text-gray-500">
                Supports colors, gradients, and images
              </p>
            </div>
          )}

          {element.type === 'text' && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">Text Content</Label>
              <Textarea
                value={element.currentValue}
                onChange={(e) => handleTextChange(element.id, e.target.value)}
                className="text-xs"
                rows={2}
              />
            </div>
          )}

          {element.type === 'icon' && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">Icon Class</Label>
              <Input
                value={element.currentValue}
                onChange={(e) => handleTextChange(element.id, e.target.value)}
                className="text-xs"
                placeholder="fas fa-icon-name"
              />
              <p className="text-xs text-gray-500">
                FontAwesome or similar icon classes
              </p>
            </div>
          )}

          {/* Current vs Default */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateVisualElement(element.id, element.defaultValue)}
              className="flex-1"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedElement(selectedElement === element.id ? null : element.id)}
              className="flex-1"
            >
              {selectedElement === element.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Paintbrush className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Visual Editor</h2>
            <Badge variant="secondary">
              {currentScreen === '/' ? 'Landing' : currentScreen.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button variant="outline" size="sm" onClick={handleImportPack}>
              <UploadIcon className="h-4 w-4 mr-2" />
              Import Pack
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPack}>
              <Download className="h-4 w-4 mr-2" />
              Export Pack
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetDefaults}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="current-screen">
                  <Monitor className="h-4 w-4 mr-2" />
                  Current Screen ({currentScreenElements.length})
                </TabsTrigger>
                <TabsTrigger value="all-elements">
                  <Layers className="h-4 w-4 mr-2" />
                  All Elements ({visualElements.length})
                </TabsTrigger>
                <TabsTrigger value="categories">
                  <Settings className="h-4 w-4 mr-2" />
                  By Category
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="px-6 py-4">
              {/* Search and Filter */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search elements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                    size="sm"
                  >
                    All
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      size="sm"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <TabsContent value="current-screen" className="mt-0 h-full">
                <div className="space-y-4">
                  {currentScreenElements.length > 0 ? (
                    currentScreenElements.map(renderElementEditor)
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No editable elements found on this screen
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="all-elements" className="mt-0 h-full">
                <div className="space-y-4">
                  {filteredElements.map(renderElementEditor)}
                </div>
              </TabsContent>

              <TabsContent value="categories" className="mt-0 h-full">
                <div className="space-y-6">
                  {categories.map(category => {
                    const categoryElements = filteredElements.filter(el => el.category === category);
                    return (
                      <div key={category}>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Palette className="h-5 w-5" />
                          {category} ({categoryElements.length})
                        </h3>
                        <div className="space-y-4">
                          {categoryElements.map(renderElementEditor)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}