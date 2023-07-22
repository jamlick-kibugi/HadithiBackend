
const db = require("../db/models/index");
const {Comment} =db;
const {User} =db;
const {Story} =db;

async function getComments(req, res) {
  const { storyId } = req.params;
  try {
     
 
    const comments = await Comment.findAll({
      where: {
        storyId: storyId,
      },include:[Story]
    });
    return res.json(comments);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}
async function addComment(req, res) {
    const { storyId } = req.params;
    const {content,currentUserId} = req.body;
     try {
       const newComment = await Comment.create({
          
         content: content,
         storyId:storyId,
         createdBy:currentUserId
          
            
       });

      
      
       return res.json(newComment);
     } catch (err) {
       return res.status(400).json({ error: true, msg: err });
     }
   }

   async function deleteComment(req, res) {
    const {commentId} = req.params;
     try {
       const newComment = await Comment.destroy({
        where:{
          id:commentId},});
      
       return res.json( newComment);
     } catch (err) {
       return res.status(400).json({ error: true, msg: err });
     }
   }

   async function editComment(req, res) {
    const {commentId} = req.params;
     try {
       const newComment = await Comment.update(
        {
          content:req.body.content
        },
        {
          returning:true,
        where:{
          
          id: commentId}});
      
       return res.json(newComment);
     } catch (err) {
       return res.status(400).json({ error: true, msg: err });
     }
   }

   module.exports = {
     editComment,
    addComment,
    getComments,
    deleteComment,
    
  };