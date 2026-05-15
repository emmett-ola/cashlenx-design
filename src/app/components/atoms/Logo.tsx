import React from 'react';
import CashlenxLogoTeal from '../../imports/CashlenxLogoTeal';
import CashlenxLogoWhite from '../../imports/CashlenxLogoWhite';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'teal' | 'white';
}

/**
 * Centralized Logo component for CashLenX
 * @param variant - 'teal' for light backgrounds, 'white' for dark backgrounds
 * To replace the logo, update the imports and components above
 */
export function Logo({ className = '', size = 'md', variant = 'teal' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };

  const LogoComponent = variant === 'white' ? CashlenxLogoWhite : CashlenxLogoTeal;

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <LogoComponent />
    </div>
  );
}