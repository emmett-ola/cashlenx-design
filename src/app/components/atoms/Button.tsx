import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'ghost' | 'fab';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  icon
}: ButtonProps) {
  const baseStyles = 'transition-all duration-200 font-medium outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'text-white px-6 py-3 rounded-lg shadow-md hover:opacity-90 active:opacity-80',
    ghost: 'px-4 py-2 hover:bg-opacity-10 rounded-lg',
    fab: 'text-white w-14 h-14 rounded-full shadow-lg hover:opacity-90 flex items-center justify-center'
  };

  const getStyles = () => {
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-color').trim() || '#008080';
    
    switch(variant) {
      case 'primary':
        return { backgroundColor: themeColor };
      case 'ghost':
        return { color: themeColor, backgroundColor: disabled ? 'transparent' : undefined };
      case 'fab':
        return { backgroundColor: themeColor };
      default:
        return {};
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} flex items-center justify-center gap-2`}
      style={getStyles()}
    >
      {icon}
      {children}
    </button>
  );
}