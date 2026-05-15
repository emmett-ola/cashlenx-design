// LocalStorage Service for CashLenX
// Handles all localStorage operations with proper typing and user isolation

import {
  UserEntity,
  CategoryEntity,
  CashFlowEntity,
  BudgetEntity,
  SystemConfig,
  STORAGE_KEYS,
  BaseEntity,
} from '../types/entities';
import { USER_AVATARS } from '../constants/avatars';
import { demoUser, DEMO_USER_ID, demoCategories, demoTransactions, demoBudgets } from '../data/demoData';

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate a simple UUID v4
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get current ISO timestamp
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Create base entity fields
 */
export function createBaseEntity(userId: string): BaseEntity {
  const now = getCurrentTimestamp();
  return {
    createUserId: userId,
    createTime: now,
    updateUserId: userId,
    updateTime: now,
    deleteUserId: null,
    deleteTime: null,
    isDelete: false,
  };
}

/**
 * Simple password hashing (for demo purposes only)
 * In production, use bcrypt or similar on backend
 */
export function hashPassword(password: string): string {
  // For demo: simple base64 encoding with salt
  // In production: NEVER do this, use proper bcrypt hashing on backend
  const salt = 'cashlenx_salt_2024';
  return btoa(password + salt);
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// ============================================================================
// System Config Service
// ============================================================================

export class SystemConfigService {
  /**
   * Get system config
   */
  static get(): SystemConfig {
    const data = localStorage.getItem(STORAGE_KEYS.SYSTEM_CONFIG);
    if (data) {
      return JSON.parse(data);
    }
    // Return default config if not exists
    return this.getDefaultConfig();
  }

  /**
   * Set system config
   */
  static set(config: Partial<SystemConfig>): void {
    const current = this.get();
    const updated = {
      ...current,
      ...config,
      lastUpdated: getCurrentTimestamp(),
    };
    localStorage.setItem(STORAGE_KEYS.SYSTEM_CONFIG, JSON.stringify(updated));
  }

  /**
   * Get default system config
   */
  static getDefaultConfig(): SystemConfig {
    return {
      isFirstBoot: true,
      appVersion: '1.0.0',
      lastUpdated: getCurrentTimestamp(),
      defaultUserId: null,
      themeColor: '#008080', // Teal
      hasSeenOnboarding: false,
      hasCompletedTutorial: false,
      preferredLanguage: 'en',
    };
  }

  /**
   * Initialize system config (first boot)
   */
  static initialize(): void {
    const config = this.get();
    if (config.isFirstBoot) {
      this.set({ isFirstBoot: false });
    }
  }

  /**
   * Reset system config
   */
  static reset(): void {
    localStorage.removeItem(STORAGE_KEYS.SYSTEM_CONFIG);
  }
}

// ============================================================================
// User Service
// ============================================================================

export class UserService {
  /**
   * Get all users
   */
  static getAll(): UserEntity[] {
    const data = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Get user by ID
   */
  static getById(id: string): UserEntity | null {
    const users = this.getAll();
    return users.find((u) => u.id === id) || null;
  }

  /**
   * Get user by username
   */
  static getByUsername(username: string): UserEntity | null {
    const users = this.getAll();
    return users.find((u) => u.username === username) || null;
  }

  /**
   * Create new user
   */
  static create(userData: {
    username: string;
    password: string;
    nickname?: string;
    emailAddress?: string;
    role?: string;
  }): UserEntity {
    const users = this.getAll();

    // Check if username already exists
    if (users.find((u) => u.username === userData.username)) {
      throw new Error('Username already exists');
    }

    const newUser: UserEntity = {
      id: generateId(),
      username: userData.username,
      passwordHash: hashPassword(userData.password),
      isActive: true,
      role: userData.role || 'user',
      nickname: userData.nickname || userData.username,
      avatarUrl: USER_AVATARS[0], // Default avatar
      emailAddress: userData.emailAddress,
      isEmailVerified: false,
      currency: 'USD',
      ...createBaseEntity(userData.username),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(users));

    // Create default categories for new user
    CategoryService.createDefaultCategories(newUser.id);

    return newUser;
  }

  /**
   * Update user
   */
  static update(id: string, updates: Partial<UserEntity>, updateUserId: string): UserEntity | null {
    const users = this.getAll();
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return null;
    }

    users[index] = {
      ...users[index],
      ...updates,
      id: users[index].id, // Prevent ID change
      updateUserId: updateUserId,
      updateTime: getCurrentTimestamp(),
    };

    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(users));
    return users[index];
  }

  /**
   * Delete user (soft delete)
   */
  static delete(id: string, deleteUserId: string): boolean {
    const users = this.getAll();
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return false;
    }

    users[index].deleteUserId = deleteUserId;
    users[index].deleteTime = getCurrentTimestamp();
    users[index].isDelete = true;
    users[index].isActive = false;

    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(users));
    return true;
  }

  /**
   * Authenticate user
   */
  static authenticate(username: string, password: string): UserEntity | null {
    const user = this.getByUsername(username);
    if (!user || !user.isActive || user.isDelete) {
      return null;
    }

    if (verifyPassword(password, user.passwordHash)) {
      return user;
    }

    return null;
  }

  /**
   * Get current logged in user
   */
  static getCurrentUser(): UserEntity | null {
    const config = SystemConfigService.get();
    if (!config.defaultUserId) {
      return null;
    }
    return this.getById(config.defaultUserId);
  }

  /**
   * Set current logged in user
   */
  static setCurrentUser(userId: string | null): void {
    SystemConfigService.set({ defaultUserId: userId });
  }
}

