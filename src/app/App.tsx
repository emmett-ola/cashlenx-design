import React, { useState, useEffect } from 'react';
import '../styles/globals.css';
import { Splash } from './components/screens/Splash';
import { Onboarding } from './components/screens/Onboarding';
import { CurrencySetup } from './components/screens/CurrencySetup';
import { Setup } from './components/screens/Setup';
import { Dashboard } from './components/screens/Dashboard';
import { AddTransaction } from './components/screens/AddTransaction';
import { CategoryManagement } from './components/screens/CategoryManagement';
import { Budget } from './components/screens/Budget';
import { Settings } from './components/screens/Settings';
import { Login } from './components/screens/Login';
import { SignUp } from './components/screens/SignUp';
import { Profile } from './components/screens/Profile';
import { Transactions } from './components/screens/Transactions';
import { MoreStatistics } from './components/screens/MoreStatistics';
import { BottomNav } from './components/organisms/BottomNav';
import { Toaster } from 'sonner@2.0.3';
import { storage } from './utils/storage';
import { dataService } from './services/dataService';
import { DEMO_AVATAR } from './constants/avatars';
import { StorageService } from './services/localStorage';
import { I18nProvider } from './contexts/I18nContext';

// Suppress React DevTools shim warning (caused by Figma Make environment)
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('React DevTools global hook') &&
      args[0].includes('Fast Refresh')
    ) {
      return;
    }
    originalConsoleError(...args);
  };
}

