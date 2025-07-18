/**
 * GAME ARTIST CONTEXT
 * 
 * This context manages the game artist mode state and provides editing capabilities
 * for all visual elements throughout the application.
 */

import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";

interface VisualElement {
  id: string;
  type: 'image' | 'text' | 'color' | 'background' | 'icon' | 'animation' | 'gradient' | 'shadow' | 'border';
  category: string;
  name: string;
  currentValue: string;
  defaultValue: string;
  description: string;
  screenPath: string;
  selector?: string;
  recommendedSize?: string;
  layerIndex?: number;
  animationDuration?: number;
  animationType?: 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'pulse';
  isVisible?: boolean;
  isLocked?: boolean;
  previewMode?: boolean;
  customProperties?: Record<string, any>;
}

interface GameArtistContextType {
  isGameArtistMode: boolean;
  setGameArtistMode: (mode: boolean) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  currentScreen: string;
  visualElements: VisualElement[];
  updateVisualElement: (id: string, value: string, property?: string) => void;
  hoveredElement: string | null;
  setHoveredElement: (elementId: string | null) => void;
  selectedElement: string | null;
  setSelectedElement: (elementId: string | null) => void;
  getElementsForScreen: (screenPath: string) => VisualElement[];
  exportVisualPack: () => void;
  importVisualPack: (file: File) => void;
  resetToDefaults: () => void;
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  gridMode: boolean;
  setGridMode: (mode: boolean) => void;
  layerPanelOpen: boolean;
  setLayerPanelOpen: (open: boolean) => void;
  colorHistory: string[];
  addColorToHistory: (color: string) => void;
  undoStack: VisualElement[][];
  redoStack: VisualElement[][];
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  duplicateElement: (elementId: string) => void;
  deleteElement: (elementId: string) => void;
  reorderElement: (elementId: string, newIndex: number) => void;
  bulkUpdateElements: (updates: { id: string; value: string; property?: string }[]) => void;
  generateColorPalette: (baseColor: string) => string[];
  applyTheme: (themeName: string) => void;
  getElementHistory: (elementId: string) => string[];
}

const GameArtistContext = createContext<GameArtistContextType | undefined>(undefined);

