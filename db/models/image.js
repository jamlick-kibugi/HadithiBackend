"use strict";
const { DataTypes } = require("sequelize");
const initImage= (sequelize) =>
  sequelize.define(
    "Image",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      StoryId: {
        type: DataTypes.INTEGER   ,
        references: {
            model: "stories", // actually refers to table name
            key: "id",
          }      
      },
      imageUrl: {
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

  
module.exports = initImage;
