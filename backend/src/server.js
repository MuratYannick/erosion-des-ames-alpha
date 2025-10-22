const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger en développement
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Routes
app.use('/api', routes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'API Érosion des Âmes - Alpha',
    version: '0.1.0',
    endpoints: {
      health: '/api/health'
    }
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trouvée'
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erreur serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    // Test de connexion à la base de données
    await testConnection();

    // Synchronisation des modèles (à utiliser en développement uniquement)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✓ Modèles synchronisés avec la base de données');
    }

    // Démarrage du serveur Express
    app.listen(PORT, () => {
      console.log(`\n✓ Serveur démarré sur http://localhost:${PORT}`);
      console.log(`✓ Environnement: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('✗ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();