// ============================================================================
// Category Service
// ============================================================================

export class CategoryService {
  /**
   * Get all categories
   */
  static getAll(): CategoryEntity[] {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Get categories by user ID
   */
  static getByUserId(userId: string): CategoryEntity[] {
    const categories = this.getAll();
    return categories.filter((c) => c.belongsUserId === userId && !c.isDelete);
  }

  /**
   * Get category by ID
   */
  static getById(id: string): CategoryEntity | null {
    const categories = this.getAll();
    return categories.find((c) => c.id === id) || null;
  }

  /**
   * Create new category
   */
  static create(categoryData: {
    belongsUserId: string;
    name: string;
    type: 'expense' | 'income';
    icon: string;
    parentId?: string | null;
    color?: string;
    remark?: string;
    isDefault?: boolean;
  }): CategoryEntity {
    const categories = this.getAll();

    const newCategory: CategoryEntity = {
      id: generateId(),
      belongsUserId: categoryData.belongsUserId,
      parentId: categoryData.parentId || null,
      name: categoryData.name,
      type: categoryData.type,
      icon: categoryData.icon,
      color: categoryData.color || '#008080',
      remark: categoryData.remark || '',
      isDefault: categoryData.isDefault || false,
      ...createBaseEntity(categoryData.belongsUserId),
    };

    categories.push(newCategory);
    localStorage.setItem(STORAGE_KEYS.CATEGORY, JSON.stringify(categories));

    return newCategory;
  }

  /**
   * Update category
   */
  static update(id: string, updates: Partial<CategoryEntity>, updateUserId: string): CategoryEntity | null {
    const categories = this.getAll();
    const index = categories.findIndex((c) => c.id === id);

    if (index === -1) {
      return null;
    }

    categories[index] = {
      ...categories[index],
      ...updates,
      id: categories[index].id, // Prevent ID change
      updateUserId: updateUserId,
      updateTime: getCurrentTimestamp(),
    };

    localStorage.setItem(STORAGE_KEYS.CATEGORY, JSON.stringify(categories));
    return categories[index];
  }

  /**
   * Delete category (soft delete)
   */
  static delete(id: string, deleteUserId: string): boolean {
    const categories = this.getAll();
    const index = categories.findIndex((c) => c.id === id);

    if (index === -1) {
      return false;
    }

    categories[index].deleteUserId = deleteUserId;
    categories[index].deleteTime = getCurrentTimestamp();
    categories[index].isDelete = true;
    localStorage.setItem(STORAGE_KEYS.CATEGORY, JSON.stringify(categories));
    return true;
  }

  /**
   * Create default categories for new user
   */
  static createDefaultCategories(userId: string): void {
    const defaultExpenseCategories = [
      { name: 'Food & Dining', icon: '🍔', children: ['Restaurants', 'Groceries', 'Coffee'] },
      { name: 'Transportation', icon: '🚗', children: ['Gas', 'Public Transit', 'Parking'] },
      { name: 'Shopping', icon: '🛍️', children: ['Clothing', 'Electronics', 'Home'] },
      { name: 'Entertainment', icon: '🎬', children: ['Movies', 'Games', 'Hobbies'] },
      { name: 'Bills & Utilities', icon: '💡', children: ['Electricity', 'Water', 'Internet'] },
      { name: 'Healthcare', icon: '🏥', children: ['Doctor', 'Pharmacy', 'Insurance'] },
    ];

    const defaultIncomeCategories = [
      { name: 'Salary', icon: '💰', children: [] },
      { name: 'Freelance', icon: '💼', children: [] },
      { name: 'Investment', icon: '📈', children: [] },
      { name: 'Gift', icon: '🎁', children: [] },
    ];

    // Create expense categories
    defaultExpenseCategories.forEach((cat) => {
      const parent = this.create({
        belongsUserId: userId,
        name: cat.name,
        type: 'expense',
        icon: cat.icon,
        isDefault: true,
      });

      // Create child categories
      cat.children.forEach((childName) => {
        this.create({
          belongsUserId: userId,
          name: childName,
          type: 'expense',
          icon: cat.icon,
          parentId: parent.id,
          isDefault: true,
        });
      });
    });

    // Create income categories
    defaultIncomeCategories.forEach((cat) => {
      this.create({
        belongsUserId: userId,
        name: cat.name,
        type: 'income',
        icon: cat.icon,
        isDefault: true,
      });
    });
  }

  /**
   * Get category tree structure for user
   */
  static getCategoryTree(userId: string): CategoryEntity[] {
    const categories = this.getByUserId(userId);
    // Return only root categories (parentId is null)
    return categories.filter((c) => !c.parentId);
  }

  /**
   * Get child categories
   */
  static getChildren(parentId: string): CategoryEntity[] {
    const categories = this.getAll();
    return categories.filter((c) => c.parentId === parentId && !c.isDelete);
  }
}

// ============================================================================
// Cash Flow Service (Transactions)
// ============================================================================

export class CashFlowService {
  /**
   * Get all cash flows
   */
  static getAll(): CashFlowEntity[] {
    const data = localStorage.getItem(STORAGE_KEYS.CASH_FLOW);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Get cash flows by user ID
   */
  static getByUserId(userId: string): CashFlowEntity[] {
    const cashFlows = this.getAll();
    return cashFlows.filter((cf) => cf.belongsUserId === userId && !cf.isDelete);
  }

  /**
   * Get cash flow by ID
   */
  static getById(id: string): CashFlowEntity | null {
    const cashFlows = this.getAll();
    return cashFlows.find((cf) => cf.id === id) || null;
  }

  /**
   * Create new cash flow
   */
  static create(cashFlowData: {
    belongsUserId: string;
    categoryId: string;
    belongsDate: string;
    amount: number;
    description: string;
    remark?: string;
  }): CashFlowEntity {
    const cashFlows = this.getAll();

    // Get category info
    const category = CategoryService.getById(cashFlowData.categoryId);

    const newCashFlow: CashFlowEntity = {
      id: generateId(),
      belongsUserId: cashFlowData.belongsUserId,
      categoryId: cashFlowData.categoryId,
      belongsDate: cashFlowData.belongsDate,
      amount: cashFlowData.amount,
      description: cashFlowData.description,
      remark: cashFlowData.remark || '',
      categoryName: category?.name,
      categoryType: category?.type,
      ...createBaseEntity(cashFlowData.belongsUserId),
    };

    cashFlows.push(newCashFlow);
    localStorage.setItem(STORAGE_KEYS.CASH_FLOW, JSON.stringify(cashFlows));

    return newCashFlow;
  }

  /**
   * Update cash flow
   */
  static update(id: string, updates: Partial<CashFlowEntity>, updateUserId: string): CashFlowEntity | null {
    const cashFlows = this.getAll();
    const index = cashFlows.findIndex((cf) => cf.id === id);

    if (index === -1) {
      return null;
    }

    cashFlows[index] = {
      ...cashFlows[index],
      ...updates,
      id: cashFlows[index].id, // Prevent ID change
      updateUserId: updateUserId,
      updateTime: getCurrentTimestamp(),
    };

    // Update computed fields if category changed
    if (updates.categoryId) {
      const category = CategoryService.getById(updates.categoryId);
      cashFlows[index].categoryName = category?.name;
      cashFlows[index].categoryType = category?.type;
    }

    localStorage.setItem(STORAGE_KEYS.CASH_FLOW, JSON.stringify(cashFlows));
    return cashFlows[index];
  }

  /**
   * Delete cash flow (soft delete)
   */
  static delete(id: string, deleteUserId: string): boolean {
    const cashFlows = this.getAll();
    const index = cashFlows.findIndex((cf) => cf.id === id);

    if (index === -1) {
      return false;
    }

    cashFlows[index].deleteUserId = deleteUserId;
    cashFlows[index].deleteTime = getCurrentTimestamp();
    cashFlows[index].isDelete = true;
    localStorage.setItem(STORAGE_KEYS.CASH_FLOW, JSON.stringify(cashFlows));
    return true;
  }

  /**
   * Get cash flows by date range
   */
  static getByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ): CashFlowEntity[] {
    const cashFlows = this.getByUserId(userId);
    return cashFlows.filter((cf) => {
      const date = new Date(cf.belongsDate);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });
  }

