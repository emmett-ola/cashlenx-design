import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { layout } from '../../constants/sharedStyles';
import { useSafeI18n } from '../../contexts/I18nContext';

interface MoreStatisticsProps {
  onBack: () => void;
}

export function MoreStatistics({ onBack }: MoreStatisticsProps) {
  const { t } = useSafeI18n();
  const weeklyData = [
    { day: 'Mon', lastWeek: 45, thisWeek: 32, id: 'week-mon' },
    { day: 'Tue', lastWeek: 52, thisWeek: 48, id: 'week-tue' },
    { day: 'Wed', lastWeek: 38, thisWeek: 55, id: 'week-wed' },
    { day: 'Thu', lastWeek: 65, thisWeek: 42, id: 'week-thu' },
    { day: 'Fri', lastWeek: 58, thisWeek: 68, id: 'week-fri' },
    { day: 'Sat', lastWeek: 72, thisWeek: 85, id: 'week-sat' },
    { day: 'Sun', lastWeek: 48, thisWeek: 52, id: 'week-sun' },
  ];

  return (
    <div className={layout.page}>
      {/* Header */}
      <div className={layout.header}>
        <div className={layout.headerContent}>
          <div className="flex items-center gap-4 py-6">
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className={layout.headerTitle}>{t('more_statistics_title')}</h1>
          </div>
        </div>
      </div>

      <div className={layout.pageContent}>
        {/* Test Data Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium">{t('more_statistics_test_data_title')}</p>
            <p className="text-xs text-blue-600 mt-1">
              {t('more_statistics_test_data_description')}
            </p>
          </div>
        </div>

        {/* Weekly Comparison */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="mb-4">{t('more_statistics_weekly_comparison')}</h3>
          
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid key="morestats-grid" strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis key="morestats-xaxis" dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis key="morestats-yaxis" tick={{ fontSize: 12 }} />
              <Tooltip key="morestats-tooltip" />
              <Bar key="morestats-bar-lastWeek" dataKey="lastWeek" fill="#E0E0E0" radius={[8, 8, 0, 0]} isAnimationActive={false} />
              <Bar key="morestats-bar-thisWeek" dataKey="thisWeek" fill="var(--theme-color, #008080)" radius={[8, 8, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>

          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full" />
              <span className="text-xs text-gray-600">{t('more_statistics_last_week')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--theme-color)' }} />
              <span className="text-xs text-gray-600">{t('more_statistics_this_week')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}