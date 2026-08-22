/**
 * Centralized Currency & Number Formatter for Vietnamese Dong (VND)
 * Marketplace standard currency: VND (₫)
 */

/**
 * Formats a numeric value into Vietnamese Dong representation (e.g. "893.660,81 ₫" or "893.661 ₫")
 * @param {number|null|undefined} amount - The numeric currency amount
 * @param {boolean} [preserveDecimals=true] - Whether to preserve decimal values if present
 * @returns {string} Formatted VND string
 */
export const formatCurrencyVND = (amount, preserveDecimals = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '—';
  }

  const num = Number(amount);

  // If amount has decimal fraction and preserveDecimals is true
  const hasDecimals = num % 1 !== 0;

  if (hasDecimals && preserveDecimals) {
    const formatted = new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
    return `${formatted} ₫`;
  }

  const formatted = new Intl.NumberFormat('vi-VN').format(Math.round(num));
  return `${formatted} ₫`;
};

/**
 * Formats an integer or decimal count into Vietnamese number format (e.g. 1.000.000)
 * @param {number|null|undefined} count - The count value
 * @returns {string} Formatted count string
 */
export const formatNumberVN = (count) => {
  if (count === null || count === undefined || isNaN(count)) {
    return '—';
  }
  return new Intl.NumberFormat('vi-VN').format(count);
};

export default {
  formatCurrencyVND,
  formatNumberVN,
};
