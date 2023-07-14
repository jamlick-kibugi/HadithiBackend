"use strict";
const { DataTypes } = require("sequelize");
const initAge= (sequelize) =>
  sequelize.define(
    "Age",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      age: {
        type: DataTypes.STRING       
      }    
       
       
    },
    {
      underscored: true,
    }
  );

  
module.exports = initAge;
