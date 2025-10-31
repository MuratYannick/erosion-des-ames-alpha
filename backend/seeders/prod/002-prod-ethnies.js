'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ethnies', [
      {
        id: 1,
        name: 'Les Éveillés',
        description: 'Les membres de l\'ethnie mutante, qui se désignent eux-mêmes comme les éveillés, ont subi une mutation légère et commune à tous, les distinguant des non-mutants sans leur conférer de capacités surhumaines ou d\'avantages significatifs. Cette mutation se manifeste par une peau grisâtre. La plupart d\'entre eux considèrent cette transformation comme une évolution naturelle pour la survie.'
      },
      {
        id: 2,
        name: 'Les Inaltérés',
        description: 'Se faisant appeler les inaltérés, ils n\'ont pas subi les mutations physiques qui ont touché les autres, restant ainsi "intacts". La plupart se perçoivent comme les dépositaires de la véritable humanité et voient les mutants comme des aberrations ou des corrompus.'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ethnies', null, {});
  }
};
