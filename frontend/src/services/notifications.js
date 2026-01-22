/**
 * Notification Service
 * Manage in-app notifications and browser notifications
 */

// Notification types
export const NotificationTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Notification storage key
const NOTIFICATIONS_KEY = 'app_notifications';
const MAX_NOTIFICATIONS = 50;

// In-memory notification store
let notifications = [];
let listeners = new Set();

/**
 * Initialize notifications from storage
 */
export function initNotifications() {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    if (stored) {
      notifications = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load notifications:', error);
    notifications = [];
  }
}

/**
 * Save notifications to storage
 */
function saveNotifications() {
  try {
    // Keep only last MAX_NOTIFICATIONS
    const toSave = notifications.slice(-MAX_NOTIFICATIONS);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('Failed to save notifications:', error);
  }
}

/**
 * Notify all listeners of changes
 */
function notifyListeners() {
  listeners.forEach((listener) => listener([...notifications]));
}

/**
 * Subscribe to notification changes
 */
export function subscribeToNotifications(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/**
 * Create a notification
 */
export function createNotification(options) {
  const {
    type = NotificationTypes.INFO,
    title,
    message,
    data = {},
    persistent = false,
    duration = 5000,
    action = null,
    dismiss = true,
  } = options;
  
  const notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    message,
    data,
    persistent,
    duration,
    action,
    dismiss,
    read: false,
    createdAt: new Date().toISOString(),
  };
  
  notifications.push(notification);
  
  if (persistent) {
    saveNotifications();
  }
  
  notifyListeners();
  
  return notification;
}

/**
 * Create success notification
 */
export function success(message, title = 'Success') {
  return createNotification({
    type: NotificationTypes.SUCCESS,
    title,
    message,
    duration: 4000,
  });
}

/**
 * Create error notification
 */
export function error(message, title = 'Error') {
  return createNotification({
    type: NotificationTypes.ERROR,
    title,
    message,
    duration: 6000,
  });
}

/**
 * Create warning notification
 */
export function warning(message, title = 'Warning') {
  return createNotification({
    type: NotificationTypes.WARNING,
    title,
    message,
    duration: 5000,
  });
}

/**
 * Create info notification
 */
export function info(message, title = 'Info') {
  return createNotification({
    type: NotificationTypes.INFO,
    title,
    message,
    duration: 4000,
  });
}

/**
 * Create transaction notification
 */
export function transaction(txHash, status, chainId = 8453) {
  const explorerUrl = chainId === 8453 
    ? `https://basescan.org/tx/${txHash}`
    : `https://sepolia.basescan.org/tx/${txHash}`;
  
  const messages = {
    pending: 'Transaction submitted. Waiting for confirmation...',
    success: 'Transaction confirmed successfully!',
    failed: 'Transaction failed. Please try again.',
  };
  
  const types = {
    pending: NotificationTypes.INFO,
    success: NotificationTypes.SUCCESS,
    failed: NotificationTypes.ERROR,
  };
  
  return createNotification({
    type: types[status] || NotificationTypes.INFO,
    title: 'Transaction',
    message: messages[status] || 'Transaction status unknown',
    data: { txHash, explorerUrl },
    action: {
      label: 'View on Explorer',
      url: explorerUrl,
    },
    persistent: status === 'success',
    duration: status === 'success' ? 6000 : 5000,
  });
}

/**
 * Mark notification as read
 */
export function markAsRead(notificationId) {
  const notification = notifications.find((n) => n.id === notificationId);
  if (notification) {
    notification.read = true;
    saveNotifications();
    notifyListeners();
  }
}

/**
 * Mark all notifications as read
 */
export function markAllAsRead() {
  notifications.forEach((n) => {
    n.read = true;
  });
  saveNotifications();
  notifyListeners();
}

/**
 * Remove a notification
 */
export function removeNotification(notificationId) {
  notifications = notifications.filter((n) => n.id !== notificationId);
  saveNotifications();
  notifyListeners();
}

/**
 * Clear all notifications
 */
export function clearNotifications() {
  notifications = [];
  saveNotifications();
  notifyListeners();
}

/**
 * Get all notifications
 */
export function getNotifications() {
  return [...notifications];
}

/**
 * Get unread count
 */
export function getUnreadCount() {
  return notifications.filter((n) => !n.read).length;
}

/**
 * Get persistent notifications only
 */
export function getPersistentNotifications() {
  return notifications.filter((n) => n.persistent);
}

/**
 * Request browser notification permission
 */
export async function requestPermission() {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

/**
 * Show browser notification
 */
export async function showBrowserNotification(title, options = {}) {
  const hasPermission = await requestPermission();
  if (!hasPermission) return null;
  
  const notification = new Notification(title, {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    ...options,
  });
  
  return notification;
}

/**
 * Show mint success browser notification
 */
export async function showMintNotification(tokenId, txHash) {
  return showBrowserNotification('NFT Minted! 🎉', {
    body: `Successfully minted MiniNFT #${tokenId}`,
    tag: `mint-${tokenId}`,
    data: { tokenId, txHash },
  });
}

// Initialize on load
if (typeof window !== 'undefined') {
  initNotifications();
}

export default {
  NotificationTypes,
  createNotification,
  success,
  error,
  warning,
  info,
  transaction,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  getNotifications,
  getUnreadCount,
  getPersistentNotifications,
  subscribeToNotifications,
  requestPermission,
  showBrowserNotification,
  showMintNotification,
};
