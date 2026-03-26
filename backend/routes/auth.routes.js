const express = require("express");
const router = express.Router();
const { register } = require("../controllers/auth.controller");
const { login } = require("../controllers/auth.controller");
const { logout } = require("../controllers/auth.controller");
const  authenticate  = require("../middleware/auth.middleware");
const {profile} = require("../controllers/auth.controller");
const {verifyEmail} = require("../controllers/verify-email.controller");


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile",authenticate, profile);  
router.get("/verify-email/:token", verifyEmail);

module.exports = router;
