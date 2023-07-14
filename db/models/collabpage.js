 
const { DataTypes } = require("sequelize");
const initCollabpage= (sequelize) =>
  sequelize.define(
    "Collabpage",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      collabId: {
        type: DataTypes.INTEGER,
        references: {
          model: "collabs",  
          key: "id",
        }
      },
      pageNumber: {
        type: DataTypes.INTEGER
      },   
      pageContent: {
        type: DataTypes.TEXT
      },   
      pageUrl:{
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

  
module.exports = initCollabpage;
