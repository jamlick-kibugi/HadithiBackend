"use strict";
const { DataTypes } = require("sequelize");
const initIllustration= (sequelize) =>
  sequelize.define(
    "Illustration",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: {
        type: DataTypes.INTEGER   ,
        references: {
            model: "users", // actually refers to table name
            key: "id",
          }      
      },
      illustrationUrl: {
        type: DataTypes.STRING
      },           
       
       
    },
    {
      underscored: true,
    }
  );

  
module.exports = initIllustration;
