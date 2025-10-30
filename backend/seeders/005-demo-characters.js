'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('characters', [
      // Personnages joueurs (PJ) liés aux users
      {
        id: 1,
        name: 'Arathorn le Preux',
        user_id: 1, // admin
        ethnie_id: 1, // Humain
        faction_id: 1, // Royaume de Lumière
        clan_id: 1, // Chevaliers de l'Aube
        is_dead: false,
        description: 'Chevalier valeureux défendant les faibles et les opprimés.',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 2,
        name: 'Elendil le Sage',
        user_id: 2, // testuser
        ethnie_id: 2, // Elfe
        faction_id: 4, // Gardiens de la Forêt
        clan_id: 5, // Gardes-Feuilles
        is_dead: false,
        description: 'Ranger elfe gardant les frontières de la forêt ancestrale.',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 3,
        name: 'Gimli Pieddur',
        user_id: 3, // player1
        ethnie_id: 3, // Nain
        faction_id: null, // Pas de faction
        clan_id: 6, // Forgerons de Pierre
        is_dead: false,
        description: 'Forgeron nain renommé pour ses armes légendaires.',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 4,
        name: 'Shadowblade',
        user_id: 2, // testuser (second personnage)
        ethnie_id: 1, // Humain
        faction_id: 2, // Confrérie des Ombres
        clan_id: 3, // Assassins Silencieux
        is_dead: false,
        description: 'Assassin mystérieux travaillant dans l\'ombre.',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Personnages non-joueurs (PNJ)
      {
        id: 5,
        name: 'Roi Aldric',
        user_id: null, // PNJ
        ethnie_id: 1, // Humain
        faction_id: 1, // Royaume de Lumière
        clan_id: null,
        is_dead: false,
        description: 'Roi sage et juste du Royaume de Lumière.',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 6,
        name: 'Grom le Destructeur',
        user_id: null, // PNJ
        ethnie_id: 4, // Orc
        faction_id: 3, // Horde Sauvage
        clan_id: 4, // Tribu du Crâne Brisé
        is_dead: false,
        description: 'Chef de guerre redoutable menant la Horde Sauvage.',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 7,
        name: 'Azrael le Corrompu',
        user_id: null, // PNJ
        ethnie_id: 5, // Démon
        faction_id: 5, // Légion Infernale
        clan_id: null,
        is_dead: false,
        description: 'Seigneur démon cherchant à envahir le monde mortel.',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 8,
        name: 'Marcus le Commandant',
        user_id: null, // PNJ
        ethnie_id: 1, // Humain
        faction_id: 1, // Royaume de Lumière
        clan_id: 1, // Chevaliers de l'Aube
        is_dead: false,
        description: 'Commandant des Chevaliers de l\'Aube.',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 9,
        name: 'Ancien Héros Déchu',
        user_id: null, // PNJ
        ethnie_id: 1, // Humain
        faction_id: null,
        clan_id: null,
        is_dead: true, // Personnage mort
        description: 'Héros légendaire tombé au combat il y a des années.',
        created_at: now,
        updated_at: now,
        deleted_at: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('characters', null, {});
  }
};
