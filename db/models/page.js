 
const { DataTypes } = require("sequelize");
const initPage= (sequelize) =>
  sequelize.define(
    "Page",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      storyId: {
        type: DataTypes.INTEGER,
        references: {
          model: "stories",  
          key: "id",
        }
      },
      pageNumber: {
        type: DataTypes.INTEGER
      },   
      pageContent: {
        type: DataTypes.TEXT
      },   
      prompt:{
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

  
module.exports = initPage;
