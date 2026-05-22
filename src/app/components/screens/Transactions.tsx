import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Filter, X, Calendar, ChevronDown, Receipt } from 'lucide-react';
import { TransactionTile } from '../molecules/TransactionTile';
import { dataService } from '../../services/dataService';
import { typography, card, layout } from '../../constants/sharedStyles';
import { useSafeI18n } from '../../contexts/I18nContext';

interface TransactionsProps {
  onBack?: () => void;
  refreshKey?: number;
}

type TransactionType = 'all' | 'income' | 'expense';

export function Transactions({ onBack, refreshKey }: TransactionsProps) {
  const { t } = useSafeI18n();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<TransactionType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Get all transactions and categories - refresh when refreshKey changes
  const [allTransactions, setAllTransactions] = useState(() => dataService.getTransactions());
  const [allCategories, setAllCategories] = useState(() => dataService.getCategories());

  // Refresh data when refreshKey changes
  useEffect(() => {
    setAllTransactions(dataService.getTransactions());
    setAllCategories(dataService.getCategories());
  }, [refreshKey]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...allTransactions];

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(tx => tx.type === selectedType);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tx => tx.category === selectedCategory);
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(tx => tx.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(tx => tx.date <= dateTo);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.description.toLowerCase().includes(query) ||
        tx.category.toLowerCase().includes(query)
      );
    }

    // Sort by date DESC, then by ID DESC
    filtered.sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      // If dates are equal, sort by ID descending
      return b.id.localeCompare(a.id);
    });

    return filtered;
  }, [allTransactions, selectedType, selectedCategory, dateFrom, dateTo, searchQuery]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: typeof filteredTransactions } = {};
    
    filteredTransactions.forEach(tx => {
      const date = new Date(tx.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let label = '';
      if (date.toDateString() === today.toDateString()) {
        label = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = 'Yesterday';
      } else {
        label = date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric',
          year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
      }

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(tx);
    });

    return groups;
  }, [filteredTransactions]);

  // Get unique categories for filter
  const categoryOptions = useMemo(() => {
    const categories = allCategories
      .filter(cat => selectedType === 'all' || cat.type === selectedType)
      .map(cat => cat.name);
    return ['all', ...new Set(categories)];
  }, [allCategories, selectedType]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedType !== 'all') count++;
    if (selectedCategory !== 'all') count++;
    if (dateFrom || dateTo) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedType, selectedCategory, dateFrom, dateTo, searchQuery]);

  const clearAllFilters = () => {
    setSelectedType('all');
    setSelectedCategory('all');
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
  };

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className={layout.page}>
      {/* Header */}
      <div className={layout.header}>
        <div className={layout.headerContent}>
          <div className={layout.headerInner}>
            <button onClick={onBack} className={layout.headerBackButton}>
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className={layout.headerTitle}>{t('transactions_title')}</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`${layout.headerAction} relative`}
            >
              <Filter className="w-5 h-5 text-gray-700" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF8A65] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className={layout.container}>
            <div className="py-4 space-y-4">
              {/* Type Filter */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  {t('transactions_filter_type')}
                </label>
                <div className="flex gap-2">
                  {(['all', 'income', 'expense'] as TransactionType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedType(type);
                        if (type !== 'all') {
                          setSelectedCategory('all');
                        }
                      }}
                      className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all ${
                        selectedType === type
                          ? 'text-white shadow-md'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                      style={selectedType === type ? { backgroundColor: 'var(--theme-color)' } : {}}
                    >
                      {type === 'all' ? t('transactions_all') : type === 'income' ? t('transactions_income') : t('transactions_expense')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  {t('transactions_filter_category')}
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-sm appearance-none cursor-pointer"
                    style={{
                      backgroundImage: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--theme-color)';
                      e.target.style.boxShadow = `0 0 0 2px var(--theme-color)33`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E5E7EB';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? t('transactions_all_categories') : cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  {t('transactions_filter_date_range')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      placeholder="From"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-sm"
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--theme-color)';
                        e.target.style.boxShadow = `0 0 0 2px var(--theme-color)33`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#E5E7EB';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      placeholder="To"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-sm"
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--theme-color)';
                        e.target.style.boxShadow = `0 0 0 2px var(--theme-color)33`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#E5E7EB';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-xl transition-colors"
                >
                  {t('transactions_clear_filters')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {hasActiveFilters && !showFilters && (
        <div className={`${layout.container} py-3`}>
          <div className="flex flex-wrap gap-2">
            {selectedType !== 'all' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                {selectedType === 'income' ? t('transactions_income') : t('transactions_expense')}
                <button
                  onClick={() => setSelectedType('all')}
                  className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {selectedCategory !== 'all' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {(dateFrom || dateTo) && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                {dateFrom && dateTo ? `${dateFrom} - ${dateTo}` : dateFrom ? `From ${dateFrom}` : `Until ${dateTo}`}
                <button
                  onClick={() => {
                    setDateFrom('');
                    setDateTo('');
                  }}
                  className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {searchQuery.trim() && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className={`${layout.container} pt-4 pb-3`}>
        <p className="text-sm text-gray-600">
          {filteredTransactions.length === 0 ? (
            t('transactions_no_transactions')
          ) : filteredTransactions.length === 1 ? (
            t('transactions_one_transaction')
          ) : (
            `${filteredTransactions.length} ${t('transactions_count')}`
          )}
          {hasActiveFilters && (
            <span className="text-gray-400"> ({t('transactions_filtered')})</span>
          )}
        </p>
      </div>

      {/* Transaction List */}
      <div className={layout.container}>
        {Object.keys(groupedTransactions).length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Receipt className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('transactions_empty_title')}
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-xs mb-6">
              {hasActiveFilters
                ? t('transactions_empty_filtered')
                : t('transactions_empty_message')}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 text-white font-medium text-sm rounded-xl transition-all hover:shadow-md"
                style={{ backgroundColor: 'var(--theme-color)' }}
              >
                {t('transactions_clear_filters')}
              </button>
            )}
          </div>
        ) : (
          // Transaction Groups
          <div className="space-y-6 pb-4">
            {Object.entries(groupedTransactions).map(([date, transactions]) => (
              <div key={date}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {date}
                </h3>
                <div className={`${card.base} divide-y divide-gray-100`}>
                  {transactions.map((transaction, index) => (
                    <div key={transaction.id} className={index === 0 ? '' : ''}>
                      <TransactionTile
                        type={transaction.type}
                        amount={transaction.amount}
                        category={transaction.category}
                        categoryIcon={transaction.categoryIcon}
                        categoryBgColor={transaction.categoryColor}
                        description={transaction.description}
                        date={transaction.date}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}