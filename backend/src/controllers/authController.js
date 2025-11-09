const bcrypt = require('bcrypt');
const { User } = require('../models');
const { generateTokenPair, verifyRefreshToken } = require('../services/jwtService');

const SALT_ROUNDS = 10;

/**
 * Inscription d'un nouvel utilisateur
 */
async function register(req, res) {
  try {
    const { user_name, email, password } = req.body;

    // Validation des champs requis
    if (!user_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis (user_name, email, password)'
      });
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
    }

    // Validation de la force du mot de passe
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Un compte existe déjà avec cet email'
      });
    }

    // Hasher le mot de passe
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Créer l'utilisateur
    const user = await User.create({
      user_name,
      email,
      password_hash,
      role: 'player', // Rôle par défaut
      email_verified: false,
      terms_accepted: false,
      forum_rules_accepted: false
    });

    // Générer les tokens
    const { accessToken, refreshToken } = generateTokenPair(user);

    // Enregistrer le refresh token
    await user.update({ refresh_token: refreshToken });

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      user: {
        id: user.id,
        username: user.user_name,
        email: user.email,
        role: user.role,
        email_verified: user.email_verified,
        terms_accepted: user.terms_accepted,
        forum_rules_accepted: user.forum_rules_accepted
      },
      token: accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Nom d\'utilisateur ou email déjà utilisé'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du compte',
      error: error.message
    });
  }
}

/**
 * Connexion d'un utilisateur
 */
async function login(req, res) {
  try {
    const { user_name, password } = req.body;

    // Validation des champs requis
    if (!user_name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nom d\'utilisateur et mot de passe requis'
      });
    }

    // Trouver l'utilisateur par nom d'utilisateur
    const user = await User.findOne({
      where: { user_name }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Nom d\'utilisateur ou mot de passe incorrect'
      });
    }

    // Vérifier que le compte n'est pas désactivé
    if (user.deleted_at) {
      return res.status(403).json({
        success: false,
        message: 'Ce compte a été désactivé'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Nom d\'utilisateur ou mot de passe incorrect'
      });
    }

    // Générer les tokens
    const { accessToken, refreshToken } = generateTokenPair(user);

    // Enregistrer le refresh token
    await user.update({ refresh_token: refreshToken });

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: user.id,
        username: user.user_name,
        email: user.email,
        role: user.role,
        email_verified: user.email_verified,
        terms_accepted: user.terms_accepted,
        forum_rules_accepted: user.forum_rules_accepted
      },
      token: accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
}

/**
 * Rafraîchir l'access token avec un refresh token
 */
async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token requis'
      });
    }

    // Vérifier le refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Refresh token expiré. Veuillez vous reconnecter.',
          error: 'TokenExpiredError'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Refresh token invalide',
        error: error.name
      });
    }

    // Charger l'utilisateur
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier que le compte n'est pas désactivé
    if (user.deleted_at) {
      return res.status(403).json({
        success: false,
        message: 'Ce compte a été désactivé'
      });
    }

    // Vérifier que le refresh token correspond à celui stocké
    if (user.refresh_token !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token révoqué ou invalide'
      });
    }

    // Générer de nouveaux tokens
    const tokens = generateTokenPair(user);

    // Enregistrer le nouveau refresh token
    await user.update({ refresh_token: tokens.refreshToken });

    res.status(200).json({
      success: true,
      message: 'Tokens rafraîchis avec succès',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    });
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du rafraîchissement du token',
      error: error.message
    });
  }
}

/**
 * Déconnexion (révoque le refresh token)
 */
async function logout(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token requis'
      });
    }

    // Décoder le token pour trouver l'utilisateur
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      // Même si le token est expiré, on peut le révoquer
      // On ne peut pas le faire si on ne peut pas le décoder
      return res.status(400).json({
        success: false,
        message: 'Token invalide'
      });
    }

    // Révoquer le refresh token
    await User.update(
      { refresh_token: null },
      { where: { id: decoded.id, refresh_token: refreshToken } }
    );

    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la déconnexion',
      error: error.message
    });
  }
}

/**
 * Récupérer les informations de l'utilisateur connecté
 */
async function me(req, res) {
  try {
    // req.user est ajouté par le middleware authenticateToken
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: req.user.id,
        username: req.user.user_name,
        email: req.user.email,
        role: req.user.role,
        email_verified: req.user.email_verified,
        terms_accepted: req.user.terms_accepted,
        forum_rules_accepted: req.user.forum_rules_accepted,
        created_at: req.user.created_at
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  me
};
