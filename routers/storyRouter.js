const express = require('express') 
const chatgptController = require("../controllers/chatgptController"); 
const testController = require("../controllers/testController"); 
const storyController = require("../controllers/storyController"); 
const imageController = require("../controllers/imageController"); 
const commentController = require('../controllers/commentController');
const likeController = require('../controllers/likeController');
const illustrationController = require('../controllers/illustrationController');
const router = express.Router()

// router.post("/", chatgptController.createStory)
router.post("/", testController.createTest)
router.get("/illustration/:currentUserId/:page/:size", illustrationController.getAllIllustrations)
// router.get("/testing", testController.test )
router.post("/cover", testController.createCover) //Create Title + Cover
router.post("/page", testController.createPage) //Create page
router.get("/page/:storyId/:page/:size", testController.getPages) //Get page
//Comments 
router.post("/page/comment/:storyId", commentController.addComment) //Create Comment
router.get("/page/comment/:storyId", commentController.getComments) //Get Comment
router.delete("/page/comment/:commentId",commentController.deleteComment); //DELETE Comment
router.patch("/page/comment/:commentId",commentController.editComment);
//Likes
router.post("/like/:storyId/:userId", likeController.addLike) //Add Like
router.delete("/like/:storyId/:userId", likeController.deleteLike)
router.get("/like/:userId/:page/:size", likeController.getUserLikes)


//Get All Stories
router.get("/:currentUserId/:page/:size/", testController.getUserStory)
router.get("/:page/:size/", testController.getAllStory)
router.get("/:storyId", testController.getStory)
router.delete("/:storyId", testController.deleteStory)


// Make illustration
router.post("/illustration", illustrationController.generateIllustration)
router.delete("/illustration/:currentIllustrationId", illustrationController.deleteIllustration)
router.post("/illustration/save", illustrationController.saveIllustration)




router.post("/image", chatgptController.createImage)
 
// router.get("/", storyController.getStory)
router.get("/images",imageController.getImages)
 
module.exports = router;