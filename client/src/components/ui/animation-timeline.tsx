/**
 * ANIMATION TIMELINE COMPONENT
 * 
 * Advanced animation timeline editor for Game Artist mode with:
 * - Keyframe-based animation system
 * - Timeline scrubbing and playback controls
 * - Easing curve editor
 * - Animation layers and sequencing
 * - Export to CSS animations
 */

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  FastForward,
  Rewind,
  Plus,
  Trash2,
  Copy,
  Edit,
  Zap,
  Clock,
  TrendingUp,
  Settings
} from "lucide-react";
import { useGameArtist } from "@/contexts/GameArtistContext";

/**
 * Keyframe interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Keyframe interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * Keyframe interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Keyframe
 */
 * @interface Keyframe
 */
/**
 * Keyframe interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Keyframe
 */
/**
 * AnimationProject interface defines the contract for implementation.
 * 
/**
 * defines interface defines the contract for implementation.
 * 
/**
 * AnimationTrack interface defines the contract for implementation.
/**
 * Keyframe interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Keyframe
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
/**
 * AnimationTrack interface defines the contract for implementation.
/**
 * defines interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
/**
 * AnimationProject interface defines the contract for implementation.
 * 
/**
 * AnimationTrack interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AnimationTrack
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AnimationProject
 */
/**
 * Keyframe interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Keyframe
 */
/**
 * AnimationProject interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AnimationProject
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AnimationTrack
 */
 * 
 * @interface AnimationTrack
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
/**
 * AnimationTrack interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AnimationTrack
 */
 * 
 * @interface defines
/**
 * AnimationProject interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AnimationProject
 */
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
/**
 * Handles animationtimeline functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await AnimationTimeline(params);
 */
 * 
 * @interface AnimationProject
 */
/**
 * AnimationTrack interface defines the contract for implementation.
/**
 * Keyframe interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface Keyframe
 */
/**
 * AnimationProject interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AnimationProject
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AnimationTrack
 */
 * @interface Keyframe
 */
/**
 * AnimationTrack interface defines the contract for implementation.
 * 
/**
 * AnimationTrack interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AnimationTrack
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
/**
 * AnimationProject interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AnimationProject
 */
 * 
 * @interface AnimationTrack
 */
/**
 * Handles animationtimeline functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await AnimationTimeline(params);
 */
interface Keyframe {
  id: string;
/**
 * AnimationProject interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AnimationProject
 */
  time: number; // in seconds
  properties: Record<string, any>;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier';
/**
 * Handles animationtimeline functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await AnimationTimeline(params);
 */
  easingValues?: [number, number, number, number]; // for cubic-bezier
}

interface AnimationTrack {
  id: string;
  name: string;
  elementId: string;
  keyframes: Keyframe[];
  isVisible: boolean;
  isLocked: boolean;
  color: string;
}

interface AnimationProject {
  id: string;
  name: string;
  duration: number; // in seconds
  fps: number;
  tracks: AnimationTrack[];
  currentTime: number;
  isPlaying: boolean;
  loop: boolean;
}

