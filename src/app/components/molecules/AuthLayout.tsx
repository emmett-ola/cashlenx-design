import React, { useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '../atoms/Logo';
import { I18nContext } from '../../contexts/I18nContext';

interface AuthLayoutProps {
  children: React.ReactNode;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}

/**
 * Shared layout for authentication screens (Login, Sign Up)
 * Reusable component to maintain consistency across auth flows
 */
export function AuthLayout({ children, onBack, title = 'CashLenX', subtitle }: AuthLayoutProps) {
  // Safely get i18n context, fall back to default if not available
  const i18nContext = useContext(I18nContext);
  const displaySubtitle = subtitle || (i18nContext?.t('auth_subtitle') ?? 'Your Financial Companion');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-white flex flex-col">
      {/* Header */}
      {onBack && (
        <div className="px-4 py-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg p-3">
              <Logo size="md" variant="teal" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              {title}
            </h1>
            <p className="text-gray-500">
              {displaySubtitle}
            </p>
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
