'use client';
import { forwardRef, type ReactNode, type MouseEvent, type KeyboardEvent } from 'react';

export interface PressableProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onPress?: () => void;
  className?: string;
  disabled?: boolean;
}

export const Pressable = forwardRef<HTMLDivElement, PressableProps>(
  ({ children, onClick, onPress, className = '', disabled = false }, ref) => {
    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onClick?.(e);
      onPress?.();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPress?.();
      }
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={className}
        aria-disabled={disabled}
      >
        {children}
      </div>
    );
  }
);

Pressable.displayName = 'Pressable';
