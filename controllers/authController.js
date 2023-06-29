const db = require("../db/models/index");

const {User} =db;

const register = async (req, res) => {
 const {email,firstName,lastName} = req.body
 try {
    const [user, created] = await User.findOrCreate({
        where: { email: email },
        defaults: {
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

module.exports = {
    register
};
     