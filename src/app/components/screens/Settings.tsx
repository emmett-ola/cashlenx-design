import React from 'react';
import { ChevronRight, HelpCircle, Palette, X, DollarSign, Globe, Settings as SettingsIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ThemeColorSelector } from '../molecules/ThemeColorSelector';
import { typography, avatarPresets, card, layout } from '../../constants/sharedStyles';
import { APP_COLOR_PALETTE } from '../../constants/colors';
import { Logo } from '../atoms/Logo';
import { UserService } from '../../services/localStorage';
import { getCurrencySymbol, getCurrencyCode } from '../../utils/currency';
import { useI18n } from '../../contexts/I18nContext';
import { SUPPORTED_LANGUAGES, Language, getLanguageInfo } from '../../utils/i18n';
import { LanguageSelector } from '../molecules/LanguageSelector';

interface SettingsProps {
  onProfileClick?: () => void;
  userName?: string;
  userEmail?: string;
  userAvatar?: string | null;
  themeColor?: string;
  onThemeColorChange?: (color: string) => void;
}

// Supported currencies (names will be translated via i18n)
const SUPPORTED_CURRENCIES = [
  { code: 'USD', nameKey: 'currency_usd', symbol: '$' },
  { code: 'CNY', nameKey: 'currency_cny', symbol: '¥' },
  { code: 'HKD', nameKey: 'currency_hkd', symbol: '$' },
  { code: 'TWD', nameKey: 'currency_twd', symbol: '$' },
];

