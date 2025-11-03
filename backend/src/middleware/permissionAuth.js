/**
 * Middleware d'authentification pour la gestion des permissions
 * Seuls les admin + (moderator avec CGU, règlement et email vérifiés) peuvent gérer les permissions
 */

/**
 * Vérifie que l'utilisateur a le droit de gérer les permissions
 */
function requirePermissionAdmin(req, res, next) {
  try {
    // Récupérer l'utilisateur depuis req (mis en place par le middleware d'auth principal)
    const user = req.user;

    // Vérifier qu'un utilisateur est connecté
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise pour gérer les permissions'
      });
    }

    // Admin a tous les droits
    if (user.role === 'admin') {
      return next();
    }

    // Moderator avec conditions
    if (user.role === 'moderator') {
      // Vérifier les conditions
      if (!user.terms_accepted) {
        return res.status(403).json({
          success: false,
          message: 'Vous devez accepter les CGU pour gérer les permissions'
        });
      }

      if (!user.forum_rules_accepted) {
        return res.status(403).json({
          success: false,
          message: 'Vous devez accepter le règlement du forum pour gérer les permissions'
        });
      }

      if (!user.email_verified) {
        return res.status(403).json({
          success: false,
          message: 'Vous devez vérifier votre email pour gérer les permissions'
        });
      }

      // Toutes les conditions sont remplies
      return next();
    }

    // Autres rôles refusés
    return res.status(403).json({
      success: false,
      message: 'Seuls les administrateurs et modérateurs peuvent gérer les permissions'
    });
  } catch (error) {
    console.error('Erreur dans le middleware requirePermissionAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des droits',
      error: error.message
    });
  }
}

/**
 * Middleware mock pour les tests - simule un utilisateur admin
 * À UTILISER UNIQUEMENT EN DÉVELOPPEMENT
 */
function mockAdminUser(req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Mock auth désactivé en production'
    });
  }

  // Simuler un utilisateur admin pour les tests
  req.user = {
    id: 1,
    username: 'admin',
    role: 'admin',
    terms_accepted: true,
    forum_rules_accepted: true,
    email_verified: true
  };

  next();
}

/**
 * Middleware mock pour les tests - simule un utilisateur moderator valide
 * À UTILISER UNIQUEMENT EN DÉVELOPPEMENT
 */
function mockModeratorUser(req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Mock auth désactivé en production'
    });
  }

  // Simuler un utilisateur moderator avec toutes les conditions remplies
  req.user = {
    id: 2,
    username: 'moderator',
    role: 'moderator',
    terms_accepted: true,
    forum_rules_accepted: true,
    email_verified: true
  };

  next();
}

module.exports = {
  requirePermissionAdmin,
  mockAdminUser,
  mockModeratorUser
};
