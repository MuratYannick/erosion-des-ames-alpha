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

async function seedInit() {
  try {
    console.log('🌱 Initialisation des seeders en mode prod...\n');

    // 1. Vider toutes les tables
    console.log('Étape 1/2: Suppression des données existantes...');
    await runCommand('node', ['src/scripts/seedUndoAll.js']);

    // 2. Exécuter les seeders de production
    console.log('\nÉtape 2/2: Exécution des seeders de production...');
    await runCommand('node', ['src/scripts/seedProd.js']);

    console.log('\n✨ Initialisation terminée avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

seedInit();