  /**
   * Get total income for user
   */
  static getTotalIncome(userId: string): number {
    const cashFlows = this.getByUserId(userId);
    return cashFlows
      .filter((cf) => cf.categoryType === 'income')
      .reduce((sum, cf) => sum + cf.amount, 0);
  }

  /**
   * Get total expense for user
   */
  static getTotalExpense(userId: string): number {
    const cashFlows = this.getByUserId(userId);
    return cashFlows
      .filter((cf) => cf.categoryType === 'expense')
      .reduce((sum, cf) => sum + cf.amount, 0);
  }

  /**
   * Get balance for user
   */
  static getBalance(userId: string): number {
    return this.getTotalIncome(userId) - this.getTotalExpense(userId);
  }
}

// ============================================================================
// Budget Service
// ============================================================================

export class BudgetService {
  /**
   * Get all budgets
   */
  static getAll(): BudgetEntity[] {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Get budgets by user ID
   */
  static getByUserId(userId: string): BudgetEntity[] {
    const budgets = this.getAll();
    return budgets.filter((b) => b.belongsUserId === userId && !b.isDelete);
  }

  /**
   * Get budget by ID
   */
  static getById(id: string): BudgetEntity | null {
    const budgets = this.getAll();
    return budgets.find((b) => b.id === id) || null;
  }

  /**
   * Create new budget
   */
  static create(budgetData: {
    belongsUserId: string;
    categoryId: string;
    limitAmount: number;
    period: 'monthly' | 'yearly';
    startDate?: string;
  }): BudgetEntity {
    const budgets = this.getAll();

    // Get category info
    const category = CategoryService.getById(budgetData.categoryId);

    const newBudget: BudgetEntity = {
      id: generateId(),
      belongsUserId: budgetData.belongsUserId,
      categoryId: budgetData.categoryId,
      limitAmount: budgetData.limitAmount,
      period: budgetData.period,
      startDate: budgetData.startDate,
      categoryName: category?.name,
      categoryIcon: category?.icon,
      categoryColor: category?.color,
      ...createBaseEntity(budgetData.belongsUserId),
    };

    budgets.push(newBudget);
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budgets));

