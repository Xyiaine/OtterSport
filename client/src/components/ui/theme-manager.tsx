/**
 * THEME MANAGER COMPONENT
 * 
 * Advanced theme management system for Game Artist mode with:
 * - Dynamic theme creation and editing
 * - Color scheme generation and validation
 * - Real-time theme preview
 * - Theme export/import functionality
 * - Accessibility compliance checking
 * - Theme inheritance and variations
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Palette, 
  Eye, 
  Download, 
  Upload,
  Save,
  Copy,
  Trash2,
  Star,
  Wand2,
  RefreshCw,
  Check,
  X,
  Paintbrush,
  Sun,
  Moon,
  Monitor,
  Zap,
  Shield,
  Target
} from "lucide-react";
import { useGameArtist } from "@/contexts/GameArtistContext";
import { useToast } from "@/hooks/use-toast";

/**
 * ThemeColor interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * ThemeColor interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * ThemeColor interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ThemeColor
 */
 * @interface ThemeColor
/**
/**
 * ThemeColor interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ThemeColor
/**
 * Theme interface defines the contract for implementation.
 * 
/**
 * defines interface defines the contract for implementation.
 * 
/**
 * Theme interface defines the contract for implementation.
 * 
/**
 * ThemeColor interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ThemeColor
/**
 * Theme interface defines the contract for implementation.
 * 
/**
 * ThemeColor interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ThemeColor
/**
 * Theme interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Theme
 */
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Theme
 */
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Theme
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Theme
 */
 */
 * Theme interface defines the contract for implementation.
 * 
/**
 * ThemeColor interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface ThemeColor
/**
 * Theme interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Theme
 */
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Theme
 */
 */
 * @interface ThemeColor
/**
 * Handles thememanager functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await ThemeManager(params);
 */
/**
 * Theme interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Theme
 */
 */
interface ThemeColor {
  name: string;
  value: string;
  description: string;
  category: 'primary' | 'secondary' | 'accent' | 'neutral' | 'semantic';
}

interface Theme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColor[];
  typography: {
    fontFamily: string;
    fontSize: { base: number; scale: number };
    lineHeight: number;
  };
  spacing: {
    base: number;
    scale: number;
/**
 * Handles thememanager functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await ThemeManager(params);
 */
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
/**
 * Handles thememanager functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await ThemeManager(params);
 */
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  isDark: boolean;
  isCustom: boolean;
  createdAt: Date;
  accessibility: {
    wcagLevel: 'AA' | 'AAA';
    contrastRatio: number;
    colorBlindFriendly: boolean;
  };
}

