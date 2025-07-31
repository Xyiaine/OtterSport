/**
 * LAYER PANEL
 * 
 * Advanced layer management system for Game Artist mode with:
 * - Visual element hierarchy
 * - Drag and drop reordering
 * - Visibility toggles
 * - Lock/unlock elements
 * - Layer grouping
 * - Blend modes
 */

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  GripVertical,
  Copy,
  Trash2,
  Plus,
  Folder,
  FolderOpen,
  Image,
  Type,
  Palette,
  Zap,
  Move,
  RotateCcw,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useGameArtist } from "@/contexts/GameArtistContext";

/**
 * LayerGroup interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * LayerGroup interface defines the contract for implementation.
/**
 * LayerGroup interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * LayerGroup interface defines the contract for implementation.
 * 
/**
 * defines interface defines the contract for implementation.
 * 
/**
 * LayerGroup interface defines the contract for implementation.
/**
 * LayerGroup interface defines the contract for implementation.
/**
 * LayerGroup interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface LayerGroup
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface LayerGroup
 */
 * 
/**
 * Handles that functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface LayerGroup
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
/**
 * Handles layerpanel functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await LayerPanel(params);
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface LayerGroup
 */
 * @interface LayerGroup
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface LayerGroup
 */
 * @interface LayerGroup
 */
interface LayerGroup {
/**
 * Handles layerpanel functionality for the application
 * 
/**
 * Handles layerpanel functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await LayerPanel(params);
 */
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await LayerPanel(params);
 */
  id: string;
  name: string;
  isExpanded: boolean;
  elementIds: string[];
  isVisible: boolean;
  isLocked: boolean;
}

