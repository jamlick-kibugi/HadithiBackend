const db = require("../db/models/index");

const {Collab} =db;
 

const createCollab = async (req, res) => {
    const {content,imageUrl,pageNumber} = req.body
    try {  
      const asset = await Collab.create({
        updated_at: new Date(),
        created_at: new Date(),  
        content:content,
        imageUrl:imageUrl,
        pageNumber:pageNumber
         
    });
     
    } catch (err) {
      console.log(err)
      return res.status(400).json({ error: true, msg: err });    
    } 
  
 
}

const getAllCollabs = async (req, res) => {
   
try {  
  
  const collabs = await Collab.findAll(); 
  res.json(collabs)
} catch (err) {
   
  return res.status(400).json({ error: true, msg: err });    
} 
}

 


module.exports = {
   
    createCollab,
    getAllCollabs
   
};
     
