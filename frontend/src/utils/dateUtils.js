/**
 * Date and time formatting utilities
 */

/**
 * Format a date relative to now (e.g., "2 hours ago")
 * @param {Date|number|string} date - Date to format
 * @returns {string} Formatted relative time
 */
export function formatRelativeTime(date) {
  const now = Date.now();
  const timestamp = date instanceof Date ? date.getTime() : new Date(date).getTime();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

/**
 * Format a date for display
 * @param {Date|number|string} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  const {
    format = 'medium',
    includeTime = false,
    locale = 'en-US'
  } = options;

  const d = date instanceof Date ? date : new Date(date);

  const dateFormats = {
    short: { month: 'numeric', day: 'numeric', year: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
  };

  const timeFormat = includeTime ? { hour: '2-digit', minute: '2-digit' } : {};
  
  return d.toLocaleDateString(locale, {
    ...dateFormats[format],
    ...timeFormat
  });
}

/**
 * Format time only
 * @param {Date|number|string} date - Date to format
 * @param {boolean} includeSeconds - Whether to include seconds
 * @returns {string} Formatted time string
 */
export function formatTime(date, includeSeconds = false) {
  const d = date instanceof Date ? date : new Date(date);
  
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' })
  };
  
  return d.toLocaleTimeString('en-US', options);
}

/**
 * Format duration in seconds to human readable string
 * @param {number} seconds - Duration in seconds
 * @param {Object} options - Formatting options
 * @returns {string} Formatted duration
 */
export function formatDuration(seconds, options = {}) {
  const { compact = false, maxUnits = 2 } = options;

  if (seconds < 0) return '0s';

  const units = [
    { name: compact ? 'y' : ' year', seconds: 31536000 },
    { name: compact ? 'd' : ' day', seconds: 86400 },
    { name: compact ? 'h' : ' hour', seconds: 3600 },
    { name: compact ? 'm' : ' minute', seconds: 60 },
    { name: compact ? 's' : ' second', seconds: 1 }
  ];

  const parts = [];
  let remaining = seconds;

  for (const unit of units) {
    if (parts.length >= maxUnits) break;
    
    const count = Math.floor(remaining / unit.seconds);
    if (count > 0) {
      if (compact) {
        parts.push(`${count}${unit.name}`);
      } else {
        parts.push(`${count}${unit.name}${count !== 1 ? 's' : ''}`);
      }
      remaining %= unit.seconds;
    }
  }

  return parts.length > 0 ? parts.join(compact ? ' ' : ', ') : '0s';
}

/**
 * Format countdown (time remaining)
 * @param {Date|number} endTime - End time
 * @returns {Object} Countdown parts
 */
export function getCountdown(endTime) {
  const end = endTime instanceof Date ? endTime.getTime() : endTime;
  const now = Date.now();
  const diff = Math.max(0, end - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds: Math.floor(diff / 1000),
    isExpired: diff === 0,
    formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`
  };
}

/**
 * Check if a date is today
 * @param {Date|number|string} date - Date to check
 * @returns {boolean}
 */
export function isToday(date) {
  const d = date instanceof Date ? date : new Date(date);
  const today = new Date();
  
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
}

/**
 * Check if a date is this week
 * @param {Date|number|string} date - Date to check
 * @returns {boolean}
 */
export function isThisWeek(date) {
  const d = date instanceof Date ? date : new Date(date);
  const now = new Date();
  
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  
  return d >= startOfWeek && d < endOfWeek;
}

/**
 * Get start and end of day
 * @param {Date} date - Date
 * @returns {Object} Start and end of day
 */
export function getDayBounds(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

/**
 * Add time to a date
 * @param {Date} date - Base date
 * @param {number} amount - Amount to add
 * @param {string} unit - Unit (seconds, minutes, hours, days, weeks, months, years)
 * @returns {Date} New date
 */
export function addTime(date, amount, unit) {
  const d = new Date(date);
  
  switch (unit) {
    case 'seconds':
      d.setSeconds(d.getSeconds() + amount);
      break;
    case 'minutes':
      d.setMinutes(d.getMinutes() + amount);
      break;
    case 'hours':
      d.setHours(d.getHours() + amount);
      break;
    case 'days':
      d.setDate(d.getDate() + amount);
      break;
    case 'weeks':
      d.setDate(d.getDate() + amount * 7);
      break;
    case 'months':
      d.setMonth(d.getMonth() + amount);
      break;
    case 'years':
      d.setFullYear(d.getFullYear() + amount);
      break;
  }
  
  return d;
}

export default {
  formatRelativeTime,
  formatDate,
  formatTime,
  formatDuration,
  getCountdown,
  isToday,
  isThisWeek,
  getDayBounds,
  addTime
};