export default function LayerPanel() {
  const { 
    visualElements, 
    selectedElement, 
    setSelectedElement,
    hoveredElement,
    setHoveredElement,
    updateVisualElement,
    duplicateElement,
    deleteElement,
    reorderElement,
    currentScreen,
    getElementsForScreen
  } = useGameArtist();

  const [layerGroups, setLayerGroups] = useState<LayerGroup[]>([
    {
      id: 'backgrounds',
      name: 'Backgrounds',
      isExpanded: true,
      elementIds: [],
      isVisible: true,
      isLocked: false
    },
    {
      id: 'characters',
      name: 'Characters',
      isExpanded: true,
      elementIds: [],
      isVisible: true,
      isLocked: false
    },
    {
      id: 'ui-elements',
      name: 'UI Elements',
      isExpanded: true,
      elementIds: [],
      isVisible: true,
      isLocked: false
    }
  ]);

  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOverElement, setDragOverElement] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);

  const currentScreenElements = getElementsForScreen(currentScreen);
  const sortedElements = [...currentScreenElements].sort((a, b) => (b.layerIndex || 0) - (a.layerIndex || 0));

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'text': return <Type className="h-4 w-4" />;
      case 'color': return <Palette className="h-4 w-4" />;
      case 'background': return <Layers className="h-4 w-4" />;
      case 'animation': return <Zap className="h-4 w-4" />;
      default: return <Move className="h-4 w-4" />;
    }
  };

  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    setDraggedElement(elementId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, elementId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverElement(elementId);
  };

  const handleDragLeave = () => {
    setDragOverElement(null);
  };

  const handleDrop = (e: React.DragEvent, targetElementId: string) => {
    e.preventDefault();
    
    if (draggedElement && draggedElement !== targetElementId) {
      const draggedEl = visualElements.find(el => el.id === draggedElement);
      const targetEl = visualElements.find(el => el.id === targetElementId);
      
      if (draggedEl && targetEl) {
        const newLayerIndex = (targetEl.layerIndex || 0) + 1;
        reorderElement(draggedElement, newLayerIndex);
      }
    }
    
    setDraggedElement(null);
    setDragOverElement(null);
  };

  const toggleElementVisibility = (elementId: string) => {
    const element = visualElements.find(el => el.id === elementId);
    if (element) {
      updateVisualElement(elementId, (!element.isVisible).toString(), 'isVisible');
    }
  };

  const toggleElementLock = (elementId: string) => {
    const element = visualElements.find(el => el.id === elementId);
    if (element) {
      updateVisualElement(elementId, (!element.isLocked).toString(), 'isLocked');
    }
  };

  const createNewGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: LayerGroup = {
        id: Date.now().toString(),
        name: newGroupName,
        isExpanded: true,
        elementIds: [],
        isVisible: true,
        isLocked: false
      };
      
      setLayerGroups(prev => [...prev, newGroup]);
      setNewGroupName('');
      setShowNewGroupInput(false);
    }
  };

  const toggleGroupExpansion = (groupId: string) => {
    setLayerGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? { ...group, isExpanded: !group.isExpanded }
          : group
      )
    );
  };

  const toggleGroupVisibility = (groupId: string) => {
    setLayerGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? { ...group, isVisible: !group.isVisible }
          : group
      )
    );
  };

  const toggleGroupLock = (groupId: string) => {
    setLayerGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? { ...group, isLocked: !group.isLocked }
          : group
      )
    );
  };

  const getElementOpacity = (element: any) => {
    if (element.isVisible === false) return 0.3;
    if (element.isLocked) return 0.7;
    return 1;
  };

  const getElementsByCategory = (category: string) => {
    return sortedElements.filter(el => el.category === category);
  };

  return (
    <Card className="w-80 max-h-[600px] overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Layers Panel
          </div>
          <Badge variant="secondary">
            {currentScreenElements.length} elements
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto">
          {/* Layer Groups */}
          <div className="space-y-1">
            {layerGroups.map((group) => {
              const groupElements = getElementsByCategory(group.name);
              
              return (
                <div key={group.id} className="border-b border-gray-200 dark:border-gray-700">
                  {/* Group Header */}
                  <div className="flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleGroupExpansion(group.id)}
                      className="p-0 h-auto mr-2"
                    >
                      {group.isExpanded ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                    
                    <div className="flex items-center gap-2 flex-1">
                      {group.isExpanded ? 
                        <FolderOpen className="h-4 w-4" /> : 
                        <Folder className="h-4 w-4" />
                      }
                      <span className="text-sm font-medium">{group.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {groupElements.length}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleGroupVisibility(group.id)}
                        className="p-1 h-auto"
                      >
                        {group.isVisible ? 
                          <Eye className="h-3 w-3" /> : 
                          <EyeOff className="h-3 w-3" />
                        }
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleGroupLock(group.id)}
                        className="p-1 h-auto"
                      >
                        {group.isLocked ? 
                          <Lock className="h-3 w-3" /> : 
                          <Unlock className="h-3 w-3" />
                        }
                      </Button>
                    </div>
                  </div>
                  
                  {/* Group Elements */}
                  {group.isExpanded && (
                    <div className="space-y-1 pl-4">
                      {groupElements.map((element) => (
                        <div
                          key={element.id}
                          className={`
                            flex items-center p-2 cursor-pointer transition-all
                            ${selectedElement === element.id ? 'bg-primary/10 border-l-2 border-primary' : ''}
                            ${hoveredElement === element.id ? 'bg-gray-50 dark:bg-gray-800' : ''}
                            ${dragOverElement === element.id ? 'bg-blue-50 dark:bg-blue-900' : ''}
                          `}
                          style={{ opacity: getElementOpacity(element) }}
                          draggable={!element.isLocked}
                          onDragStart={(e) => handleDragStart(e, element.id)}
                          onDragOver={(e) => handleDragOver(e, element.id)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, element.id)}
                          onClick={() => setSelectedElement(element.id)}
                          onMouseEnter={() => setHoveredElement(element.id)}
                          onMouseLeave={() => setHoveredElement(null)}
                        >
                          {/* Drag Handle */}
                          <GripVertical className="h-4 w-4 mr-2 text-gray-400" />
                          
                          {/* Element Icon */}
                          <div className="mr-2">
                            {getElementIcon(element.type)}
                          </div>
                          
                          {/* Element Info */}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {element.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {element.type} • {element.screenPath}
                            </div>
                          </div>
                          
                          {/* Element Controls */}
                          <div className="flex gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleElementVisibility(element.id);
                              }}
                              className="p-1 h-auto"
                            >
                              {element.isVisible !== false ? 
                                <Eye className="h-3 w-3" /> : 
                                <EyeOff className="h-3 w-3" />
                              }
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleElementLock(element.id);
                              }}
                              className="p-1 h-auto"
                            >
                              {element.isLocked ? 
                                <Lock className="h-3 w-3" /> : 
                                <Unlock className="h-3 w-3" />
                              }
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Ungrouped Elements */}
          <div className="space-y-1 p-4">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Ungrouped Elements
            </div>
            {sortedElements
              .filter(el => !layerGroups.some(group => 
                getElementsByCategory(group.name).includes(el)
              ))
              .map((element) => (
                <div
                  key={element.id}
                  className={`
                    flex items-center p-2 cursor-pointer transition-all rounded
                    ${selectedElement === element.id ? 'bg-primary/10 border-l-2 border-primary' : ''}
                    ${hoveredElement === element.id ? 'bg-gray-50 dark:bg-gray-800' : ''}
                    ${dragOverElement === element.id ? 'bg-blue-50 dark:bg-blue-900' : ''}
                  `}
                  style={{ opacity: getElementOpacity(element) }}
                  draggable={!element.isLocked}
                  onDragStart={(e) => handleDragStart(e, element.id)}
                  onDragOver={(e) => handleDragOver(e, element.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, element.id)}
                  onClick={() => setSelectedElement(element.id)}
                  onMouseEnter={() => setHoveredElement(element.id)}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  {/* Drag Handle */}
                  <GripVertical className="h-4 w-4 mr-2 text-gray-400" />
                  
                  {/* Element Icon */}
                  <div className="mr-2">
                    {getElementIcon(element.type)}
                  </div>
                  
                  {/* Element Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {element.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {element.type} • Layer {element.layerIndex || 0}
                    </div>
                  </div>
                  
                  {/* Element Controls */}
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateElement(element.id);
                      }}
                      className="p-1 h-auto"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleElementVisibility(element.id);
                      }}
                      className="p-1 h-auto"
                    >
                      {element.isVisible !== false ? 
                        <Eye className="h-3 w-3" /> : 
                        <EyeOff className="h-3 w-3" />
                      }
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleElementLock(element.id);
                      }}
                      className="p-1 h-auto"
                    >
                      {element.isLocked ? 
                        <Lock className="h-3 w-3" /> : 
                        <Unlock className="h-3 w-3" />
                      }
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteElement(element.id);
                      }}
                      className="p-1 h-auto text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
          {/* Create New Group */}
          {showNewGroupInput ? (
            <div className="flex gap-2">
              <Input
                placeholder="Group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    createNewGroup();
                  }
                }}
                className="text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={createNewGroup}
                disabled={!newGroupName.trim()}
              >
                Create
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewGroupInput(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Group
            </Button>
          )}

          {/* Selected Element Actions */}
          {selectedElement && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => duplicateElement(selectedElement)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  deleteElement(selectedElement);
                  setSelectedElement(null);
                }}
                className="text-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}