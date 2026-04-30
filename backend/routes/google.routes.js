const express = require("express");
const passport = require("passport");
const { completeGoogleAuth } = require("../controllers/auth.controller");

const router = express.Router();

const dotenv = require("dotenv");
dotenv.config();

const frontendUrls = [
  ...(process.env.FRONTEND_URLS || "").split(","),
  process.env.FRONTEND_URL,
  "http://localhost:4000"
]
  .filter(Boolean)
  .map((url) => url.trim().replace(/\/$/, ""));

const primaryFrontendUrl = frontendUrls[0];

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account"
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${primaryFrontendUrl}/login`
  }),
  completeGoogleAuth
);

module.exports = router;