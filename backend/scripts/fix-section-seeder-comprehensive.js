const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'seeders', 'prod', '007-prod-sections.js');
let content = fs.readFileSync(filePath, 'utf8');

// Step 1: Remove ALL lines that contain "id: <number>,"
// This regex will match lines like "        id: 1," or "        id: 79,"
content = content.replace(/^(\s+)id: \d+,\s*\n/gm, '');

// Step 2: Replace category_id values
content = content.replace(/category_id: 1,/g, "category_id: categoryIdBySlug['forum-general'],");
content = content.replace(/category_id: 2,/g, "category_id: categoryIdBySlug['forum-hrp'],");
content = content.replace(/category_id: 3,/g, "category_id: categoryIdBySlug['forum-rp'],");

// Step 3: Replace faction_id values
content = content.replace(/faction_id: 1,/g, 'faction_id: factionEclaireurs.id,');
content = content.replace(/faction_id: 2,/g, 'faction_id: factionVeilleurs.id,');

// Step 4: Replace clan_id values
const clanMapping = {
  2: 'La Caste des Symbiotes',
  3: 'La Caste des Sensitifs',
  4: 'La Caste des Forgerons de Chair',
  5: 'La Caste des Sentinelles du Chaos',
  6: 'La Caste des Scrutateurs',
  8: 'Le Clan des Sentinelles',
  9: 'Le Clan des Pourvoyeurs',
  10: 'Le Clan des Archivistes',
  11: 'Le Clan des Purificateurs',
  12: 'Le Clan des Explorateurs',
  13: 'Les Veilleurs des Ruines',
  14: 'Le Peuple des Ombres',
  15: 'Les Vagabonds du Vent',
  16: 'Les Artisans du Réemploi',
  17: 'Les Frères de la Terre Brûlée',
  18: 'Le Sanctuaire du Silence',
  19: 'Les Collecteurs de Chuchotis',
  20: 'Les Semeurs d\'Espoir',
  21: 'Les Loups Solitaires',
  22: 'Les Dévoreurs d\'Âmes'
};

for (const [clanNum, clanName] of Object.entries(clanMapping)) {
  const searchPattern = new RegExp(`clan_id: ${clanNum},`, 'g');
  const replacement = `clan_id: clanIdByName['${clanName}'],`;
  content = content.replace(searchPattern, replacement);
}

// Step 5: Replace parent_section_id values with slug-based lookups
const parentMapping = {
  7: 'entree-oasis-des-transformes',
  8: 'portes-citadelle-du-renouveau',
  9: 'rumeurs-terres-abandonnees',
  13: 'eclaireurs-quartiers-clans',
  17: 'veilleurs-quartiers-clans',
  30: 'clan-veilleurs-ruines',
  31: 'clan-peuple-ombres',
  32: 'clan-vagabonds-vent',
  33: 'clan-artisans-reemploi',
  34: 'clan-freres-terre-brulee',
  35: 'clan-sanctuaire-silence',
  36: 'clan-collecteurs-chuchotis',
  37: 'clan-semeurs-espoir',
  38: 'clan-loups-solitaires',
  39: 'clan-devoreurs-ames'
};

for (const [parentId, parentSlug] of Object.entries(parentMapping)) {
  const searchPattern = new RegExp(`parent_section_id: ${parentId},`, 'g');
  const replacement = `parent_section_id: sectionIdBySlug['${parentSlug}'],`;
  content = content.replace(searchPattern, replacement);
}

// Step 6: Add dynamic lookups before the first bulkInsert
const beforeCode = `  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('sections', [`;

const afterCode = `  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Dynamic lookups for foreign keys
    const [categories] = await queryInterface.sequelize.query(
      \`SELECT id, slug FROM categories WHERE slug IN ('forum-general', 'forum-hrp', 'forum-rp')\`
    );

    const categoryIdBySlug = {};
    categories.forEach(cat => {
      categoryIdBySlug[cat.slug] = cat.id;
    });

    const [factions] = await queryInterface.sequelize.query(
      \`SELECT id, name FROM factions WHERE name IN ('Les Éclaireurs de l\\\\'Aube Nouvelle', 'Les Veilleurs de l\\\\'Ancien Monde')\`
    );

    const factionEclaireurs = factions.find(f => f.name === 'Les Éclaireurs de l\\'Aube Nouvelle');
    const factionVeilleurs = factions.find(f => f.name === 'Les Veilleurs de l\\'Ancien Monde');

    const [clans] = await queryInterface.sequelize.query(\`SELECT id, name FROM clans\`);

    const clanIdByName = {};
    clans.forEach(clan => {
      clanIdByName[clan.name] = clan.id;
    });

    // Insert parent sections first (those with parent_section_id: null)
    await queryInterface.bulkInsert('sections', [`;

content = content.replace(beforeCode, afterCode);

// Step 7: Split into two passes - find where child sections start
// Look for the comment "SOUS-SECTIONS: OASIS DES TRANSFORMÉS"
const splitPoint = `      // ==========================================
      // SOUS-SECTIONS: OASIS DES TRANSFORMÉS (Éclaireurs)
      // ==========================================`;

const splitReplacement = `    ], {});

    // Query inserted parent sections to get their IDs for child sections
    const [insertedSections] = await queryInterface.sequelize.query(
      \`SELECT id, slug FROM sections\`
    );

    const sectionIdBySlug = {};
    insertedSections.forEach(section => {
      sectionIdBySlug[section.slug] = section.id;
    });

    // ==========================================
    // SOUS-SECTIONS: OASIS DES TRANSFORMÉS (Éclaireurs)
    // ==========================================
    await queryInterface.bulkInsert('sections', [`;

content = content.replace(splitPoint, splitReplacement);

console.log('✓ Removed all id fields from section seeder');
console.log('✓ Added dynamic category, faction, and clan lookups');
console.log('✓ Converted to two-pass insertion for parent-child relationships');

// Write back
fs.writeFileSync(filePath, content, 'utf8');
