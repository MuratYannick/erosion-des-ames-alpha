const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'seeders', 'prod', '009-prod-posts.js');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const newLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Skip lines that are just "id: N,"
  if (/^\s+id: \d+,\s*$/.test(line)) {
    continue;
  }

  // Add dynamic lookups right after "const now = new Date();"
  if (line.includes('const now = new Date();')) {
    newLines.push(line);
    newLines.push('');
    newLines.push('    // Dynamic lookups for foreign keys');
    newLines.push('    const [topics] = await queryInterface.sequelize.query(');
    newLines.push('      `SELECT id, slug FROM topics WHERE slug IN (\'bienvenue-sur-erosion-des-ames\', \'reglement-du-forum\', \'cgu\', \'hey-toi-qui-es-tu\')`');
    newLines.push('    );');
    newLines.push('');
    newLines.push('    const topicIdBySlug = {};');
    newLines.push('    topics.forEach(topic => {');
    newLines.push('      topicIdBySlug[topic.slug] = topic.id;');
    newLines.push('    });');
    newLines.push('');
    newLines.push('    const [users] = await queryInterface.sequelize.query(');
    newLines.push('      `SELECT id, user_name FROM users WHERE user_name = \'l\\\\\'équipe de développement\'`');
    newLines.push('    );');
    newLines.push('');
    newLines.push('    const devUserId = users[0].id;');
    newLines.push('');
    continue;
  }

  // Replace topic_id values with slug-based lookups
  let modifiedLine = line
    .replace(/topic_id: 1,/, "topic_id: topicIdBySlug['bienvenue-sur-erosion-des-ames'],")
    .replace(/topic_id: 2,/, "topic_id: topicIdBySlug['reglement-du-forum'],")
    .replace(/topic_id: 3,/, "topic_id: topicIdBySlug['cgu'],")
    .replace(/topic_id: 4,/, "topic_id: topicIdBySlug['hey-toi-qui-es-tu'],");

  // Replace author_user_id: 1 with dynamic lookup
  modifiedLine = modifiedLine.replace(/author_user_id: 1,/, 'author_user_id: devUserId,');

  newLines.push(modifiedLine);
}

// Write the new content
fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');

console.log('✓ Removed all 4 forced ID fields from posts seeder');
console.log('✓ Added dynamic lookups for topics and users');
console.log('✓ Replaced all hardcoded foreign key IDs with dynamic lookups');
