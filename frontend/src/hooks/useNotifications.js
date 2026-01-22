/**
 * useNotifications hook for browser notifications
 */
import { useState, useEffect, useCallback } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('Notification' in window);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const notify = useCallback(
    (title, options = {}) => {
      if (!isSupported || permission !== 'granted') {
        return null;
      }

      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options,
      });

      return notification;
    },
    [isSupported, permission]
  );

  const notifyMint = useCallback(
    (tokenId) => {
      return notify('NFT Minted! 🎉', {
        body: `You successfully minted MiniNFT #${tokenId}`,
        tag: `mint-${tokenId}`,
        requireInteraction: false,
      });
    },
    [notify]
  );

  const notifyTransfer = useCallback(
    (tokenId, to) => {
      return notify('NFT Transferred', {
        body: `MiniNFT #${tokenId} has been transferred`,
        tag: `transfer-${tokenId}`,
      });
    },
    [notify]
  );

  const notifyError = useCallback(
    (message) => {
      return notify('Transaction Failed', {
        body: message,
        tag: 'error',
      });
    },
    [notify]
  );

  return {
    permission,
    isSupported,
    isGranted: permission === 'granted',
    isDenied: permission === 'denied',
    requestPermission,
    notify,
    notifyMint,
    notifyTransfer,
    notifyError,
  };
}

/**
 * usePushNotifications hook for service worker push notifications
 */
export function usePushNotifications() {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then(setSubscription);
      });
    }
  }, []);

  const subscribe = useCallback(async (vapidPublicKey) => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Push notifications not supported');
    }

    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      setSubscription(sub);
      return sub;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    if (!subscription) return;

    setIsLoading(true);

    try {
      await subscription.unsubscribe();
      setSubscription(null);
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  return {
    subscription,
    isSubscribed: !!subscription,
    isLoading,
    subscribe,
    unsubscribe,
  };
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export default useNotifications;
