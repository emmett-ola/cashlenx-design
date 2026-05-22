import React, { useEffect } from 'react';
import { Logo } from '../atoms/Logo';
import { useSafeI18n } from '../../contexts/I18nContext';

interface SplashProps {
  onComplete: () => void;
}

export function Splash({ onComplete }: SplashProps) {
  const { t } = useSafeI18n();
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--theme-color) 0%, #4DB6AC 100%)' }}>
      <div className="text-center animate-in zoom-in duration-700">
        <div className="w-28 h-28 mx-auto mb-6 flex items-center justify-center animate-pulse">
          <Logo size="lg" variant="white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">{t('app_name')}</h1>
        <p className="text-white/80 text-lg">{t('app_tagline')}</p>
      </div>
    </div>
  );
}