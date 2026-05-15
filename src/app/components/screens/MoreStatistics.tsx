import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { layout } from '../../constants/sharedStyles';

interface MoreStatisticsProps {
  onBack: () => void;
}

export function MoreStatistics({ onBack }: MoreStatisticsProps) {
  const weeklyData = [
    { day: 'Mon', lastWeek: 45, thisWeek: 32, id: 'week-mon' },
    { day: 'Tue', lastWeek: 52, thisWeek: 48, id: 'week-tue' },
    { day: 'Wed', lastWeek: 38, thisWeek: 55, id: 'week-wed' },
    { day: 'Thu', lastWeek: 65, thisWeek: 42, id: 'week-thu' },
    { day: 'Fri', lastWeek: 58, thisWeek: 68, id: 'week-fri' },
    { day: 'Sat', lastWeek: 72, thisWeek: 85, id: 'week-sat' },
    { day: 'Sun', lastWeek: 48, thisWeek: 52, id: 'week-sun' },
  ];

  const topMerchants = [
    { name: 'Amazon', amount: 245.50, percent: 18 },
    { name: 'Walmart', amount: 187.30, percent: 14 },
    { name: 'Starbucks', amount: 156.80, percent: 12 },
    { name: 'Uber', amount: 142.20, percent: 11 },
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
            <h1 className={layout.headerTitle}>More Statistics</h1>
          </div>
        </div>
      </div>

      <div className={layout.pageContent}>
        {/* Test Data Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium">Test Data Only</p>
            <p className="text-xs text-blue-600 mt-1">
              The statistics below are sample data for demonstration purposes. Real analytics will be implemented in a future update.
            </p>
          </div>
        </div>

        {/* Weekly Comparison */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="mb-4">Weekly Comparison</h3>
          
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
              <span className="text-xs text-gray-600">Last Week</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--theme-color)' }} />
              <span className="text-xs text-gray-600">This Week</span>
            </div>
          </div>
        </div>

        {/* Top Spending Sources */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-6 mb-6">
          <h3 className="mb-4">Top Spending Sources</h3>
          
          <div className="space-y-4">
            {topMerchants.map((merchant, index) => (
              <div key={merchant.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                      style={{ 
                        backgroundColor: 'rgba(var(--theme-color-rgb, 0, 128, 128), 0.1)',
                        color: 'var(--theme-color)'
                      }}
                    >
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{merchant.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">${merchant.amount}</span>
                </div>
                <div className="ml-13">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${merchant.percent}%`,
                        backgroundColor: 'var(--theme-color)'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}