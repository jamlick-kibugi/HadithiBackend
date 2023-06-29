const express = require('express') 
const chatgptController = require("../controllers/chatgptController"); 
const testController = require("../controllers/testController"); 
const storyController = require("../controllers/storyController"); 
const imageController = require("../controllers/imageController"); 
const router = express.Router()

// router.post("/", chatgptController.createStory)
router.post("/", testController.createTest)
router.post("/cover", testController.createCover) //Create Title + Cover
router.post("/page", testController.createPage) //Create page
router.get("/page/:storyId/:page/:size", testController.getPages) //Get page

router.get("/", testController.getAllStory)
router.post("/image", chatgptController.createImage)
 
router.get("/", storyController.getStory)
router.get("/images",imageController.getImages)
 
module.exports = router;