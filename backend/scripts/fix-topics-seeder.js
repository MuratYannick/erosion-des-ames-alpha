const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'seeders', 'prod', '008-prod-topics.js');
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
    newLines.push('    const [sections] = await queryInterface.sequelize.query(');
    newLines.push('      `SELECT id, slug FROM sections WHERE slug IN (\'annonces\', \'reglement-et-cgu\', \'campement-de-refugies\')`');
    newLines.push('    );');
    newLines.push('');
    newLines.push('    const sectionIdBySlug = {};');
    newLines.push('    sections.forEach(section => {');
    newLines.push('      sectionIdBySlug[section.slug] = section.id;');
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

  // Replace section_id values with slug-based lookups
  let modifiedLine = line
    .replace(/section_id: 1,/, "section_id: sectionIdBySlug['annonces'],")
    .replace(/section_id: 2,/, "section_id: sectionIdBySlug['reglement-et-cgu'],")
    .replace(/section_id: 4,/, "section_id: sectionIdBySlug['campement-de-refugies'],");

  // Replace author_user_id: 1 with dynamic lookup
  modifiedLine = modifiedLine.replace(/author_user_id: 1,/, 'author_user_id: devUserId,');

  newLines.push(modifiedLine);
}

// Write the new content
fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');

console.log('✓ Removed all 4 forced ID fields from topics seeder');
console.log('✓ Added dynamic lookups for sections and users');
console.log('✓ Replaced all hardcoded foreign key IDs with dynamic lookups');
