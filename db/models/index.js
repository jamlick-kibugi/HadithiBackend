'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');


const process = require('process');
const initCollab = require('./Collab');
const initStory = require('./story')
const initImage = require('./image')
const initUser = require('./user');
const initPage = require('./page');
const initComment = require('./comment');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/database.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });


db.User = initUser(sequelize)
db.Collab = initCollab(sequelize)
db.Story = initStory(sequelize)
db.Page = initPage(sequelize)
db.Image =initImage(sequelize)
db.Comment = initComment(sequelize)

//1-m 
db.User.hasMany(db.Story);
db.Story.belongsTo(db.User);

db.Story.hasMany(db.Page)
db.Page.belongsTo(db.Story)

db.Story.hasMany(db.Image);
db.Image.belongsTo(db.Story);

db.Story.hasMany(db.Comment);
db.Comment.belongsTo(db.Story);


 

db.Sequelize = Sequelize;


module.exports = db;
