const { sequelize } = require('../config/database');

async function showUsersTable() {
  try {
    // Afficher la structure
    const [structure] = await sequelize.query('DESCRIBE users');
    console.log('\n=== Structure de la table users ===');
    console.table(structure);

    // Afficher les index
    const [indexes] = await sequelize.query('SHOW INDEX FROM users');
    console.log('\n=== Index de la table users ===');
    indexes.forEach(idx => {
      const unique = idx.Non_unique === 0 ? '(UNIQUE)' : '';
      console.log(`- ${idx.Column_name}: ${idx.Key_name} ${unique}`);
    });

    await sequelize.close();
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

showUsersTable();
