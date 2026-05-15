// Entity type definitions for CashLenX localStorage storage
// Based on backend MongoDB schema design

// ============================================================================
// Base Entity
// ============================================================================

export interface BaseEntity {
  createUserId: string; // UUID of user who created this entity
  createTime: string; // ISO 8601 date string
  updateUserId: string; // UUID of user who last updated this entity
  updateTime: string; // ISO 8601 date string
  deleteUserId?: string | null; // UUID of user who deleted this entity
  deleteTime?: string | null; // ISO 8601 date string, null if not deleted
  isDelete: boolean; // Soft delete flag
}

// ============================================================================
// User Entity
// ============================================================================

export interface UserEntity extends BaseEntity {
  id: string; // UUID
  username: string;
  passwordHash: string; // In real app, hash with bcrypt. For demo, can be plain or simple hash
  isActive: boolean;
  role: string; // 'user' | 'admin' | 'demo'
  nickname?: string;
  avatarUrl?: string;
  emailAddress?: string;
  isEmailVerified: boolean;
  gender?: string; // 'male' | 'female' | 'other' | 'prefer_not_to_say'
  currency?: string; // User's preferred currency (e.g., 'USD', 'EUR')
  phone?: string;
  location?: string;
  birthDate?: string; // ISO 8601 date string
}

// ============================================================================
// Category Entity
// ============================================================================

export interface CategoryEntity extends BaseEntity {
  id: string; // UUID
  belongsUserId: string; // UUID - User who owns this category
  parentId?: string | null; // UUID - Parent category for tree structure, null for root
  name: string;
  type: 'expense' | 'income'; // Category type
  icon: string; // Icon name or emoji
  color?: string; // Category color (hex code, e.g., '#FF8A65')
  remark?: string;
  isDefault?: boolean; // Flag to indicate if this is a default system category
}

// ============================================================================
// Cash Flow Entity (Transaction)
// ============================================================================

export interface CashFlowEntity extends BaseEntity {
  id: string; // UUID
  belongsUserId: string; // UUID - User who owns this transaction
  categoryId: string; // UUID - Reference to CategoryEntity
  belongsDate: string; // ISO 8601 date string - Date of transaction
  amount: number; // Transaction amount (always positive, type determines if expense/income)
  description: string; // Transaction description/title
  remark?: string; // Additional notes
  // Computed fields (not stored, computed from category)
  categoryName?: string;
  categoryType?: 'expense' | 'income';
}

// ============================================================================
// Budget Entity
// ============================================================================

export interface BudgetEntity extends BaseEntity {
  id: string; // UUID
  belongsUserId: string; // UUID - User who owns this budget
  categoryId: string; // UUID - Reference to CategoryEntity
  limitAmount: number; // Budget limit amount
  period: 'monthly' | 'yearly'; // Budget period
  startDate?: string; // ISO 8601 date string - When this budget starts (optional, defaults to current month/year)
  // Computed fields (not stored, computed from category and transactions)
  categoryName?: string;
  categoryIcon?: string;
  categoryColor?: string;
  spentAmount?: number; // Calculated from transactions
}

// ============================================================================
// System Config
// ============================================================================

export interface SystemConfig {
  isFirstBoot: boolean; // Flag for first time app launch
  appVersion: string; // App version for migration purposes
  lastUpdated: string; // ISO 8601 date string
  defaultUserId?: string | null; // Currently logged in user, null if logged out
  themeColor?: string; // Global theme color (CSS variable value)
  // Future flags
  hasSeenOnboarding?: boolean;
  hasCompletedTutorial?: boolean;
  preferredLanguage?: string;
}

// ============================================================================
// LocalStorage Structure
// ============================================================================

export interface LocalStorageData {
  system_config: SystemConfig;
  user_info: UserEntity[]; // Array of all users
  cash_flow: CashFlowEntity[]; // Array of all transactions (filtered by user in service layer)
  category: CategoryEntity[]; // Array of all categories (filtered by user in service layer)
  budget: BudgetEntity[]; // Array of all budgets (filtered by user in service layer)
}

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  SYSTEM_CONFIG: 'cashlenx_system_config',
  USER_INFO: 'cashlenx_user_info',
  CASH_FLOW: 'cashlenx_cash_flow',
  CATEGORY: 'cashlenx_category',
  BUDGET: 'cashlenx_budget',
} as const;