 
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
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",  
          key: "id",
        }
      },
      title: {
        type: DataTypes.TEXT
      },   
      coverUrl:{
        type:DataTypes.STRING
      }  ,        
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

  
module.exports = initStory;
