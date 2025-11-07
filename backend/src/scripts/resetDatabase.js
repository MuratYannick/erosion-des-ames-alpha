require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

(async () => {
  try {
    console.log('🗑️  Suppression de toutes les tables...');

    // Désactiver les vérifications de clés étrangères
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Récupérer toutes les tables
    const [tables] = await sequelize.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${process.env.DB_NAME}'`
    );

    // Supprimer chaque table
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      console.log(`  Suppression de: ${tableName}`);
      await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\``);
    }

    // Réactiver les vérifications de clés étrangères
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✅ Toutes les tables ont été supprimées avec succès');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
})();
