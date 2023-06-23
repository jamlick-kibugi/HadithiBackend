const express = require('express')
const collabController = require("../controllers/collabController"); 
// const openaiController = require("../controllers/openaiController"); 
// const chatgptController = require("../controllers/chatgptController"); 
const router = express.Router()

router.post("/", collabController.createCollab)
router.get("/", collabController.getAllCollabs)

 
module.exports = router;