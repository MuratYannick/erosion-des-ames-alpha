const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

/**
 * Hache un mot de passe
 * @param {string} password - Le mot de passe en clair
 * @returns {Promise<string>} Le mot de passe haché
 */
const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error('Erreur lors du hashage du mot de passe');
  }
};

/**
 * Compare un mot de passe en clair avec un hash
 * @param {string} password - Le mot de passe en clair
 * @param {string} hash - Le hash à comparer
 * @returns {Promise<boolean>} True si les mots de passe correspondent
 */
const comparePassword = async (password, hash) => {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (error) {
    throw new Error('Erreur lors de la comparaison des mots de passe');
  }
};

module.exports = {
  hashPassword,
  comparePassword
};
