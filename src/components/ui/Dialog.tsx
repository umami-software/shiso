'use client';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type ReactElement,
  Children,
  cloneElement,
  isValidElement,
} from 'react';
import { createPortal } from 'react-dom';

interface DialogContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within DialogTrigger');
  }
  return context;
}

export interface DialogTriggerProps {
  children: ReactNode;
}

export function DialogTrigger({ children }: DialogTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const childArray = Children.toArray(children);
  const trigger = childArray.find(
    (child) => isValidElement(child) && child.type !== Modal
  );
  const modal = childArray.find(
    (child) => isValidElement(child) && child.type === Modal
  );

  return (
    <DialogContext.Provider value={{ isOpen, open, close }}>
      {isValidElement(trigger) &&
        cloneElement(trigger as ReactElement<any>, {
          onClick: (e: React.MouseEvent) => {
            open();
            (trigger as ReactElement<any>).props.onClick?.(e);
          },
        })}
      {modal}
    </DialogContext.Provider>
  );
}

export interface ModalProps {
  children: ReactNode;
  placement?: 'center' | 'left' | 'right';
  offset?: string;
}

export function Modal({ children, placement = 'center', offset }: ModalProps) {
  const { isOpen, close } = useDialogContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  if (!mounted || !isOpen) return null;

  const placementStyles = {
    center: 'items-center justify-center',
    left: 'items-stretch justify-start',
    right: 'items-stretch justify-end',
  };

  const content = (
    <div
      className={`fixed inset-0 z-50 flex ${placementStyles[placement]}`}
      style={offset ? { paddingTop: offset } : undefined}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={close}
      />
      {children}
    </div>
  );

  return createPortal(content, document.body);
}

export interface DialogProps {
  children: ReactNode | ((props: { close: () => void }) => ReactNode);
  variant?: 'default' | 'sheet';
  className?: string;
}

export function Dialog({ children, variant = 'default', className = '' }: DialogProps) {
  const { close } = useDialogContext();

  const variantStyles = {
    default: 'relative rounded-lg bg-background p-6 shadow-xl max-h-[90vh] overflow-auto',
    sheet: 'relative h-full bg-background shadow-xl overflow-auto',
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      {typeof children === 'function' ? children({ close }) : children}
    </div>
  );
}
