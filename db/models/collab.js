"use strict";
const { DataTypes } = require("sequelize");
const initCollab= (sequelize) =>
  sequelize.define(
    "Collab",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      
      prompt: {
        type: DataTypes.STRING         
      },
      guide: {
        type: DataTypes.TEXT
      },     
      createdBy: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",  
          key: "id",
        }
      },       
      coverUrl:{
        type: DataTypes.STRING         

      } ,
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",  
          key: "id",
        }
      },
       
    },
    {
      underscored: true,
    }
  );

  
module.exports = initCollab;
