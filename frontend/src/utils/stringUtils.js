/**
 * String formatting and manipulation utilities
 */

/**
 * Truncate address for display
 * @param {string} address - Ethereum address
 * @param {number} startChars - Characters to show at start
 * @param {number} endChars - Characters to show at end
 * @returns {string} Truncated address
 */
export function truncateAddress(address, startChars = 6, endChars = 4) {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Truncate any string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add
 * @returns {string} Truncated string
 */
export function truncate(str, maxLength = 50, suffix = '...') {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '';
  return num.toLocaleString('en-US');
}

/**
 * Format number as compact (1K, 1M, etc.)
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Compact number
 */
export function formatCompact(num, decimals = 1) {
  if (num === null || num === undefined) return '';
  
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
  
  if (tier === 0) return num.toString();
  
  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;
  
  return scaled.toFixed(decimals) + suffix;
}

/**
 * Format ETH value
 * @param {number|string} value - Value in ETH or wei
 * @param {Object} options - Formatting options
 * @returns {string} Formatted ETH value
 */
export function formatETH(value, options = {}) {
  const {
    decimals = 4,
    showSymbol = true,
    fromWei = false
  } = options;

  let ethValue = Number(value);
  
  if (fromWei) {
    ethValue = ethValue / 1e18;
  }
  
  if (isNaN(ethValue)) return showSymbol ? '0 ETH' : '0';
  
  // Handle very small values
  if (ethValue > 0 && ethValue < 0.0001) {
    return showSymbol ? '< 0.0001 ETH' : '< 0.0001';
  }
  
  const formatted = ethValue.toFixed(decimals);
  // Remove trailing zeros
  const cleaned = parseFloat(formatted).toString();
  
  return showSymbol ? `${cleaned} ETH` : cleaned;
}

/**
 * Format percentage
 * @param {number} value - Value (0-1 or 0-100)
 * @param {Object} options - Formatting options
 * @returns {string} Formatted percentage
 */
export function formatPercentage(value, options = {}) {
  const {
    decimals = 1,
    normalized = false, // true if value is 0-1
    showSign = false
  } = options;

  const percent = normalized ? value * 100 : value;
  const sign = showSign && percent > 0 ? '+' : '';
  
  return `${sign}${percent.toFixed(decimals)}%`;
}

/**
 * Convert string to slug
 * @param {string} str - String to convert
 * @returns {string} URL-safe slug
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Convert to title case
 * @param {string} str - String to convert
 * @returns {string} Title cased string
 */
export function toTitleCase(str) {
  if (!str) return '';
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

/**
 * Convert to camelCase
 * @param {string} str - String to convert
 * @returns {string} camelCased string
 */
export function toCamelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, '');
}

/**
 * Convert to kebab-case
 * @param {string} str - String to convert
 * @returns {string} kebab-cased string
 */
export function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Pluralize a word
 * @param {number} count - Count
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional)
 * @returns {string} Pluralized word with count
 */
export function pluralize(count, singular, plural) {
  const word = count === 1 ? singular : (plural || `${singular}s`);
  return `${count} ${word}`;
}

/**
 * Generate random ID
 * @param {number} length - Length of ID
 * @returns {string} Random ID
 */
export function generateId(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Mask sensitive data
 * @param {string} str - String to mask
 * @param {number} visibleStart - Visible characters at start
 * @param {number} visibleEnd - Visible characters at end
 * @param {string} maskChar - Character to use for masking
 * @returns {string} Masked string
 */
export function mask(str, visibleStart = 4, visibleEnd = 4, maskChar = '•') {
  if (!str || str.length <= visibleStart + visibleEnd) return str;
  
  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  const middle = maskChar.repeat(Math.min(str.length - visibleStart - visibleEnd, 8));
  
  return `${start}${middle}${end}`;
}

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export function escapeHtml(str) {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, (char) => entities[char]);
}

/**
 * Highlight search matches in text
 * @param {string} text - Text to search in
 * @param {string} query - Search query
 * @param {string} tag - HTML tag to wrap matches
 * @returns {string} Text with highlighted matches
 */
export function highlightMatches(text, query, tag = 'mark') {
  if (!query || !text) return text;
  
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  
  return text.replace(regex, `<${tag}>$1</${tag}>`);
}

export default {
  truncateAddress,
  truncate,
  formatNumber,
  formatCompact,
  formatETH,
  formatPercentage,
  slugify,
  toTitleCase,
  toCamelCase,
  toKebabCase,
  pluralize,
  generateId,
  mask,
  escapeHtml,
  highlightMatches
};
