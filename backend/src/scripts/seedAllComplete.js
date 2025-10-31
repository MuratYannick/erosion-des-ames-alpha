const { spawn } = require('child_process');
const path = require('path');

async function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd: path.join(__dirname, '../..'),
      shell: true,
      stdio: 'inherit'
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

async function seedAllComplete() {
  try {
    console.log('🌱 Initialisation complète de tous les seeders...\n');

    // 1. Vider toutes les tables
    console.log('Étape 1/3: Suppression des données existantes...');
    await runCommand('node', ['src/scripts/seedUndoAll.js']);

    // 2. Exécuter les seeders de production
    console.log('\nÉtape 2/3: Exécution des seeders de production...');
    await runCommand('node', ['src/scripts/seedProd.js']);

    // 3. Exécuter les seeders de développement
    console.log('\nÉtape 3/3: Exécution des seeders de développement...');
    await runCommand('node', ['src/scripts/seedDev.js']);

    console.log('\n✨ Initialisation complète terminée avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

seedAllComplete();
