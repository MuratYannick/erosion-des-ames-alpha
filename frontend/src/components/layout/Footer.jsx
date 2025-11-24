import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-gray-500 text-sm">
            &copy; {currentYear} <span className="text-gray-400">Erosion des Ames</span>. Tous
            droits reserves.
          </div>

          {/* Links */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/mentions-legales"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Mentions legales
            </Link>
            <Link
              to="/contact"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
