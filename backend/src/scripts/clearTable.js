const { sequelize } = require('../config/database');

/**
 * Script pour vider une table spécifique
 * Usage: node src/scripts/clearTable.js <table_name>
 * Exemple: node src/scripts/clearTable.js users
 */

async function clearTable() {
  const tableName = process.argv[2];

  if (!tableName) {
    console.error('❌ Erreur: Vous devez spécifier le nom de la table à vider.');
    console.log('Usage: npm run db:clear <table_name>');
    console.log('Exemple: npm run db:clear users');
    process.exit(1);
  }

  try {
    console.log(`🔄 Vérification de l'existence de la table "${tableName}"...`);

    // Vérifier si la table existe
    const [tables] = await sequelize.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?",
      { replacements: [tableName] }
    );

    if (tables.length === 0) {
      console.error(`❌ Erreur: La table "${tableName}" n'existe pas dans la base de données.`);
      process.exit(1);
    }

    console.log(`🗑️  Vidage de la table "${tableName}"...`);

    // Désactiver temporairement les contraintes de clés étrangères
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Vider la table
    await sequelize.query(`TRUNCATE TABLE ${tableName}`);

    // Réactiver les contraintes de clés étrangères
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log(`✅ Table "${tableName}" vidée avec succès!`);

  } catch (error) {
    console.error('❌ Erreur lors du vidage de la table:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

clearTable();
