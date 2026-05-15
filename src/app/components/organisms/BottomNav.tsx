import React from 'react';
import { Home, LayoutGrid, Plus, Wallet, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddClick: () => void;
}

export function BottomNav({ activeTab, onTabChange, onAddClick }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'category', label: 'Category', icon: LayoutGrid },
    { id: 'add', label: 'Add', icon: Plus },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isAdd = tab.id === 'add';

          if (isAdd) {
            return (
              <div 
                key={tab.id}
                onClick={onAddClick}
                className="flex flex-col items-center justify-center -mt-8"
              >
                <div className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:opacity-90 transition-colors" style={{ backgroundColor: 'var(--theme-color)' }}>
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-xs mt-1.5" style={{ color: 'var(--theme-color)' }}>{tab.label}</span>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center py-2 px-4 min-w-[60px]"
            >
              <Icon 
                className="w-6 h-6 mb-1 transition-colors"
                style={{ color: isActive ? 'var(--theme-color)' : '#9ca3af' }} 
              />
              <span 
                className="text-xs transition-colors"
                style={{ 
                  color: isActive ? 'var(--theme-color)' : '#9ca3af',
                  fontWeight: isActive ? 500 : 400
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}