"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("collabs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      image_url: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.STRING,
      },      
     page_number:{
      type: Sequelize.INTEGER,
     },
     created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("collabs");
  },
};
