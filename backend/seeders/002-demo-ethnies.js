'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ethnies', [
      {
        id: 1,
        name: 'Humains',
        description: 'Les humains sont polyvalents et adaptables. Ils dominent de nombreuses régions du monde.'
      },
      {
        id: 2,
        name: 'Elfes',
        description: 'Les elfes sont des êtres immortels dotés d\'une grande maîtrise de la magie et en harmonie avec la nature.'
      },
      {
        id: 3,
        name: 'Nains',
        description: 'Les nains sont des maîtres forgerons et artisans, vivant principalement dans les montagnes.'
      },
      {
        id: 4,
        name: 'Orcs',
        description: 'Les orcs sont des guerriers redoutables, organisés en clans et tribus belliqueuses.'
      },
      {
        id: 5,
        name: 'Démons',
        description: 'Les démons sont des créatures corrompues par les ténèbres, dotées de pouvoirs surnaturels.'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ethnies', null, {});
  }
};
