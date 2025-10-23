import PortalLayout from '../../components/portal/layout/PortalLayout';
import Hero from '../../components/portal/sections/Hero';
import About from '../../components/portal/sections/About';
import Factions from '../../components/portal/sections/Factions';
import Features from '../../components/portal/sections/Features';

const Portal = () => {
  return (
    <PortalLayout>
      <Hero />
      <About />
      <Factions />
      <Features />
    </PortalLayout>
  );
};

export default Portal;
