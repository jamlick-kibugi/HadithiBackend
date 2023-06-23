"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("images", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
     
    story_id:{
      type: Sequelize.INTEGER,
      references: {
        model: "stories", // actually refers to table name
        key: "id",
      }
     },
     image_url:{
      type: Sequelize.STRING,
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
    await queryInterface.dropTable("images");
  },
};
