import React from 'react';
import { Delete } from 'lucide-react';

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
}

export function NumericKeypad({ onKeyPress }: NumericKeypadProps) {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'backspace']
  ];

  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {keys.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className="h-14 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors font-semibold text-lg flex items-center justify-center"
            >
              {key === 'backspace' ? (
                <Delete className="w-6 h-6 text-gray-600" />
              ) : (
                key
              )}
            </button>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
