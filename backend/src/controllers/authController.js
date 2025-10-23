const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/jwt');
const { Op } = require('sequelize');

/**
 * Inscription d'un nouvel utilisateur
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation des champs
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Tous les champs sont requis'
      });
    }

    // Validation de la longueur du mot de passe
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({
          error: 'Cet email est déjà utilisé'
        });
      }
      if (existingUser.username === username) {
        return res.status(409).json({
          error: "Ce nom d'utilisateur est déjà pris"
        });
      }
    }

    // Hasher le mot de passe
    const password_hash = await hashPassword(password);

    // Créer l'utilisateur
    const user = await User.create({
      username,
      email,
      password_hash
    });

    // Générer le token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username
    });

    // Réponse
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'inscription',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Connexion d'un utilisateur
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des champs
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email et mot de passe requis'
      });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le compte est actif
    if (!user.is_active) {
      return res.status(403).json({
        error: 'Compte désactivé'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Mettre à jour last_login
    await user.update({ last_login: new Date() });

    // Générer le token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username
    });

    // Réponse
    res.status(200).json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      error: 'Erreur lors de la connexion',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtenir les informations de l'utilisateur connecté
 */
const getMe = async (req, res) => {
  try {
    // L'utilisateur est déjà attaché à req.user par le middleware auth
    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'username', 'email', 'created_at', 'last_login']
    });

    if (!user) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      user
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du profil',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};
