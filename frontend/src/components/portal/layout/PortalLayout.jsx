import Header from '../navigation/Header';
import PortalSidebar from '../navigation/PortalSidebar';
import Footer from './Footer';

const PortalLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-city-950">
      <Header />
      <PortalSidebar />
      {/* Padding-top pour compenser le header fixe (hauteur approximative du header) */}
      <main className="flex-grow pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PortalLayout;
