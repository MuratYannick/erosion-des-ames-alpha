import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Contexte d'authentification pour gérer l'utilisateur connecté
 */
const AuthContext = createContext(null);

/**
 * Hook pour utiliser le contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

/**
 * Provider d'authentification
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Connexion
  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  // Mise à jour de l'utilisateur
  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = () => {
    return !!user;
  };

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === 'string') {
      return user.role === roles;
    }
    return roles.includes(user.role);
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Vérifier si l'utilisateur est moderator ou admin
  const isModerator = () => {
    return user?.role === 'admin' || user?.role === 'moderator';
  };

  // Vérifier si l'utilisateur peut créer une section
  // TODO: Implémenter la vérification des permissions côté serveur
  const canCreateSection = (category, section = null) => {
    if (!user) return false;

    // Admin et moderator peuvent toujours créer
    if (isModerator()) return true;

    // Si la section/catégorie est verrouillée
    const resource = section || category;
    if (resource?.is_locked) return false;

    // TODO: Vérifier les permissions spécifiques depuis l'API
    // Pour l'instant, on autorise tous les utilisateurs connectés
    return true;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    hasRole,
    isAdmin,
    isModerator,
    canCreateSection
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
