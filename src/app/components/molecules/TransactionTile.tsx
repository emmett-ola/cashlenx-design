import React from 'react';
import { Wallet } from 'lucide-react';
import { getCurrencySymbol } from '../../utils/currency';

interface TransactionTileProps {
  // Legacy props (for backward compatibility)
  icon?: React.ReactNode;
  iconBg?: string;
  title?: string;

  // New props (from dataService)
  category?: string;
  categoryIcon?: string;
  categoryBgColor?: string; // New prop for category background color
  description?: string;

  // Common props
  date: string;
  amount: number;
  type: 'income' | 'expense';
}

export function TransactionTile({
  icon,
  iconBg,
  title,
  category,
  categoryIcon,
  categoryBgColor, // New prop
  description,
  date,
  amount,
  type
}: TransactionTileProps) {
  // Swapped colors: expense = green, income = red
  const amountColor = type === 'expense' ? 'text-[#10B981]' : 'text-[#EF4444]';
  const amountPrefix = type === 'income' ? '+' : '-';
  const currencySymbol = getCurrencySymbol();
  
  // Get theme color from CSS variable
  const getThemeColor = () => {
    if (typeof window !== 'undefined') {
      return getComputedStyle(document.documentElement).getPropertyValue('--theme-color').trim() || '#008080';
    }
    return '#008080';
  };

  // Use new props if available, fallback to legacy props, then to defaults
  // Priority: description > category > title > fallback
  const displayTitle = description || category || title || 'Transaction';
  
  // Icon priority: categoryIcon > icon > default wallet icon
  const displayIcon = categoryIcon || icon || <Wallet className="w-5 h-5 text-white" />;
  
  // Background color priority: categoryBgColor > iconBg > theme color
  const displayIconBg = categoryBgColor || iconBg || getThemeColor();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <div className="flex items-center gap-3 py-3 px-4 bg-white rounded-xl hover:shadow-md transition-shadow">
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: displayIconBg }}
      >
        {typeof displayIcon === 'string' ? (
          <span className="text-xl">{displayIcon}</span>
        ) : (
          displayIcon
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{displayTitle}</h3>
        <p className="text-sm text-gray-500">{formatDate(date)}</p>
      </div>
      
      <div className={`font-semibold ${amountColor}`}>
        {amountPrefix}{currencySymbol}{Math.abs(amount).toFixed(2)}
      </div>
    </div>
  );
}