const defaultVisualElements: VisualElement[] = [
  // Landing Page Elements
  { id: 'landing-bg', type: 'background', category: 'Backgrounds', name: 'Landing Background', currentValue: 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)', defaultValue: 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)', description: 'Main landing page background', screenPath: '/' },
  { id: 'landing-logo', type: 'image', category: 'Logos', name: 'Main Logo', currentValue: '/api/placeholder/200/80', defaultValue: '/api/placeholder/200/80', description: 'OtterSport main logo', screenPath: '/', recommendedSize: '200x80px' },
  { id: 'landing-hero-image', type: 'image', category: 'Illustrations', name: 'Hero Image', currentValue: '/api/placeholder/400/300', defaultValue: '/api/placeholder/400/300', description: 'Main hero illustration', screenPath: '/', recommendedSize: '400x300px' },
  { id: 'landing-title', type: 'text', category: 'Text', name: 'Main Title', currentValue: 'Welcome to OtterSport', defaultValue: 'Welcome to OtterSport', description: 'Landing page main title', screenPath: '/' },
  { id: 'landing-subtitle', type: 'text', category: 'Text', name: 'Subtitle', currentValue: 'Your Personal Fitness Journey Starts Here', defaultValue: 'Your Personal Fitness Journey Starts Here', description: 'Landing page subtitle', screenPath: '/' },
  
  // Home Page Elements
  { id: 'home-bg', type: 'background', category: 'Backgrounds', name: 'Home Background', currentValue: '#F8FAFC', defaultValue: '#F8FAFC', description: 'Home page background', screenPath: '/home' },
  { id: 'home-otter-happy', type: 'image', category: 'Characters', name: 'Otter Coach - Happy', currentValue: '/api/placeholder/120/120', defaultValue: '/api/placeholder/120/120', description: 'Happy otter coach character', screenPath: '/home', recommendedSize: '120x120px' },
  { id: 'home-welcome-text', type: 'text', category: 'Text', name: 'Welcome Message', currentValue: 'Ready for your workout?', defaultValue: 'Ready for your workout?', description: 'Home page welcome message', screenPath: '/home' },
  { id: 'home-streak-bg', type: 'color', category: 'Colors', name: 'Streak Card Background', currentValue: '#14B8A6', defaultValue: '#14B8A6', description: 'Streak counter background color', screenPath: '/home' },
  
  // Workout Page Elements
  { id: 'workout-bg', type: 'background', category: 'Backgrounds', name: 'Workout Background', currentValue: '#F1F5F9', defaultValue: '#F1F5F9', description: 'Workout page background', screenPath: '/workout' },
  { id: 'workout-card-bg', type: 'image', category: 'Cards', name: 'Exercise Card Background', currentValue: '/api/placeholder/300/420', defaultValue: '/api/placeholder/300/420', description: 'Exercise card background design', screenPath: '/workout', recommendedSize: '300x420px' },
  { id: 'workout-card-frame', type: 'image', category: 'Cards', name: 'Card Frame Overlay', currentValue: '/api/placeholder/300/420', defaultValue: '/api/placeholder/300/420', description: 'Card frame border overlay', screenPath: '/workout', recommendedSize: '300x420px' },
  { id: 'workout-timer-bg', type: 'color', category: 'Colors', name: 'Timer Background', currentValue: '#1E293B', defaultValue: '#1E293B', description: 'Workout timer background', screenPath: '/workout' },
  
  // Exercise Icons
  { id: 'icon-strength', type: 'icon', category: 'Exercise Icons', name: 'Strength Icon', currentValue: 'fas fa-dumbbell', defaultValue: 'fas fa-dumbbell', description: 'Strength exercise icon', screenPath: '/workout' },
  { id: 'icon-cardio', type: 'icon', category: 'Exercise Icons', name: 'Cardio Icon', currentValue: 'fas fa-heart', defaultValue: 'fas fa-heart', description: 'Cardio exercise icon', screenPath: '/workout' },
  { id: 'icon-flexibility', type: 'icon', category: 'Exercise Icons', name: 'Flexibility Icon', currentValue: 'fas fa-leaf', defaultValue: 'fas fa-leaf', description: 'Flexibility exercise icon', screenPath: '/workout' },
  { id: 'icon-mixed', type: 'icon', category: 'Exercise Icons', name: 'Mixed Icon', currentValue: 'fas fa-fire', defaultValue: 'fas fa-fire', description: 'Mixed exercise icon', screenPath: '/workout' },
  
  // Progress Page Elements
  { id: 'progress-bg', type: 'background', category: 'Backgrounds', name: 'Progress Background', currentValue: '#FAFBFC', defaultValue: '#FAFBFC', description: 'Progress page background', screenPath: '/progress' },
  { id: 'progress-chart-primary', type: 'color', category: 'Colors', name: 'Chart Primary Color', currentValue: '#14B8A6', defaultValue: '#14B8A6', description: 'Progress chart primary color', screenPath: '/progress' },
  { id: 'progress-chart-secondary', type: 'color', category: 'Colors', name: 'Chart Secondary Color', currentValue: '#0F766E', defaultValue: '#0F766E', description: 'Progress chart secondary color', screenPath: '/progress' },
  { id: 'progress-otter-proud', type: 'image', category: 'Characters', name: 'Otter Coach - Proud', currentValue: '/api/placeholder/120/120', defaultValue: '/api/placeholder/120/120', description: 'Proud otter coach character', screenPath: '/progress', recommendedSize: '120x120px' },
  
  // Deck Creation Page Elements
  { id: 'decks-bg', type: 'background', category: 'Backgrounds', name: 'Deck Creation Background', currentValue: '#F8FAFC', defaultValue: '#F8FAFC', description: 'Deck creation page background', screenPath: '/decks' },
  { id: 'decks-card-template', type: 'image', category: 'Cards', name: 'Deck Card Template', currentValue: '/api/placeholder/280/200', defaultValue: '/api/placeholder/280/200', description: 'Deck card template design', screenPath: '/decks', recommendedSize: '280x200px' },
  
  // Exercise Illustrations
  { id: 'exercise-pushup', type: 'image', category: 'Exercise Art', name: 'Push-up Illustration', currentValue: '/api/placeholder/300/200', defaultValue: '/api/placeholder/300/200', description: 'Push-up exercise illustration', screenPath: '/workout', recommendedSize: '300x200px' },
  { id: 'exercise-squat', type: 'image', category: 'Exercise Art', name: 'Squat Illustration', currentValue: '/api/placeholder/300/200', defaultValue: '/api/placeholder/300/200', description: 'Squat exercise illustration', screenPath: '/workout', recommendedSize: '300x200px' },
  { id: 'exercise-plank', type: 'image', category: 'Exercise Art', name: 'Plank Illustration', currentValue: '/api/placeholder/300/200', defaultValue: '/api/placeholder/300/200', description: 'Plank exercise illustration', screenPath: '/workout', recommendedSize: '300x200px' },
  { id: 'exercise-jumping-jacks', type: 'image', category: 'Exercise Art', name: 'Jumping Jacks Illustration', currentValue: '/api/placeholder/300/200', defaultValue: '/api/placeholder/300/200', description: 'Jumping jacks exercise illustration', screenPath: '/workout', recommendedSize: '300x200px' },
  
  // Achievement Icons
  { id: 'achievement-first-workout', type: 'image', category: 'Achievement Icons', name: 'First Workout Badge', currentValue: '/api/placeholder/64/64', defaultValue: '/api/placeholder/64/64', description: 'First workout achievement icon', screenPath: '/progress', recommendedSize: '64x64px' },
  { id: 'achievement-streak', type: 'image', category: 'Achievement Icons', name: 'Streak Badge', currentValue: '/api/placeholder/64/64', defaultValue: '/api/placeholder/64/64', description: 'Streak achievement icon', screenPath: '/progress', recommendedSize: '64x64px' },
  { id: 'achievement-century', type: 'image', category: 'Achievement Icons', name: 'Century Badge', currentValue: '/api/placeholder/64/64', defaultValue: '/api/placeholder/64/64', description: 'Century club achievement icon', screenPath: '/progress', recommendedSize: '64x64px' },
];

