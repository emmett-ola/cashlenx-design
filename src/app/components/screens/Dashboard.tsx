import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { SummaryCard } from '../molecules/SummaryCard';
import { TransactionTile } from '../molecules/TransactionTile';
import { typography, avatarPresets, layout } from '../../constants/sharedStyles';
import { dataService } from '../../services/dataService';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  userName: string;
  userAvatar?: string | null;
  onAddTransaction: () => void;
  onProfileClick: () => void;
  onSeeAllTransactions?: () => void;
  onNavigateToMoreStats?: () => void;
  isDemo?: boolean;
  refreshKey?: number; // Add refresh key to trigger re-renders
}

export function Dashboard({ userName, userAvatar, onAddTransaction, onProfileClick, onSeeAllTransactions, onNavigateToMoreStats, isDemo = false, refreshKey }: DashboardProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Use state to store transactions and summary, refresh when refreshKey changes
  const [summary, setSummary] = useState(() => dataService.getSummary());
  const [allTransactions, setAllTransactions] = useState(() => dataService.getTransactions());

  // Refresh data when refreshKey changes
  useEffect(() => {
    setSummary(dataService.getSummary());
    setAllTransactions(dataService.getTransactions());
  }, [refreshKey]);
  
  // Get only the 5 most recent transactions, sorted by date DESC, then ID DESC
  const recentTransactions = allTransactions
    .sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      // If dates are equal, sort by ID descending
      return b.id.localeCompare(a.id);
    })
    .slice(0, 5);

  // Stats data
  const categoryData = [
    { name: 'Food', value: 450, color: '#FF8A65', id: 'cat-food' },
    { name: 'Shopping', value: 320, color: '#4DB6AC', id: 'cat-shopping' },
    { name: 'Transport', value: 180, color: '#FFB74D', id: 'cat-transport' },
    { name: 'Home', value: 280, color: '#9575CD', id: 'cat-home' },
    { name: 'Others', value: 120, color: '#90A4AE', id: 'cat-others' },
  ];

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
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 
                onClick={onProfileClick}
                className={`${layout.headerTitle} transition-colors cursor-pointer`}
              >
                {userName}
              </h1>
              <p className="text-gray-500 text-sm mt-1">{getGreeting()}</p>
            </div>
            {userAvatar ? (
              <button 
                onClick={onProfileClick}
                className={avatarPresets.medium.container}
              >
                <img src={userAvatar} alt="User Avatar" className={avatarPresets.medium.image} />
              </button>
            ) : (
              <button 
                onClick={onProfileClick}
                className={avatarPresets.medium.fallback}
                style={{ background: 'linear-gradient(135deg, var(--theme-color) 0%, #4DB6AC 100%)' }}
              >
                {userName.charAt(0)}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={layout.pageContent}>
        {/* Summary Card */}
        <SummaryCard 
          totalBalance={summary.balance} 
          income={summary.totalIncome} 
          expense={summary.totalExpense} 
        />

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2>Recent Activity</h2>
            <button 
              onClick={onSeeAllTransactions}
              className="font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all" 
              style={{ color: 'var(--theme-color)' }}
            >
              See All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {recentTransactions.map((transaction) => (
              <TransactionTile
                key={transaction.id}
                type={transaction.type}
                amount={transaction.amount}
                category={transaction.category}
                categoryIcon={transaction.categoryIcon}
                categoryBgColor={transaction.categoryColor}
                description={transaction.description}
                date={transaction.date}
              />
            ))}
          </div>
        </div>

        {/* Spending by Category */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
          <h3 className="mb-4">Spending by Category</h3>
          
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  isAnimationActive={false}
                >
                  {categoryData.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-gray-700">{cat.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">${cat.value}</span>
              </div>
            ))}
          </div>
          
          {/* More Statistics Link */}
          <button 
            onClick={onNavigateToMoreStats}
            className="w-full mt-6 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:shadow-md transition-all" 
            style={{ 
              backgroundColor: 'rgba(var(--theme-color-rgb, 0, 128, 128), 0.1)',
              color: 'var(--theme-color)'
            }}
          >
            More Statistics Charts
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekly Comparison - REMOVED */}
        {/* Top Spending Sources - REMOVED */}
      </div>
    </div>
  );
}