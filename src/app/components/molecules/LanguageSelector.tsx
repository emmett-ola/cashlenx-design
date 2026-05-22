import React from 'react';
import { X } from 'lucide-react';
import { useSafeI18n } from '../../contexts/I18nContext';
import { SUPPORTED_LANGUAGES, Language } from '../../utils/i18n';
import { toast } from 'sonner@2.0.3';

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LanguageSelector({ isOpen, onClose }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useSafeI18n();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    toast.success(`Language updated to ${langInfo?.nativeName}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900">
            {t('select_language')}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">
          {t('language_description')}
        </p>

        {/* Language List */}
        <div className="space-y-2 mb-6">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors ${
                language === lang.code ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: 'var(--theme-color)' }}
                >
                  {lang.nativeName.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{lang.nativeName}</p>
                  <p className="text-sm text-gray-500">{lang.name}</p>
                </div>
              </div>
              {language === lang.code && (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--theme-color)' }}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  );
}