type AppState = 'splash' | 'onboarding' | 'currency' | 'setup' | 'app' | 'login' | 'signup' | 'profile' | 'morestats';
type ActiveTab = 'home' | 'category' | 'budget' | 'settings' | 'transactions';

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);
  
  // Initialize login state from localStorage using storage utility
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return storage.get<boolean>('isLoggedIn', false) || false;
  });
  
  const [userName, setUserName] = useState(() => {
    return storage.get<string>('userName', 'Demo Data') || 'Demo Data';
  });
  
  const [userEmail, setUserEmail] = useState(() => {
    return storage.get<string>('userEmail', 'demo@cashlengx.app') || 'demo@cashlengx.app';
  });
  
  const [userAvatar, setUserAvatar] = useState<string | null>(() => {
    const storedAvatar = storage.get<string | null>('userAvatar', null);
    const isUserLoggedIn = storage.get<boolean>('isLoggedIn', false);
    
    // If not logged in and no avatar set, use demo avatar
    if (!isUserLoggedIn && !storedAvatar) {
      return DEMO_AVATAR;
    }
    
    return storedAvatar;
  });
  
  const [canGoBackFromLogin, setCanGoBackFromLogin] = useState(false);

  // Auto-fill credentials from signup
  const [autoFillCredentials, setAutoFillCredentials] = useState<{ email: string; password: string } | null>(null);

  // Theme color with localStorage persistence
  const [themeColor, setThemeColor] = useState(() => {
    return storage.get<string>('theme-color', '#008080') || '#008080';
  });

  // Save theme color to localStorage and update CSS variable
  useEffect(() => {
    storage.set('theme-color', themeColor);
    document.documentElement.style.setProperty('--theme-color', themeColor);
  }, [themeColor]);

  // Initialize data service when login state changes
  useEffect(() => {
    dataService.init(isLoggedIn, userEmail);
  }, [isLoggedIn, userEmail]);

  const handleSplashComplete = () => {
    const hasSeenOnboarding = storage.get<boolean>('hasSeenOnboarding', false);
    const isUserLoggedIn = storage.get<boolean>('isLoggedIn', false);
    
    if (hasSeenOnboarding) {
      // User has seen onboarding before
      if (isUserLoggedIn) {
        // User is logged in, go directly to app
        setAppState('app');
      } else {
        // User not logged in, show login page
        setAppState('login');
      }
    } else {
      // First time user, show onboarding
      setAppState('onboarding');
    }
  };

  const handleOnboardingComplete = () => {
    // Mark onboarding as seen
    storage.set('hasSeenOnboarding', true);
    setAppState('login');
  };

  const handleCurrencySetup = (selectedCurrency: string) => {
    setCurrency(selectedCurrency);
    setAppState('app');
  };

  const handleSetupComplete = (selectedCurrency: string) => {
    setCurrency(selectedCurrency);
    // Mark setup as completed for this user
    storage.set(`hasCompletedSetup_${userEmail}`, true);
    setAppState('app');
  };

  const handleAddTransaction = (transaction: any) => {
    // Use dataService to save transaction
    dataService.addTransaction(transaction);
    
    // Close the modal
    setShowAddTransaction(false);
    // Refresh dashboard
    setDashboardRefreshKey(prevKey => prevKey + 1);
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setAppState('profile');
    } else {
      setCanGoBackFromLogin(true);
      setAppState('login');
    }
  };

  const handleLogin = (email: string, password: string) => {
    // Extract name from email (simple demo logic)
    const name = email.split('@')[0].replace(/[._-]/g, ' ').split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    setUserName(name);
    setUserEmail(email);
    setIsLoggedIn(true);

    // Save to localStorage using storage utility
    storage.set('isLoggedIn', true);
    storage.set('userName', name);
    storage.set('userEmail', email);

    // Clear auto-fill credentials
    setAutoFillCredentials(null);

    setCanGoBackFromLogin(false);

    // Check if this specific user has completed setup
    const hasCompletedSetup = storage.get<boolean>(`hasCompletedSetup_${email}`, false);
    if (hasCompletedSetup) {
      setAppState('app');
    } else {
      // First-time login for this user, show setup
      setAppState('setup');
    }
  };

  const handleDemoMode = () => {
    // Initialize demo data in localStorage (ONLY happens here)
    // This resets demo data every time user enters demo mode
    StorageService.initializeDemoData();

    // Continue with demo data
    setIsLoggedIn(false);
    setUserName('Demo Data');
    setUserEmail('demo@cashlengx.app');
    setUserAvatar(DEMO_AVATAR);

    // Clear login from localStorage but keep onboarding flag
    storage.set('isLoggedIn', false);
    storage.set('userName', 'Demo Data');
    storage.set('userEmail', 'demo@cashlengx.app');
    storage.set('userAvatar', DEMO_AVATAR);

    // Clear auto-fill credentials
    setAutoFillCredentials(null);

    // Demo mode always goes directly to app, skip setup
    setAppState('app');
  };

  const handleBackToApp = () => {
    setAppState('app');
  };

  const handleSignUpComplete = (email: string, password: string) => {
    // Store credentials for auto-fill
    setAutoFillCredentials({ email, password });
    // Navigate to login page
    setAppState('login');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('Demo Data');
    setUserEmail('demo@cashlengx.app');
    setUserAvatar(DEMO_AVATAR);

    // Clear login from localStorage
    storage.set('isLoggedIn', false);
    storage.set('userName', 'Demo Data');
    storage.set('userEmail', 'demo@cashlengx.app');
    storage.set('userAvatar', DEMO_AVATAR);

    setAppState('login');
    setActiveTab('home');
  };

  const handleProfileSave = (data: any) => {
    setUserName(data.name);
    setUserEmail(data.email);
    
    // Save to localStorage using storage utility
    storage.set('userName', data.name);
    storage.set('userEmail', data.email);
    
    if (data.currency) {
      setCurrency(data.currency);
    }
  };

  const handleNavigateToTransactions = () => {
    setActiveTab('transactions');
  };

  const handleNavigateToMoreStats = () => {
    setAppState('morestats');
  };

  // Render splash screen
  if (appState === 'splash') {
    return (
      <I18nProvider>
        <Splash onComplete={handleSplashComplete} />
      </I18nProvider>
    );
  }

  // Render onboarding
  if (appState === 'onboarding') {
    return (
      <I18nProvider>
        <Onboarding onComplete={handleOnboardingComplete} />
      </I18nProvider>
    );
  }

  // Render currency setup
  if (appState === 'currency') {
    return (
      <I18nProvider>
        <CurrencySetup onComplete={handleCurrencySetup} />
      </I18nProvider>
    );
  }

  // Render setup screen (first-time login)
  if (appState === 'setup') {
    return (
      <I18nProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'white',
              color: '#1F2937',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              maxWidth: '400px',
            },
            className: 'cashlengx-toast',
          }}
        />
        <Setup onComplete={handleSetupComplete} />
      </I18nProvider>
    );
  }

  // Render login screen
  if (appState === 'login') {
    return (
      <I18nProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'white',
              color: '#1F2937',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              maxWidth: '400px',
            },
            className: 'cashlengx-toast',
          }}
        />
        <Login
          onLogin={handleLogin}
          onDemoMode={handleDemoMode}
          onSwitchToSignUp={() => {
            setAutoFillCredentials(null);
            setAppState('signup');
          }}
          onBack={canGoBackFromLogin ? handleBackToApp : undefined}
          initialUsername={autoFillCredentials?.email}
          initialPassword={autoFillCredentials?.password}
        />
      </I18nProvider>
    );
  }

  // Render sign up screen
  if (appState === 'signup') {
    return (
      <I18nProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'white',
              color: '#1F2937',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              maxWidth: '400px',
            },
            className: 'cashlengx-toast',
          }}
        />
        <SignUp
          onSignUp={handleLogin}
          onSignUpComplete={handleSignUpComplete}
          onSwitchToLogin={() => {
            setAutoFillCredentials(null);
            setAppState('login');
          }}
          onBack={canGoBackFromLogin ? handleBackToApp : undefined}
        />
      </I18nProvider>
    );
  }

  // Render profile screen
  if (appState === 'profile') {
    return (
      <I18nProvider>
        <Profile
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
          currency={currency}
          onBack={handleBackToApp}
          onLogout={handleLogout}
          onSave={handleProfileSave}
        />
      </I18nProvider>
    );
  }

  // Render more statistics screen
  if (appState === 'morestats') {
    return (
      <I18nProvider>
        <MoreStatistics onBack={handleBackToApp} />
      </I18nProvider>
    );
  }

  // Render main app
  return (
    <I18nProvider>
      <div className="min-h-screen bg-[#F9FAFB]">
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'white',
            color: '#1F2937',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
          },
          className: 'cashlengx-toast',
        }}
      />
      {/* Main Content */}
      {activeTab === 'home' && (
        <Dashboard 
          userName={userName}
          userAvatar={userAvatar}
          onAddTransaction={() => setShowAddTransaction(true)} 
          onProfileClick={handleProfileClick}
          onSeeAllTransactions={handleNavigateToTransactions}
          onNavigateToMoreStats={handleNavigateToMoreStats}
          isDemo={!isLoggedIn}
          refreshKey={dashboardRefreshKey}
        />
      )}
      {activeTab === 'transactions' && <Transactions onBack={() => setActiveTab('home')} refreshKey={dashboardRefreshKey} />}
      {activeTab === 'category' && <CategoryManagement onCategoryChange={() => setDashboardRefreshKey(prevKey => prevKey + 1)} />}
      {activeTab === 'budget' && <Budget refreshKey={dashboardRefreshKey} />}
      {activeTab === 'settings' && (
        <Settings 
          onProfileClick={handleProfileClick}
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
          themeColor={themeColor}
          onThemeColorChange={setThemeColor}
        />
      )}

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <AddTransaction
          onClose={() => setShowAddTransaction(false)}
          onSubmit={handleAddTransaction}
        />
      )}

      {/* Bottom Navigation - Hide on Transactions screen */}
      {activeTab !== 'transactions' && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            const previousTab = activeTab;
            setActiveTab(tab as ActiveTab);
            // Refresh data when navigating away from category page or navigating to home/transactions/budget
            if (previousTab === 'category' || tab === 'home' || tab === 'transactions' || tab === 'budget') {
              setDashboardRefreshKey(prevKey => prevKey + 1);
            }
          }}
          onAddClick={() => setShowAddTransaction(true)}
        />
      )}
      </div>
    </I18nProvider>
  );
}