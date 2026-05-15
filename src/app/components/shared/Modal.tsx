import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  position?: 'center' | 'bottom';
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full',
};

/**
 * Shared Modal Component
 * Provides consistent modal styling across the app with bottom sheet and center variants
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
  position = 'bottom',
  className = '',
}: ModalProps) {
  if (!isOpen) return null;

  const isBottom = position === 'bottom';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 animate-in fade-in">
      <div
        className={`bg-white w-full ${maxWidthClasses[maxWidth]} ${
          isBottom ? 'rounded-t-3xl max-h-[90vh]' : 'rounded-2xl m-4'
        } shadow-2xl animate-in ${
          isBottom ? 'slide-in-from-bottom' : 'zoom-in-95'
        } duration-300 flex flex-col ${className}`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 flex-shrink-0">
            {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
            {!title && <div />}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
