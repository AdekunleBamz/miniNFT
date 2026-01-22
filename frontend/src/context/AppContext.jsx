import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// Initial state
const initialState = {
  // User state
  user: {
    address: null,
    balance: 0,
    nfts: [],
    isConnected: false,
  },
  // Collection state
  collection: {
    totalSupply: 0,
    minted: 0,
    remaining: 505,
    mintPrice: 0.00001,
  },
  // UI state
  ui: {
    theme: 'dark',
    isLoading: false,
    activeModal: null,
    sidebarOpen: false,
    viewMode: 'grid', // 'grid' | 'list'
  },
  // Transaction state
  transactions: {
    pending: [],
    completed: [],
    failed: [],
  },
  // Notifications
  notifications: [],
};

// Action types
const ActionTypes = {
  // User actions
  SET_USER_ADDRESS: 'SET_USER_ADDRESS',
  SET_USER_BALANCE: 'SET_USER_BALANCE',
  SET_USER_NFTS: 'SET_USER_NFTS',
  SET_CONNECTED: 'SET_CONNECTED',
  DISCONNECT_USER: 'DISCONNECT_USER',
  
  // Collection actions
  SET_COLLECTION_STATS: 'SET_COLLECTION_STATS',
  UPDATE_MINTED_COUNT: 'UPDATE_MINTED_COUNT',
  
  // UI actions
  SET_THEME: 'SET_THEME',
  SET_LOADING: 'SET_LOADING',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_VIEW_MODE: 'SET_VIEW_MODE',
  
  // Transaction actions
  ADD_PENDING_TX: 'ADD_PENDING_TX',
  COMPLETE_TX: 'COMPLETE_TX',
  FAIL_TX: 'FAIL_TX',
  CLEAR_TRANSACTIONS: 'CLEAR_TRANSACTIONS',
  
  // Notification actions
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    // User reducers
    case ActionTypes.SET_USER_ADDRESS:
      return {
        ...state,
        user: { ...state.user, address: action.payload },
      };
    case ActionTypes.SET_USER_BALANCE:
      return {
        ...state,
        user: { ...state.user, balance: action.payload },
      };
    case ActionTypes.SET_USER_NFTS:
      return {
        ...state,
        user: { ...state.user, nfts: action.payload },
      };
    case ActionTypes.SET_CONNECTED:
      return {
        ...state,
        user: { ...state.user, isConnected: action.payload },
      };
    case ActionTypes.DISCONNECT_USER:
      return {
        ...state,
        user: initialState.user,
      };
      
    // Collection reducers
    case ActionTypes.SET_COLLECTION_STATS:
      return {
        ...state,
        collection: { ...state.collection, ...action.payload },
      };
    case ActionTypes.UPDATE_MINTED_COUNT:
      return {
        ...state,
        collection: {
          ...state.collection,
          minted: state.collection.minted + action.payload,
          remaining: state.collection.remaining - action.payload,
        },
      };
      
    // UI reducers
    case ActionTypes.SET_THEME:
      return {
        ...state,
        ui: { ...state.ui, theme: action.payload },
      };
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        ui: { ...state.ui, isLoading: action.payload },
      };
    case ActionTypes.OPEN_MODAL:
      return {
        ...state,
        ui: { ...state.ui, activeModal: action.payload },
      };
    case ActionTypes.CLOSE_MODAL:
      return {
        ...state,
        ui: { ...state.ui, activeModal: null },
      };
    case ActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
      };
    case ActionTypes.SET_VIEW_MODE:
      return {
        ...state,
        ui: { ...state.ui, viewMode: action.payload },
      };
      
    // Transaction reducers
    case ActionTypes.ADD_PENDING_TX:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          pending: [...state.transactions.pending, action.payload],
        },
      };
    case ActionTypes.COMPLETE_TX:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          pending: state.transactions.pending.filter(tx => tx.hash !== action.payload.hash),
          completed: [...state.transactions.completed, action.payload],
        },
      };
    case ActionTypes.FAIL_TX:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          pending: state.transactions.pending.filter(tx => tx.hash !== action.payload.hash),
          failed: [...state.transactions.failed, action.payload],
        },
      };
    case ActionTypes.CLEAR_TRANSACTIONS:
      return {
        ...state,
        transactions: initialState.transactions,
      };
      
    // Notification reducers
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, { id: Date.now(), ...action.payload }],
      };
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    case ActionTypes.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };
      
    default:
      return state;
  }
}

// Create context
const AppContext = createContext(null);

