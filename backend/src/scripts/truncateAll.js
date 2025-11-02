require('dotenv').config();
const { sequelize } = require('../models/User');

(async () => {
  try {
    console.log('🗑️  Vidage de toutes les tables...');

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    const tables = ['posts', 'topics', 'sections', 'categories', 'characters', 'clans', 'factions', 'ethnies', 'users'];

    for (const table of tables) {
      console.log(`  Vidage de: ${table}`);
      await sequelize.query(`TRUNCATE TABLE \`${table}\``);
    }

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✅ Toutes les tables ont été vidées');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
})();
