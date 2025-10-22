const { sequelize, testConnection } = require('../config/database');

/**
 * Script de test de connexion à la base de données
 */
async function runTest() {
  console.log('\n================================');
  console.log('Test de connexion à la base de données');
  console.log('================================\n');

  try {
    // Test de connexion
    await testConnection();

    // Vérifier la version de MySQL
    const [results] = await sequelize.query('SELECT VERSION() as version');
    console.log(`Version MySQL: ${results[0].version}`);

    // Lister les tables
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log(`\nNombre de tables: ${tables.length}`);

    if (tables.length > 0) {
      console.log('\nTables existantes:');
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`  - ${tableName}`);
      });
    }

    // Vérifier la table users si elle existe
    if (tables.some(t => Object.values(t)[0] === 'users')) {
      const [users] = await sequelize.query('SELECT COUNT(*) as count FROM users');
      console.log(`\nNombre d'utilisateurs dans la table users: ${users[0].count}`);
    }

    console.log('\n✓ Test de connexion réussi!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Erreur lors du test de connexion:');
    console.error(error.message);
    console.error('\nVérifiez que:');
    console.error('1. MySQL est installé et démarré');
    console.error('2. La base de données existe (créez-la avec: CREATE DATABASE erosion_des_ames;)');
    console.error('3. Les informations de connexion dans .env sont correctes\n');
    process.exit(1);
  }
}

runTest();
