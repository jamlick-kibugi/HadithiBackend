const db = require("../db/models/index");

const {User} =db;

const register = async (req, res) => {
 const {email,firstName,lastName,picture} = req.body
 try {
    const [user, created] = await User.findOrCreate({
        where: { email: email },
        defaults: {
          picture:picture,
          biography:"",
          email:email,
          firstName:firstName,
          lastName:lastName,
          updated_at: new Date(),
          created_at: new Date(),  
        }
      });
      return res.json(user)
    
 } catch (err) {
  console.log(err)
    return res.status(400).json({ error: true, msg: err });    
 } 

 
}

const getUsers = async (req, res) => {
   
  try {
     const users = await User.findAll()
      return res.json(users)
     
  } catch (err) {
   console.log(err)
     return res.status(400).json({ error: true, msg: err });    
  } 
 
  
 }

 const getUser = async (req, res) => {
  const {currentUserId} =req.params
   
  try {
     const user  = await User.findAll({where:{id:currentUserId}})
      return res.json(user)
     
  } catch (err) {
   console.log(err)
     return res.status(400).json({ error: true, msg: err });    
  } 

   
 }

 const updateUser = async (req, res) => {
  const {currentUserId,firstName,lastName,picture,email,biography} =req.body
   
  try {
     const user  = await User.update({
      firstName,
      lastName,
      biography,
      picture,
      email
     },{where:{id:currentUserId}})
      return res.json(currentUserId)
     
  } catch (err) {
   console.log(err)
     return res.status(400).json({ error: true, msg: err });    
  } 

   
 }

module.exports = {
    register,
    getUsers,
    getUser,
    updateUser
};
     