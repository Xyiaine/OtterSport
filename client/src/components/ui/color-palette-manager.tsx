/**
 * COLOR PALETTE MANAGER
 * 
 * Advanced color management system for Game Artist mode with:
 * - Color palette generation
 * - Color history tracking
 * - Eyedropper tool
 * - Color harmony analysis
 * - Export/import color schemes
 */

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Eye, 
  Copy, 
  Download, 
  Upload,
  RotateCcw,
  Wand2,
  Plus,
  Trash2,
  Heart,
  Star,
  Zap
} from "lucide-react";
import { useGameArtist } from "@/contexts/GameArtistContext";
import { useToast } from "@/hooks/use-toast";

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  type: 'custom' | 'generated' | 'harmony' | 'trending';
  created: Date;
  isFavorite?: boolean;
}

interface ColorAnalysis {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  brightness: number;
  contrast: number;
  accessibility: 'AAA' | 'AA' | 'A' | 'Poor';
}

export default function ColorPaletteManager() {
  const { 
    colorHistory, 
    addColorToHistory, 
    generateColorPalette,
    updateVisualElement,
    selectedElement,
    visualElements
  } = useGameArtist();
  
  const { toast } = useToast();
  
  const [activeColor, setActiveColor] = useState('#14B8A6');
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorAnalysis, setColorAnalysis] = useState<ColorAnalysis | null>(null);
  const [harmonyType, setHarmonyType] = useState<'complementary' | 'triadic' | 'analogous' | 'monochromatic'>('complementary');
  const [isEyedropping, setIsEyedropping] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with some default palettes
  useEffect(() => {
    const defaultPalettes: ColorPalette[] = [
      {
        id: '1',
        name: 'OtterSport Default',
        colors: ['#14B8A6', '#0F766E', '#F59E0B', '#EF4444', '#8B5CF6'],
        type: 'custom',
        created: new Date(),
        isFavorite: true
      },
      {
        id: '2',
        name: 'Ocean Breeze',
        colors: ['#0369A1', '#0284C7', '#06B6D4', '#67E8F9', '#A5F3FC'],
        type: 'harmony',
        created: new Date()
      },
      {
        id: '3',
        name: 'Forest Glow',
        colors: ['#15803D', '#16A34A', '#84CC16', '#A3E635', '#D9F99D'],
        type: 'harmony',
        created: new Date()
      }
    ];
    
    setSavedPalettes(defaultPalettes);
  }, []);

  // Analyze color properties
  useEffect(() => {
    if (activeColor) {
      const analysis = analyzeColor(activeColor);
      setColorAnalysis(analysis);
    }
  }, [activeColor]);

  const analyzeColor = (hex: string): ColorAnalysis => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Calculate brightness (luminance)
    const brightness = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    
    // Calculate contrast ratio with white
    const contrast = (Math.max(brightness, 1) + 0.05) / (Math.min(brightness, 1) + 0.05);
    
    // Determine accessibility rating
    let accessibility: 'AAA' | 'AA' | 'A' | 'Poor' = 'Poor';
    if (contrast >= 7) accessibility = 'AAA';
    else if (contrast >= 4.5) accessibility = 'AA';
    else if (contrast >= 3) accessibility = 'A';
    
    return {
      hex,
      rgb,
      hsl,
      brightness,
      contrast,
      accessibility
    };
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const generateHarmonyPalette = (baseColor: string, type: string) => {
    const baseHsl = rgbToHsl(...Object.values(hexToRgb(baseColor)));
    const colors = [baseColor];
    
    switch (type) {
      case 'complementary':
        colors.push(hslToHex((baseHsl.h + 180) % 360, baseHsl.s, baseHsl.l));
        break;
      case 'triadic':
        colors.push(hslToHex((baseHsl.h + 120) % 360, baseHsl.s, baseHsl.l));
        colors.push(hslToHex((baseHsl.h + 240) % 360, baseHsl.s, baseHsl.l));
        break;
      case 'analogous':
        colors.push(hslToHex((baseHsl.h + 30) % 360, baseHsl.s, baseHsl.l));
        colors.push(hslToHex((baseHsl.h - 30 + 360) % 360, baseHsl.s, baseHsl.l));
        break;
      case 'monochromatic':
        colors.push(hslToHex(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 20, 100)));
        colors.push(hslToHex(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 20, 0)));
        break;
    }
    
    return colors;
  };

  const hslToHex = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c/2;
    
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 1/6) {
      r = c; g = x; b = 0;
    } else if (1/6 <= h && h < 2/6) {
      r = x; g = c; b = 0;
    } else if (2/6 <= h && h < 3/6) {
      r = 0; g = c; b = x;
    } else if (3/6 <= h && h < 4/6) {
      r = 0; g = x; b = c;
    } else if (4/6 <= h && h < 5/6) {
      r = x; g = 0; b = c;
    } else if (5/6 <= h && h < 1) {
      r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const copyColorToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: "Color Copied",
      description: `${color} copied to clipboard`,
    });
  };

  const applyColorToElement = (color: string) => {
    if (selectedElement) {
      const element = visualElements.find(el => el.id === selectedElement);
      if (element) {
        updateVisualElement(selectedElement, color);
        addColorToHistory(color);
        toast({
          title: "Color Applied",
          description: `Applied ${color} to ${element.name}`,
        });
      }
    }
  };

  const savePalette = () => {
    const generatedColors = generateHarmonyPalette(activeColor, harmonyType);
    const newPalette: ColorPalette = {
      id: Date.now().toString(),
      name: `${harmonyType} Palette`,
      colors: generatedColors,
      type: 'generated',
      created: new Date()
    };
    
    setSavedPalettes(prev => [...prev, newPalette]);
    toast({
      title: "Palette Saved",
      description: `${newPalette.name} saved successfully`,
    });
  };

  const toggleFavorite = (paletteId: string) => {
    setSavedPalettes(prev => 
      prev.map(p => 
        p.id === paletteId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  const deletePalette = (paletteId: string) => {
    setSavedPalettes(prev => prev.filter(p => p.id !== paletteId));
  };

  const exportPalettes = () => {
    const dataStr = JSON.stringify(savedPalettes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `ottersport-color-palettes-${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
  };

  const importPalettes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedPalettes = JSON.parse(e.target?.result as string);
          setSavedPalettes(prev => [...prev, ...importedPalettes]);
          toast({
            title: "Palettes Imported",
            description: `Successfully imported ${importedPalettes.length} palettes`,
          });
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Invalid file format",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Color Picker Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Picker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-20 h-20 rounded-lg border-2 border-gray-300 cursor-pointer"
              style={{ backgroundColor: activeColor }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            <div className="flex-1">
              <Label htmlFor="color-input">Color Value</Label>
              <Input
                id="color-input"
                type="text"
                value={activeColor}
                onChange={(e) => setActiveColor(e.target.value)}
                className="font-mono"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyColorToClipboard(activeColor)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {showColorPicker && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <input
                type="color"
                value={activeColor}
                onChange={(e) => setActiveColor(e.target.value)}
                className="w-full h-20 rounded border-none cursor-pointer"
              />
            </div>
          )}

          {/* Color Analysis */}
          {colorAnalysis && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <Label className="text-xs font-medium">RGB</Label>
                <div className="text-sm font-mono">
                  {colorAnalysis.rgb.r}, {colorAnalysis.rgb.g}, {colorAnalysis.rgb.b}
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium">HSL</Label>
                <div className="text-sm font-mono">
                  {Math.round(colorAnalysis.hsl.h)}°, {Math.round(colorAnalysis.hsl.s)}%, {Math.round(colorAnalysis.hsl.l)}%
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium">Brightness</Label>
                <div className="text-sm">{Math.round(colorAnalysis.brightness * 100)}%</div>
              </div>
              <div>
                <Label className="text-xs font-medium">Accessibility</Label>
                <Badge variant={colorAnalysis.accessibility === 'AAA' ? 'default' : 'secondary'}>
                  {colorAnalysis.accessibility}
                </Badge>
              </div>
            </div>
          )}

          {selectedElement && (
            <Button
              onClick={() => applyColorToElement(activeColor)}
              className="w-full"
            >
              Apply to Selected Element
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Harmony Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Color Harmony Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {['complementary', 'triadic', 'analogous', 'monochromatic'].map((type) => (
              <Button
                key={type}
                variant={harmonyType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHarmonyType(type as any)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            {generateHarmonyPalette(activeColor, harmonyType).map((color, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => {
                  setActiveColor(color);
                  copyColorToClipboard(color);
                }}
                title={color}
              />
            ))}
          </div>

          <Button onClick={savePalette} className="w-full">
            Save Palette
          </Button>
        </CardContent>
      </Card>

      {/* Color History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Recent Colors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {colorHistory.slice(0, 10).map((color, index) => (
              <div
                key={index}
                className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => setActiveColor(color)}
                title={color}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saved Palettes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Saved Palettes
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportPalettes}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {savedPalettes.map((palette) => (
            <div key={palette.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{palette.name}</span>
                  <Badge variant="secondary">{palette.type}</Badge>
                  {palette.isFavorite && <Heart className="h-4 w-4 text-red-500" />}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(palette.id)}
                  >
                    <Heart className={`h-4 w-4 ${palette.isFavorite ? 'text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePalette(palette.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                {palette.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => setActiveColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importPalettes}
        className="hidden"
      />
    </div>
  );
}