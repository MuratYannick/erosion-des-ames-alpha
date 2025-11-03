import { Outlet } from 'react-router-dom';
import ForumNavbar from '../navigation/ForumNavbar';
import Breadcrumb from '../navigation/Breadcrumb';

/**
 * ForumLayout - Layout principal du forum
 * Contient:
 * - Navbar fixe en haut (64px)
 * - Breadcrumb sous la navbar (40px)
 * - Zone de contenu avec padding-top pour compenser la navbar fixe
 *
 * @param {Object} props
 * @param {Array} props.breadcrumbItems - Items du fil d'ariane
 * @param {React.ReactNode} props.children - Contenu de la page (optionnel, utilise Outlet si absent)
 */
const ForumLayout = ({ breadcrumbItems = [], children }) => {
  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Navbar fixe */}
      <ForumNavbar />

      {/* Breadcrumb fixe sous la navbar */}
      <div className="fixed top-16 left-0 right-0 z-40">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Zone de contenu principale avec padding-top pour navbar + breadcrumb */}
      <main className="pt-[104px]">
        {/* Container responsive */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children || <Outlet />}
        </div>
      </main>

      {/* Footer (optionnel) */}
      <footer className="bg-neutral-900 border-t border-neutral-800 py-6 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-neutral-500 text-sm">
          <p>&copy; 2025 Érosion des Âmes - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
};

export default ForumLayout;