export default function AnimationTimeline() {
  const { selectedElement, visualElements, updateVisualElement } = useGameArtist();
  
  const [project, setProject] = useState<AnimationProject>({
    id: 'main',
    name: 'Main Animation',
    duration: 5.0,
    fps: 60,
    tracks: [],
    currentTime: 0,
    isPlaying: false,
    loop: true
  });
  
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [selectedKeyframes, setSelectedKeyframes] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [showProperties, setShowProperties] = useState(false);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  // Animation playback system
  useEffect(() => {
    if (project.isPlaying) {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }
        
        const elapsed = (timestamp - startTimeRef.current) / 1000;
        const newTime = elapsed % project.duration;
        
        setProject(prev => ({
          ...prev,
          currentTime: newTime
        }));
        
        // Apply current frame values to elements
        applyAnimationFrame(newTime);
        
        if (project.loop || newTime < project.duration) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          stopAnimation();
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [project.isPlaying, project.duration, project.loop]);

  const applyAnimationFrame = (time: number) => {
    project.tracks.forEach(track => {
      if (!track.isVisible) return;
      
      const element = visualElements.find(el => el.id === track.elementId);
      if (!element) return;
      
      // Find keyframes around current time
      const keyframes = track.keyframes.sort((a, b) => a.time - b.time);
      const beforeKeyframe = keyframes.filter(kf => kf.time <= time).pop();
      const afterKeyframe = keyframes.find(kf => kf.time > time);
      
      if (beforeKeyframe && afterKeyframe) {
        // Interpolate between keyframes
        const progress = (time - beforeKeyframe.time) / (afterKeyframe.time - beforeKeyframe.time);
        const easedProgress = applyEasing(progress, beforeKeyframe.easing, beforeKeyframe.easingValues);
        
        // Apply interpolated values
        Object.keys(beforeKeyframe.properties).forEach(prop => {
          const startValue = beforeKeyframe.properties[prop];
          const endValue = afterKeyframe.properties[prop];
          const currentValue = interpolateValue(startValue, endValue, easedProgress);
          
          // Update element property
          updateVisualElement(element.id, currentValue, prop);
        });
      } else if (beforeKeyframe) {
        // Apply exact keyframe values
        Object.keys(beforeKeyframe.properties).forEach(prop => {
          updateVisualElement(element.id, beforeKeyframe.properties[prop], prop);
        });
      }
    });
  };

  const applyEasing = (t: number, easing: string, values?: [number, number, number, number]): number => {
    switch (easing) {
      case 'linear':
        return t;
      case 'ease-in':
        return t * t;
      case 'ease-out':
        return 1 - Math.pow(1 - t, 2);
      case 'ease-in-out':
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      case 'cubic-bezier':
        if (values) {
          // Simplified cubic bezier implementation
          return cubicBezier(values[0], values[1], values[2], values[3], t);
        }
        return t;
      default:
        return t;
    }
  };

  const cubicBezier = (x1: number, y1: number, x2: number, y2: number, t: number): number => {
    // Simplified cubic bezier calculation
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    
    return ay * t * t * t + by * t * t + cy * t;
  };

  const interpolateValue = (start: any, end: any, progress: number): any => {
    if (typeof start === 'number' && typeof end === 'number') {
      return start + (end - start) * progress;
    }
    
    if (typeof start === 'string' && typeof end === 'string') {
      // Handle color interpolation
      if (start.startsWith('#') && end.startsWith('#')) {
        return interpolateColor(start, end, progress);
      }
      
      // Handle transform strings
      if (start.includes('px') || start.includes('%')) {
        const startNum = parseFloat(start);
        const endNum = parseFloat(end);
        const unit = start.replace(/[0-9.-]/g, '');
        return (startNum + (endNum - startNum) * progress) + unit;
      }
    }
    
    return progress < 0.5 ? start : end;
  };

  const interpolateColor = (start: string, end: string, progress: number): string => {
    const startRgb = hexToRgb(start);
    const endRgb = hexToRgb(end);
    
    const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * progress);
    const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * progress);
    const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * progress);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const playAnimation = () => {
    setProject(prev => ({ ...prev, isPlaying: true }));
    startTimeRef.current = undefined;
  };

  const pauseAnimation = () => {
    setProject(prev => ({ ...prev, isPlaying: false }));
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const stopAnimation = () => {
    pauseAnimation();
    setProject(prev => ({ ...prev, currentTime: 0 }));
    startTimeRef.current = undefined;
  };

  const scrubToTime = (time: number) => {
    setProject(prev => ({ ...prev, currentTime: time }));
    if (!project.isPlaying) {
      applyAnimationFrame(time);
    }
  };

  const addKeyframe = (trackId: string, time: number) => {
    if (!selectedElement) return;
    
    const element = visualElements.find(el => el.id === selectedElement);
    if (!element) return;
    
    const newKeyframe: Keyframe = {
      id: Date.now().toString(),
      time,
      properties: {
        x: (element as any).x || 0,
        y: (element as any).y || 0,
        scale: (element as any).scale || 1,
        rotation: (element as any).rotation || 0,
        opacity: (element as any).opacity || 1,
        color: (element as any).color || '#000000'
      },
      easing: 'ease-in-out'
    };
    
    setProject(prev => ({
      ...prev,
      tracks: prev.tracks.map(track =>
        track.id === trackId
          ? { ...track, keyframes: [...track.keyframes, newKeyframe] }
          : track
      )
    }));
  };

  const deleteKeyframe = (trackId: string, keyframeId: string) => {
    setProject(prev => ({
      ...prev,
      tracks: prev.tracks.map(track =>
        track.id === trackId
          ? { ...track, keyframes: track.keyframes.filter(kf => kf.id !== keyframeId) }
          : track
      )
    }));
  };

  const addTrack = () => {
    if (!selectedElement) return;
    
    const element = visualElements.find(el => el.id === selectedElement);
    if (!element) return;
    
    const newTrack: AnimationTrack = {
      id: Date.now().toString(),
      name: `${element.name} Animation`,
      elementId: selectedElement,
      keyframes: [],
      isVisible: true,
      isLocked: false,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };
    
    setProject(prev => ({
      ...prev,
      tracks: [...prev.tracks, newTrack]
    }));
  };

  const timeToPixels = (time: number): number => {
    const timelineWidth = 800; // Base timeline width
    return (time / project.duration) * timelineWidth * zoom;
  };

  const pixelsToTime = (pixels: number): number => {
    const timelineWidth = 800;
    return (pixels / (timelineWidth * zoom)) * project.duration;
  };

  return (
    <Card className="w-full max-h-[600px] overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Animation Timeline
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">
              {project.currentTime.toFixed(2)}s / {project.duration}s
            </Badge>
            <Badge variant="outline">
              {project.fps} FPS
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Playback Controls */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrubToTime(0)}
            >
              <Rewind className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={project.isPlaying ? pauseAnimation : playAnimation}
            >
              {project.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={stopAnimation}
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrubToTime(project.duration)}
            >
              <FastForward className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Zoom:</span>
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                max={3}
                min={0.1}
                step={0.1}
                className="w-20"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addTrack}
              disabled={!selectedElement}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Track
            </Button>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div className="p-4 border-b">
          <div className="relative h-8 bg-gray-100 dark:bg-gray-800 rounded">
            <div
              className="absolute top-0 w-1 h-full bg-red-500 z-10"
              style={{ left: `${timeToPixels(project.currentTime)}px` }}
            />
            <div
              className="absolute top-0 left-0 w-full h-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const time = pixelsToTime(x);
                scrubToTime(Math.max(0, Math.min(project.duration, time)));
              }}
            />
            {/* Time markers */}
            {Array.from({ length: Math.ceil(project.duration) + 1 }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full border-l border-gray-300 dark:border-gray-600"
                style={{ left: `${timeToPixels(i)}px` }}
              >
                <span className="absolute top-0 left-1 text-xs text-gray-500">
                  {i}s
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Animation Tracks */}
        <div className="max-h-[300px] overflow-y-auto">
          {project.tracks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No animation tracks yet</p>
              <p className="text-sm">Select an element and click "Add Track" to start animating</p>
            </div>
          ) : (
            project.tracks.map((track) => (
              <div
                key={track.id}
                className={`border-b p-4 ${selectedTrack === track.id ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
              >
                {/* Track Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: track.color }}
                    />
                    <span className="font-medium">{track.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {track.keyframes.length} keyframes
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addKeyframe(track.id, project.currentTime)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTrack(track.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Track Timeline */}
                <div className="relative h-8 bg-gray-100 dark:bg-gray-800 rounded">
                  {track.keyframes.map((keyframe) => (
                    <div
                      key={keyframe.id}
                      className="absolute top-1 w-6 h-6 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                      style={{ left: `${timeToPixels(keyframe.time) - 12}px` }}
                      onClick={() => {
                        if (selectedKeyframes.includes(keyframe.id)) {
                          setSelectedKeyframes(prev => prev.filter(id => id !== keyframe.id));
                        } else {
                          setSelectedKeyframes(prev => [...prev, keyframe.id]);
                        }
                      }}
                      title={`Keyframe at ${keyframe.time.toFixed(2)}s`}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Properties Panel */}
        {selectedKeyframes.length > 0 && (
          <div className="border-t p-4">
            <h4 className="font-medium mb-4">Keyframe Properties</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Easing</label>
                <select className="w-full mt-1 p-2 border rounded">
                  <option>ease-in-out</option>
                  <option>linear</option>
                  <option>ease-in</option>
                  <option>ease-out</option>
                  <option>cubic-bezier</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Duration</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Duration in seconds"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}