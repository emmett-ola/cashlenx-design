/**
 * Data Service Layer - LEGACY COMPATIBILITY
 * Abstracts data storage and retrieval logic
 * Acts as a bridge between old Transaction interface and new Entity structures
 * 
 * Modes:
 * - DEMO: Uses hardcoded demo data from demoData.ts (read-only)
 * - LOCAL: Uses localStorage services with proper entity structures (logged-in users)
 * - API: Will use API calls in production (future)
 */

import {
  demoTransactions,
  demoCategories,
  demoSummary,
  DEMO_USER_ID,
  getDemoTransactionsWithCategories,
  getDemoIncomeTotal,
  getDemoExpenseTotal,
  getDemoBalance,
} from '../data/demoData';

import {
  UserService,
  CategoryService,
  CashFlowService,
  SystemConfigService,
  BudgetService,
} from './localStorage';

import type { CashFlowEntity, CategoryEntity } from '../types/entities';

// Legacy interface for backwards compatibility
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  categoryIcon: string;
  allocated: number;
  spent: number;
  currency: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  parentId?: string;
}

type DataMode = 'demo' | 'local' | 'api';

class DataService {
  private mode: DataMode = 'demo';
  private userId: string | null = null;

  /**
   * Initialize data service with mode
   */
  init(isLoggedIn: boolean, userEmail?: string) {
    if (isLoggedIn && userEmail) {
      this.mode = 'local';
      // Get current user from localStorage
      const currentUser = UserService.getCurrentUser();
      if (currentUser) {
        this.userId = currentUser.id;
      }
    } else {
      this.mode = 'demo';
      this.userId = DEMO_USER_ID;
    }
  }

  /**
   * Get current mode
   */
  getMode(): DataMode {
    return this.mode;
  }

  // ========================================
  // TRANSACTIONS
  // ========================================

  /**
   * Convert CashFlowEntity to legacy Transaction format
   */
  private cashFlowToTransaction(cashFlow: CashFlowEntity): Transaction {
    const category = this.mode === 'demo' 
      ? demoCategories.find(c => c.id === cashFlow.categoryId)
      : CategoryService.getById(cashFlow.categoryId);

    // Get theme color from CSS variable or use default
    const getThemeColor = () => {
      if (typeof window !== 'undefined') {
        return getComputedStyle(document.documentElement).getPropertyValue('--theme-color').trim() || '#008080';
      }
      return '#008080';
    };

    return {
      id: cashFlow.id,
      type: category?.type || 'expense',
      amount: cashFlow.amount,
      category: category?.name || 'Unknown',
      categoryIcon: category?.icon || '💰', // Default wallet emoji
      categoryColor: category?.color || getThemeColor(), // Use theme color as default
      description: cashFlow.description,
      date: cashFlow.belongsDate,
      createdAt: cashFlow.createTime,
    };
  }

  /**
   * Get all transactions
   */
  getTransactions(): Transaction[] {
    if (this.mode === 'demo') {
      return getDemoTransactionsWithCategories().map(tx => this.cashFlowToTransaction(tx));
    }

    if (this.mode === 'local' && this.userId) {
      const cashFlows = CashFlowService.getByUserId(this.userId);
      return cashFlows.map(cf => this.cashFlowToTransaction(cf));
    }

    // TODO: API mode - fetch from server
    return [];
  }

