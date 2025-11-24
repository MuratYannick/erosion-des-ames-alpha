const { body, validationResult } = require('express-validator');
const {
  validateUsername,
  validatePassword,
  validateEmail,
} = require('../validators/userValidators');

/**
 * Middleware pour gérer les erreurs de validation
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Règles de validation pour l'inscription
 */
const registerValidation = [
  body('username')
    .trim()
    .custom((value) => {
      const result = validateUsername(value);
      if (!result.isValid) {
        throw new Error(result.message);
      }
      return true;
    }),
  body('email')
    .trim()
    .toLowerCase()
    .custom((value) => {
      const result = validateEmail(value);
      if (!result.isValid) {
        throw new Error(result.message);
      }
      return true;
    }),
  body('password').custom((value) => {
    const result = validatePassword(value);
    if (!result.isValid) {
      throw new Error(result.message);
    }
    return true;
  }),
  body('cguAccepted')
    .isBoolean()
    .withMessage("L'acceptation des CGU doit être un booléen")
    .custom((value) => {
      if (value !== true) {
        throw new Error('Vous devez accepter les CGU pour vous inscrire');
      }
      return true;
    }),
  handleValidationErrors,
];

/**
 * Règles de validation pour la connexion
 */
const loginValidation = [
  body('email')
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("Le format de l'email est invalide"),
  body('password').notEmpty().withMessage('Le mot de passe est requis'),
  handleValidationErrors,
];

/**
 * Règles de validation pour le rafraîchissement du token
 */
const refreshTokenValidation = [
  body('refreshToken').notEmpty().withMessage('Le token de rafraîchissement est requis'),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  refreshTokenValidation,
};
