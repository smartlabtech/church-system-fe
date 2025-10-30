/**
 * Church System Modern Theme Configuration
 * Unified theme for the modernized church management system
 */

export const churchTheme = {
  // Core brand colors - Updated for church aesthetic
  colors: {
    primary: {
      main: '#1E40AF',    // Royal blue - trust and faith
      light: '#3B82F6',
      lighter: '#60A5FA',
      dark: '#1E3A8A',
      darker: '#1E293B'
    },
    secondary: {
      main: '#B8860B',    // Gold - divine and sacred
      light: '#DAA520',
      lighter: '#FFD700',
      dark: '#996515',
      darker: '#7C5A10'
    },
    accent: {
      main: '#059669',    // Teal green - growth and life
      light: '#10B981',
      lighter: '#34D399',
      dark: '#047857',
      darker: '#064E3B'
    },
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827'
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669'
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706'
    },
    error: {
      main: '#EF4444',
      light: '#FCA5A5',
      dark: '#DC2626'
    },
    info: {
      main: '#3B82F6',
      light: '#93C5FD',
      dark: '#2563EB'
    }
  },

  // Typography system
  typography: {
    fontFamily: {
      base: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      heading: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      arabic: '"Noto Naskh Arabic", "Traditional Arabic", "Arial", sans-serif',
      mono: '"JetBrains Mono", "Courier New", monospace'
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem'   // 60px
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
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2
    }
  },

  // Spacing system
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '3rem',      // 48px
    '2xl': '4rem',   // 64px
    '3xl': '6rem',   // 96px
    '4xl': '8rem'    // 128px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    base: '0.5rem',  // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    '2xl': '2rem',   // 32px
    full: '9999px'
  },

  // Shadows
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '2xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none'
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
    slower: '500ms ease-in-out'
  },

  // Breakpoints
  breakpoints: {
    xs: '36em',  // 576px
    sm: '48em',  // 768px
    md: '62em',  // 992px
    lg: '75em',  // 1200px
    xl: '88em'   // 1408px
  },

  // Z-index scale
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
    notification: 1700
  },

  // Gradients - Updated for church aesthetic
  gradients: {
    primary: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
    secondary: 'linear-gradient(135deg, #B8860B 0%, #FFD700 100%)',
    accent: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    hero: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #BAE6FD 100%)',
    spiritual: 'linear-gradient(135deg, #1E40AF 0%, #B8860B 100%)',
    growth: 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
    warm: 'linear-gradient(135deg, #F59E0B 0%, #DC2626 100%)',
    cool: 'linear-gradient(135deg, #0EA5E9 0%, #1E40AF 100%)',
    dark: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
    holy: 'linear-gradient(135deg, #FFD700 20%, #FFFFFF 50%, #FFD700 80%)'
  }
};

// Mantine theme configuration
export const mantineThemeConfig = {
  colors: {
    // Convert our color palette to Mantine's 10-shade format
    primary: [
      '#EFF6FF', // 0 - lightest
      '#DBEAFE', // 1
      '#BFDBFE', // 2
      '#93C5FD', // 3
      '#60A5FA', // 4
      '#3B82F6', // 5 - light
      '#1E40AF', // 6 - main (royal blue)
      '#1E3A8A', // 7 - dark
      '#1E293B', // 8 - darker
      '#0F172A'  // 9 - darkest
    ],
    secondary: [
      '#FFFBEB', // 0 - lightest
      '#FEF3C7', // 1
      '#FDE68A', // 2
      '#FCD34D', // 3
      '#FFD700', // 4 - gold
      '#DAA520', // 5
      '#B8860B', // 6 - main (dark goldenrod)
      '#996515', // 7
      '#7C5A10', // 8
      '#5C4310'  // 9 - darkest
    ],
    accent: [
      '#F0FDF4', // 0
      '#DCFCE7', // 1
      '#BBF7D0', // 2
      '#86EFAC', // 3
      '#34D399', // 4
      '#10B981', // 5
      '#059669', // 6 - main (teal)
      '#047857', // 7
      '#064E3B', // 8
      '#022C22'  // 9
    ]
  },
  primaryColor: 'primary',
  primaryShade: 6,

  fontFamily: churchTheme.typography.fontFamily.base,
  fontFamilyMonospace: churchTheme.typography.fontFamily.mono,

  headings: {
    fontFamily: churchTheme.typography.fontFamily.heading,
    fontWeight: churchTheme.typography.fontWeight.bold,
    sizes: {
      h1: { fontSize: churchTheme.typography.fontSize['4xl'] },
      h2: { fontSize: churchTheme.typography.fontSize['3xl'] },
      h3: { fontSize: churchTheme.typography.fontSize['2xl'] },
      h4: { fontSize: churchTheme.typography.fontSize.xl },
      h5: { fontSize: churchTheme.typography.fontSize.lg },
      h6: { fontSize: churchTheme.typography.fontSize.base }
    }
  },

  defaultRadius: 'md',

  shadows: {
    xs: churchTheme.shadows.xs,
    sm: churchTheme.shadows.sm,
    md: churchTheme.shadows.md,
    lg: churchTheme.shadows.lg,
    xl: churchTheme.shadows.xl
  },

  other: {
    transitions: churchTheme.transitions,
    zIndex: churchTheme.zIndex,
    gradients: churchTheme.gradients
  }
};

