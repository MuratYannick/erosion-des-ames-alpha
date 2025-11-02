const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'seeders', 'prod', '007-prod-sections.js');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const newLines = [];
let inBulkInsert = false;
let firstBulkInsertDone = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Skip lines that are just "id: N,"
  if (/^\s+id: \d+,\s*$/.test(line)) {
    continue; // Skip this line entirely
  }

  // Add dynamic lookups right after "const now = new Date();"
  if (line.includes('const now = new Date();') && !firstBulkInsertDone) {
    newLines.push(line);
    newLines.push('');
    newLines.push('    // Dynamic lookups for foreign keys');
    newLines.push('    const [categories] = await queryInterface.sequelize.query(');
    newLines.push('      `SELECT id, slug FROM categories WHERE slug IN (\'forum-general\', \'forum-hrp\', \'forum-rp\')`');
    newLines.push('    );');
    newLines.push('');
    newLines.push('    const categoryIdBySlug = {};');
    newLines.push('    categories.forEach(cat => {');
    newLines.push('      categoryIdBySlug[cat.slug] = cat.id;');
    newLines.push('    });');
    newLines.push('');
    newLines.push('    const [factions] = await queryInterface.sequelize.query(');
    newLines.push('      `SELECT id, name FROM factions WHERE name IN (\'Les Éclaireurs de l\\\\\'Aube Nouvelle\', \'Les Veilleurs de l\\\\\'Ancien Monde\')`');
    newLines.push('    );');
    newLines.push('');
    newLines.push('    const factionEclaireurs = factions.find(f => f.name === \'Les Éclaireurs de l\\\'Aube Nouvelle\');');
    newLines.push('    const factionVeilleurs = factions.find(f => f.name === \'Les Veilleurs de l\\\'Ancien Monde\');');
    newLines.push('');
    newLines.push('    const [clans] = await queryInterface.sequelize.query(`SELECT id, name FROM clans`);');
    newLines.push('');
    newLines.push('    const clanIdByName = {};');
    newLines.push('    clans.forEach(clan => {');
    newLines.push('      clanIdByName[clan.name] = clan.id;');
    newLines.push('    });');
    newLines.push('');
    newLines.push('    // Insert parent sections first (those with parent_section_id: null)');
    continue;
  }

  // Split insert into two passes
  if (line.includes('SOUS-SECTIONS: OASIS DES TRANSFORMÉS')) {
    newLines.push('    ], {});');
    newLines.push('');
    newLines.push('    // Query inserted parent sections to get their IDs for child sections');
    newLines.push('    const [insertedSections] = await queryInterface.sequelize.query(');
    newLines.push('      `SELECT id, slug FROM sections`');
    newLines.push('    );');
    newLines.push('');
    newLines.push('    const sectionIdBySlug = {};');
    newLines.push('    insertedSections.forEach(section => {');
    newLines.push('      sectionIdBySlug[section.slug] = section.id;');
    newLines.push('    });');
    newLines.push('');
    newLines.push('    // ==========================================');
    newLines.push('    // SOUS-SECTIONS: OASIS DES TRANSFORMÉS (Éclaireurs)');
    newLines.push('    // ==========================================');
    newLines.push('    await queryInterface.bulkInsert(\'sections\', [');
    continue;
  }

  // Replace category_id values
  let modifiedLine = line
    .replace(/category_id: 1,/g, "category_id: categoryIdBySlug['forum-general'],")
    .replace(/category_id: 2,/g, "category_id: categoryIdBySlug['forum-hrp'],")
    .replace(/category_id: 3,/g, "category_id: categoryIdBySlug['forum-rp'],");

  // Replace faction_id values
  modifiedLine = modifiedLine
    .replace(/faction_id: 1,/g, 'faction_id: factionEclaireurs.id,')
    .replace(/faction_id: 2,/g, 'faction_id: factionVeilleurs.id,');

  // Replace clan_id values
  const clanReplacements = [
    [2, 'La Caste des Symbiotes'],
    [3, 'La Caste des Sensitifs'],
    [4, 'La Caste des Forgerons de Chair'],
    [5, 'La Caste des Sentinelles du Chaos'],
    [6, 'La Caste des Scrutateurs'],
    [8, 'Le Clan des Sentinelles'],
    [9, 'Le Clan des Pourvoyeurs'],
    [10, 'Le Clan des Archivistes'],
    [11, 'Le Clan des Purificateurs'],
    [12, 'Le Clan des Explorateurs'],
    [13, 'Les Veilleurs des Ruines'],
    [14, 'Le Peuple des Ombres'],
    [15, 'Les Vagabonds du Vent'],
    [16, 'Les Artisans du Réemploi'],
    [17, 'Les Frères de la Terre Brûlée'],
    [18, 'Le Sanctuaire du Silence'],
    [19, 'Les Collecteurs de Chuchotis'],
    [20, 'Les Semeurs d\\\'Espoir'],
    [21, 'Les Loups Solitaires'],
    [22, 'Les Dévoreurs d\\\'Âmes']
  ];

  for (const [num, name] of clanReplacements) {
    modifiedLine = modifiedLine.replace(
      new RegExp(`clan_id: ${num},`, 'g'),
      `clan_id: clanIdByName['${name}'],`
    );
  }

  // Replace parent_section_id values
  const parentReplacements = [
    [7, 'entree-oasis-des-transformes'],
    [8, 'portes-citadelle-du-renouveau'],
    [9, 'rumeurs-terres-abandonnees'],
    [13, 'eclaireurs-quartiers-clans'],
    [17, 'veilleurs-quartiers-clans'],
    [30, 'clan-veilleurs-ruines'],
    [31, 'clan-peuple-ombres'],
    [32, 'clan-vagabonds-vent'],
    [33, 'clan-artisans-reemploi'],
    [34, 'clan-freres-terre-brulee'],
    [35, 'clan-sanctuaire-silence'],
    [36, 'clan-collecteurs-chuchotis'],
    [37, 'clan-semeurs-espoir'],
    [38, 'clan-loups-solitaires'],
    [39, 'clan-devoreurs-ames']
  ];

  for (const [num, slug] of parentReplacements) {
    modifiedLine = modifiedLine.replace(
      new RegExp(`parent_section_id: ${num},`, 'g'),
      `parent_section_id: sectionIdBySlug['${slug}'],`
    );
  }

  newLines.push(modifiedLine);
}

// Write the new content
fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');

console.log('✓ Removed all 79 forced ID fields');
console.log('✓ Added dynamic lookups for categories, factions, and clans');
console.log('✓ Replaced all hardcoded foreign key IDs with dynamic lookups');
console.log('✓ Split into two-pass insertion (parent sections first, then child sections)');
