/**
 * Export centralisé du module Forum
 * Permet d'importer facilement les composants, pages et services du forum
 */

// Layouts
export { default as ForumLayout } from './components/layout/ForumLayout';

// Navigation
export { default as ForumNavbar } from './components/navigation/ForumNavbar';
export { default as Breadcrumb } from './components/navigation/Breadcrumb';

// Cards
export * from './components/cards';

// Pages
export { default as CategoriesPage } from './pages/CategoriesPage';

// Services
export * from './services';

// Hooks
export { useBreakpoint, useIsMobile, useIsDesktop } from './hooks/useBreakpoint';

// Styles
export { default as forumTheme } from './styles/theme';
export { default as breakpoints } from './styles/breakpoints';
