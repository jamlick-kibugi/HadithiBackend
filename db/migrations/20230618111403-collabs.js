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
      prompt: {
        type: Sequelize.STRING,
      },
      guide:{
        type:Sequelize.TEXT,

      },
      created_by: {
        type: Sequelize.INTEGER,
     },
     cover_url:{
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
    user_id: {
      type: Sequelize.INTEGER,
      references:{
        model:"users",
        key:"id"
      }
    },     
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("collabs");
  },
};
