/**
 * Thème post-apocalyptique pour le Forum
 * Érosion des Âmes
 */

export const forumTheme = {
  // Palette de couleurs post-apocalyptique
  colors: {
    // Couleurs principales
    city: {
      50: '#f5f3f0',
      100: '#e6e1d9',
      200: '#d1c7b8',
      300: '#b8a890',
      400: '#a08d6f',
      500: '#8b7355',
      600: '#6f5c46',
      700: '#594a3a',
      800: '#443830',
      900: '#352d26',
    },
    ochre: {
      50: '#fef8ed',
      100: '#fcefd5',
      200: '#f8dcaa',
      300: '#f4c474',
      400: '#f0a63c',
      500: '#ec8e16',
      600: '#d77310',
      700: '#b35710',
      800: '#904514',
      900: '#753b14',
    },
    nature: {
      50: '#f2f7f3',
      100: '#e0ebe2',
      200: '#c2d7c7',
      300: '#9abda3',
      400: '#6e9d7b',
      500: '#4f8159',
      600: '#3c6645',
      700: '#315238',
      800: '#29422f',
      900: '#223727',
    },
    mutant: {
      50: '#f0f9f4',
      100: '#dcf0e3',
      200: '#bae0cb',
      300: '#8bc9ab',
      400: '#58ab85',
      500: '#369068',
      600: '#257352',
      700: '#1e5c43',
      800: '#1a4a37',
      900: '#163d2e',
    },
    pure: {
      50: '#f0f7fb',
      100: '#e0edf5',
      200: '#c9e0ee',
      300: '#a4cce3',
      400: '#79b0d4',
      500: '#5894c7',
      600: '#4578b9',
      700: '#3a62a6',
      800: '#345389',
      900: '#2e466e',
    },
    blood: {
      50: '#fef2f2',
      100: '#fde3e3',
      200: '#fccccc',
      300: '#f9a8a8',
      400: '#f47474',
      500: '#ea4747',
      600: '#d62929',
      700: '#b31f1f',
      800: '#941d1d',
      900: '#7b1e1e',
    },
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },

  // Espacements
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  // Typographie
  typography: {
    fonts: {
      title: "'Metal Mania', cursive",      // Titre du jeu
      heading: "'Permanent Marker', cursive", // Titres sections
      body: "'system-ui', sans-serif",       // Texte courant
      mono: "'Courier New', monospace",      // Code/dates
    },
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Ombres
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Bordures
  borders: {
    radius: {
      none: '0',
      sm: '0.125rem',  // 2px
      base: '0.25rem', // 4px
      md: '0.375rem',  // 6px
      lg: '0.5rem',    // 8px
      xl: '0.75rem',   // 12px
      full: '9999px',
    },
    width: {
      thin: '1px',
      base: '2px',
      thick: '4px',
    },
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },

  // Hauteur navbar
  navbar: {
    height: '4rem', // 64px
    breadcrumb: '2.5rem', // 40px
    total: '6.5rem', // 104px (navbar + breadcrumb)
  },
};

export default forumTheme;
