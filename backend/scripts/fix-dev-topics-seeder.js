const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'seeders', 'dev', '108-dev-topics.js');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const newLines = [];
let lookupAdded = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Skip lines that are just "id: N,"
  if (/^\s+id: \d+,\s*$/.test(line)) {
    continue;
  }

  // Add dynamic lookups right after date variable declarations
  if (line.includes('const twoDaysAgo') && !lookupAdded) {
    newLines.push(line);
    newLines.push('');
    newLines.push('    // Dynamic lookups for foreign keys');
    newLines.push('    const [sections] = await queryInterface.sequelize.query(');
    newLines.push('      `SELECT id, slug FROM sections`');
    newLines.push('    );');
    newLines.push('');
    newLines.push('    const sectionIdBySlug = {};');
    newLines.push('    sections.forEach(section => {');
    newLines.push('      sectionIdBySlug[section.slug] = section.id;');
    newLines.push('    });');
    newLines.push('');
    newLines.push('    const [users] = await queryInterface.sequelize.query(');
    newLines.push('      `SELECT id, user_name FROM users WHERE user_name IN (\'admin\', \'moderator\', \'PJ-eclaireur\')`');
    newLines.push('    );');
    newLines.push('');
    newLines.push('    const userIdByName = {};');
    newLines.push('    users.forEach(user => {');
    newLines.push('      userIdByName[user.user_name] = user.id;');
    newLines.push('    });');
    newLines.push('');
    newLines.push('    const [characters] = await queryInterface.sequelize.query(');
    newLines.push('      `SELECT id, name FROM characters`');
    newLines.push('    );');
    newLines.push('');
    newLines.push('    const characterIdByName = {};');
    newLines.push('    characters.forEach(char => {');
    newLines.push('      characterIdByName[char.name] = char.id;');
    newLines.push('    });');
    newLines.push('');
    newLines.push('    const [factions] = await queryInterface.sequelize.query(');
    newLines.push('      `SELECT id, name FROM factions`');
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
    lookupAdded = true;
    continue;
  }

  // Replace section_id values
  let modifiedLine = line
    .replace(/section_id: 1,/, "section_id: sectionIdBySlug['annonces'],")
    .replace(/section_id: 4,/, "section_id: sectionIdBySlug['campement-de-refugies'],")
    .replace(/section_id: 5,/, "section_id: sectionIdBySlug['autour-du-jeu'],")
    .replace(/section_id: 7,/, "section_id: sectionIdBySlug['entree-oasis-des-transformes'],")
    .replace(/section_id: 9,/, "section_id: sectionIdBySlug['rumeurs-terres-abandonnees'],")
    .replace(/section_id: 11,/, "section_id: sectionIdBySlug['eclaireurs-place-centrale'],")
    .replace(/section_id: 15,/, "section_id: sectionIdBySlug['veilleurs-hall-principal'],");

  // Replace author_user_id values
  modifiedLine = modifiedLine
    .replace(/author_user_id: 1,/, "author_user_id: userIdByName['admin'],")
    .replace(/author_user_id: 2,/, "author_user_id: userIdByName['moderator'],")
    .replace(/author_user_id: 4,/, "author_user_id: userIdByName['PJ-eclaireur'],");

  // Replace author_character_id values
  modifiedLine = modifiedLine
    .replace(/author_character_id: 1,/, "author_character_id: characterIdByName['Kael l\\'Éveillé'],")
    .replace(/author_character_id: 3,/, "author_character_id: characterIdByName['Ash le Solitaire'],")
    .replace(/author_character_id: 5,/, "author_character_id: characterIdByName['Marcus le Protecteur'],")
    .replace(/author_character_id: 6,/, "author_character_id: characterIdByName['Zara la Marcheuse'],");

  // Replace faction_id values
  modifiedLine = modifiedLine
    .replace(/faction_id: 1,/, 'faction_id: factionEclaireurs.id,')
    .replace(/faction_id: 2,/, 'faction_id: factionVeilleurs.id,');

  // Replace clan_id values
  modifiedLine = modifiedLine
    .replace(/clan_id: 8,/, "clan_id: clanIdByName['Le Clan des Sentinelles'],")
    .replace(/clan_id: 15,/, "clan_id: clanIdByName['Les Vagabonds du Vent'],");

  newLines.push(modifiedLine);
}

// Write the new content
fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');

console.log('✓ Removed all 7 forced ID fields from dev topics seeder');
console.log('✓ Added dynamic lookups for sections, users, characters, factions, and clans');
console.log('✓ Replaced all hardcoded foreign key IDs with dynamic lookups');
