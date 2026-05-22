import React from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'password';
  variant?: 'filled' | 'underlined';
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Input({ 
  value, 
  onChange, 
  placeholder = '', 
  type = 'text',
  variant = 'filled',
  icon,
  disabled = false,
  className = ''
}: InputProps) {
  const variants = {
    filled: 'bg-gray-100 px-4 py-3 rounded-lg border-2 border-transparent focus:bg-white',
    underlined: 'bg-transparent px-2 py-2 border-b-2 border-gray-300'
  };

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`${variants[variant]} ${className} outline-none transition-all`}
      style={{
        borderColor: 'var(--theme-color)'
      }}
      onFocus={(e) => {
        if (variant === 'filled') {
          e.target.style.borderColor = 'var(--theme-color)';
        } else {
          e.target.style.borderBottomColor = 'var(--theme-color)';
        }
      }}
      onBlur={(e) => {
        if (variant === 'filled') {
          e.target.style.borderColor = 'transparent';
        } else {
          e.target.style.borderBottomColor = '#d1d5db';
        }
      }}
    />
  );
}