    return newBudget;
  }

  /**
   * Update budget
   */
  static update(id: string, updates: Partial<BudgetEntity>, updateUserId: string): BudgetEntity | null {
    const budgets = this.getAll();
    const index = budgets.findIndex((b) => b.id === id);

    if (index === -1) {
      return null;
    }

    budgets[index] = {
      ...budgets[index],
      ...updates,
      id: budgets[index].id, // Prevent ID change
      updateUserId: updateUserId,
      updateTime: getCurrentTimestamp(),
    };

    // Update computed fields if category changed
    if (updates.categoryId) {
      const category = CategoryService.getById(updates.categoryId);
      budgets[index].categoryName = category?.name;
      budgets[index].categoryIcon = category?.icon;
      budgets[index].categoryColor = category?.color;
    }

    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budgets));
    return budgets[index];
  }

  /**
   * Delete budget (soft delete)
   */
  static delete(id: string, deleteUserId: string): boolean {
    const budgets = this.getAll();
    const index = budgets.findIndex((b) => b.id === id);

    if (index === -1) {
      return false;
    }

    budgets[index].deleteUserId = deleteUserId;
    budgets[index].deleteTime = getCurrentTimestamp();
    budgets[index].isDelete = true;
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budgets));
    return true;
  }

  /**
   * Get budgets with calculated spent amounts
   * This computes actual spending from transactions for the current period
   */
  static getBudgetsWithSpending(userId: string): BudgetEntity[] {
    const budgets = this.getByUserId(userId);
    const currentDate = new Date();

    return budgets.map((budget) => {
      // Calculate date range based on period
      let startDate: Date;
      let endDate: Date;

      if (budget.period === 'monthly') {
        // Current month
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
      } else {
        // Current year
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        endDate = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59);
      }

      // Get transactions for this category in the period
      const transactions = CashFlowService.getByDateRange(
        userId,
        startDate.toISOString(),
        endDate.toISOString()
      );

      // Get category and all its children
      const category = CategoryService.getById(budget.categoryId);
      const childCategories = CategoryService.getChildren(budget.categoryId);
      const categoryIds = [budget.categoryId, ...childCategories.map(c => c.id)];

      // Calculate spent amount for this category (including children)
      const spentAmount = transactions
        .filter((tx) => categoryIds.includes(tx.categoryId) && tx.categoryType === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);

      return {
        ...budget,
        spentAmount,
        categoryName: category?.name,
        categoryIcon: category?.icon,
        categoryColor: category?.color,
      };
    });
  }
}

