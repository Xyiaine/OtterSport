/**
 * VISUAL ELEMENT WRAPPER
 * 
 * This component wraps visual elements to make them editable in game artist mode.
 * It handles hover states, selection, and live updates.
 */

import { forwardRef, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useGameArtist } from "@/contexts/GameArtistContext";

interface VisualElementProps {
  id: string;
  type: 'image' | 'text' | 'color' | 'background' | 'icon';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  [key: string]: any;
}

export const VisualElement = forwardRef<HTMLElement, VisualElementProps>(
  ({ id, type, children, className, style, fallback, as: Component = 'div', ...props }, ref) => {
    const {
      isGameArtistMode,
      visualElements,
      hoveredElement,
      setHoveredElement,
      selectedElement,
      setSelectedElement,
    } = useGameArtist();

    const elementRef = useRef<HTMLElement>(null);
    const element = visualElements.find(el => el.id === id);
    
    // Use provided ref or fallback to internal ref
    const elementRefToUse = ref || elementRef;

    const isHovered = hoveredElement === id;
    const isSelected = selectedElement === id;
    const isEditable = isGameArtistMode && element;

    // Apply visual element's current value based on type
    const getElementStyle = (): React.CSSProperties => {
      if (!element) return style || {};
      
      const baseStyle = style || {};
      
      switch (type) {
        case 'color':
          return {
            ...baseStyle,
            backgroundColor: element.currentValue,
          };
        case 'background':
          return {
            ...baseStyle,
            background: element.currentValue,
          };
        default:
          return baseStyle;
      }
    };

    const getElementProps = () => {
      if (!element) return props;
      
      const baseProps = { ...props };
      
      switch (type) {
        case 'image':
          if (Component === 'img') {
            return {
              ...baseProps,
              src: element.currentValue,
              alt: element.name,
            };
          }
          return baseProps;
        case 'icon':
          return {
            ...baseProps,
            className: cn(className, element.currentValue),
          };
        default:
          return baseProps;
      }
    };

    const getElementContent = () => {
      if (!element) {
        // For img elements, don't return children as they can't have children
        if (Component === 'img') {
          return null;
        }
        return children;
      }
      
      switch (type) {
        case 'text':
          return element.currentValue;
        case 'image':
          if (Component !== 'img') {
            return (
              <img 
                src={element.currentValue} 
                alt={element.name}
                className="w-full h-full object-cover"
              />
            );
          }
          // For img elements, the src is set in getElementProps, no children needed
          return null;
        default:
          return children;
      }
    };

    const handleMouseEnter = () => {
      if (isEditable) {
        setHoveredElement(id);
      }
    };

    const handleMouseLeave = () => {
      if (isEditable) {
        setHoveredElement(null);
      }
    };

    const handleClick = (e: React.MouseEvent) => {
      if (isEditable) {
        e.stopPropagation();
        setSelectedElement(selectedElement === id ? null : id);
      }
    };

    const editableProps = isEditable ? {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
      style: {
        ...getElementStyle(),
        cursor: 'pointer',
        position: 'relative' as const,
        ...(isHovered && {
          outline: '2px dashed #3B82F6',
          outlineOffset: '2px',
        }),
        ...(isSelected && {
          outline: '2px solid #3B82F6',
          outlineOffset: '2px',
        }),
      },
      className: cn(
        className,
        isEditable && 'transition-all duration-200',
        isHovered && 'z-10',
        isSelected && 'z-20'
      ),
    } : {
      style: getElementStyle(),
      className,
    };

    // If element not found and no fallback, render children as-is
    if (!element && !fallback) {
      return (
        <Component 
          ref={elementRefToUse}
          {...props}
          {...editableProps}
        >
          {Component === 'img' ? null : children}
        </Component>
      );
    }

    // If element not found but fallback exists, render fallback
    if (!element && fallback) {
      if (Component === 'img') {
        // For img elements, we need to wrap the fallback in a div
        return (
          <div 
            ref={elementRefToUse}
            {...editableProps}
          >
            {fallback}
          </div>
        );
      }
      return (
        <Component 
          ref={elementRefToUse}
          {...props}
          {...editableProps}
        >
          {fallback}
        </Component>
      );
    }

    // Handle img elements separately since they can't have children
    if (Component === 'img') {
      return (
        <div className="relative">
          <Component 
            ref={elementRefToUse}
            {...getElementProps()}
            {...editableProps}
          />
          {/* Edit indicator */}
          {isEditable && (isHovered || isSelected) && (
            <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none z-30">
              {element?.name || id}
              {isSelected && ' (Selected)'}
            </div>
          )}
        </div>
      );
    }

    return (
      <Component 
        ref={elementRefToUse}
        {...getElementProps()}
        {...editableProps}
      >
        {getElementContent()}
        
        {/* Edit indicator */}
        {isEditable && (isHovered || isSelected) && (
          <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none z-30">
            {element?.name || id}
            {isSelected && ' (Selected)'}
          </div>
        )}
      </Component>
    );
  }
);

VisualElement.displayName = 'VisualElement';

// Convenience components for common use cases
export const EditableImage = ({ id, ...props }: Omit<VisualElementProps, 'type'>) => (
  <VisualElement id={id} type="image" as="div" {...props} />
);

export const EditableText = ({ id, ...props }: Omit<VisualElementProps, 'type'>) => (
  <VisualElement id={id} type="text" {...props} />
);

export const EditableBackground = ({ id, ...props }: Omit<VisualElementProps, 'type'>) => (
  <VisualElement id={id} type="background" {...props} />
);

export const EditableColor = ({ id, ...props }: Omit<VisualElementProps, 'type'>) => (
  <VisualElement id={id} type="color" {...props} />
);

export const EditableIcon = ({ id, ...props }: Omit<VisualElementProps, 'type'>) => (
  <VisualElement id={id} type="icon" as="i" {...props} />
);