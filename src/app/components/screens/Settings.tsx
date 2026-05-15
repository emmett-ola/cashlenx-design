import React from 'react';
import { ChevronRight, Eye, Bell, Lock, HelpCircle, LogOut, Palette, X, FolderTree } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ThemeColorSelector } from '../molecules/ThemeColorSelector';
import { typography, avatarPresets, card, layout } from '../../constants/sharedStyles';
import { APP_COLOR_PALETTE } from '../../constants/colors';

interface SettingsProps {
  onProfileClick?: () => void;
  userName?: string;
  userEmail?: string;
  userAvatar?: string | null;
  themeColor?: string;
  onThemeColorChange?: (color: string) => void;
}

export function Settings({ 
  userName = 'User', 
  userEmail = 'user@email.com', 
  userAvatar, 
  onProfileClick,
  themeColor = '#008080',
  onThemeColorChange 
}: SettingsProps) {
  const [showThemeSelector, setShowThemeSelector] = React.useState(false);
  const [tempThemeColor, setTempThemeColor] = React.useState(themeColor);

  const handleComingSoon = (feature: string) => {
    toast.info(`${feature} coming soon! 🚀`);
  };

  return (
    <div className={layout.page}>
      {/* Header */}
      <div className={layout.header}>
        <div className={layout.headerContent}>
          <div className="py-6">
            <h1 className={layout.headerTitle}>Settings</h1>
            <p className="text-gray-500 text-sm mt-1">Personalize your experience</p>
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
            Preferences
          </h3>
          
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Theme Color */}
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
                Theme Color
              </span>

              <div 
                className="w-8 h-8 rounded-full shadow-sm border-2 border-gray-200"
                style={{ backgroundColor: themeColor }}
              />
            </button>
          </div>
        </div>

        {/* Privacy & Security Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">
            Privacy & Security
          </h3>
          
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button 
              onClick={() => handleComingSoon('Privacy Settings')}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <span className="flex-1 text-left font-medium text-gray-900">
                Privacy Settings
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button 
              onClick={() => handleComingSoon('Security')}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <span className="flex-1 text-left font-medium text-gray-900">
                Security
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button 
              onClick={() => handleComingSoon('Notifications')}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <span className="flex-1 text-left font-medium text-gray-900">
                Notifications
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">
            Support
          </h3>
          
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button 
              onClick={() => handleComingSoon('Help & Support')}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="flex-1 text-left font-medium text-gray-900">
                Help & Support
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-sm text-gray-400">
          CashLenX v1.0.0
        </p>
      </div>

      {/* Theme Color Picker Modal */}
      {showThemeSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">
                Choose Theme Color
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
              <p className="text-sm text-gray-500">Selected: {tempThemeColor.toUpperCase()}</p>
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
                💡 <strong>Note:</strong> This theme color will be used throughout the app for primary buttons, accents, and highlights.
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
                Cancel
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
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}