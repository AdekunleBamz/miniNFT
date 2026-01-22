/**
 * Error types for the application
 */
export const ErrorTypes = {
  WALLET_CONNECTION: 'WALLET_CONNECTION',
  TRANSACTION: 'TRANSACTION',
  CONTRACT: 'CONTRACT',
  NETWORK: 'NETWORK',
  USER_REJECTED: 'USER_REJECTED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  UNKNOWN: 'UNKNOWN',
};

/**
 * Error codes mapping
 */
const ErrorCodes = {
  4001: ErrorTypes.USER_REJECTED,
  4100: ErrorTypes.WALLET_CONNECTION,
  4200: ErrorTypes.WALLET_CONNECTION,
  4900: ErrorTypes.NETWORK,
  4901: ErrorTypes.NETWORK,
  '-32000': ErrorTypes.INSUFFICIENT_FUNDS,
  '-32603': ErrorTypes.TRANSACTION,
};

/**
 * User-friendly error messages
 */
const ErrorMessages = {
  [ErrorTypes.WALLET_CONNECTION]: 'Failed to connect wallet. Please try again.',
  [ErrorTypes.TRANSACTION]: 'Transaction failed. Please try again.',
  [ErrorTypes.CONTRACT]: 'Contract interaction failed.',
  [ErrorTypes.NETWORK]: 'Network error. Please check your connection.',
  [ErrorTypes.USER_REJECTED]: 'Transaction was rejected.',
  [ErrorTypes.INSUFFICIENT_FUNDS]: 'Insufficient funds for this transaction.',
  [ErrorTypes.UNKNOWN]: 'An unexpected error occurred.',
};

/**
 * Parse error and return type
 */
export function parseErrorType(error) {
  if (!error) return ErrorTypes.UNKNOWN;
  
  // Check for error code
  const code = error.code || error.error?.code;
  if (code && ErrorCodes[code]) {
    return ErrorCodes[code];
  }
  
  // Check error message patterns
  const message = error.message?.toLowerCase() || '';
  
  if (message.includes('user rejected') || message.includes('user denied')) {
    return ErrorTypes.USER_REJECTED;
  }
  
  if (message.includes('insufficient') || message.includes('not enough')) {
    return ErrorTypes.INSUFFICIENT_FUNDS;
  }
  
  if (message.includes('network') || message.includes('disconnected')) {
    return ErrorTypes.NETWORK;
  }
  
  if (message.includes('wallet') || message.includes('connect')) {
    return ErrorTypes.WALLET_CONNECTION;
  }
  
  if (message.includes('contract') || message.includes('execution reverted')) {
    return ErrorTypes.CONTRACT;
  }
  
  return ErrorTypes.UNKNOWN;
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error) {
  const type = parseErrorType(error);
  
  // Try to get specific message from error
  if (error?.shortMessage) {
    return error.shortMessage;
  }
  
  // Try to parse revert reason
  if (error?.message?.includes('execution reverted:')) {
    const match = error.message.match(/execution reverted: (.*?)(?:"|$)/);
    if (match) {
      return match[1];
    }
  }
  
  return ErrorMessages[type];
}

/**
 * AppError class for custom errors
 */
export class AppError extends Error {
  constructor(type, message, originalError = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
  
  toJSON() {
    return {
      name: this.name,
      type: this.type,
      message: this.message,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Error handler wrapper
 */
export function handleError(error, callback) {
  const type = parseErrorType(error);
  const message = getErrorMessage(error);
  
  console.error(`[${type}] ${message}`, error);
  
  if (callback) {
    callback({ type, message, error });
  }
  
  return { type, message };
}

/**
 * Async error handler HOF
 */
export function withErrorHandler(fn, onError) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, onError);
      throw error;
    }
  };
}

/**
 * Log error to console with formatting
 */
export function logError(context, error) {
  const type = parseErrorType(error);
  const message = getErrorMessage(error);
  
  console.group(`🚨 Error: ${context}`);
  console.log('Type:', type);
  console.log('Message:', message);
  console.log('Original:', error);
  console.groupEnd();
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error) {
  const type = parseErrorType(error);
  return [ErrorTypes.NETWORK, ErrorTypes.TRANSACTION].includes(type);
}

/**
 * Check if error was user rejection
 */
export function isUserRejection(error) {
  return parseErrorType(error) === ErrorTypes.USER_REJECTED;
}

export default {
  ErrorTypes,
  parseErrorType,
  getErrorMessage,
  AppError,
  handleError,
  withErrorHandler,
  logError,
  isRetryableError,
  isUserRejection,
};
