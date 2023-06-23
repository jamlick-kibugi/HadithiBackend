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
      pageNumber: {
        type: DataTypes.INTEGER         
      },
      imageUrl: {
        type: DataTypes.STRING
      },     
      content: {
        type: DataTypes.STRING
      },     
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
       
    },
    {
      underscored: true,
    }
  );

  
module.exports = initCollab;