// Component-specific styles
export const componentStyles = {
  button: {
    primary: {
      background: churchTheme.gradients.primary,
      border: 'none',
      color: 'white',
      fontWeight: churchTheme.typography.fontWeight.semibold,
      padding: `${churchTheme.spacing.sm} ${churchTheme.spacing.md}`,
      borderRadius: churchTheme.borderRadius.md,
      transition: churchTheme.transitions.base,
      boxShadow: churchTheme.shadows.sm,
      '&:hover': {
        boxShadow: churchTheme.shadows.md,
        transform: 'translateY(-2px)'
      }
    },
    secondary: {
      background: 'transparent',
      border: `2px solid ${churchTheme.colors.primary.main}`,
      color: churchTheme.colors.primary.main,
      fontWeight: churchTheme.typography.fontWeight.semibold,
      padding: `${churchTheme.spacing.sm} ${churchTheme.spacing.md}`,
      borderRadius: churchTheme.borderRadius.md,
      transition: churchTheme.transitions.base,
      '&:hover': {
        background: churchTheme.colors.primary.lighter,
        borderColor: churchTheme.colors.primary.dark
      }
    }
  },

  card: {
    default: {
      background: 'white',
      borderRadius: churchTheme.borderRadius.lg,
      boxShadow: churchTheme.shadows.sm,
      padding: churchTheme.spacing.md,
      transition: churchTheme.transitions.base,
      '&:hover': {
        boxShadow: churchTheme.shadows.md
      }
    },
    elevated: {
      background: 'white',
      borderRadius: churchTheme.borderRadius.lg,
      boxShadow: churchTheme.shadows.md,
      padding: churchTheme.spacing.lg,
      transition: churchTheme.transitions.base,
      '&:hover': {
        boxShadow: churchTheme.shadows.lg,
        transform: 'translateY(-4px)'
      }
    }
  },

  widget: {
    container: {
      background: 'white',
      borderRadius: churchTheme.borderRadius.xl,
      boxShadow: churchTheme.shadows.base,
      padding: churchTheme.spacing.lg,
      border: `1px solid ${churchTheme.colors.neutral[200]}`
    },
    stat: {
      value: {
        fontSize: churchTheme.typography.fontSize['3xl'],
        fontWeight: churchTheme.typography.fontWeight.bold,
        color: churchTheme.colors.neutral[800]
      },
      label: {
        fontSize: churchTheme.typography.fontSize.sm,
        color: churchTheme.colors.neutral[500],
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }
    }
  }
};

// Helper functions
export const getColor = (colorPath) => {
  const paths = colorPath.split('.');
  let value = churchTheme.colors;
  for (const path of paths) {
    value = value[path];
  }
  return value || colorPath;
};

export const getSpacing = (size) => {
  return churchTheme.spacing[size] || size;
};

export const getShadow = (type) => {
  return churchTheme.shadows[type] || churchTheme.shadows.base;
};

export const getGradient = (name) => {
  return churchTheme.gradients[name] || churchTheme.gradients.primary;
};

// RTL support for Arabic
export const rtlStyles = {
  direction: 'rtl',
  textAlign: 'right',
  fontFamily: churchTheme.typography.fontFamily.arabic,

  // Flip margins and paddings
  marginLeft: 'auto',
  marginRight: 0,
  paddingLeft: 0,
  paddingRight: churchTheme.spacing.md,

  // Flip borders
  borderLeft: 'none',
  borderRight: `1px solid ${churchTheme.colors.neutral[200]}`,

  // Flip transforms
  transform: 'scaleX(-1)'
};

export default churchTheme;