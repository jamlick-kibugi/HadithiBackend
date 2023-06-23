"use strict";
const { DataTypes } = require("sequelize");
const initStory= (sequelize) =>
  sequelize.define(
    "Story",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      content: {
        type: DataTypes.TEXT
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

  
module.exports = initStory;
