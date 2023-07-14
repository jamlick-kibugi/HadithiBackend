"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("stories", {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references:{
          model:"users",
          key:"id"
        }
      },     
      title:{
        type: Sequelize.TEXT,
      },
      cover_url:{
        type:Sequelize.STRING,

      },      
      created_at: {        
        type: Sequelize.DATE,
      },
      updated_at: {        
        type: Sequelize.DATE,
      },
      genre_id: {
        type: Sequelize.INTEGER,
        references:{
          model:"genres",
          key:"id"
        }
      },
      age_id: {
        type: Sequelize.INTEGER,
        references:{
          model:"ages",
          key:"id"
        }
      },
   
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("stories");
  },
};
