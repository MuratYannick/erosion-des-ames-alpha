/**
 * Breakpoints pour le design responsive mobile-first
 * Forum - Érosion des Âmes
 */

export const breakpoints = {
  // Mobile (par défaut)
  mobile: '0px',

  // Petite tablette / grand mobile
  sm: '640px',

  // Tablette
  md: '768px',

  // Desktop
  lg: '1024px',

  // Grand desktop
  xl: '1280px',
};

/**
 * Media queries pour utilisation avec Tailwind ou styled-components
 */
export const mediaQueries = {
  mobile: `(min-width: ${breakpoints.mobile})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
};

/**
 * Hook personnalisé pour détecter le breakpoint actuel
 */
export const breakpointValues = {
  mobile: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export default breakpoints;
