/**
 * Validation utilities for forms and data
 */

/**
 * Check if value is a valid Ethereum address
 * @param {string} address - Address to validate
 * @returns {boolean}
 */
export function isValidAddress(address) {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Check if value is a valid transaction hash
 * @param {string} hash - Hash to validate
 * @returns {boolean}
 */
export function isValidTxHash(hash) {
  if (!hash) return false;
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Check if value is a valid email
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Check if value is a valid URL
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if value is a valid IPFS hash/CID
 * @param {string} cid - CID to validate
 * @returns {boolean}
 */
export function isValidIpfsCid(cid) {
  if (!cid) return false;
  // Validate CIDv0 (Qm...) or CIDv1 (bafy...)
  return /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z2-7]{55})$/.test(cid);
}

/**
 * Validate a form field
 * @param {*} value - Value to validate
 * @param {Object} rules - Validation rules
 * @returns {string|null} Error message or null if valid
 */
export function validateField(value, rules) {
  const {
    required,
    minLength,
    maxLength,
    min,
    max,
    pattern,
    custom,
    messages = {}
  } = rules;

  if (required && (!value || (typeof value === 'string' && !value.trim()))) {
    return messages.required || 'This field is required';
  }

  if (value && typeof value === 'string') {
    if (minLength && value.length < minLength) {
      return messages.minLength || `Must be at least ${minLength} characters`;
    }

    if (maxLength && value.length > maxLength) {
      return messages.maxLength || `Must be at most ${maxLength} characters`;
    }

    if (pattern && !pattern.test(value)) {
      return messages.pattern || 'Invalid format';
    }
  }

  if (typeof value === 'number') {
    if (min !== undefined && value < min) {
      return messages.min || `Must be at least ${min}`;
    }

    if (max !== undefined && value > max) {
      return messages.max || `Must be at most ${max}`;
    }
  }

  if (custom) {
    const customError = custom(value);
    if (customError) {
      return customError;
    }
  }

  return null;
}

/**
 * Validate entire form
 * @param {Object} values - Form values
 * @param {Object} schema - Validation schema
 * @returns {Object} Errors object
 */
export function validateForm(values, schema) {
  const errors = {};

  for (const [field, rules] of Object.entries(schema)) {
    const error = validateField(values[field], rules);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

/**
 * Create a validator function for a schema
 * @param {Object} schema - Validation schema
 * @returns {Function} Validator function
 */
export function createValidator(schema) {
  return (values) => validateForm(values, schema);
}

/**
 * Common validation rules
 */
export const rules = {
  required: (message) => ({
    required: true,
    messages: { required: message }
  }),

  email: (message) => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: { pattern: message || 'Invalid email address' }
  }),

  minLength: (length, message) => ({
    minLength: length,
    messages: { minLength: message }
  }),

  maxLength: (length, message) => ({
    maxLength: length,
    messages: { maxLength: message }
  }),

  min: (value, message) => ({
    min: value,
    messages: { min: message }
  }),

  max: (value, message) => ({
    max: value,
    messages: { max: message }
  }),

  address: (message) => ({
    pattern: /^0x[a-fA-F0-9]{40}$/,
    messages: { pattern: message || 'Invalid Ethereum address' }
  }),

  url: (message) => ({
    custom: (value) => {
      if (!value) return null;
      try {
        new URL(value);
        return null;
      } catch {
        return message || 'Invalid URL';
      }
    }
  }),

  matches: (regex, message) => ({
    pattern: regex,
    messages: { pattern: message }
  }),

  oneOf: (options, message) => ({
    custom: (value) => {
      if (!options.includes(value)) {
        return message || `Must be one of: ${options.join(', ')}`;
      }
      return null;
    }
  }),

  numeric: (message) => ({
    pattern: /^\d+$/,
    messages: { pattern: message || 'Must be a number' }
  }),

  positive: (message) => ({
    custom: (value) => {
      if (Number(value) <= 0) {
        return message || 'Must be a positive number';
      }
      return null;
    }
  })
};

/**
 * Combine multiple validation rules
 * @param  {...Object} ruleObjects - Rules to combine
 * @returns {Object} Combined rules
 */
export function combineRules(...ruleObjects) {
  const combined = {
    messages: {}
  };

  for (const rule of ruleObjects) {
    Object.assign(combined, rule);
    if (rule.messages) {
      Object.assign(combined.messages, rule.messages);
    }
  }

  return combined;
}

export default {
  isValidAddress,
  isValidTxHash,
  isValidEmail,
  isValidUrl,
  isValidIpfsCid,
  validateField,
  validateForm,
  createValidator,
  rules,
  combineRules
};
