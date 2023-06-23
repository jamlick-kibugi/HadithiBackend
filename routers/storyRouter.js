const express = require('express') 
const chatgptController = require("../controllers/chatgptController"); 
const testController = require("../controllers/testController"); 
const storyController = require("../controllers/storyController"); 
const imageController = require("../controllers/imageController"); 
const router = express.Router()

// router.post("/", chatgptController.createStory)
router.post("/", testController.createTest)
router.post("/image", chatgptController.createImage)
 
router.get("/", storyController.getStory)
router.get("/images",imageController.getImages)
 
module.exports = router;