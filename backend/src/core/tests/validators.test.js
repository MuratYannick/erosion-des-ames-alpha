const {
  validateUsername,
  validatePassword,
  validateEmail,
} = require('../validators/userValidators');

describe('validateUsername', () => {
  describe('valid usernames', () => {
    test('accepts 8+ character alphabetic username', () => {
      expect(validateUsername('JeanPaul').isValid).toBe(true);
    });

    test('accepts username with space between letters', () => {
      expect(validateUsername('Jean Paul').isValid).toBe(true);
    });

    test('accepts username with hyphen between letters', () => {
      expect(validateUsername('Jean-Paul').isValid).toBe(true);
    });

    test('accepts username with apostrophe between letters', () => {
      expect(validateUsername("Jean'Paul").isValid).toBe(true);
    });

    test('accepts mixed special characters between letters', () => {
      expect(validateUsername("Jean-Paul D'Arc").isValid).toBe(true);
    });
  });

  describe('invalid usernames', () => {
    test('rejects username shorter than 8 characters', () => {
      const result = validateUsername('Jean');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('8 caractères');
    });

    test('rejects username starting with special character', () => {
      const result = validateUsername('-JeanPaul');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('commencer');
    });

    test('rejects username ending with special character', () => {
      const result = validateUsername('JeanPaul-');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('terminer');
    });

    test('rejects consecutive special characters', () => {
      const result = validateUsername('Jean--Paul');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('suivre');
    });

    test('rejects username with numbers', () => {
      const result = validateUsername('JeanPaul123');
      expect(result.isValid).toBe(false);
    });

    test('rejects username with invalid special characters', () => {
      const result = validateUsername('Jean@Paul');
      expect(result.isValid).toBe(false);
    });

    test('rejects null username', () => {
      const result = validateUsername(null);
      expect(result.isValid).toBe(false);
    });

    test('rejects empty username', () => {
      const result = validateUsername('');
      expect(result.isValid).toBe(false);
    });
  });
});

describe('validatePassword', () => {
  describe('valid passwords', () => {
    test('accepts password with all requirements', () => {
      expect(validatePassword('Password1!').isValid).toBe(true);
    });

    test('accepts complex password', () => {
      expect(validatePassword('MyP@ssw0rd!').isValid).toBe(true);
    });

    test('accepts password with various special characters', () => {
      expect(validatePassword('Test123#$').isValid).toBe(true);
    });
  });

  describe('invalid passwords', () => {
    test('rejects password shorter than 8 characters', () => {
      const result = validatePassword('Pass1!');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('8 caractères');
    });

    test('rejects password without lowercase', () => {
      const result = validatePassword('PASSWORD1!');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('minuscule');
    });

    test('rejects password without uppercase', () => {
      const result = validatePassword('password1!');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('majuscule');
    });

    test('rejects password without digit', () => {
      const result = validatePassword('Password!');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('chiffre');
    });

    test('rejects password without special character', () => {
      const result = validatePassword('Password1');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('spécial');
    });

    test('rejects password with space', () => {
      const result = validatePassword('Pass word1!');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('espaces');
    });

    test('rejects null password', () => {
      const result = validatePassword(null);
      expect(result.isValid).toBe(false);
    });
  });
});

describe('validateEmail', () => {
  describe('valid emails', () => {
    test('accepts standard email', () => {
      expect(validateEmail('user@example.com').isValid).toBe(true);
    });

    test('accepts email with subdomain', () => {
      expect(validateEmail('user@mail.example.com').isValid).toBe(true);
    });

    test('accepts email with plus sign', () => {
      expect(validateEmail('user+tag@example.com').isValid).toBe(true);
    });
  });

  describe('invalid emails', () => {
    test('rejects email without @', () => {
      const result = validateEmail('userexample.com');
      expect(result.isValid).toBe(false);
    });

    test('rejects email without domain', () => {
      const result = validateEmail('user@');
      expect(result.isValid).toBe(false);
    });

    test('rejects email without TLD', () => {
      const result = validateEmail('user@example');
      expect(result.isValid).toBe(false);
    });

    test('rejects null email', () => {
      const result = validateEmail(null);
      expect(result.isValid).toBe(false);
    });

    test('rejects empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
    });
  });
});
