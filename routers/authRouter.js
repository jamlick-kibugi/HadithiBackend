const express = require('express')
const authController = require("../controllers/authController");
const { auth } = require('express-oauth2-jwt-bearer');
const router = express.Router()

const jwtCheck = auth({
    audience: 'https://hadithiai/api',
    issuerBaseURL: 'https://dev-v1icflozixzxhuj3.us.auth0.com/', 
    tokenSigningAlg: 'RS256'
	 
	
  });
  

  router.get("/users/:currentUserId", authController.getUser);
router.post("/register", authController.register);

router.get("/users", authController.getUsers);
router.patch("/users", authController.updateUser);

module.exports = router;
