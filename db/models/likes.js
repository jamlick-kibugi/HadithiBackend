
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
      } , 
      liked:{
        type:DataTypes.BOOLEAN,     
      }
    },
    {
      underscored: true,
    }
  );

  
module.exports = initLike;

















 