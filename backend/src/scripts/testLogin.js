const bcrypt = require('bcrypt');
const { User } = require('../models');
const { sequelize } = require('../models');

async function testLogin() {
  try {
    console.log('🔍 Test de la fonction de login\n');

    // Lister les utilisateurs disponibles
    console.log('📋 Utilisateurs dans la base de données:');
    const users = await User.findAll({
      where: { deleted_at: null },
      attributes: ['id', 'user_name', 'email', 'role'],
      limit: 10
    });

    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé dans la base de données!');
      process.exit(1);
    }

    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Username: ${user.user_name}, Email: ${user.email}, Role: ${user.role}`);
    });

    // Tester la connexion avec le premier utilisateur
    const testUser = users[0];
    console.log(`\n🧪 Test de connexion avec: ${testUser.user_name}`);

    // Récupérer l'utilisateur complet avec le password_hash
    const fullUser = await User.findOne({
      where: { user_name: testUser.user_name }
    });

    if (!fullUser) {
      console.log('❌ Utilisateur non trouvé!');
      process.exit(1);
    }

    console.log(`✓ Utilisateur trouvé: ${fullUser.user_name}`);
    console.log(`  - Email: ${fullUser.email}`);
    console.log(`  - Role: ${fullUser.role}`);
    console.log(`  - Has password_hash: ${!!fullUser.password_hash}`);
    console.log(`  - Password hash length: ${fullUser.password_hash?.length || 0}`);

    // Tester avec un mot de passe (vous devrez ajuster selon votre cas)
    console.log('\n📝 Pour tester la connexion:');
    console.log(`   Username: ${testUser.user_name}`);
    console.log(`   Utilisez le mot de passe que vous avez défini lors de la création du compte`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await sequelize.close();
  }
}

testLogin();
