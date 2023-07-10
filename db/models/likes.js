
const { DataTypes } = require("sequelize");

const initLike= (sequelize) =>
  sequelize.define(
    "Like",
    {        
      storyId:{
        type:DataTypes.INTEGER,
        references: {
          model: "stories", 
          key: "id",
        }
      } ,
      userId:{
        type:DataTypes.INTEGER,
        references: {
          model: "users", 
          key: "id",
        }
      }  
    },
    {
      underscored: true,
    }
  );

  
module.exports = initLike;

















 