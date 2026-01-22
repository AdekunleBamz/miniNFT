/**
 * Notification component for in-app notifications
 */
import React, { useState, useEffect, useCallback } from 'react';

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      dismissible: true,
      ...notification,
    };

    setNotifications((prev) => [...prev, newNotification]);

    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification, clearAll }}>
      {children}
      <NotificationContainer notifications={notifications} onDismiss={removeNotification} />
    </NotificationContext.Provider>
  );
}

const NotificationContext = React.createContext(null);

export function useNotification() {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

function NotificationContainer({ notifications, onDismiss }) {
  return (
    <div className="notification-container" role="region" aria-label="Notifications" aria-live="polite">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={() => onDismiss(notification.id)}
        />
      ))}
    </div>
  );
}

function NotificationItem({ notification, onDismiss }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(onDismiss, 300);
  };

  const icons = {
    success: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  };

  return (
    <div
      className={`notification notification--${notification.type} ${isExiting ? 'notification--exiting' : ''}`}
      role="alert"
    >
      <div className="notification__icon">
        {notification.icon || icons[notification.type]}
      </div>
      
      <div className="notification__content">
        {notification.title && (
          <h4 className="notification__title">{notification.title}</h4>
        )}
        <p className="notification__message">{notification.message}</p>
        
        {notification.action && (
          <button
            className="notification__action"
            onClick={notification.action.onClick}
          >
            {notification.action.label}
          </button>
        )}
      </div>

      {notification.dismissible && (
        <button
          className="notification__dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      {notification.progress && (
        <div
          className="notification__progress"
          style={{ animationDuration: `${notification.duration}ms` }}
        />
      )}
    </div>
  );
}

// Convenience functions
export function useNotify() {
  const { addNotification } = useNotification();

  return {
    success: (message, options = {}) => addNotification({ type: 'success', message, ...options }),
    error: (message, options = {}) => addNotification({ type: 'error', message, ...options }),
    warning: (message, options = {}) => addNotification({ type: 'warning', message, ...options }),
    info: (message, options = {}) => addNotification({ type: 'info', message, ...options }),
  };
}

export default NotificationProvider;
