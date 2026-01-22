/**
 * Analytics Service
 * Track user interactions and events
 */

// Event types
export const EventTypes = {
  // Page views
  PAGE_VIEW: 'page_view',
  
  // Wallet events
  WALLET_CONNECT: 'wallet_connect',
  WALLET_DISCONNECT: 'wallet_disconnect',
  WALLET_CHANGE: 'wallet_change',
  
  // NFT events
  MINT_STARTED: 'mint_started',
  MINT_SUCCESS: 'mint_success',
  MINT_FAILED: 'mint_failed',
  BATCH_MINT_STARTED: 'batch_mint_started',
  BATCH_MINT_SUCCESS: 'batch_mint_success',
  BATCH_MINT_FAILED: 'batch_mint_failed',
  
  // Transfer events
  TRANSFER_STARTED: 'transfer_started',
  TRANSFER_SUCCESS: 'transfer_success',
  TRANSFER_FAILED: 'transfer_failed',
  
  // UI events
  GALLERY_VIEW: 'gallery_view',
  NFT_VIEW: 'nft_view',
  SHARE_CLICK: 'share_click',
  FAVORITE_ADD: 'favorite_add',
  FAVORITE_REMOVE: 'favorite_remove',
  
  // Search events
  SEARCH: 'search',
  FILTER_APPLY: 'filter_apply',
  SORT_CHANGE: 'sort_change',
  
  // Error events
  ERROR: 'error',
};

// Event queue for batching
let eventQueue = [];
let flushTimeout = null;
const FLUSH_INTERVAL = 5000;

/**
 * Track an event
 */
export function trackEvent(eventName, properties = {}) {
  const event = {
    event: eventName,
    timestamp: new Date().toISOString(),
    properties: {
      ...properties,
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    },
  };
  
  eventQueue.push(event);
  
  // Console log in development
  if (import.meta.env.DEV) {
    console.log('📊 Event:', eventName, properties);
  }
  
  // Schedule flush
  scheduleFlush();
}

/**
 * Schedule event queue flush
 */
function scheduleFlush() {
  if (flushTimeout) return;
  
  flushTimeout = setTimeout(() => {
    flushEvents();
    flushTimeout = null;
  }, FLUSH_INTERVAL);
}

/**
 * Flush events to analytics endpoint
 */
async function flushEvents() {
  if (eventQueue.length === 0) return;
  
  const events = [...eventQueue];
  eventQueue = [];
  
  // In production, send to analytics endpoint
  if (!import.meta.env.DEV) {
    try {
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ events }),
      // });
    } catch (error) {
      console.error('Failed to send analytics:', error);
      // Re-queue events on failure
      eventQueue = [...events, ...eventQueue];
    }
  }
}

/**
 * Track page view
 */
export function trackPageView(pageName, properties = {}) {
  trackEvent(EventTypes.PAGE_VIEW, {
    page: pageName,
    ...properties,
  });
}

/**
 * Track wallet connection
 */
export function trackWalletConnect(address, connector) {
  trackEvent(EventTypes.WALLET_CONNECT, {
    address: address?.slice(0, 10) + '...',
    connector,
  });
}

/**
 * Track wallet disconnection
 */
export function trackWalletDisconnect() {
  trackEvent(EventTypes.WALLET_DISCONNECT);
}

/**
 * Track mint start
 */
export function trackMintStart(quantity = 1) {
  trackEvent(quantity > 1 ? EventTypes.BATCH_MINT_STARTED : EventTypes.MINT_STARTED, {
    quantity,
  });
}

/**
 * Track mint success
 */
export function trackMintSuccess(quantity, txHash, tokenIds) {
  trackEvent(quantity > 1 ? EventTypes.BATCH_MINT_SUCCESS : EventTypes.MINT_SUCCESS, {
    quantity,
    txHash: txHash?.slice(0, 20) + '...',
    tokenIds,
  });
}

/**
 * Track mint failure
 */
export function trackMintFailed(quantity, error) {
  trackEvent(quantity > 1 ? EventTypes.BATCH_MINT_FAILED : EventTypes.MINT_FAILED, {
    quantity,
    error: error?.message || 'Unknown error',
  });
}

/**
 * Track NFT view
 */
export function trackNFTView(tokenId) {
  trackEvent(EventTypes.NFT_VIEW, {
    tokenId,
  });
}

/**
 * Track gallery view
 */
export function trackGalleryView(viewMode, filterCount) {
  trackEvent(EventTypes.GALLERY_VIEW, {
    viewMode,
    filterCount,
  });
}

/**
 * Track share action
 */
export function trackShare(platform, tokenId) {
  trackEvent(EventTypes.SHARE_CLICK, {
    platform,
    tokenId,
  });
}

/**
 * Track favorite action
 */
export function trackFavorite(action, tokenId) {
  trackEvent(action === 'add' ? EventTypes.FAVORITE_ADD : EventTypes.FAVORITE_REMOVE, {
    tokenId,
  });
}

/**
 * Track search
 */
export function trackSearch(query, resultCount) {
  trackEvent(EventTypes.SEARCH, {
    query,
    resultCount,
  });
}

/**
 * Track filter application
 */
export function trackFilter(filters) {
  trackEvent(EventTypes.FILTER_APPLY, {
    filterCount: Object.keys(filters).length,
    filters: JSON.stringify(filters),
  });
}

/**
 * Track error
 */
export function trackError(error, context = {}) {
  trackEvent(EventTypes.ERROR, {
    errorMessage: error?.message || 'Unknown error',
    errorType: error?.name || 'Error',
    ...context,
  });
}

/**
 * Get session data
 */
export function getSessionData() {
  return {
    sessionId: getSessionId(),
    eventCount: eventQueue.length,
    startTime: sessionStorage.getItem('analytics_session_start'),
  };
}

/**
 * Get or create session ID
 */
function getSessionId() {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
    sessionStorage.setItem('analytics_session_start', new Date().toISOString());
  }
  return sessionId;
}

// Flush events before page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    flushEvents();
  });
  
  // Initialize session
  getSessionId();
}

export default {
  EventTypes,
  trackEvent,
  trackPageView,
  trackWalletConnect,
  trackWalletDisconnect,
  trackMintStart,
  trackMintSuccess,
  trackMintFailed,
  trackNFTView,
  trackGalleryView,
  trackShare,
  trackFavorite,
  trackSearch,
  trackFilter,
  trackError,
  getSessionData,
};
