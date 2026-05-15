/**
 * LocalStorage utility functions
 * Provides type-safe localStorage operations with error handling
 */

const STORAGE_PREFIX = 'cashlengx-';

export const storage = {
  /**
   * Get item from localStorage
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      if (typeof window === 'undefined') return defaultValue ?? null;
      
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      if (!item) return defaultValue ?? null;
      
      // Try to parse as JSON
      try {
        return JSON.parse(item) as T;
      } catch {
        // If JSON parse fails, return the raw value (handles legacy plain string values)
        return item as unknown as T;
      }
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue ?? null;
    }
  },

  /**
   * Set item in localStorage
   */
  set<T>(key: string, value: T): void {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key: string): void {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  },

  /**
   * Clear all app data from localStorage
   */
  clear(): void {
    try {
      if (typeof window === 'undefined') return;
      
      // Only clear keys with our prefix
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  },

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      return localStorage.getItem(STORAGE_PREFIX + key) !== null;
    } catch (error) {
      return false;
    }
  }
};