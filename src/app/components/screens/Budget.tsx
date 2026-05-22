import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { Button } from '../atoms/Button';
import { layout } from '../../constants/sharedStyles';
import { BudgetService, SystemConfigService } from '../../services/localStorage';
import { BudgetEntity } from '../../types/entities';
import { useSafeI18n } from '../../contexts/I18nContext';

interface BudgetProps {
  refreshKey?: number; // Add refresh key to trigger re-renders
}

export function Budget({ refreshKey }: BudgetProps = {}) {
  const { t } = useSafeI18n();
  const [budgets, setBudgets] = useState<BudgetEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load budgets from localStorage
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      
      const systemConfig = SystemConfigService.get();
      const userId = systemConfig.defaultUserId;
      
      if (userId) {
        const budgetsWithSpending = BudgetService.getBudgetsWithSpending(userId);
        setBudgets(budgetsWithSpending);
      } else {
        setBudgets([]);
      }
    } catch (err) {
      console.error('Error loading budgets:', err);
      setError('Failed to load budgets');
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  }, [refreshKey]); // Add refreshKey as dependency

  const getPercentage = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const getStatusColor = (spent: number, limit: number) => {
    const percent = (spent / limit) * 100;
    if (percent >= 100) return '#EF4444';
    if (percent >= 80) return '#F59E0B';
    return '#10B981';
  };

  // Calculate totals
  const totalLimit = budgets.reduce((sum, b) => sum + b.limitAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spentAmount || 0), 0);
  const totalRemaining = totalLimit - totalSpent;
  const totalPercentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  return (
    <div className={layout.page}>
      {/* Header */}
      <div className={layout.header}>
        <div className={layout.headerContent}>
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className={layout.headerTitle}>{t('budget_title')}</h1>
              <p className="text-gray-500 text-sm mt-1">{t('budget_subtitle')}</p>
            </div>
            <Button variant="fab" className="w-12 h-12">
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      <div className={layout.pageContent}>
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008080] mx-auto mb-4"></div>
              <p className="text-gray-500">{t('budget_loading')}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Overall Budget Summary */}
            <div className="rounded-2xl p-6 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, var(--theme-color) 0%, #4DB6AC 100%)' }}>
              <p className="text-sm opacity-90 mb-2">{t('budget_total_monthly')}</p>
              <h1 className="text-display mb-4">${totalLimit.toFixed(2)}</h1>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">{t('budget_spent')}: ${totalSpent.toFixed(2)}</span>
                  <span className="text-sm">{t('budget_remaining')}: ${totalRemaining.toFixed(2)}</span>
                </div>
                <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${Math.min(totalPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Category Budgets */}
            <div className="space-y-4 mb-24">
              <h2>{t('budget_category_budgets')}</h2>
              
              {budgets.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <p className="text-gray-500 mb-4">{t('budget_no_budgets')}</p>
                  <Button variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('budget_create_first')}
                  </Button>
                </div>
              ) : (
                budgets.map((budget) => {
                  const percentage = getPercentage(budget.spentAmount || 0, budget.limitAmount);
                  const isOverBudget = (budget.spentAmount || 0) > budget.limitAmount;
                  
                  return (
                    <div 
                      key={budget.id}
                      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${budget.categoryColor}20` }}
                          >
                            {budget.categoryIcon}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{budget.categoryName}</h3>
                            <p className="text-sm text-gray-500">
                              ${(budget.spentAmount || 0).toFixed(2)} of ${budget.limitAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        {isOverBudget && (
                          <div className="flex items-center gap-1 text-[#EF4444]">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">{t('budget_over_budget')}</span>
                          </div>
                        )}
                      </div>

                      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: getStatusColor(budget.spentAmount || 0, budget.limitAmount)
                          }}
                        />
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span
                          className="text-xs font-medium"
                          style={{ color: getStatusColor(budget.spentAmount || 0, budget.limitAmount) }}
                        >
                          {percentage.toFixed(0)}% {t('budget_used')}
                        </span>
                        <span className="text-xs text-gray-500">
                          ${(budget.limitAmount - (budget.spentAmount || 0)).toFixed(2)} {t('budget_left')}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Budget CTA */}
            {budgets.length > 0 && (
              <div className="mt-6 mb-6">
                <button
                  className="w-full py-4 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 hover:shadow-xl transition-shadow"
                  style={{
                    background: `linear-gradient(to right, var(--theme-color), ${adjustColorBrightness(getComputedStyle(document.documentElement).getPropertyValue('--theme-color').trim(), 30)})`
                  }}
                >
                  <Plus className="w-5 h-5" />
                  {t('budget_add_new')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Helper function to adjust color brightness
function adjustColorBrightness(color: string, percent: number) {
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return `#${(
    0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1)}`;
}