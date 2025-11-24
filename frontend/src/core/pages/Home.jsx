import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <span className="text-gray-400">
          Connecté en tant que <span className="text-purple-400">{user?.username}</span>
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm"
        >
          Déconnexion
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-4">Erosion des Ames</h1>
      <p className="text-gray-400">Bienvenue, {user?.username} !</p>
      <div className="mt-8 flex gap-4">
        <a href="/forum" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
          Forum
        </a>
        <a href="/game" className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition">
          Game
        </a>
        <a
          href="/portal"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
        >
          Portal
        </a>
      </div>
    </div>
  );
};

export default Home;
