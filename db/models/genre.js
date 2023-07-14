"use strict";
const { DataTypes } = require("sequelize");
const initGenre= (sequelize) =>
  sequelize.define(
    "Genre",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      genre: {
        type: DataTypes.STRING       
      }    
       
       
    },
    {
      underscored: true,
    }
  );

  
module.exports = initGenre;
