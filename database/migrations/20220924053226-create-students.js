'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('aluno', {
      id_aluno: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      nome_aluno: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('aluno');
  },
};