  /**
   * Add new transaction
   */
  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    if (this.mode === 'demo') {
      // Demo mode - can't persist, just return a mock transaction
      console.warn('Demo mode: Transaction not saved');
      const mockTransaction: Transaction = {
        ...transaction,
        id: `demo-tx-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      return mockTransaction;
    }

    if (this.mode === 'local' && this.userId) {
      // Find category by name
      const categories = CategoryService.getByUserId(this.userId);
      const category = categories.find(c => c.name === transaction.category);

      if (!category) {
        console.error('Category not found:', transaction.category);
        throw new Error('Category not found');
      }

      // Create cash flow entity
      const cashFlow = CashFlowService.create({
        belongsUserId: this.userId,
        categoryId: category.id,
        belongsDate: transaction.date,
        amount: transaction.amount,
        description: transaction.description,
        remark: '',
      });

      return this.cashFlowToTransaction(cashFlow);
    }

    // TODO: API mode - post to server
    throw new Error('Not implemented');
  }

  /**
   * Update transaction
   */
  updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
    if (this.mode === 'demo') {
      console.warn('Demo mode: Transaction not updated');
      return null;
    }

    if (this.mode === 'local' && this.userId) {
      const cashFlow = CashFlowService.getById(id);
      if (!cashFlow || cashFlow.belongsUserId !== this.userId) {
        return null;
      }

      // Handle category update
      let categoryId = cashFlow.categoryId;
      if (updates.category) {
        const categories = CategoryService.getByUserId(this.userId);
        const category = categories.find(c => c.name === updates.category);
        if (category) {
          categoryId = category.id;
        }
      }

      // Update cash flow
      const updated = CashFlowService.update(id, {
        categoryId: categoryId,
        belongsDate: updates.date || cashFlow.belongsDate,
        amount: updates.amount ?? cashFlow.amount,
        description: updates.description || cashFlow.description,
      });

      return updated ? this.cashFlowToTransaction(updated) : null;
    }

    // TODO: API mode - patch to server
    return null;
  }

  /**
   * Delete transaction
   */
  deleteTransaction(id: string): boolean {
    if (this.mode === 'demo') {
      console.warn('Demo mode: Transaction not deleted');
      return false;
    }

    if (this.mode === 'local') {
      return CashFlowService.delete(id);
    }

    // TODO: API mode - delete from server
    return false;
  }

  // ========================================
  // BUDGET
  // ========================================

  /**
   * Get all budget items
   */
  getBudget(): BudgetItem[] {
    if (this.mode === 'demo') {
      // Get budgets with spending from BudgetService
      const budgets = BudgetService.getBudgetsWithSpending(DEMO_USER_ID);
      
      // Convert BudgetEntity[] to BudgetItem[] for legacy compatibility
      return budgets.map(budget => ({
        id: budget.id,
        category: budget.categoryName,
        categoryIcon: budget.categoryIcon,
        allocated: budget.limitAmount,
        spent: budget.spentAmount || 0,
        currency: 'USD',
      }));
    }

    if (this.mode === 'local' && this.userId) {
      // Get budgets with spending from BudgetService
      const budgets = BudgetService.getBudgetsWithSpending(this.userId);
      
      // Convert BudgetEntity[] to BudgetItem[] for legacy compatibility
      return budgets.map(budget => ({
        id: budget.id,
        category: budget.categoryName,
        categoryIcon: budget.categoryIcon,
        allocated: budget.limitAmount,
        spent: budget.spentAmount || 0,
        currency: 'USD',
      }));
    }

    // TODO: API mode
    return [];
  }

  /**
   * Add or update budget item
   */
  setBudgetItem(budgetItem: Omit<BudgetItem, 'id' | 'spent'>): BudgetItem {
    if (this.mode === 'demo') {
      console.warn('Demo mode: Budget not saved');
      return {
        ...budgetItem,
        id: budgetItem.category,
        spent: 0,
      };
    }

    // TODO: In local mode, we need a separate budget allocation storage
    // For now, just return the item
    console.warn('Budget allocation not yet implemented in localStorage');
    return {
      ...budgetItem,
      id: budgetItem.category,
      spent: 0,
    };
  }

  /**
   * Delete budget item
   */
  deleteBudgetItem(id: string): boolean {
    if (this.mode === 'demo') {
      console.warn('Demo mode: Budget not deleted');
      return false;
    }

    // TODO: Implement budget deletion
    console.warn('Budget deletion not yet implemented');
    return false;
  }

  // ========================================
  // CATEGORIES
  // ========================================

  /**
   * Convert CategoryEntity to legacy Category format
   */
  private entityToCategory(entity: CategoryEntity): Category {
    return {
      id: entity.id,
      name: entity.name,
      icon: entity.icon,
      color: entity.color || '#008080',
      type: entity.type,
      parentId: entity.parentId || undefined,
    };
  }

  /**
   * Get all categories
   */
  getCategories(): Category[] {
    if (this.mode === 'demo') {
      return demoCategories.map(c => this.entityToCategory(c));
    }

    if (this.mode === 'local' && this.userId) {
      const categories = CategoryService.getByUserId(this.userId);
      return categories.map(c => this.entityToCategory(c));
    }

    // TODO: API mode
    return [];
  }

  /**
   * Add category
   */
  addCategory(category: Omit<Category, 'id'>): Category {
    if (this.mode === 'demo') {
      console.warn('Demo mode: Category not saved');
      return {
        ...category,
        id: `demo-cat-${Date.now()}`,
      };
    }

    if (this.mode === 'local' && this.userId) {
      const newCategory = CategoryService.create({
        belongsUserId: this.userId,
        parentId: category.parentId || null,
        name: category.name,
        type: category.type,
        icon: category.icon,
        color: category.color || '#008080',
        remark: '',
        isDefault: false,
      });

      return this.entityToCategory(newCategory);
    }

    // TODO: API mode
    throw new Error('Not implemented');
  }

  /**
   * Update category
   */
  updateCategory(id: string, updates: Partial<Category>): Category | null {
    if (this.mode === 'demo') {
      console.warn('Demo mode: Category not updated');
      return null;
    }

    if (this.mode === 'local' && this.userId) {
      const updated = CategoryService.update(
        id,
        {
          name: updates.name,
          icon: updates.icon,
          color: updates.color,
          type: updates.type,
          parentId: updates.parentId || null,
        },
        this.userId
      );

      return updated ? this.entityToCategory(updated) : null;
    }

    // TODO: API mode
    return null;
  }

  /**
   * Delete category
   */
  deleteCategory(id: string): boolean {
    if (this.mode === 'demo') {
      console.warn('Demo mode: Category not deleted');
      return false;
    }

    if (this.mode === 'local') {
      return CategoryService.delete(id);
    }

    // TODO: API mode
    return false;
  }

  // ========================================
  // SUMMARY & STATISTICS
  // ========================================

  /**
   * Get financial summary
   */
  getSummary() {
    if (this.mode === 'demo') {
      return {
        totalIncome: getDemoIncomeTotal(),
        totalExpense: getDemoExpenseTotal(),
        balance: getDemoBalance(),
        monthlyChange: demoSummary.monthlyChange,
      };
    }

    if (this.mode === 'local' && this.userId) {
      const totalIncome = CashFlowService.getTotalIncome(this.userId);
      const totalExpense = CashFlowService.getTotalExpense(this.userId);
      const balance = CashFlowService.getBalance(this.userId);
      
      return {
        totalIncome,
        totalExpense,
        balance,
        monthlyChange: '+0%', // TODO: Calculate actual monthly change
      };
    }

    // TODO: API mode
    return demoSummary;
  }

  // ========================================
  // USER DATA MANAGEMENT
  // ========================================

  /**
   * Clear all user data (for logout or account deletion)
   */
  clearUserData() {
    if (this.mode === 'local' && this.userId) {
      // Soft delete all user's data
      const transactions = CashFlowService.getByUserId(this.userId);
      transactions.forEach(tx => CashFlowService.delete(tx.id));
      
      const categories = CategoryService.getByUserId(this.userId);
      categories.forEach(cat => CategoryService.delete(cat.id));
      
      // Note: We don't delete the user entity itself, just mark as inactive
    }
  }

  /**
   * Export user data (for backup or migration)
   */
  exportData() {
    return {
      transactions: this.getTransactions(),
      budget: this.getBudget(),
      categories: this.getCategories(),
      summary: this.getSummary(),
      exportedAt: new Date().toISOString(),
    };
  }

  /**
   * Import user data (from backup)
   */
  importData(data: {
    transactions?: Transaction[];
    budget?: BudgetItem[];
    categories?: Category[];
  }) {
    if (this.mode === 'demo') {
      console.warn('Demo mode: Cannot import data');
      return false;
    }

    if (this.mode === 'local' && this.userId) {
      try {
        // Import categories first (transactions depend on them)
        if (data.categories) {
          data.categories.forEach(cat => {
            CategoryService.create({
              belongsUserId: this.userId!,
              parentId: cat.parentId || null,
              name: cat.name,
              type: cat.type,
              icon: cat.icon,
              color: cat.color || '#008080',
              remark: '',
              isDefault: false,
            });
          });
        }

        // Import transactions
        if (data.transactions) {
          data.transactions.forEach(tx => {
            this.addTransaction(tx);
          });
        }

        // TODO: Import budget allocations

        return true;
      } catch (error) {
        console.error('Failed to import data:', error);
        return false;
      }
    }

    // TODO: API mode
    return false;
  }
}

// Export singleton instance
export const dataService = new DataService();