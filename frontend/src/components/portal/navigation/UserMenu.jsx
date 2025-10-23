import { Link } from 'react-router-dom';
import { storage } from '../../../utils/localStorage';

const UserMenu = ({ mobile = false }) => {
  const token = storage.getToken();
  const user = storage.getUser();

  const handleLogout = () => {
    storage.clear();
    window.location.href = '/';
  };

  if (token && user) {
    // Utilisateur connecté
    return (
      <div className={mobile ? 'flex flex-col space-y-2' : 'flex items-center space-x-4'}>
        <span className={`font-texte-corps ${mobile ? 'px-4 py-2 text-lg' : 'text-base'} text-nature-500`}>
          {user.username}
        </span>
        <button
          onClick={handleLogout}
          className={`${
            mobile ? 'text-left px-4 py-2' : 'px-4 py-2'
          } font-texte-corps text-base bg-blood-700 hover:bg-blood-600 text-white rounded transition-colors`}
        >
          Déconnexion
        </button>
      </div>
    );
  }

  // Utilisateur non connecté
  return (
    <div className={mobile ? 'flex flex-col space-y-2' : 'flex items-center space-x-4'}>
      <Link
        to="/login"
        className={`${
          mobile ? 'text-center px-4 py-2' : 'px-4 py-2'
        } font-texte-corps text-base bg-city-700 hover:bg-city-600 text-ochre-400 rounded transition-colors`}
      >
        Connexion
      </Link>
      <Link
        to="/register"
        className={`${
          mobile ? 'text-center px-4 py-2' : 'px-4 py-2'
        } font-texte-corps text-base bg-ochre-600 hover:bg-ochre-500 text-white rounded transition-colors`}
      >
        Inscription
      </Link>
    </div>
  );
};

export default UserMenu;
