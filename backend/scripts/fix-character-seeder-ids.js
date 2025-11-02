const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'seeders', 'prod', '005-prod-characters.js');
let content = fs.readFileSync(filePath, 'utf8');

// Mapping of clan numbers to names
const clanMapping = {
  1: 'Les Prophètes de l\'Harmonie',
  2: 'La Caste des Symbiotes',
  3: 'La Caste des Sensitifs',
  4: 'La Caste des Forgerons de Chair',
  5: 'La Caste des Sentinelles du Chaos',
  6: 'La Caste des Scrutateurs',
  7: 'Les Élus d\'Avant',
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

// Replace all clan_id: N with dynamic lookups
for (let clanNum = 1; clanNum <= 22; clanNum++) {
  const clanName = clanMapping[clanNum];
  const searchPattern = new RegExp(`clan_id: ${clanNum},`, 'g');
  const replacement = `clan_id: clanIdByName['${clanName}'],`;
  content = content.replace(searchPattern, replacement);
}

// Remove any remaining id: characterId++, lines (shouldn't be any, but just in case)
content = content.replace(/\s+id: characterId\+\+,\n/g, '');

// Write back
fs.writeFileSync(filePath, content, 'utf8');

console.log('✓ Fixed all clan_id references in character seeder');
console.log('✓ Removed all forced id assignments');
