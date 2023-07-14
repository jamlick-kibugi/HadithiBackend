const express = require('express')
const collabController = require("../controllers/collabController"); 
// const openaiController = require("../controllers/openaiController"); 
// const chatgptController = require("../controllers/chatgptController"); 
const router = express.Router()

router.post("/", collabController.createCollab)
router.post("/page", collabController.createCollabPage)
router.post("/page/image", collabController.createPageImage)
router.post("/page/coverImage", collabController.createCoverImage)
router.patch("/page/coverImage", collabController.editCoverImage)

router.patch("/page/image", collabController.editPageImage)
router.patch("/page", collabController.editCollabContent)
router.delete("/page/:collabPageId", collabController.deleteCollabPage)
router.get("/userCollab/:currentUserId", collabController.getUserCollab)
router.post("/userCollab/shareCollab", collabController.shareCollab)
router.get("/userCollab/shareCollab/:currentUserId", collabController.getShareCollab)
router.get("/userCollab/pages/:currentCollabId", collabController.getUserCollabPages)
router.get("/:currentCollabId", collabController.getCollab)



 
module.exports = router;