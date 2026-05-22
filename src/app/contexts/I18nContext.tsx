import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getCurrentLanguage, setCurrentLanguage as saveLanguage, t as translate } from '../utils/i18n';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      return getCurrentLanguage();
    } catch (error) {
      console.error('Error getting current language:', error);
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    try {
      setLanguageState(lang);
      saveLanguage(lang);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  const t = (key: string) => {
    try {
      return translate(key, language);
    } catch (error) {
      console.error('Error translating key:', key, error);
      return key;
    }
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

/**
 * Safe version of useI18n that returns a fallback if context is not available
 * Use this in components that might render outside of I18nProvider during development/preview
 */
export function useSafeI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    // Return fallback implementation
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => key,
    };
  }

  return context;
}
