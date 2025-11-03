// Configuration globale pour les tests d'intégration

// Mock de la base de données pour éviter les vraies connexions
jest.mock('../src/config/database', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
    sync: jest.fn().mockResolvedValue(true)
  }
}));

// Augmenter le timeout pour les tests d'intégration
jest.setTimeout(10000);

// Nettoyer les mocks entre les tests
afterEach(() => {
  jest.clearAllMocks();
});