export function GameArtistProvider({ children }: { children: React.ReactNode }) {
  const [isGameArtistMode, setGameArtistMode] = useState(() => {
    return localStorage.getItem('gameArtistMode') === 'true';
  });
  const [isEditing, setIsEditing] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [visualElements, setVisualElements] = useState<VisualElement[]>(() => {
    const saved = localStorage.getItem('visualElements');
    return saved ? JSON.parse(saved) : defaultVisualElements;
  });
  const [location] = useLocation();

  // New enhanced state
  const [previewMode, setPreviewMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [gridMode, setGridMode] = useState(false);
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [colorHistory, setColorHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('colorHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [undoStack, setUndoStack] = useState<VisualElement[][]>([]);
  const [redoStack, setRedoStack] = useState<VisualElement[][]>([]);

  // Save to localStorage whenever mode changes
  useEffect(() => {
    localStorage.setItem('gameArtistMode', isGameArtistMode.toString());
  }, [isGameArtistMode]);

  // Save visual elements to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('visualElements', JSON.stringify(visualElements));
  }, [visualElements]);

  // Save color history to localStorage
  useEffect(() => {
    localStorage.setItem('colorHistory', JSON.stringify(colorHistory));
  }, [colorHistory]);

  const pushToUndoStack = (currentState: VisualElement[]) => {
    setUndoStack(prev => [...prev.slice(-19), currentState]); // Keep last 20 states
    setRedoStack([]); // Clear redo stack when new action is performed
  };

  const updateVisualElement = (id: string, value: string, property?: string) => {
    pushToUndoStack(visualElements);
    setVisualElements(prev => 
      prev.map(element => 
        element.id === id ? { 
          ...element, 
          currentValue: value,
          ...(property && { [property]: value })
        } : element
      )
    );
  };

  const bulkUpdateElements = (updates: { id: string; value: string; property?: string }[]) => {
    pushToUndoStack(visualElements);
    setVisualElements(prev => 
      prev.map(element => {
        const update = updates.find(u => u.id === element.id);
        if (update) {
          return {
            ...element,
            currentValue: update.value,
            ...(update.property && { [update.property]: update.value })
          };
        }
        return element;
      })
    );
  };

  const getElementsForScreen = (screenPath: string) => {
    return visualElements.filter(element => {
      if (screenPath === '/') return element.screenPath === '/';
      if (screenPath.startsWith('/workout')) return element.screenPath === '/workout' || element.screenPath === '/';
      return element.screenPath === screenPath || element.screenPath === '/';
    });
  };

  const exportVisualPack = () => {
    const dataStr = JSON.stringify(visualElements, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ottersport-visual-pack-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importVisualPack = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedElements = JSON.parse(e.target?.result as string);
        setVisualElements(importedElements);
      } catch (error) {
        console.error('Error importing visual pack:', error);
      }
    };
    reader.readAsText(file);
  };

  const resetToDefaults = () => {
    pushToUndoStack(visualElements);
    setVisualElements(defaultVisualElements);
    localStorage.removeItem('visualElements');
  };

  const addColorToHistory = (color: string) => {
    setColorHistory(prev => {
      const newHistory = [color, ...prev.filter(c => c !== color)];
      return newHistory.slice(0, 20); // Keep last 20 colors
    });
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [...prev, visualElements]);
      setUndoStack(prev => prev.slice(0, -1));
      setVisualElements(previousState);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack(prev => [...prev, visualElements]);
      setRedoStack(prev => prev.slice(0, -1));
      setVisualElements(nextState);
    }
  };

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  const duplicateElement = (elementId: string) => {
    const elementToDuplicate = visualElements.find(el => el.id === elementId);
    if (elementToDuplicate) {
      pushToUndoStack(visualElements);
      const newElement = {
        ...elementToDuplicate,
        id: `${elementId}-copy-${Date.now()}`,
        name: `${elementToDuplicate.name} (Copy)`,
        layerIndex: (elementToDuplicate.layerIndex || 0) + 1
      };
      setVisualElements(prev => [...prev, newElement]);
    }
  };

  const deleteElement = (elementId: string) => {
    pushToUndoStack(visualElements);
    setVisualElements(prev => prev.filter(el => el.id !== elementId));
  };

  const reorderElement = (elementId: string, newIndex: number) => {
    pushToUndoStack(visualElements);
    const element = visualElements.find(el => el.id === elementId);
    if (element) {
      const updatedElement = { ...element, layerIndex: newIndex };
      setVisualElements(prev => 
        prev.map(el => el.id === elementId ? updatedElement : el)
      );
    }
  };

  const generateColorPalette = (baseColor: string): string[] => {
    // Convert hex to HSL and generate complementary colors
    const hsl = hexToHsl(baseColor);
    const palette = [];
    
    // Base color
    palette.push(baseColor);
    
    // Complementary
    palette.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
    
    // Analogous colors
    palette.push(hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l));
    palette.push(hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l));
    
    // Triadic colors
    palette.push(hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
    palette.push(hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l));
    
    return palette;
  };

  const applyTheme = (themeName: string) => {
    const themes = {
      default: { primary: '#14B8A6', secondary: '#0F766E', accent: '#F59E0B' },
      dark: { primary: '#1E293B', secondary: '#475569', accent: '#F59E0B' },
      ocean: { primary: '#0369A1', secondary: '#0284C7', accent: '#06B6D4' },
      forest: { primary: '#15803D', secondary: '#16A34A', accent: '#84CC16' },
      sunset: { primary: '#DC2626', secondary: '#EA580C', accent: '#F59E0B' },
      purple: { primary: '#7C3AED', secondary: '#A855F7', accent: '#C084FC' }
    };
    
    const theme = themes[themeName as keyof typeof themes];
    if (theme) {
      pushToUndoStack(visualElements);
      setCurrentTheme(themeName);
      
      // Apply theme colors to relevant elements
      const themeUpdates = visualElements
        .filter(el => el.type === 'color' && el.category === 'Colors')
        .map(el => ({
          id: el.id,
          value: el.name.toLowerCase().includes('primary') ? theme.primary :
                el.name.toLowerCase().includes('secondary') ? theme.secondary :
                el.name.toLowerCase().includes('accent') ? theme.accent :
                el.currentValue,
          property: 'currentValue'
        }));
      
      bulkUpdateElements(themeUpdates);
    }
  };

  const getElementHistory = (elementId: string): string[] => {
    // Return history of values for a specific element
    const element = visualElements.find(el => el.id === elementId);
    return element ? [element.currentValue, element.defaultValue] : [];
  };

  // Helper functions for color conversion
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
    
    return { h: h * 360, s: s * 100, l: l * 100 };
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

  return (
    <GameArtistContext.Provider value={{
      isGameArtistMode,
      setGameArtistMode,
      isEditing,
      setIsEditing,
      currentScreen: location,
      visualElements,
      updateVisualElement,
      hoveredElement,
      setHoveredElement,
      selectedElement,
      setSelectedElement,
      getElementsForScreen,
      exportVisualPack,
      importVisualPack,
      resetToDefaults,
      previewMode,
      setPreviewMode,
      currentTheme,
      setCurrentTheme,
      animationSpeed,
      setAnimationSpeed,
      gridMode,
      setGridMode,
      layerPanelOpen,
      setLayerPanelOpen,
      colorHistory,
      addColorToHistory,
      undoStack,
      redoStack,
      undo,
      redo,
      canUndo,
      canRedo,
      duplicateElement,
      deleteElement,
      reorderElement,
      bulkUpdateElements,
      generateColorPalette,
      applyTheme,
      getElementHistory,
    }}>
      {children}
    </GameArtistContext.Provider>
  );
}

export const useGameArtist = () => {
  const context = useContext(GameArtistContext);
  if (context === undefined) {
    throw new Error('useGameArtist must be used within a GameArtistProvider');
  }
  return context;
};