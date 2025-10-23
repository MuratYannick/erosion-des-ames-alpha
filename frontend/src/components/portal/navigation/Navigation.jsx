import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ mobile = false }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Portail', path: '/' },
    { name: 'Forum', path: '/forum' },
    { name: 'Jeu', path: '/game' },
  ];

  const isActive = (path) => location.pathname === path;

  const linkClasses = (path) => {
    const baseClasses = mobile
      ? 'block px-4 py-2 rounded font-texte-corps text-lg transition-colors'
      : 'font-texte-corps text-lg transition-colors';

    if (isActive(path)) {
      return `${baseClasses} text-ochre-500 ${mobile ? 'bg-city-800' : ''}`;
    }
    return `${baseClasses} text-city-300 hover:text-ochre-400`;
  };

  return (
    <nav className={mobile ? 'flex flex-col space-y-2' : 'flex space-x-6'}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={linkClasses(item.path)}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
