/**
 * Spacing Utilities
 * Provides consistent spacing values and helper functions
 * Based on an 8px grid system
 */

// Base spacing unit (8px)
export const SPACING_UNIT = 8;

// Spacing scale
export const spacing = {
  0: '0',
  0.5: '0.25rem',  // 4px
  1: '0.5rem',     // 8px
  1.5: '0.75rem',  // 12px
  2: '1rem',       // 16px
  2.5: '1.25rem',  // 20px
  3: '1.5rem',     // 24px
  4: '2rem',       // 32px
  5: '2.5rem',     // 40px
  6: '3rem',       // 48px
  8: '4rem',       // 64px
  10: '5rem',      // 80px
  12: '6rem',      // 96px
  16: '8rem',      // 128px
  20: '10rem',     // 160px
  24: '12rem',     // 192px
};

/**
 * Get spacing value by key
 * @param {number|string} key - Spacing key from scale
 * @returns {string} CSS spacing value
 */
export function getSpacing(key) {
  return spacing[key] || spacing[1];
}

/**
 * Create spacing value from multiple keys (like CSS shorthand)
 * @param  {...(number|string)} keys - Spacing keys
 * @returns {string} CSS spacing shorthand value
 */
export function createSpacing(...keys) {
  return keys.map(key => getSpacing(key)).join(' ');
}

/**
 * Convert spacing key to pixels
 * @param {number|string} key - Spacing key
 * @returns {number} Pixel value
 */
export function spacingToPx(key) {
  const value = getSpacing(key);
  const remMatch = value.match(/^([\d.]+)rem$/);
  if (remMatch) {
    return parseFloat(remMatch[1]) * 16;
  }
  return 0;
}

/**
 * Generate inline style object for margin
 * @param {Object} options - Margin options
 * @returns {Object} Style object
 */
export function marginStyle({ 
  top, right, bottom, left, 
  x, y, all 
} = {}) {
  const style = {};
  
  if (all !== undefined) {
    style.margin = getSpacing(all);
  }
  if (y !== undefined) {
    style.marginTop = getSpacing(y);
    style.marginBottom = getSpacing(y);
  }
  if (x !== undefined) {
    style.marginLeft = getSpacing(x);
    style.marginRight = getSpacing(x);
  }
  if (top !== undefined) style.marginTop = getSpacing(top);
  if (right !== undefined) style.marginRight = getSpacing(right);
  if (bottom !== undefined) style.marginBottom = getSpacing(bottom);
  if (left !== undefined) style.marginLeft = getSpacing(left);
  
  return style;
}

/**
 * Generate inline style object for padding
 * @param {Object} options - Padding options
 * @returns {Object} Style object
 */
export function paddingStyle({ 
  top, right, bottom, left, 
  x, y, all 
} = {}) {
  const style = {};
  
  if (all !== undefined) {
    style.padding = getSpacing(all);
  }
  if (y !== undefined) {
    style.paddingTop = getSpacing(y);
    style.paddingBottom = getSpacing(y);
  }
  if (x !== undefined) {
    style.paddingLeft = getSpacing(x);
    style.paddingRight = getSpacing(x);
  }
  if (top !== undefined) style.paddingTop = getSpacing(top);
  if (right !== undefined) style.paddingRight = getSpacing(right);
  if (bottom !== undefined) style.paddingBottom = getSpacing(bottom);
  if (left !== undefined) style.paddingLeft = getSpacing(left);
  
  return style;
}

/**
 * Generate gap style for flexbox/grid
 * @param {number|string} rowGap - Row gap spacing key
 * @param {number|string} columnGap - Column gap spacing key (optional)
 * @returns {Object} Style object
 */
export function gapStyle(rowGap, columnGap) {
  if (columnGap !== undefined) {
    return {
      rowGap: getSpacing(rowGap),
      columnGap: getSpacing(columnGap),
    };
  }
  return { gap: getSpacing(rowGap) };
}

export default spacing;
