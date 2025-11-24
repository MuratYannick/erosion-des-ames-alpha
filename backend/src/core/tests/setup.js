// Set test environment before loading dotenv
process.env.NODE_ENV = 'test';

require('dotenv').config();

// Désactiver les logs pendant les tests
console.log = jest.fn();
console.error = jest.fn();
