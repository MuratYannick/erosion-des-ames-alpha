'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ajouter la contrainte de clé étrangère pour factions.main_clan_id
    await queryInterface.addConstraint('factions', {
      fields: ['main_clan_id'],
      type: 'foreign key',
      name: 'fk_factions_main_clan',
      references: {
        table: 'clans',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Ajouter un index sur main_clan_id pour optimiser les jointures
    await queryInterface.addIndex('factions', ['main_clan_id'], {
      name: 'idx_factions_main_clan'
    });

    // Ajouter la contrainte de clé étrangère pour clans.leader_character_id
    await queryInterface.addConstraint('clans', {
      fields: ['leader_character_id'],
      type: 'foreign key',
      name: 'fk_clans_leader_character',
      references: {
        table: 'characters',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Ajouter un index sur leader_character_id pour optimiser les jointures
    await queryInterface.addIndex('clans', ['leader_character_id'], {
      name: 'idx_clans_leader_character'
    });
  },

  async down(queryInterface, Sequelize) {
    // IMPORTANT : Supprimer les contraintes FK AVANT les index
    await queryInterface.removeConstraint('clans', 'fk_clans_leader_character');
    await queryInterface.removeConstraint('factions', 'fk_factions_main_clan');

    // Ensuite supprimer les index
    await queryInterface.removeIndex('clans', 'idx_clans_leader_character');
    await queryInterface.removeIndex('factions', 'idx_factions_main_clan');
  }
};
