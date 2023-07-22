
const db = require("../db/models/index");
const {Like} =db;
const {Story} =db;
const {User}=db

 
 
   async function addLike(req, res) {
    const {userId} = req.params;
    const {storyId} = req.params;

     try {
       const newLike = await Like.create({
        userId:userId,
        storyId:storyId,
        liked:true});
      
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

   async function getUserLikes(req, res) {


     
    
  
    const {userId,page,size} = req.params;
     

     try {

      const allStory = await Story.findAndCountAll({include: [{model:Like,where:{
        userId:userId}},{model:User}] ,  limit: size,
        offset: page * size});

      //  const allStory = await Like.findAndCountAll({include: [{model:Story,where:{userId:userId}},{model:User}], where:{
      //   userId:userId},  limit: size,
      //   offset: page * size});

        let pageCount = Math.ceil(allStory.count/size)
  
  
     
    res.json({allStory,pageCount})
      
       
     } catch (err) {
       return res.status(400).json({ error: true, msg: err });
     }
   }

    

   module.exports = {
    addLike,
    deleteLike,
    getUserLikes
    
  };