export function Settings({
  userName = 'User',
  userEmail = 'user@email.com',
  userAvatar,
  onProfileClick,
  themeColor = '#008080',
  onThemeColorChange
}: SettingsProps) {
  const { language, setLanguage, t } = useI18n();
  const [showThemeSelector, setShowThemeSelector] = React.useState(false);
  const [tempThemeColor, setTempThemeColor] = React.useState(themeColor);
  const [showAbout, setShowAbout] = React.useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = React.useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = React.useState(false);

  // Get current user settings
  const currentUser = UserService.getCurrentUser();
  const [currentCurrency, setCurrentCurrency] = React.useState(currentUser?.currency || 'USD');
  const currentCurrencySymbol = getCurrencySymbol();
  const currentLanguageInfo = getLanguageInfo(language);
  const currentLanguageDisplay = currentLanguageInfo?.nativeName || 'English';

  const handleComingSoon = (feature: string) => {
    toast.info(`${feature} ${t('coming_soon')}`);
  };

  const handleCheckUpdate = () => {
    toast.info(t('latest_version'));
  };

  const handleCurrencyChange = (currency: string) => {
    if (currentUser) {
      UserService.update(currentUser.id, { currency }, currentUser.id);
      setCurrentCurrency(currency);
      toast.success(`Currency updated to ${currency}`);
    }
    setShowCurrencySelector(false);
  };

  return (
    <div className={layout.page}>
      {/* Header */}
      <div className={layout.header}>
        <div className={layout.headerContent}>
          <div className="py-6">
            <h1 className={layout.headerTitle}>{t('settings')}</h1>
            <p className="text-gray-500 text-sm mt-1">{t('settings_subtitle')}</p>
          </div>
        </div>
      </div>

      <div className={layout.pageContent}>
        {/* Profile Card */}
        <button 
          onClick={onProfileClick}
          className={`w-full ${card.baseHover} ${card.paddingLarge}`}
        >
          <div className="flex items-center gap-4">
            {userAvatar ? (
              <div className={avatarPresets.medium.container}>
                <img 
                  src={userAvatar} 
                  alt="User Avatar" 
                  className={avatarPresets.medium.image}
                />
              </div>
            ) : (
              <div 
                className={avatarPresets.medium.fallback}
                style={{ background: 'linear-gradient(135deg, var(--theme-color) 0%, #4DB6AC 100%)' }}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 text-left">
              <h3 className={typography.username}>{userName}</h3>
              <p className={typography.caption}>{userEmail}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </button>

        {/* Preferences Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">
            {t('setting_section')}
          </h3>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Theme */}
            <button
              onClick={() => setShowThemeSelector(true)}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${themeColor}20` }}
              >
                <Palette
                  className="w-5 h-5"
                  style={{ color: themeColor }}
                />
              </div>

              <span className="flex-1 text-left font-medium text-gray-900">
                {t('theme')}
              </span>

              <div
                className="w-8 h-8 rounded-full shadow-sm border-2 border-gray-200"
                style={{ backgroundColor: themeColor }}
              />
            </button>

            {/* Currency */}
            <button
              onClick={() => setShowCurrencySelector(true)}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>

              <span className="flex-1 text-left font-medium text-gray-900">
                {t('currency')}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  {currentCurrency} ({currentCurrencySymbol})
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>

            {/* Language */}
            <button
              onClick={() => setShowLanguageSelector(true)}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>

              <span className="flex-1 text-left font-medium text-gray-900">
                {t('language')}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  {currentLanguageDisplay}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>

            {/* More Setting */}
            <button
              onClick={() => handleComingSoon('More Setting')}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <SettingsIcon className="w-5 h-5 text-gray-600" />
              </div>

              <span className="flex-1 text-left font-medium text-gray-900">
                {t('more_setting')}
              </span>

              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">
            {t('support_section')}
          </h3>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => setShowAbout(true)}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="flex-1 text-left font-medium text-gray-900">
                {t('about')}
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Theme Color Picker Modal */}
      {showThemeSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">
                {t('choose_theme_color')}
              </h2>
              <button
                onClick={() => setShowThemeSelector(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Preview */}
            <div className="mb-6 flex flex-col items-center gap-3">
              <div
                className="w-20 h-20 rounded-full shadow-lg border-4 border-white"
                style={{ backgroundColor: tempThemeColor }}
              />
              <p className="text-sm text-gray-500">{t('theme_selected')}: {tempThemeColor.toUpperCase()}</p>
            </div>

            {/* Color Palette */}
            <div className="mb-6">
              <div className="grid grid-cols-4 gap-3 justify-items-center">
                {APP_COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    onClick={() => setTempThemeColor(color)}
                    className={`w-12 h-12 rounded-full transition-all ${
                      tempThemeColor === color
                        ? "ring-4 ring-offset-2 scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ 
                      backgroundColor: color,
                      ...(tempThemeColor === color ? { boxShadow: `0 0 0 4px ${tempThemeColor}` } : {})
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-700">
                💡 {t('theme_note')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setTempThemeColor(themeColor);
                  setShowThemeSelector(false);
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => {
                  if (onThemeColorChange) {
                    onThemeColorChange(tempThemeColor);
                  }
                  setShowThemeSelector(false);
                }}
                className="flex-1 px-4 py-3 rounded-xl font-medium text-white transition-shadow hover:shadow-lg"
                style={{
                  backgroundColor: tempThemeColor,
                  background: `linear-gradient(135deg, ${tempThemeColor} 0%, ${tempThemeColor}dd 100%)`
                }}
              >
                {t('apply')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">
                {t('about_title')}
              </h2>
              <button
                onClick={() => setShowAbout(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Logo and App Info */}
            <div className="mb-6 flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg p-3">
                <Logo size="md" variant="teal" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('app_name')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('app_tagline')}
                </p>
              </div>
            </div>

            {/* Version Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{t('version')}</span>
                <span className="text-sm text-gray-900 font-semibold">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{t('build_date')}</span>
                <span className="text-sm text-gray-900 font-semibold">2026-05-21</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCheckUpdate}
                className="flex-1 px-4 py-3 border-2 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                style={{ borderColor: 'var(--theme-color)' }}
              >
                <RefreshCw className="w-4 h-4" />
                {t('check_update')}
              </button>
              <button
                onClick={() => setShowAbout(false)}
                className="flex-1 px-4 py-3 rounded-xl font-medium text-white transition-shadow hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--theme-color)',
                  background: 'linear-gradient(135deg, var(--theme-color) 0%, #4DB6AC 100%)'
                }}
              >
                {t('close')}
              </button>
            </div>

            {/* Copyright */}
            <p className="text-center text-xs text-gray-400 mt-4">
              {t('copyright')}
            </p>
          </div>
        </div>
      )}

      {/* Currency Selector Modal */}
      {showCurrencySelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">
                {t('select_currency')}
              </h2>
              <button
                onClick={() => setShowCurrencySelector(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">
              {t('currency_description')}
            </p>

            {/* Currency List */}
            <div className="space-y-2 mb-6">
              {SUPPORTED_CURRENCIES.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencyChange(currency.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors ${
                    currentCurrency === currency.code ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white"
                      style={{ backgroundColor: 'var(--theme-color)' }}
                    >
                      {currency.symbol}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{currency.code}</p>
                      <p className="text-sm text-gray-500">{t(currency.nameKey)}</p>
                    </div>
                  </div>
                  {currentCurrency === currency.code && (
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
              onClick={() => setShowCurrencySelector(false)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Language Selector Modal */}
      <LanguageSelector
        isOpen={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </div>
  );
}