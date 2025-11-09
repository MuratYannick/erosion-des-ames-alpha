import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  // Rediriger vers login si non authentifié (après le chargement initial)
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Érosion des Âmes</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Bienvenue, {user.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Tableau de bord</h2>
          <p className="text-xl text-gray-400 mb-8">Version Alpha</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Profil</h3>
              <p className="text-gray-400">Email : {user.email}</p>
              <p className="text-gray-400">Rôle : {user.role}</p>
              <p className="text-gray-400">ID : {user.id}</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Navigation</h3>
              <Link to="/forum" className="text-blue-400 hover:text-blue-300 block">
                Accéder au forum
              </Link>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Progression</h3>
              <p className="text-gray-400">À venir...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
