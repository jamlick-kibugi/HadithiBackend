
const db = require("../db/models/index");
const {Like} =db;

 
 
   async function addLike(req, res) {
    const {userId} = req.params;
    const {storyId} = req.params;

     try {
       const newLike = await Like.create({
        userId:userId,
        storyId:storyId});
      
       return res.json(newLike);
     } catch (err) {
       return res.status(400).json({ error: true, msg: err });
     }
   }

   async function deleteLike(req, res) {
    
    const {userId} = req.params;
    const {storyId} = req.params;

     try {
       const newLike = await Like.destroy( {where:{
        userId:userId,storyId:storyId},});
      
       return res.json(newLike);
     } catch (err) {
       return res.status(400).json({ error: true, msg: err });
     }
   }

    

   module.exports = {
    addLike,
    deleteLike
    
  };