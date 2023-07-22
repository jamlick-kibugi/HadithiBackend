
const { DataTypes } = require("sequelize");

const initComment= (sequelize) =>
  sequelize.define(
    "Comment",
    {
      content: {type: DataTypes.STRING},   
      createdBy:{
        type: DataTypes.INTEGER  ,  
        references: {
          model: "users", 
          key: "id",
        }
      },
      storyId:{
        type:DataTypes.INTEGER,
        references: {
          model: "stories", 
          key: "id",
        }
      } 
    },
    {
      underscored: true,
    }
  );

  
module.exports = initComment;

















 