import React from 'react';
import { APP_COLOR_PALETTE } from '../../constants/colors';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  label?: string;
  colors?: string[];
  columns?: number;
}

/**
 * Shared Color Picker Component
 * Provides consistent color selection UI with the app's color palette
 */
export function ColorPicker({
  selectedColor,
  onColorChange,
  label = 'Color',
  colors = APP_COLOR_PALETTE,
  columns = 4,
}: ColorPickerProps) {
  // Map columns to actual Tailwind class (dynamic classes don't work)
  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }[columns] || 'grid-cols-4';

  return (
    <div className="mb-6">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className={`grid ${gridColsClass} gap-3 justify-items-center`}>
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-12 h-12 rounded-full transition-all ${
              selectedColor === color
                ? 'ring-4 ring-[#008080] ring-offset-2 scale-110'
                : 'hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );
}