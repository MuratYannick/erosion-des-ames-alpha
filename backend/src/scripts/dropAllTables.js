require('dotenv').config();
const db = require('../models');

(async () => {
  try {
    console.log('🗑️  Suppression de toutes les tables...');

    // Désactiver les vérifications de clés étrangères
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Récupérer toutes les tables
    const [tables] = await db.sequelize.query('SHOW TABLES');

    // Supprimer chaque table
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`  Suppression de: ${tableName}`);
      await db.sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\``);
    }

    // Réactiver les vérifications de clés étrangères
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✅ Toutes les tables ont été supprimées avec succès');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
})();