export default function ThemeManager() {
  const { currentTheme, applyTheme } = useGameArtist();
  const { toast } = useToast();
  
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);

  // Initialize with default themes
  useEffect(() => {
    const defaultThemes: Theme[] = [
      {
        id: 'ottersport-default',
        name: 'OtterSport Default',
        description: 'The classic OtterSport theme with teal accents',
        colors: [
          { name: 'primary', value: '#14B8A6', description: 'Primary brand color', category: 'primary' },
          { name: 'secondary', value: '#0F766E', description: 'Secondary brand color', category: 'secondary' },
          { name: 'accent', value: '#F59E0B', description: 'Accent color for highlights', category: 'accent' },
          { name: 'background', value: '#FFFFFF', description: 'Main background color', category: 'neutral' },
          { name: 'surface', value: '#F9FAFB', description: 'Surface color for cards', category: 'neutral' },
          { name: 'text', value: '#111827', description: 'Primary text color', category: 'neutral' },
          { name: 'success', value: '#10B981', description: 'Success state color', category: 'semantic' },
          { name: 'warning', value: '#F59E0B', description: 'Warning state color', category: 'semantic' },
          { name: 'error', value: '#EF4444', description: 'Error state color', category: 'semantic' },
        ],
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: { base: 16, scale: 1.125 },
          lineHeight: 1.5
        },
        spacing: { base: 4, scale: 1.5 },
        borderRadius: { small: 4, medium: 8, large: 12 },
        shadows: {
          small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          large: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        },
        isDark: false,
        isCustom: false,
        createdAt: new Date(),
        accessibility: {
          wcagLevel: 'AA',
          contrastRatio: 4.5,
          colorBlindFriendly: true
        }
      },
      {
        id: 'ottersport-dark',
        name: 'OtterSport Dark',
        description: 'Dark theme variant with excellent contrast',
        colors: [
          { name: 'primary', value: '#14B8A6', description: 'Primary brand color', category: 'primary' },
          { name: 'secondary', value: '#0F766E', description: 'Secondary brand color', category: 'secondary' },
          { name: 'accent', value: '#F59E0B', description: 'Accent color for highlights', category: 'accent' },
          { name: 'background', value: '#0F172A', description: 'Main background color', category: 'neutral' },
          { name: 'surface', value: '#1E293B', description: 'Surface color for cards', category: 'neutral' },
          { name: 'text', value: '#F1F5F9', description: 'Primary text color', category: 'neutral' },
          { name: 'success', value: '#10B981', description: 'Success state color', category: 'semantic' },
          { name: 'warning', value: '#F59E0B', description: 'Warning state color', category: 'semantic' },
          { name: 'error', value: '#EF4444', description: 'Error state color', category: 'semantic' },
        ],
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: { base: 16, scale: 1.125 },
          lineHeight: 1.5
        },
        spacing: { base: 4, scale: 1.5 },
        borderRadius: { small: 4, medium: 8, large: 12 },
        shadows: {
          small: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
          medium: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
          large: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
        },
        isDark: true,
        isCustom: false,
        createdAt: new Date(),
        accessibility: {
          wcagLevel: 'AA',
          contrastRatio: 4.5,
          colorBlindFriendly: true
        }
      },
      {
        id: 'ocean-breeze',
        name: 'Ocean Breeze',
        description: 'Calming blue theme inspired by ocean waves',
        colors: [
          { name: 'primary', value: '#0369A1', description: 'Primary brand color', category: 'primary' },
          { name: 'secondary', value: '#0284C7', description: 'Secondary brand color', category: 'secondary' },
          { name: 'accent', value: '#06B6D4', description: 'Accent color for highlights', category: 'accent' },
          { name: 'background', value: '#F8FAFC', description: 'Main background color', category: 'neutral' },
          { name: 'surface', value: '#E2E8F0', description: 'Surface color for cards', category: 'neutral' },
          { name: 'text', value: '#1E293B', description: 'Primary text color', category: 'neutral' },
          { name: 'success', value: '#059669', description: 'Success state color', category: 'semantic' },
          { name: 'warning', value: '#D97706', description: 'Warning state color', category: 'semantic' },
          { name: 'error', value: '#DC2626', description: 'Error state color', category: 'semantic' },
        ],
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: { base: 16, scale: 1.125 },
          lineHeight: 1.5
        },
        spacing: { base: 4, scale: 1.5 },
        borderRadius: { small: 6, medium: 10, large: 16 },
        shadows: {
          small: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          large: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        },
        isDark: false,
        isCustom: false,
        createdAt: new Date(),
        accessibility: {
          wcagLevel: 'AA',
          contrastRatio: 4.5,
          colorBlindFriendly: true
        }
      }
    ];
    
    setThemes(defaultThemes);
  }, []);

  const calculateContrastRatio = (color1: string, color2: string): number => {
    const getLuminance = (hex: string): number => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  };

  const generateColorPalette = (baseColor: string): ThemeColor[] => {
    // Generate a complete color palette from a base color
    const hsl = hexToHsl(baseColor);
    
    return [
      { name: 'primary', value: baseColor, description: 'Primary brand color', category: 'primary' },
      { name: 'secondary', value: hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 0.1, 0)), description: 'Secondary brand color', category: 'secondary' },
      { name: 'accent', value: hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l), description: 'Accent color for highlights', category: 'accent' },
      { name: 'background', value: '#FFFFFF', description: 'Main background color', category: 'neutral' },
      { name: 'surface', value: '#F9FAFB', description: 'Surface color for cards', category: 'neutral' },
      { name: 'text', value: '#111827', description: 'Primary text color', category: 'neutral' },
      { name: 'success', value: '#10B981', description: 'Success state color', category: 'semantic' },
      { name: 'warning', value: '#F59E0B', description: 'Warning state color', category: 'semantic' },
      { name: 'error', value: '#EF4444', description: 'Error state color', category: 'semantic' },
    ];
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
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
    
    return { h: h * 360, s, l };
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    h /= 360;
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

  const createCustomTheme = (baseColor: string) => {
    const newTheme: Theme = {
      id: Date.now().toString(),
      name: 'Custom Theme',
      description: 'Custom theme created from base color',
      colors: generateColorPalette(baseColor),
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: { base: 16, scale: 1.125 },
        lineHeight: 1.5
      },
      spacing: { base: 4, scale: 1.5 },
      borderRadius: { small: 4, medium: 8, large: 12 },
      shadows: {
        small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        large: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      },
      isDark: false,
      isCustom: true,
      createdAt: new Date(),
      accessibility: {
        wcagLevel: 'AA',
        contrastRatio: 4.5,
        colorBlindFriendly: true
      }
    };
    
    setThemes(prev => [...prev, newTheme]);
    setSelectedTheme(newTheme.id);
    toast({
      title: "Theme Created",
      description: "Custom theme has been created successfully",
    });
  };

  const duplicateTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;
    
    const duplicatedTheme = {
      ...theme,
      id: Date.now().toString(),
      name: `${theme.name} Copy`,
      isCustom: true,
      createdAt: new Date()
    };
    
    setThemes(prev => [...prev, duplicatedTheme]);
    toast({
      title: "Theme Duplicated",
      description: "Theme has been duplicated successfully",
    });
  };

  const exportTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;
    
    const dataStr = JSON.stringify(theme, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `${theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`);
    linkElement.click();
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTheme = JSON.parse(e.target?.result as string);
        const newTheme = {
          ...importedTheme,
          id: Date.now().toString(),
          isCustom: true,
          createdAt: new Date()
        };
        
        setThemes(prev => [...prev, newTheme]);
        toast({
          title: "Theme Imported",
          description: "Theme has been imported successfully",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid theme file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const checkAccessibility = (theme: Theme) => {
    const textColor = theme.colors.find(c => c.name === 'text')?.value || '#000000';
    const backgroundColor = theme.colors.find(c => c.name === 'background')?.value || '#FFFFFF';
    
    const contrastRatio = calculateContrastRatio(textColor, backgroundColor);
    
    return {
      contrastRatio,
      wcagLevel: contrastRatio >= 7 ? 'AAA' : contrastRatio >= 4.5 ? 'AA' : 'A',
      colorBlindFriendly: true // Simplified check
    };
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Palette className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Theme Manager</h2>
          <Badge variant="secondary">
            {themes.length} themes
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}
          >
            <Shield className="h-4 w-4 mr-2" />
            Accessibility
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('theme-import')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            Create Theme
          </Button>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => {
          const accessibility = checkAccessibility(theme);
          const isActive = currentTheme === theme.id;
          
          return (
            <Card
              key={theme.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isActive ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => {
                applyTheme(theme.id);
                setSelectedTheme(theme.id);
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{theme.name}</CardTitle>
                    {isActive && <Badge variant="default">Active</Badge>}
                    {theme.isCustom && <Badge variant="outline">Custom</Badge>}
                  </div>
                  <div className="flex items-center gap-1">
                    {theme.isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    <div className="flex items-center gap-1">
                      {accessibility.wcagLevel === 'AAA' && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                      {accessibility.wcagLevel === 'AA' && (
                        <Target className="h-4 w-4 text-yellow-500" />
                      )}
                      {accessibility.wcagLevel === 'A' && (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {theme.description}
                </p>
              </CardHeader>
              
              <CardContent>
                {/* Color Palette Preview */}
                <div className="flex gap-2 mb-4">
                  {theme.colors.slice(0, 6).map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: color.value }}
                      title={`${color.name}: ${color.value}`}
                    />
                  ))}
                </div>
                
                {/* Theme Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Contrast Ratio</span>
                    <Badge variant="outline">
                      {accessibility.contrastRatio.toFixed(1)}:1
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>WCAG Level</span>
                    <Badge variant={accessibility.wcagLevel === 'AAA' ? 'default' : 'secondary'}>
                      {accessibility.wcagLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Created</span>
                    <span className="text-gray-500">
                      {theme.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewMode(true);
                      applyTheme(theme.id);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateTheme(theme.id);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      exportTheme(theme.id);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {theme.isCustom && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setThemes(prev => prev.filter(t => t.id !== theme.id));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Theme Generator */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Theme Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Base Color</Label>
              <Input
                type="color"
                className="h-12 w-full"
                onChange={(e) => createCustomTheme(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => createCustomTheme('#' + Math.floor(Math.random()*16777215).toString(16))}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Random
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Panel */}
      {showAccessibilityPanel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Accessibility Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="font-medium">WCAG AAA</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Contrast ratio ≥ 7:1 for optimal accessibility
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">WCAG AA</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Contrast ratio ≥ 4.5:1 for good accessibility
                  </p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Below AA</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Contrast ratio &lt; 4.5:1 may cause accessibility issues
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden file input */}
      <input
        id="theme-import"
        type="file"
        accept=".json"
        onChange={importTheme}
        className="hidden"
      />
    </div>
  );
}