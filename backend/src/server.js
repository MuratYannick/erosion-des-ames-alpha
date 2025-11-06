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

    // NOTE: sequelize.sync() désactivé - utiliser les migrations à la place
    // La synchronisation automatique causait des ALTER TABLE non désirés
    // Décommenter uniquement si nécessaire pour le développement initial
    // if (process.env.NODE_ENV === 'development') {
    //   await sequelize.sync({ alter: true });
    //   console.log('✓ Modèles synchronisés avec la base de données');
    // }

    // Démarrage du serveur Express
    const server = app.listen(PORT, () => {
      console.log(`\n✓ Serveur démarré sur http://localhost:${PORT}`);
      console.log(`✓ Environnement: ${process.env.NODE_ENV || 'development'}\n`);
    });

    // Gestion des erreurs du serveur
    server.on('error', (err) => {
      console.error('✗ Erreur du serveur:', err);
      process.exit(1);
    });

    // Gestion propre de l'arrêt du serveur
    process.on('SIGTERM', () => {
      console.log('\n✓ Signal SIGTERM reçu, arrêt du serveur...');
      server.close(() => {
        console.log('✓ Serveur fermé proprement');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n✓ Signal SIGINT reçu, arrêt du serveur...');
      server.close(() => {
        console.log('✓ Serveur fermé proprement');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('✗ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();
