const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log,
  }
);

async function updateMigrationNames() {
  try {
    await sequelize.authenticate();
    console.log('✓ Connexion à la base de données établie');

    // Mettre à jour le nom de la migration
    await sequelize.query(`
      UPDATE SequelizeMeta
      SET name = '001-create-users.js'
      WHERE name = '20251022000000-create-users.js'
    `);

    console.log('✓ Nom de migration mis à jour : 20251022000000-create-users.js → 001-create-users.js');

    // Vérifier
    const [results] = await sequelize.query('SELECT * FROM SequelizeMeta');
    console.log('\nMigrations dans la base :');
    results.forEach(row => console.log(`  - ${row.name}`));

    await sequelize.close();
  } catch (error) {
    console.error('✗ Erreur:', error.message);
    process.exit(1);
  }
}

updateMigrationNames();
