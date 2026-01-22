/**
 * Storage utilities with expiration support
 */

const STORAGE_PREFIX = 'miniNFT_';

/**
 * Set item with optional expiration
 */
export const setStorageItem = (key, value, expiresInMinutes = null) => {
  try {
    const item = {
      value,
      timestamp: Date.now(),
      expires: expiresInMinutes ? Date.now() + expiresInMinutes * 60 * 1000 : null
    };
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Get item, respecting expiration
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (!item) return defaultValue;
    
    const parsed = JSON.parse(item);
    
    // Check expiration
    if (parsed.expires && Date.now() > parsed.expires) {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return defaultValue;
    }
    
    return parsed.value;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove item
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

/**
 * Clear all app items
 */
export const clearStorage = () => {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Get storage size in bytes
 */
export const getStorageSize = () => {
  let total = 0;
  Object.keys(localStorage)
    .filter(key => key.startsWith(STORAGE_PREFIX))
    .forEach(key => {
      total += localStorage.getItem(key).length * 2; // UTF-16
    });
  return total;
};

/**
 * Session storage utilities
 */
export const session = {
  set: (key, value) => {
    try {
      sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  get: (key, defaultValue = null) => {
    try {
      const item = sessionStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  remove: (key) => {
    sessionStorage.removeItem(STORAGE_PREFIX + key);
  },
  
  clear: () => {
    Object.keys(sessionStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => sessionStorage.removeItem(key));
  }
};

export default {
  setStorageItem,
  getStorageItem,
  removeStorageItem,
  clearStorage,
  getStorageSize,
  session
};
