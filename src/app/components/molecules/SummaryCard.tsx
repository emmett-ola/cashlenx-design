import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryCardProps {
  totalBalance: number;
  income: number;
  expense: number;
  dayBalance?: number;
  dayIncome?: number;
  dayExpense?: number;
  monthBalance?: number;
  monthIncome?: number;
  monthExpense?: number;
  yearBalance?: number;
  yearIncome?: number;
  yearExpense?: number;
  incomeTrend?: { percent: number; period: string };
  expenseTrend?: { percent: number; period: string };
}

export function SummaryCard({ 
  totalBalance, 
  income, 
  expense,
  dayBalance = totalBalance * 0.15, // Default mock data
  dayIncome = income * 0.12,
  dayExpense = expense * 0.10,
  monthBalance = totalBalance * 0.45, // Default mock data
  monthIncome = income * 0.42,
  monthExpense = expense * 0.38,
  yearBalance = totalBalance * 0.85, // Default mock data
  yearIncome = income * 0.82,
  yearExpense = expense * 0.88,
  incomeTrend = { percent: 12, period: 'last month' },
  expenseTrend = { percent: 8, period: 'last month' }
}: SummaryCardProps) {
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year' | 'total'>('total');

  const displayBalance = viewMode === 'total' ? totalBalance : 
                         viewMode === 'year' ? yearBalance :
                         viewMode === 'month' ? monthBalance : dayBalance;
  const displayIncome = viewMode === 'total' ? income : 
                        viewMode === 'year' ? yearIncome :
                        viewMode === 'month' ? monthIncome : dayIncome;
  const displayExpense = viewMode === 'total' ? expense : 
                         viewMode === 'year' ? yearExpense :
                         viewMode === 'month' ? monthExpense : dayExpense;

  const getBalanceLabel = () => {
    switch (viewMode) {
      case 'day': return 'Today Balance';
      case 'month': return 'Month Balance';
      case 'year': return 'Year Balance';
      default: return 'Total Balance';
    }
  };

  return (
    <div className="rounded-2xl p-6 text-white shadow-lg relative" style={{ background: 'linear-gradient(135deg, var(--theme-color) 0%, #4DB6AC 100%)' }}>
      {/* Glassmorphism Switcher - Top Right */}
      <div className="absolute top-4 right-4 flex bg-white/15 backdrop-blur-md rounded-lg p-1 shadow-lg z-10">
        <button
          onClick={() => setViewMode('day')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            viewMode === 'day'
              ? 'bg-white/30 backdrop-blur-sm shadow-md text-white'
              : 'text-white/70 hover:text-white/90'
          }`}
        >
          Day
        </button>
        <button
          onClick={() => setViewMode('month')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            viewMode === 'month'
              ? 'bg-white/30 backdrop-blur-sm shadow-md text-white'
              : 'text-white/70 hover:text-white/90'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => setViewMode('year')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            viewMode === 'year'
              ? 'bg-white/30 backdrop-blur-sm shadow-md text-white'
              : 'text-white/70 hover:text-white/90'
          }`}
        >
          Year
        </button>
        <button
          onClick={() => setViewMode('total')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            viewMode === 'total'
              ? 'bg-white/30 backdrop-blur-sm shadow-md text-white'
              : 'text-white/70 hover:text-white/90'
          }`}
        >
          Total
        </button>
      </div>

      <p className="text-sm opacity-90 mb-2">{getBalanceLabel()}</p>
      <h1 className="text-display mb-6">${displayBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
      
      <div className="flex gap-4">
        <div className="flex-1 bg-gray-800/30 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-[#10B981] rounded-full flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs opacity-90">Income</span>
          </div>
          <p className="font-semibold">${displayIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <div className="flex items-center gap-1 text-xs">
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
            <span className="text-[#10B981]">{incomeTrend.percent}% {incomeTrend.period}</span>
          </div>
        </div>
        
        <div className="flex-1 bg-gray-800/30 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-[#EF4444] rounded-full flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs opacity-90">Expense</span>
          </div>
          <p className="font-semibold">${displayExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <div className="flex items-center gap-1 text-xs">
            <TrendingDown className="w-4 h-4 text-[#EF4444]" />
            <span className="text-[#EF4444]">{expenseTrend.percent}% {expenseTrend.period}</span>
          </div>
        </div>
      </div>
    </div>
  );
}