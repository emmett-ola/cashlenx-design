/**
 * Currency utility functions
 */

import { UserService } from '../services/localStorage';

/**
 * Currency symbol mapping
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'Fr',
  HKD: 'HK$',
  SGD: 'S$',
  KRW: '₩',
  BRL: 'R$',
  MXN: 'Mex$',
  ZAR: 'R',
  RUB: '₽',
  THB: '฿',
  IDR: 'Rp',
  MYR: 'RM',
  PHP: '₱',
  VND: '₫',
};

/**
 * Get currency symbol for current user
 */
export function getCurrencySymbol(): string {
  const currentUser = UserService.getCurrentUser();
  const currency = currentUser?.currency || 'USD';
  return CURRENCY_SYMBOLS[currency] || '$';
}

/**
 * Get currency code for current user
 */
export function getCurrencyCode(): string {
  const currentUser = UserService.getCurrentUser();
  return currentUser?.currency || 'USD';
}

/**
 * Format amount with currency symbol
 */
export function formatCurrency(amount: number, showSymbol: boolean = true): string {
  const formatted = Math.abs(amount).toFixed(2);
  if (showSymbol) {
    return `${getCurrencySymbol()}${formatted}`;
  }
  return formatted;
}
