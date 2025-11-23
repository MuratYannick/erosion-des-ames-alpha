require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = require('./database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: false,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie!');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   User: ${dbConfig.username}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Impossible de se connecter à la base de données:');
    console.error(`   ${error.message}`);
    console.log('\n💡 Vérifiez que:');
    console.log('   1. MySQL est installé et en cours d\'exécution');
    console.log('   2. La base de données existe (créez-la avec: CREATE DATABASE erosion_des_ames_dev;)');
    console.log('   3. Les identifiants dans .env sont corrects');
    process.exit(1);
  }
}

testConnection();
