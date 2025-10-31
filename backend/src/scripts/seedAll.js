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

async function runAllSeeders() {
  try {
    const queryInterface = sequelize.getQueryInterface();

    // Exécuter les seeders de production
    console.log('🌱 Exécution des seeders de production...\n');
    const prodSeedersPath = path.join(__dirname, '../../seeders/prod');
    const prodSeederFiles = (await fs.readdir(prodSeedersPath))
      .filter(file => file.endsWith('.js'))
      .sort();

    for (const file of prodSeederFiles) {
      console.log(`📦 Exécution du seeder: ${file}`);
      const seeder = require(path.join(prodSeedersPath, file));

      if (seeder.up) {
        await seeder.up(queryInterface, Sequelize);
        console.log(`✅ ${file} - Succès\n`);
      }
    }

    console.log('✨ Seeders de production terminés!\n');

    // Exécuter les seeders de développement
    console.log('🌱 Exécution des seeders de développement...\n');
    const devSeedersPath = path.join(__dirname, '../../seeders/dev');
    const devSeederFiles = (await fs.readdir(devSeedersPath))
      .filter(file => file.endsWith('.js'))
      .sort();

    for (const file of devSeederFiles) {
      console.log(`📦 Exécution du seeder: ${file}`);
      const seeder = require(path.join(devSeedersPath, file));

      if (seeder.up) {
        await seeder.up(queryInterface, Sequelize);
        console.log(`✅ ${file} - Succès\n`);
      }
    }

    console.log('✨ Tous les seeders ont été exécutés avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution des seeders:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runAllSeeders();
