/**
 * Accessibility hooks for improving a11y
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useFocusTrap - Trap focus within an element
 */
export function useFocusTrap(isActive = true) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    // Focus first element when trap is activated
    firstElement?.focus();
    
    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);
  
  return containerRef;
}

/**
 * useArrowNavigation - Enable arrow key navigation for lists
 */
export function useArrowNavigation(itemsCount, options = {}) {
  const { 
    loop = true, 
    orientation = 'vertical',
    onSelect,
  } = options;
  
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleKeyDown = useCallback((e) => {
    const isVertical = orientation === 'vertical';
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
    
    let newIndex = activeIndex;
    
    switch (e.key) {
      case nextKey:
        e.preventDefault();
        newIndex = activeIndex + 1;
        if (newIndex >= itemsCount) {
          newIndex = loop ? 0 : itemsCount - 1;
        }
        break;
      case prevKey:
        e.preventDefault();
        newIndex = activeIndex - 1;
        if (newIndex < 0) {
          newIndex = loop ? itemsCount - 1 : 0;
        }
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = itemsCount - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect?.(activeIndex);
        return;
      default:
        return;
    }
    
    setActiveIndex(newIndex);
  }, [activeIndex, itemsCount, loop, orientation, onSelect]);
  
  const getItemProps = useCallback((index) => ({
    tabIndex: index === activeIndex ? 0 : -1,
    'aria-selected': index === activeIndex,
    'data-active': index === activeIndex,
  }), [activeIndex]);
  
  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    getItemProps,
  };
}

/**
 * useAnnounce - Announce messages to screen readers
 */
export function useAnnounce() {
  const regionRef = useRef(null);
  
  useEffect(() => {
    // Create aria-live region if it doesn't exist
    let region = document.getElementById('aria-live-region');
    
    if (!region) {
      region = document.createElement('div');
      region.id = 'aria-live-region';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      region.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      `;
      document.body.appendChild(region);
    }
    
    regionRef.current = region;
    
    return () => {
      // Don't remove on cleanup as other components might use it
    };
  }, []);
  
  const announce = useCallback((message, priority = 'polite') => {
    if (!regionRef.current) return;
    
    regionRef.current.setAttribute('aria-live', priority);
    regionRef.current.textContent = '';
    
    // Use setTimeout to ensure screen readers pick up the change
    setTimeout(() => {
      if (regionRef.current) {
        regionRef.current.textContent = message;
      }
    }, 100);
  }, []);
  
  return announce;
}

/**
 * useReducedMotion - Check if user prefers reduced motion
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (event) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReducedMotion;
}

/**
 * useHighContrast - Check if user prefers high contrast
 */
export function useHighContrast() {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: more)');
    setPrefersHighContrast(mediaQuery.matches);
    
    const handler = (event) => setPrefersHighContrast(event.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersHighContrast;
}

/**
 * useSkipLink - Create skip to main content functionality
 */
export function useSkipLink(targetId = 'main-content') {
  const skipToMain = useCallback(() => {
    const mainContent = document.getElementById(targetId);
    if (mainContent) {
      mainContent.tabIndex = -1;
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }, [targetId]);
  
  return skipToMain;
}

/**
 * useFocusVisible - Track if focus should be visible
 */
export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        setIsFocusVisible(true);
      }
    };
    
    const handleMouseDown = () => {
      setIsFocusVisible(false);
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
  
  return isFocusVisible;
}

/**
 * useFocusReturn - Return focus to element when component unmounts
 */
export function useFocusReturn() {
  const previousFocusRef = useRef(null);
  
  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    
    return () => {
      previousFocusRef.current?.focus?.();
    };
  }, []);
  
  const returnFocus = useCallback(() => {
    previousFocusRef.current?.focus?.();
  }, []);
  
  return returnFocus;
}

/**
 * useId - Generate unique IDs for accessibility
 */
let idCounter = 0;
export function useId(prefix = 'id') {
  const idRef = useRef(null);
  
  if (idRef.current === null) {
    idCounter += 1;
    idRef.current = `${prefix}-${idCounter}`;
  }
  
  return idRef.current;
}

/**
 * Generate ARIA attributes for common patterns
 */
export const ariaPatterns = {
  button: (props = {}) => ({
    role: 'button',
    tabIndex: props.disabled ? -1 : 0,
    'aria-disabled': props.disabled || undefined,
    'aria-pressed': props.pressed,
    'aria-expanded': props.expanded,
    'aria-label': props.label,
  }),
  
  dialog: (props = {}) => ({
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': props.titleId,
    'aria-describedby': props.descriptionId,
  }),
  
  menu: (props = {}) => ({
    role: 'menu',
    'aria-label': props.label,
    'aria-orientation': props.orientation || 'vertical',
  }),
  
  menuItem: (props = {}) => ({
    role: 'menuitem',
    tabIndex: props.active ? 0 : -1,
    'aria-disabled': props.disabled || undefined,
  }),
  
  tab: (props = {}) => ({
    role: 'tab',
    'aria-selected': props.selected,
    'aria-controls': props.panelId,
    tabIndex: props.selected ? 0 : -1,
  }),
  
  tabPanel: (props = {}) => ({
    role: 'tabpanel',
    'aria-labelledby': props.tabId,
    tabIndex: 0,
    hidden: !props.visible,
  }),
  
  alert: (props = {}) => ({
    role: 'alert',
    'aria-live': props.priority || 'assertive',
    'aria-atomic': true,
  }),
};

export default {
  useFocusTrap,
  useArrowNavigation,
  useAnnounce,
  useReducedMotion,
  useHighContrast,
  useSkipLink,
  useFocusVisible,
  useFocusReturn,
  useId,
  ariaPatterns,
};
