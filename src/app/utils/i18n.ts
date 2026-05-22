/**
 * Internationalization (i18n) utility
 * Loads and manages XML-based language resources
 */

import enXml from '../i18n/en.xml?raw';
import zhCNXml from '../i18n/zh-CN.xml?raw';
import zhTWXml from '../i18n/zh-TW.xml?raw';

export type Language = 'en' | 'zh-CN' | 'zh-TW';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文' },
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文' },
];

// Translation cache
const translationCache: Map<Language, Map<string, string>> = new Map();

/**
 * Parse XML string and extract translations
 */
function parseXML(xmlString: string): Map<string, string> {
  const translations = new Map<string, string>();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  const stringElements = xmlDoc.getElementsByTagName('string');
  for (let i = 0; i < stringElements.length; i++) {
    const element = stringElements[i];
    const name = element.getAttribute('name');
    const value = element.textContent;

    if (name && value) {
      translations.set(name, value);
    }
  }

  return translations;
}

/**
 * Load translations for a specific language
 */
function loadTranslations(language: Language): Map<string, string> {
  if (translationCache.has(language)) {
    return translationCache.get(language)!;
  }

  let xmlContent: string;
  switch (language) {
    case 'zh-CN':
      xmlContent = zhCNXml;
      break;
    case 'zh-TW':
      xmlContent = zhTWXml;
      break;
    case 'en':
    default:
      xmlContent = enXml;
      break;
  }

  const translations = parseXML(xmlContent);
  translationCache.set(language, translations);
  return translations;
}

/**
 * Get translation for a key in the current language
 */
export function t(key: string, language: Language = 'en'): string {
  const translations = loadTranslations(language);
  return translations.get(key) || key;
}

/**
 * Get language info by code
 */
export function getLanguageInfo(code: Language): LanguageInfo | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

/**
 * Detect browser language and map to supported language
 */
function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  try {
    // Get browser language
    const browserLang = navigator.language || (navigator as any).userLanguage;

    // Check if browserLang is valid
    if (!browserLang || typeof browserLang !== 'string') {
      return 'en';
    }

    // Map browser language to supported languages
    if (browserLang.startsWith('zh-CN') || browserLang.startsWith('zh-Hans')) {
      return 'zh-CN';
    } else if (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-Hant') || browserLang.startsWith('zh-HK')) {
      return 'zh-TW';
    } else if (browserLang.startsWith('zh')) {
      // Default Chinese to Simplified
      return 'zh-CN';
    }

    // Default to English
    return 'en';
  } catch (error) {
    // Fallback to English if any error occurs
    return 'en';
  }
}

/**
 * Get current language from localStorage or detect from browser
 */
export function getCurrentLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  try {
    const stored = localStorage.getItem('app_language');
    if (stored && (stored === 'en' || stored === 'zh-CN' || stored === 'zh-TW')) {
      return stored as Language;
    }

    // If no stored language, detect from browser
    const detected = detectBrowserLanguage();

    // Save the detected language
    try {
      setCurrentLanguage(detected);
    } catch (e) {
      // Ignore localStorage errors
    }

    return detected;
  } catch (error) {
    // Fallback to English if any error occurs
    return 'en';
  }
}

/**
 * Set current language to localStorage
 */
export function setCurrentLanguage(language: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('app_language', language);
}
