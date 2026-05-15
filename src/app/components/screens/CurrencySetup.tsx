import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

interface CurrencySetupProps {
  onComplete: (currency: string) => void;
}

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

export function CurrencySetup({ onComplete }: CurrencySetupProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('USD');

  const filteredCurrencies = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="mb-2">Select Your Currency</h1>
        <p className="text-gray-600 mb-6">Choose your primary currency for all transactions</p>

        <div className="mb-6">
          <Input
            value={search}
            onChange={setSearch}
            placeholder="Search currency..."
            icon={<Search className="w-5 h-5" />}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          {filteredCurrencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => setSelected(currency.code)}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#008080]/10 rounded-full flex items-center justify-center text-[#008080] font-semibold">
                  {currency.symbol}
                </div>
                <div className="text-left">
                  <p className="font-medium">{currency.code}</p>
                  <p className="text-sm text-gray-500">{currency.name}</p>
                </div>
              </div>
              {selected === currency.code && (
                <Check className="w-6 h-6 text-[#008080]" />
              )}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          onClick={() => onComplete(selected)}
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
