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
const initLike = require('./likes');
const initIllustration = require('./illustration');
const initGenre = require('./genre');
const initAge = require('./age');
const initCollabpage = require('./collabpage')
const initUsercollab = require('./usercollab')

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
db.Like = initLike(sequelize)
db.Illustration = initIllustration(sequelize)
db.Genre = initGenre(sequelize)
db.Age = initAge(sequelize)
db.Collabpage = initCollabpage(sequelize)
db.Usercollab = initUsercollab(sequelize)
//1-m 

 

db.Collab.hasMany(db.Collabpage)
db.Collabpage.belongsTo(db.Collab)

db.Age.hasMany(db.Story)
db.Story.belongsTo(db.Age)

db.Genre.hasMany(db.Story)
db.Story.belongsTo(db.Genre)

db.User.hasMany(db.Story);
db.Story.belongsTo(db.User);

db.User.hasMany(db.Like);
db.Like.belongsTo(db.User);

db.Story.hasMany(db.Like);
db.Like.belongsTo(db.Story);

db.Story.hasMany(db.Page)
db.Page.belongsTo(db.Story)

db.Story.hasMany(db.Image);
db.Image.belongsTo(db.Story);

db.Story.hasMany(db.Comment);
db.Comment.belongsTo(db.Story);

db.User.hasMany(db.Illustration)
db.Illustration.belongsTo(db.User)

// db.User.hasMany(db.Collab)
// db.Collab.belongsTo(db.User)

//m-m
db.Collab.belongsToMany(db.User , {onDelete:"CASCADE",through:db.Usercollab})
db.User.belongsToMany(db.Collab, {through:db.Usercollab})
db.Usercollab.belongsTo(db.User);
db.Usercollab.belongsTo(db.Collab, {onDelete: "CASCADE"});

 

db.Sequelize = Sequelize;


module.exports = db;
