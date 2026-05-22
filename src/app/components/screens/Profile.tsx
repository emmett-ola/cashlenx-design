import React, { useState } from 'react';
import { ArrowLeft, Camera, Mail, Phone, MapPin, Calendar, Edit2, Save, DollarSign, Search, Check, X } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { DEMO_AVATAR, USER_AVATARS } from '../../constants/avatars';
import { useSafeI18n } from '../../contexts/I18nContext';

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
];

interface ProfileProps {
  userName: string;
  userEmail: string;
  userAvatar?: string | null;
  currency: string;
  onBack: () => void;
  onLogout: () => void;
  onSave: (data: any) => void;
}

export function Profile({ userName, userEmail, userAvatar, currency, onBack, onLogout, onSave }: ProfileProps) {
  const { t } = useSafeI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [location, setLocation] = useState('San Francisco, CA');
  const [birthDate, setBirthDate] = useState('1995-03-15');
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(userAvatar);

  const handleSave = () => {
    onSave({ name, email, phone, location, birthDate, currency: selectedCurrency, avatar: selectedAvatar });
    setIsEditing(false);
  };

  const filteredCurrencies = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
      c.name.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const currentCurrency = currencies.find(c => c.code === selectedCurrency);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div 
        className="px-4 py-6 pb-20"
        style={{
          background: `linear-gradient(to bottom right, var(--theme-color), color-mix(in srgb, var(--theme-color) 70%, white))`
        }}
      >
        <div className="max-w-lg mx-auto">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-white">{t('profile_title')}</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm font-medium">{t('profile_edit_button')}</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-white/90 transition-colors"
                style={{ color: 'var(--theme-color)' }}
              >
                <Save className="w-4 h-4" />
                <span className="text-sm font-medium">{t('profile_save_button')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-12">
        {/* Avatar Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {selectedAvatar ? (
                <img 
                  src={selectedAvatar} 
                  alt="User Avatar" 
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-semibold"
                  style={{
                    background: `linear-gradient(to bottom right, var(--theme-color), color-mix(in srgb, var(--theme-color) 70%, white))`
                  }}
                >
                  {name.charAt(0)}
                </div>
              )}
              {isEditing && (
                <button 
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
                  style={{ 
                    backgroundColor: 'var(--theme-color)',
                    filter: 'brightness(1)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0.85)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <h2 className="font-semibold text-gray-900">{name}</h2>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="mb-4">{t('profile_personal_info')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile_full_name')}
              </label>
              {isEditing ? (
                <Input
                  value={name}
                  onChange={setName}
                  placeholder={t('profile_name_placeholder')}
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {name}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                {t('profile_email')}
              </label>
              {/* Email is always read-only - cannot be changed */}
              <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                {email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                {t('profile_phone')}
              </label>
              {isEditing ? (
                <Input
                  value={phone}
                  onChange={setPhone}
                  placeholder={t('profile_phone_placeholder')}
                  icon={<Phone className="w-5 h-5" />}
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {phone}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                {t('profile_location')}
              </label>
              {isEditing ? (
                <Input
                  value={location}
                  onChange={setLocation}
                  placeholder={t('profile_location_placeholder')}
                  icon={<MapPin className="w-5 h-5" />}
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {location}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                {t('profile_birth_date')}
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg border-2 border-transparent focus:bg-white outline-none transition-all"
                  style={{
                    borderColor: 'transparent'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--theme-color)'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {new Date(birthDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                {t('profile_currency')}
              </label>
              {isEditing ? (
                <button
                  onClick={() => setShowCurrencyModal(true)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg border-2 border-transparent focus:bg-white outline-none transition-all text-left flex items-center justify-between"
                  style={{
                    borderColor: 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--theme-color)';
                  }}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <span>{currentCurrency ? `${currentCurrency.name} (${currentCurrency.symbol})` : t('profile_currency_select')}</span>
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </button>
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {currentCurrency ? `${currentCurrency.name} (${currentCurrency.symbol})` : t('profile_currency_not_set')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="mb-4">{t('profile_account_stats')}</h3>

          <div className="grid grid-cols-2 gap-4">
            <div
              className="text-center p-4 rounded-xl"
              style={{ backgroundColor: 'color-mix(in srgb, var(--theme-color) 5%, white)' }}
            >
              <p className="text-2xl font-bold" style={{ color: 'var(--theme-color)' }}>147</p>
              <p className="text-sm text-gray-600 mt-1">{t('profile_transactions')}</p>
            </div>
            <div
              className="text-center p-4 rounded-xl"
              style={{ backgroundColor: 'color-mix(in srgb, var(--theme-color) 5%, white)' }}
            >
              <p className="text-2xl font-bold" style={{ color: 'var(--theme-color)' }}>8</p>
              <p className="text-sm text-gray-600 mt-1">{t('profile_active_budgets')}</p>
            </div>
            <div
              className="text-center p-4 rounded-xl"
              style={{ backgroundColor: 'color-mix(in srgb, var(--theme-color) 5%, white)' }}
            >
              <p className="text-2xl font-bold" style={{ color: 'var(--theme-color)' }}>3</p>
              <p className="text-sm text-gray-600 mt-1">{t('profile_months_active')}</p>
            </div>
            <div
              className="text-center p-4 rounded-xl"
              style={{ backgroundColor: 'color-mix(in srgb, var(--theme-color) 5%, white)' }}
            >
              <p className="text-2xl font-bold" style={{ color: 'var(--theme-color)' }}>$8.2K</p>
              <p className="text-sm text-gray-600 mt-1">{t('profile_saved')}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full text-[#EF4444] hover:bg-red-50 border-2 border-red-200"
        >
          {t('profile_logout_button')}
        </Button>
      </div>

      {/* Currency Selection Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">
                {t('profile_currency_modal_title')}
              </h2>
              <button
                onClick={() => {
                  setShowCurrencyModal(false);
                  setCurrencySearch('');
                }}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <Input
                value={currencySearch}
                onChange={setCurrencySearch}
                placeholder={t('profile_currency_search_placeholder')}
                icon={<Search className="w-5 h-5" />}
              />
            </div>

            {/* Currency List */}
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              <div className="bg-white rounded-xl overflow-hidden">
                {filteredCurrencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setSelectedCurrency(curr.code);
                      setShowCurrencyModal(false);
                      setCurrencySearch('');
                    }}
                    className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                        style={{
                          backgroundColor: 'color-mix(in srgb, var(--theme-color) 10%, white)',
                          color: 'var(--theme-color)'
                        }}
                      >
                        {curr.symbol}
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{curr.code}</p>
                        <p className="text-sm text-gray-500">{curr.name}</p>
                      </div>
                    </div>
                    {selectedCurrency === curr.code && (
                      <Check className="w-6 h-6" style={{ color: 'var(--theme-color)' }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">
                {t('profile_avatar_modal_title')}
              </h2>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Avatar Grid - 2 rows x 3 columns */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {USER_AVATARS.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedAvatar(avatar);
                    setShowAvatarModal(false);
                  }}
                  className={`relative aspect-square rounded-2xl overflow-hidden transition-all ${
                    selectedAvatar === avatar
                      ? 'ring-4 ring-offset-2 scale-105'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    ...(selectedAvatar === avatar ? { 
                      ringColor: 'var(--theme-color)',
                      boxShadow: `0 0 0 4px var(--theme-color)`
                    } : {})
                  }}
                >
                  <img 
                    src={avatar} 
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedAvatar === avatar && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                    >
                      <Check className="w-8 h-8 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Info */}
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-700">
                {t('profile_avatar_tip')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}