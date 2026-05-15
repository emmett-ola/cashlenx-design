import React from 'react';
import { AlertTriangle, LucideIcon } from 'lucide-react';
import { Button } from '../atoms/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  icon?: LucideIcon;
}

const variantStyles = {
  danger: {
    iconBg: 'bg-[#EF4444]/10',
    iconColor: 'text-[#EF4444]',
    buttonBg: 'bg-[#EF4444] hover:bg-[#DC2626]',
  },
  warning: {
    iconBg: 'bg-[#F59E0B]/10',
    iconColor: 'text-[#F59E0B]',
    buttonBg: 'bg-[#F59E0B] hover:bg-[#D97706]',
  },
  info: {
    iconBg: 'bg-[#008080]/10',
    iconColor: 'text-[#008080]',
    buttonBg: 'bg-[#008080] hover:bg-[#006666]',
  },
};

/**
 * Shared Confirm Dialog Component
 * Provides consistent confirmation dialogs with different variants
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  icon: Icon = AlertTriangle,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        <div className={`w-14 h-14 ${styles.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-7 h-7 ${styles.iconColor}`} />
        </div>

        <h2 className="text-center mb-2 text-xl font-bold text-gray-900">{title}</h2>

        <div className="text-center text-gray-600 mb-6 text-sm">
          {description}
        </div>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 border-2 border-gray-300"
          >
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className={`flex-1 ${styles.buttonBg}`}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
