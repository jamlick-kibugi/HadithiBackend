"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pages", {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
      },
      story_id: {
        type: Sequelize.INTEGER,
        references:{
          model:"stories",
          key:"id"
        }
      },     
      page_number:{
        type: Sequelize.INTEGER,
      },
      page_content:{
        type: Sequelize.TEXT,
      },
      prompt:{
        type: Sequelize.TEXT,
      },
      page_url:{
        type:Sequelize.STRING,

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
    await queryInterface.dropTable("pages");
  },
};
