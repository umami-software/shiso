'use client';
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { icon } from '@/lib/variants';

export interface SearchFieldProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  delay?: number;
  autoFocus?: boolean;
  className?: string;
}

export function SearchField({
  placeholder = 'Search...',
  onSearch,
  delay = 300,
  autoFocus = false,
  className = '',
}: SearchFieldProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch?.(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, onSearch]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <span className={`${icon({ size: 'sm' })} absolute left-3 text-muted`}>
        <Search />
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
      />
    </div>
  );
}
