require('dotenv').config();
const { sequelize } = require('../models/User');

(async () => {
  try {
    console.log('🗑️  Suppression complète de toutes les tables...');

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Récupérer toutes les tables
    const [tables] = await sequelize.query('SHOW TABLES');

    // Supprimer chaque table
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`  Suppression de: ${tableName}`);
      await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\``);
    }

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✅ Toutes les tables ont été supprimées avec succès');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
})();
