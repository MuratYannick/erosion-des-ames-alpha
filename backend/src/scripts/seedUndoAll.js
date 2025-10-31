const { Sequelize } = require('sequelize');
const path = require('path');
const config = require('../config/config.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: console.log
  }
);

async function undoAllSeeders() {
  try {
    console.log('🗑️  Suppression de toutes les données des seeders...\n');

    const queryInterface = sequelize.getQueryInterface();

    // Liste des tables dans l'ordre inverse de dépendance
    const tables = [
      'posts',
      'topics',
      'sections',
      'categories',
      'characters',
      'users',
      'clans',
      'factions',
      'ethnies'
    ];

    for (const table of tables) {
      console.log(`🗑️  Vidage de la table: ${table}`);
      await queryInterface.bulkDelete(table, null, {});
      console.log(`✅ ${table} - Vidée\n`);
    }

    console.log('✨ Toutes les données des seeders ont été supprimées!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression des données:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

undoAllSeeders();
