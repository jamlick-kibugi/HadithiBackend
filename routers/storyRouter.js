const express = require('express') 
const chatgptController = require("../controllers/chatgptController"); 
const testController = require("../controllers/testController"); 
const storyController = require("../controllers/storyController"); 
const imageController = require("../controllers/imageController"); 
const commentController = require('../controllers/commentController');
 
const router = express.Router()

// router.post("/", chatgptController.createStory)
router.post("/", testController.createTest)
router.post("/cover", testController.createCover) //Create Title + Cover
router.post("/page", testController.createPage) //Create page
router.get("/page/:storyId/:page/:size", testController.getPages) //Get page
//Comments 
router.post("/page/comment/:storyId", commentController.addComment) //Create Comment
router.get("/page/comment/:storyId", commentController.getComments) //Get Comment
router.delete("/page/comment/:commentId",commentController.deleteComment);
router.patch("/page/comment/:commentId",commentController.editComment);
//Get All Stories
router.get("/", testController.getAllStory)
router.get("/:storyId", testController.getStory)

router.post("/image", chatgptController.createImage)
 
router.get("/", storyController.getStory)
router.get("/images",imageController.getImages)
 
module.exports = router;