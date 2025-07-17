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
  type: 'image' | 'text' | 'color' | 'background' | 'icon';
  category: string;
  name: string;
  currentValue: string;
  defaultValue: string;
  description: string;
  screenPath: string;
  selector?: string;
  recommendedSize?: string;
}

interface GameArtistContextType {
  isGameArtistMode: boolean;
  setGameArtistMode: (mode: boolean) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  currentScreen: string;
  visualElements: VisualElement[];
  updateVisualElement: (id: string, value: string) => void;
  hoveredElement: string | null;
  setHoveredElement: (elementId: string | null) => void;
  selectedElement: string | null;
  setSelectedElement: (elementId: string | null) => void;
  getElementsForScreen: (screenPath: string) => VisualElement[];
  exportVisualPack: () => void;
  importVisualPack: (file: File) => void;
  resetToDefaults: () => void;
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

  // Save to localStorage whenever mode changes
  useEffect(() => {
    localStorage.setItem('gameArtistMode', isGameArtistMode.toString());
  }, [isGameArtistMode]);

  // Save visual elements to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('visualElements', JSON.stringify(visualElements));
  }, [visualElements]);

  const updateVisualElement = (id: string, value: string) => {
    setVisualElements(prev => 
      prev.map(element => 
        element.id === id ? { ...element, currentValue: value } : element
      )
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
    setVisualElements(defaultVisualElements);
    localStorage.removeItem('visualElements');
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