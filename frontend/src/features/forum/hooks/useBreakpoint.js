import { useState, useEffect } from 'react';
import { breakpointValues } from '../styles/breakpoints';

/**
 * Hook pour détecter le breakpoint actuel
 * Retourne le nom du breakpoint actif
 * @returns {string} 'mobile' | 'sm' | 'md' | 'lg' | 'xl'
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('mobile');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= breakpointValues.xl) {
        setBreakpoint('xl');
      } else if (width >= breakpointValues.lg) {
        setBreakpoint('lg');
      } else if (width >= breakpointValues.md) {
        setBreakpoint('md');
      } else if (width >= breakpointValues.sm) {
        setBreakpoint('sm');
      } else {
        setBreakpoint('mobile');
      }
    };

    // Appel initial
    handleResize();

    // Écoute du redimensionnement
    window.addEventListener('resize', handleResize);

    // Nettoyage
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

/**
 * Hook pour vérifier si on est sur un écran mobile/tablette
 * @returns {boolean}
 */
export const useIsMobile = () => {
  const breakpoint = useBreakpoint();
  return breakpoint === 'mobile' || breakpoint === 'sm';
};

/**
 * Hook pour vérifier si on est sur un écran desktop
 * @returns {boolean}
 */
export const useIsDesktop = () => {
  const breakpoint = useBreakpoint();
  return breakpoint === 'lg' || breakpoint === 'xl';
};

export default useBreakpoint;