// ============================================================================
// Storage Service - Main Entry Point
// ============================================================================

export class StorageService {
  /**
   * Initialize storage (first boot setup)
   */
  static initialize(): void {
    SystemConfigService.initialize();
  }

  /**
   * Initialize demo data for demo user
   * This is called ONLY when entering demo mode
   * Clears existing demo data and loads fresh data from demoData.ts
   */
  static initializeDemoData(): void {
    // 1. Ensure demo user exists in user_info
    const users = UserService.getAll();
    const existingDemoUserIndex = users.findIndex(u => u.id === DEMO_USER_ID);
    
    if (existingDemoUserIndex >= 0) {
      // Update existing demo user
      users[existingDemoUserIndex] = demoUser;
    } else {
      // Add demo user
      users.push(demoUser);
    }
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(users));

    // 2. Clear existing demo user's categories and replace with fresh demo categories
    const allCategories = CategoryService.getAll();
    const nonDemoCategories = allCategories.filter(cat => cat.belongsUserId !== DEMO_USER_ID);
    const newCategories = [...nonDemoCategories, ...demoCategories];
    localStorage.setItem(STORAGE_KEYS.CATEGORY, JSON.stringify(newCategories));

    // 3. Clear existing demo user's transactions and replace with fresh demo transactions
    const allCashFlows = CashFlowService.getAll();
    const nonDemoCashFlows = allCashFlows.filter(cf => cf.belongsUserId !== DEMO_USER_ID);
    const newCashFlows = [...nonDemoCashFlows, ...demoTransactions];
    localStorage.setItem(STORAGE_KEYS.CASH_FLOW, JSON.stringify(newCashFlows));

    // 4. Clear existing demo user's budgets and replace with fresh demo budgets
    const allBudgets = BudgetService.getAll();
    const nonDemoBudgets = allBudgets.filter(b => b.belongsUserId !== DEMO_USER_ID);
    const newBudgets = [...nonDemoBudgets, ...demoBudgets];
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(newBudgets));

    // 5. Set demo user as current user
    SystemConfigService.set({ defaultUserId: DEMO_USER_ID });

    console.log('✅ Demo data initialized:', {
      categories: demoCategories.length,
      transactions: demoTransactions.length,
      budgets: demoBudgets.length,
      userId: DEMO_USER_ID,
    });
  }

  /**
   * Clear all storage (reset app)
   */
  static clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  /**
   * Export all data (for backup)
   */
  static exportData(): string {
    const data = {
      system_config: SystemConfigService.get(),
      user_info: UserService.getAll(),
      cash_flow: CashFlowService.getAll(),
      category: CategoryService.getAll(),
      budget: BudgetService.getAll(),
      exportedAt: getCurrentTimestamp(),
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data (from backup)
   */
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.system_config) {
        localStorage.setItem(STORAGE_KEYS.SYSTEM_CONFIG, JSON.stringify(data.system_config));
      }
      if (data.user_info) {
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(data.user_info));
      }
      if (data.cash_flow) {
        localStorage.setItem(STORAGE_KEYS.CASH_FLOW, JSON.stringify(data.cash_flow));
      }
      if (data.category) {
        localStorage.setItem(STORAGE_KEYS.CATEGORY, JSON.stringify(data.category));
      }
      if (data.budget) {
        localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(data.budget));
      }

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  /**
   * Get storage size
   */
  static getStorageSize(): { used: number; available: number } {
    let used = 0;
    Object.values(STORAGE_KEYS).forEach((key) => {
      const item = localStorage.getItem(key);
      if (item) {
        used += item.length;
      }
    });

    // Most browsers provide 5-10MB for localStorage
    const available = 5 * 1024 * 1024; // 5MB

    return { used, available };
  }
}