/**
 * App Provider component
 */
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Memoized action creators
  const actions = useMemo(() => ({
    // User actions
    setUserAddress: (address) => dispatch({ type: ActionTypes.SET_USER_ADDRESS, payload: address }),
    setUserBalance: (balance) => dispatch({ type: ActionTypes.SET_USER_BALANCE, payload: balance }),
    setUserNFTs: (nfts) => dispatch({ type: ActionTypes.SET_USER_NFTS, payload: nfts }),
    setConnected: (connected) => dispatch({ type: ActionTypes.SET_CONNECTED, payload: connected }),
    disconnectUser: () => dispatch({ type: ActionTypes.DISCONNECT_USER }),
    
    // Collection actions
    setCollectionStats: (stats) => dispatch({ type: ActionTypes.SET_COLLECTION_STATS, payload: stats }),
    updateMintedCount: (count) => dispatch({ type: ActionTypes.UPDATE_MINTED_COUNT, payload: count }),
    
    // UI actions
    setTheme: (theme) => dispatch({ type: ActionTypes.SET_THEME, payload: theme }),
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    openModal: (modal) => dispatch({ type: ActionTypes.OPEN_MODAL, payload: modal }),
    closeModal: () => dispatch({ type: ActionTypes.CLOSE_MODAL }),
    toggleSidebar: () => dispatch({ type: ActionTypes.TOGGLE_SIDEBAR }),
    setViewMode: (mode) => dispatch({ type: ActionTypes.SET_VIEW_MODE, payload: mode }),
    
    // Transaction actions
    addPendingTx: (tx) => dispatch({ type: ActionTypes.ADD_PENDING_TX, payload: tx }),
    completeTx: (tx) => dispatch({ type: ActionTypes.COMPLETE_TX, payload: tx }),
    failTx: (tx) => dispatch({ type: ActionTypes.FAIL_TX, payload: tx }),
    clearTransactions: () => dispatch({ type: ActionTypes.CLEAR_TRANSACTIONS }),
    
    // Notification actions
    addNotification: (notification) => dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification }),
    removeNotification: (id) => dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id }),
    clearNotifications: () => dispatch({ type: ActionTypes.CLEAR_NOTIFICATIONS }),
  }), []);
  
  // Computed values
  const computed = useMemo(() => ({
    progress: state.collection.minted / 505 * 100,
    hasPendingTx: state.transactions.pending.length > 0,
    notificationCount: state.notifications.length,
    isDarkTheme: state.ui.theme === 'dark',
  }), [state.collection.minted, state.transactions.pending.length, state.notifications.length, state.ui.theme]);
  
  const value = useMemo(() => ({
    state,
    actions,
    computed,
  }), [state, actions, computed]);
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Hook to use app context
 */
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

/**
 * Hook for user state
 */
export function useUser() {
  const { state, actions } = useAppContext();
  return {
    ...state.user,
    setAddress: actions.setUserAddress,
    setBalance: actions.setUserBalance,
    setNFTs: actions.setUserNFTs,
    setConnected: actions.setConnected,
    disconnect: actions.disconnectUser,
  };
}

/**
 * Hook for collection state
 */
export function useCollection() {
  const { state, actions, computed } = useAppContext();
  return {
    ...state.collection,
    progress: computed.progress,
    setStats: actions.setCollectionStats,
    updateMinted: actions.updateMintedCount,
  };
}

/**
 * Hook for UI state
 */
export function useUI() {
  const { state, actions, computed } = useAppContext();
  return {
    ...state.ui,
    isDarkTheme: computed.isDarkTheme,
    setTheme: actions.setTheme,
    setLoading: actions.setLoading,
    openModal: actions.openModal,
    closeModal: actions.closeModal,
    toggleSidebar: actions.toggleSidebar,
    setViewMode: actions.setViewMode,
  };
}

/**
 * Hook for transaction state
 */
export function useTransactions() {
  const { state, actions, computed } = useAppContext();
  return {
    ...state.transactions,
    hasPending: computed.hasPendingTx,
    addPending: actions.addPendingTx,
    complete: actions.completeTx,
    fail: actions.failTx,
    clear: actions.clearTransactions,
  };
}

/**
 * Hook for notifications
 */
export function useNotifications() {
  const { state, actions, computed } = useAppContext();
  return {
    notifications: state.notifications,
    count: computed.notificationCount,
    add: actions.addNotification,
    remove: actions.removeNotification,
    clear: actions.clearNotifications,
  };
}

export { ActionTypes };
export default AppContext;
