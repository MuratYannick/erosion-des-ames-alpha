#!/usr/bin/env node
/**
 * Script pour réinitialiser complètement la base de données de développement
 * Utilise resetDatabase.js puis relance les migrations et seeders dev
 */

const { spawn } = require('child_process');
const path = require('path');

const runCommand = (command, args, description) => {
  return new Promise((resolve, reject) => {
    console.log(`\n📦 ${description}...`);

    const proc = spawn(command, args, {
      cwd: path.join(__dirname, '../..'),
      stdio: 'inherit',
      shell: true
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${description} a échoué avec le code ${code}`));
      } else {
        console.log(`✅ ${description} terminé`);
        resolve();
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
};

(async () => {
  try {
    console.log('🔄 Réinitialisation de la base de données de développement...\n');

    // Étape 1: Supprimer toutes les tables
    await runCommand('node', ['src/scripts/resetDatabase.js'], 'Suppression de toutes les tables');

    // Étape 2: Relancer les migrations
    await runCommand('npm', ['run', 'db:migrate'], 'Exécution des migrations');

    // Étape 3: Lancer tous les seeders (prod + dev)
    await runCommand('npm', ['run', 'db:seed:all'], 'Exécution de tous les seeders (prod + dev)');

    console.log('\n✅ Base de données de développement réinitialisée avec succès!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur lors de la réinitialisation:', error.message);
    process.exit(1);
  }
})();
