const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs').promises;
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

async function runSeedersProd() {
  try {
    console.log('🌱 Exécution des seeders de production...\n');

    const seedersPath = path.join(__dirname, '../../seeders/prod');
    const seederFiles = (await fs.readdir(seedersPath))
      .filter(file => file.endsWith('.js'))
      .sort();

    const queryInterface = sequelize.getQueryInterface();

    for (const file of seederFiles) {
      console.log(`📦 Exécution du seeder: ${file}`);
      const seeder = require(path.join(seedersPath, file));

      if (seeder.up) {
        await seeder.up(queryInterface, Sequelize);
        console.log(`✅ ${file} - Succès\n`);
      }
    }

    console.log('✨ Tous les seeders de production ont été exécutés avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution des seeders:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runSeedersProd();
