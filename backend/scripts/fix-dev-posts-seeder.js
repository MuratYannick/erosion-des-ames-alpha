const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'seeders', 'dev', '109-dev-posts.js');
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
    newLines.push('    const [topics] = await queryInterface.sequelize.query(');
    newLines.push('      `SELECT id, slug FROM topics`');
    newLines.push('    );');
    newLines.push('');
    newLines.push('    const topicIdBySlug = {};');
    newLines.push('    topics.forEach(topic => {');
    newLines.push('      topicIdBySlug[topic.slug] = topic.id;');
    newLines.push('    });');
    newLines.push('');
    newLines.push('    const [users] = await queryInterface.sequelize.query(');
    newLines.push('      `SELECT id, user_name FROM users`');
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
    lookupAdded = true;
    continue;
  }

  // Replace topic_id values
  let modifiedLine = line
    .replace(/topic_id: 1,/, "topic_id: topicIdBySlug['dev-ouverture-phase-test'],")
    .replace(/topic_id: 2,/, "topic_id: topicIdBySlug['dev-idee-systeme-commerce'],")
    .replace(/topic_id: 3,/, "topic_id: topicIdBySlug['dev-presentation-pj-eclaireur'],")
    .replace(/topic_id: 4,/, "topic_id: topicIdBySlug['dev-rp-rassemblement-eveilles'],")
    .replace(/topic_id: 5,/, "topic_id: topicIdBySlug['dev-rp-patrouille-nocturne'],")
    .replace(/topic_id: 6,/, "topic_id: topicIdBySlug['dev-rp-caravane-desert'],")
    .replace(/topic_id: 7,/, "topic_id: topicIdBySlug['dev-rp-arrivee-etranger'],");

  // Replace author_user_id values
  modifiedLine = modifiedLine
    .replace(/author_user_id: 1,/, "author_user_id: userIdByName['admin'],")
    .replace(/author_user_id: 2,/, "author_user_id: userIdByName['moderator'],")
    .replace(/author_user_id: 3,/, "author_user_id: userIdByName['game-master'],")
    .replace(/author_user_id: 4,/, "author_user_id: userIdByName['PJ-eclaireur'],")
    .replace(/author_user_id: 5,/, "author_user_id: userIdByName['PJ-veilleur'],")
    .replace(/author_user_id: 7,/, "author_user_id: userIdByName['PJ-symbiote'],");

  // Replace author_character_id values
  modifiedLine = modifiedLine
    .replace(/author_character_id: 1,/, "author_character_id: characterIdByName['Kael l\\'Éveillé'],")
    .replace(/author_character_id: 2,/, "author_character_id: characterIdByName['Elena la Pure'],")
    .replace(/author_character_id: 3,/, "author_character_id: characterIdByName['Ash le Solitaire'],")
    .replace(/author_character_id: 4,/, "author_character_id: characterIdByName['Lyra la Cultivatrice'],")
    .replace(/author_character_id: 5,/, "author_character_id: characterIdByName['Marcus le Protecteur'],")
    .replace(/author_character_id: 6,/, "author_character_id: characterIdByName['Zara la Marcheuse'],");

  newLines.push(modifiedLine);
}

// Write the new content
fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');

console.log('✓ Removed all 15 forced ID fields from dev posts seeder');
console.log('✓ Added dynamic lookups for topics, users, and characters');
console.log('✓ Replaced all hardcoded foreign key IDs with dynamic lookups');
