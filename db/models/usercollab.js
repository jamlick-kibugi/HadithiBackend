"use strict";
const { DataTypes } = require("sequelize");
const initUsercollab= (sequelize) =>
  sequelize.define(
    "Usercollab",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",  
          key: "id",
        }
      },
      collabId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "collabs", 
          key: "id",
        }
      },       
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      underscored: true,
    }
  );

  
module.exports = initUsercollab;
