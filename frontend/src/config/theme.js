/**
 * Theme Configuration
 * 
 * Centralized theme configuration for the MiniNFT application.
 * Includes colors, typography, spacing, animations, and component styles.
 */

// Color palette
export const colors = {
  // Primary colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e'
  },
  
  // Secondary colors (purple accent)
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87'
  },
  
  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b'
  },
  
  // Semantic colors
  success: {
    light: '#4ade80',
    main: '#22c55e',
    dark: '#16a34a'
  },
  
  warning: {
    light: '#fbbf24',
    main: '#f59e0b',
    dark: '#d97706'
  },
  
  error: {
    light: '#f87171',
    main: '#ef4444',
    dark: '#dc2626'
  },
  
  info: {
    light: '#60a5fa',
    main: '#3b82f6',
    dark: '#2563eb'
  }
};

// Typography
export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace",
    display: "'Space Grotesk', 'Inter', sans-serif"
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem'  // 60px
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },
  
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  }
};

// Spacing scale
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem'
};

// Border radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px'
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
  
  // Colored shadows
  primary: '0 4px 14px 0 rgba(14, 165, 233, 0.39)',
  secondary: '0 4px 14px 0 rgba(168, 85, 247, 0.39)',
  success: '0 4px 14px 0 rgba(34, 197, 94, 0.39)',
  error: '0 4px 14px 0 rgba(239, 68, 68, 0.39)',
  
  // Glass shadow
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
};

// Transitions
export const transitions = {
  duration: {
    fastest: '50ms',
    faster: '100ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '400ms',
    slowest: '500ms'
  },
  
  timing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  }
};

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  overlay: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080
};

// Breakpoints
export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Light theme
export const lightTheme = {
  name: 'light',
  colors: {
    background: {
      primary: colors.neutral[50],
      secondary: colors.neutral[100],
      tertiary: colors.neutral[200]
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
      tertiary: colors.neutral[400],
      inverse: colors.neutral[50]
    },
    border: {
      primary: colors.neutral[200],
      secondary: colors.neutral[300]
    },
    surface: {
      primary: '#ffffff',
      elevated: '#ffffff'
    }
  }
};

// Dark theme
export const darkTheme = {
  name: 'dark',
  colors: {
    background: {
      primary: colors.neutral[950],
      secondary: colors.neutral[900],
      tertiary: colors.neutral[800]
    },
    text: {
      primary: colors.neutral[50],
      secondary: colors.neutral[400],
      tertiary: colors.neutral[500],
      inverse: colors.neutral[900]
    },
    border: {
      primary: colors.neutral[800],
      secondary: colors.neutral[700]
    },
    surface: {
      primary: colors.neutral[900],
      elevated: colors.neutral[800]
    }
  }
};

// Component-specific styles
export const components = {
  button: {
    sizes: {
      xs: { height: '1.75rem', fontSize: typography.fontSize.xs, padding: '0 0.5rem' },
      sm: { height: '2rem', fontSize: typography.fontSize.sm, padding: '0 0.75rem' },
      md: { height: '2.5rem', fontSize: typography.fontSize.base, padding: '0 1rem' },
      lg: { height: '3rem', fontSize: typography.fontSize.lg, padding: '0 1.5rem' },
      xl: { height: '3.5rem', fontSize: typography.fontSize.xl, padding: '0 2rem' }
    },
    variants: {
      solid: {
        background: colors.primary[500],
        color: '#ffffff',
        hover: colors.primary[600]
      },
      outline: {
        background: 'transparent',
        borderColor: colors.primary[500],
        color: colors.primary[500],
        hover: colors.primary[50]
      },
      ghost: {
        background: 'transparent',
        color: colors.primary[500],
        hover: colors.primary[50]
      },
      link: {
        background: 'transparent',
        color: colors.primary[500],
        textDecoration: 'underline'
      }
    }
  },
  
  card: {
    background: '#ffffff',
    borderRadius: borderRadius.xl,
    shadow: shadows.md,
    padding: spacing[6]
  },
  
  input: {
    height: '2.5rem',
    borderRadius: borderRadius.md,
    borderColor: colors.neutral[300],
    focusBorderColor: colors.primary[500],
    fontSize: typography.fontSize.base,
    padding: `0 ${spacing[3]}`
  },
  
  modal: {
    overlay: 'rgba(0, 0, 0, 0.5)',
    background: '#ffffff',
    borderRadius: borderRadius['2xl'],
    shadow: shadows['2xl'],
    maxWidth: '32rem'
  },
  
  toast: {
    borderRadius: borderRadius.lg,
    shadow: shadows.lg,
    padding: `${spacing[3]} ${spacing[4]}`
  }
};

// Animation keyframes
export const keyframes = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 }
  },
  slideInUp: {
    from: { transform: 'translateY(100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 }
  },
  slideInDown: {
    from: { transform: 'translateY(-100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 }
  },
  slideInLeft: {
    from: { transform: 'translateX(-100%)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 }
  },
  slideInRight: {
    from: { transform: 'translateX(100%)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 }
  },
  scaleIn: {
    from: { transform: 'scale(0.9)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 }
  },
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 }
  },
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' }
  },
  bounce: {
    '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
    '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' }
  },
  shimmer: {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' }
  }
};

// CSS custom properties generator
export function generateCSSVariables(theme = darkTheme) {
  const vars = {
    // Colors
    '--color-primary-50': colors.primary[50],
    '--color-primary-100': colors.primary[100],
    '--color-primary-200': colors.primary[200],
    '--color-primary-300': colors.primary[300],
    '--color-primary-400': colors.primary[400],
    '--color-primary-500': colors.primary[500],
    '--color-primary-600': colors.primary[600],
    '--color-primary-700': colors.primary[700],
    '--color-primary-800': colors.primary[800],
    '--color-primary-900': colors.primary[900],
    
    '--color-secondary-500': colors.secondary[500],
    '--color-secondary-600': colors.secondary[600],
    
    '--color-success': colors.success.main,
    '--color-warning': colors.warning.main,
    '--color-error': colors.error.main,
    '--color-info': colors.info.main,
    
    // Theme-specific
    '--bg-primary': theme.colors.background.primary,
    '--bg-secondary': theme.colors.background.secondary,
    '--bg-tertiary': theme.colors.background.tertiary,
    '--text-primary': theme.colors.text.primary,
    '--text-secondary': theme.colors.text.secondary,
    '--text-tertiary': theme.colors.text.tertiary,
    '--border-primary': theme.colors.border.primary,
    '--border-secondary': theme.colors.border.secondary,
    '--surface-primary': theme.colors.surface.primary,
    '--surface-elevated': theme.colors.surface.elevated,
    
    // Typography
    '--font-sans': typography.fontFamily.sans,
    '--font-mono': typography.fontFamily.mono,
    '--font-display': typography.fontFamily.display,
    
    // Shadows
    '--shadow-sm': shadows.sm,
    '--shadow-md': shadows.md,
    '--shadow-lg': shadows.lg,
    '--shadow-xl': shadows.xl,
    
    // Transitions
    '--transition-fast': transitions.duration.fast,
    '--transition-normal': transitions.duration.normal,
    '--transition-slow': transitions.duration.slow,
    '--ease-smooth': transitions.timing.smooth
  };
  
  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');
}

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  lightTheme,
  darkTheme,
  components,
  keyframes,
  generateCSSVariables
};
