import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Visual Element interface for Game Artist system
 * Defines structure for visual customization elements
 */
interface VisualElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'exercise' | 'card';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: Record<string, any>;
  animation?: string;
  visible: boolean;
}

/**
 * Game Artist Context Type
 * Defines the interface for the Game Artist context
 */
interface GameArtistContextType {
  elements: VisualElement[];
  selectedElement: string | null;
  isEditorOpen: boolean;
  currentTheme: string;
  
  // Element management
  addElement: (element: Omit<VisualElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<VisualElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  
  // Editor controls
  openEditor: () => void;
  closeEditor: () => void;
  
  // Theme management
  setTheme: (theme: string) => void;
  
  // Export functionality
  exportScene: () => string;
  importScene: (data: string) => void;
}

/**
 * Game Artist Context
 */
const GameArtistContext = createContext<GameArtistContextType | undefined>(undefined);

/**
 * Game Artist Provider component
 * Provides the Game Artist context to child components
 */
interface GameArtistProviderProps {
  children: ReactNode;
}

export function GameArtistProvider({ children }: GameArtistProviderProps) {
  const [elements, setElements] = useState<VisualElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');

  // Generate unique ID for elements
  const generateId = () => `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addElement = (elementData: Omit<VisualElement, 'id'>) => {
    const newElement: VisualElement = {
      ...elementData,
      id: generateId(),
    };
    setElements(prev => [...prev, newElement]);
  };

  const updateElement = (id: string, updates: Partial<VisualElement>) => {
    setElements(prev => 
      prev.map(element => 
        element.id === id ? { ...element, ...updates } : element
      )
    );
  };

  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(element => element.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const selectElement = (id: string | null) => {
    setSelectedElement(id);
  };

  const openEditor = () => {
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setSelectedElement(null);
  };

  const setTheme = (theme: string) => {
    setCurrentTheme(theme);
  };

  const exportScene = () => {
    return JSON.stringify({
      elements,
      theme: currentTheme,
      timestamp: new Date().toISOString(),
    });
  };

  const importScene = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.elements && Array.isArray(parsed.elements)) {
        setElements(parsed.elements);
      }
      if (parsed.theme) {
        setCurrentTheme(parsed.theme);
      }
    } catch (error) {
      console.error('Failed to import scene:', error);
    }
  };

  const contextValue: GameArtistContextType = {
    elements,
    selectedElement,
    isEditorOpen,
    currentTheme,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    openEditor,
    closeEditor,
    setTheme,
    exportScene,
    importScene,
  };

  return (
    <GameArtistContext.Provider value={contextValue}>
      {children}
    </GameArtistContext.Provider>
  );
}

/**
 * Hook to use Game Artist context
 * Provides access to the Game Artist context
 */
export function useGameArtist() {
  const context = useContext(GameArtistContext);
  if (context === undefined) {
    throw new Error('useGameArtist must be used within a GameArtistProvider');
  }
  return context;
}