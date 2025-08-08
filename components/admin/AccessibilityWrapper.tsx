"use client";
import { ReactNode, useEffect, useRef } from 'react';

interface AccessibilityWrapperProps {
  children: ReactNode;
  className?: string;
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  tabIndex?: number;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

export default function AccessibilityWrapper({
  children,
  className = '',
  role,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  tabIndex,
  onKeyDown,
  ...props
}: AccessibilityWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        // Ensure focus is visible
        document.body.classList.add('focus-visible');
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Close modals or return focus to previous element
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      role={role}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      {...props}
    >
      {children}
    </div>
  );
}

// Hook para manejar navegación por teclado
export function useKeyboardNavigation() {
  const handleKeyNavigation = (event: React.KeyboardEvent, items: any[], currentIndex: number, onSelect: (index: number) => void) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        onSelect(nextIndex);
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        onSelect(prevIndex);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect(currentIndex);
        break;
      case 'Escape':
        event.preventDefault();
        // Close dropdown or return focus
        break;
    }
  };

  return { handleKeyNavigation };
}

// Hook para manejar focus trap en modales
export function useFocusTrap(enabled: boolean = true) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Focus first element when modal opens
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [enabled]);

  return containerRef;
} 