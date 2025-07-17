/**
 * GAME ARTIST TOOLBAR
 * 
 * This component provides a floating toolbar for game artists that appears
 * when game artist mode is enabled. It provides quick access to editing tools.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Paintbrush, 
  Eye, 
  EyeOff, 
  Settings,
  Layers,
  Monitor,
  Palette,
  Save,
  Download,
  Upload,
  RotateCcw,
  Move,
  X
} from "lucide-react";
import { useGameArtist } from "@/contexts/GameArtistContext";
import VisualEditor from "./visual-editor";

export default function GameArtistToolbar() {
  const { 
    isGameArtistMode, 
    setGameArtistMode, 
    isEditing, 
    setIsEditing,
    currentScreen,
    getElementsForScreen,
    hoveredElement,
    selectedElement,
    visualElements,
    exportVisualPack,
    resetToDefaults
  } = useGameArtist();

  const [showEditor, setShowEditor] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);

  if (!isGameArtistMode) return null;

  const currentScreenElements = getElementsForScreen(currentScreen);
  const totalElements = visualElements.length;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - offsetX,
        y: e.clientY - offsetY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getScreenName = (path: string) => {
    if (path === '/') return 'Landing';
    if (path.startsWith('/workout')) return 'Workout';
    if (path.startsWith('/game-modes')) return 'Game Mode';
    return path.slice(1).charAt(0).toUpperCase() + path.slice(2);
  };

  return (
    <>
      {/* Floating Toolbar */}
      <div
        className={`fixed z-40 bg-white dark:bg-gray-900 shadow-lg rounded-lg border transition-all duration-200 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${isMinimized ? 'w-12' : 'w-72'}`}
        style={{
          left: position.x,
          top: position.y,
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Paintbrush className="h-4 w-4 text-primary" />
            {!isMinimized && (
              <>
                <span className="text-sm font-medium">Game Artist</span>
                <Badge variant="secondary" className="text-xs">
                  {getScreenName(currentScreen)}
                </Badge>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0"
            >
              {isMinimized ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGameArtistMode(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-3 space-y-3">
            {/* Screen Info */}
            <div className="text-xs text-gray-500">
              <div className="flex items-center justify-between">
                <span>Elements on screen:</span>
                <span className="font-medium">{currentScreenElements.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total elements:</span>
                <span className="font-medium">{totalElements}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEditor(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-3 w-3" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                <Eye className="h-3 w-3" />
                Preview
              </Button>
            </div>

            {/* Element Status */}
            {hoveredElement && (
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                <div className="font-medium">Hovered Element:</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {visualElements.find(el => el.id === hoveredElement)?.name || 'Unknown'}
                </div>
              </div>
            )}

            {selectedElement && (
              <div className="p-2 bg-primary/10 rounded text-xs">
                <div className="font-medium">Selected Element:</div>
                <div className="text-primary">
                  {visualElements.find(el => el.id === selectedElement)?.name || 'Unknown'}
                </div>
              </div>
            )}

            {/* Quick Tools */}
            <div className="flex flex-wrap gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={exportVisualPack}
                className="h-8 px-2"
              >
                <Download className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToDefaults}
                className="h-8 px-2"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditor(true)}
                className="h-8 px-2"
              >
                <Layers className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Visual Editor Modal */}
      {showEditor && (
        <VisualEditor onClose={() => setShowEditor(false)} />
      )}
    </>
  );
}