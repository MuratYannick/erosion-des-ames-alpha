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

async function checkData() {
  try {
    const [categories] = await sequelize.query('SELECT COUNT(*) as count FROM categories');
    const [sections] = await sequelize.query('SELECT COUNT(*) as count FROM sections');
    const [topics] = await sequelize.query('SELECT COUNT(*) as count FROM topics');
    const [posts] = await sequelize.query('SELECT COUNT(*) as count FROM posts');
    const [users] = await sequelize.query('SELECT COUNT(*) as count FROM users');
    const [characters] = await sequelize.query('SELECT COUNT(*) as count FROM characters');
    const [clans] = await sequelize.query('SELECT COUNT(*) as count FROM clans');

    console.log('\n📊 Résultats du seeding:');
    console.log('========================');
    console.log(`✅ Users: ${users[0].count}`);
    console.log(`✅ Clans: ${clans[0].count}`);
    console.log(`✅ Characters: ${characters[0].count}`);
    console.log(`✅ Categories: ${categories[0].count}`);
    console.log(`✅ Sections: ${sections[0].count}`);
    console.log(`✅ Topics: ${topics[0].count}`);
    console.log(`✅ Posts: ${posts[0].count}`);
    console.log('========================\n');

    // Check some IDs to verify auto-increment worked
    const [sampleCategories] = await sequelize.query('SELECT id, name FROM categories ORDER BY id');
    console.log('📋 IDs des catégories (auto-générés):');
    sampleCategories.forEach(cat => {
      console.log(`  ID ${cat.id}: ${cat.name}`);
    });

    await sequelize.close();
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

checkData();
