import Header from '../navigation/Header';
import Footer from './Footer';

const PortalLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-city-950">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PortalLayout;
