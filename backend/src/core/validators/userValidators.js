/**
 * Validateurs personnalisés pour le modèle User
 */

/**
 * Valide le format du username
 * Règles:
 * - 8 caractères minimum
 * - Caractères autorisés: lettres (a-z, A-Z), sensible à la casse
 * - Caractères spéciaux autorisés: tiret (-), espace ( ), apostrophe (')
 * - Caractères spéciaux: pas en début, pas en fin, pas consécutifs, uniquement entre lettres
 */
const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return { isValid: false, message: "Le nom d'utilisateur est requis" };
  }

  if (username.length < 8) {
    return { isValid: false, message: "Le nom d'utilisateur doit contenir au moins 8 caractères" };
  }

  if (username.length > 50) {
    return { isValid: false, message: "Le nom d'utilisateur ne peut pas dépasser 50 caractères" };
  }

  // Caractères autorisés: lettres + tiret, espace, apostrophe
  const allowedPattern = /^[a-zA-Z-' ]+$/;
  if (!allowedPattern.test(username)) {
    return {
      isValid: false,
      message:
        "Le nom d'utilisateur ne peut contenir que des lettres, tirets, espaces et apostrophes",
    };
  }

  // Pas de caractère spécial en début
  if (/^[-' ]/.test(username)) {
    return {
      isValid: false,
      message: "Le nom d'utilisateur ne peut pas commencer par un caractère spécial",
    };
  }

  // Pas de caractère spécial en fin
  if (/[-' ]$/.test(username)) {
    return {
      isValid: false,
      message: "Le nom d'utilisateur ne peut pas terminer par un caractère spécial",
    };
  }

  // Pas de caractères spéciaux consécutifs
  if (/[-' ]{2,}/.test(username)) {
    return { isValid: false, message: 'Les caractères spéciaux ne peuvent pas se suivre' };
  }

  return { isValid: true, message: null };
};

/**
 * Valide le format du mot de passe
 * Règles:
 * - 8 caractères minimum
 * - Sensible à la casse
 * - Au moins 1 lettre minuscule
 * - Au moins 1 lettre majuscule
 * - Au moins 1 chiffre
 * - Au moins 1 caractère spécial (tous sauf espace)
 * - Espace interdit
 */
const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Le mot de passe est requis' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
  }

  // Espace interdit
  if (/\s/.test(password)) {
    return { isValid: false, message: "Le mot de passe ne peut pas contenir d'espaces" };
  }

  // Au moins 1 minuscule
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Le mot de passe doit contenir au moins une lettre minuscule',
    };
  }

  // Au moins 1 majuscule
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Le mot de passe doit contenir au moins une lettre majuscule',
    };
  }

  // Au moins 1 chiffre
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins un chiffre' };
  }

  // Au moins 1 caractère spécial (tout sauf lettres, chiffres et espace)
  if (!/[^a-zA-Z0-9\s]/.test(password)) {
    return {
      isValid: false,
      message: 'Le mot de passe doit contenir au moins un caractère spécial',
    };
  }

  return { isValid: true, message: null };
};

/**
 * Valide le format de l'email
 */
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: "L'email est requis" };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { isValid: false, message: "Le format de l'email est invalide" };
  }

  if (email.length > 255) {
    return { isValid: false, message: "L'email ne peut pas dépasser 255 caractères" };
  }

  return { isValid: true, message: null };
};

module.exports = {
  validateUsername,
  validatePassword,
  validateEmail,
};
