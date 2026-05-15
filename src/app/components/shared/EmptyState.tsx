import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  iconColor?: string;
  iconBgColor?: string;
}

/**
 * Shared Empty State Component
 * Displays a consistent empty state across the app
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  iconColor = 'text-gray-400',
  iconBgColor = 'bg-gray-100',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className={`w-20 h-20 ${iconBgColor} rounded-full flex items-center justify-center mb-4`}>
        <Icon className={`w-10 h-10 ${iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 text-center max-w-xs mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 text-white font-medium text-sm rounded-xl transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--theme-color)' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
