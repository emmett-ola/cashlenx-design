import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Logo } from '../atoms/Logo';
import { layout } from '../../constants/sharedStyles';
import { UserService } from '../../services/localStorage';
import { useSafeI18n } from '../../contexts/I18nContext';

interface SetupProps {
  onComplete: (currency: string) => void;
}

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
];

export function Setup({ onComplete }: SetupProps) {
  const { t } = useSafeI18n();
  const currentUser = UserService.getCurrentUser();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(currentUser?.currency || 'USD');

  const filteredCurrencies = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleFinish = () => {
    // Update user's currency preference
    if (currentUser) {
      UserService.update(currentUser.id, { currency: selected }, currentUser.id);
    }
    onComplete(selected);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg p-3">
            <Logo size="md" variant="teal" />
          </div>
          <h1 className="text-4xl font-bold mb-2">{t('setup_welcome_title')}</h1>
          <p className="text-gray-500">{t('setup_welcome_subtitle')}</p>
        </div>

        {/* Setup Content */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('setup_currency_preference')}</h2>
          <p className="text-gray-600 text-sm mb-4">
            {t('setup_currency_description')}
          </p>

          <div className="mb-4">
            <Input
              value={search}
              onChange={setSearch}
              placeholder={t('setup_search_placeholder')}
              icon={<Search className="w-5 h-5" />}
              className="w-full"
            />
          </div>

          <div className="bg-gray-50 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
            {filteredCurrencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => setSelected(currency.code)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0"
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
                    <p className="text-sm text-gray-500">{currency.name}</p>
                  </div>
                </div>
                {selected === currency.code && (
                  <Check className="w-6 h-6" style={{ color: 'var(--theme-color)' }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Setup Finish Button */}
        <Button variant="primary" onClick={handleFinish} className="w-full">
          {t('setup_finish_button')}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          {t('setup_change_settings_note')}
        </p>
      </div>
    </div>
  );
}
