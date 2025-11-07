import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/forum/api';

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

  // Vérifier si le token est expiré
  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      // Décoder le JWT (partie payload)
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Vérifier l'expiration (exp est en secondes, Date.now() en millisecondes)
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return true;
    }
  };

  // Vérifier la validité du token auprès du backend
  const verifyToken = async (token) => {
    try {
      const response = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Token invalide:', error);
      return null;
    }
  };

  // Obtenir le storage approprié (localStorage ou sessionStorage)
  const getStorage = () => {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    return rememberMe ? localStorage : sessionStorage;
  };

  // Déconnexion (définie avant loadUser pour éviter les erreurs de référence)
  const logout = () => {
    // Nettoyer les deux storages
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    setUser(null);
  };

  // Connexion
  const login = (userData, token, refreshToken = null, rememberMe = false) => {
    // Stocker l'option "Se souvenir de moi"
    localStorage.setItem('rememberMe', rememberMe.toString());

    // Choisir le storage approprié
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem('user', JSON.stringify(userData));
    storage.setItem('token', token);
    if (refreshToken) {
      storage.setItem('refreshToken', refreshToken);
    }
    setUser(userData);
  };

  // Charger l'utilisateur depuis le storage au démarrage
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Essayer d'abord sessionStorage, puis localStorage
        let token = sessionStorage.getItem('token');
        let storedUser = sessionStorage.getItem('user');

        if (!token || !storedUser) {
          token = localStorage.getItem('token');
          storedUser = localStorage.getItem('user');
        }

        // Si pas de token ou de user, pas d'utilisateur connecté
        if (!token || !storedUser) {
          setLoading(false);
          return;
        }

        // Vérifier si le token est expiré côté client
        if (isTokenExpired(token)) {
          console.log('Token expiré, déconnexion...');
          logout();
          setLoading(false);
          return;
        }

        // Vérifier la validité du token auprès du backend
        const userData = await verifyToken(token);

        if (userData && userData.success) {
          // Token valide, charger l'utilisateur
          setUser(JSON.parse(storedUser));
        } else {
          // Token invalide, déconnexion
          console.log('Token invalide auprès du backend, déconnexion...');
          logout();
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
