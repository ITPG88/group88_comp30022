const express = require("express");
const passport = require("passport");

// create Router object
const router = express.Router();
const auth = require("../helper/auth");
// import controller functions
const mod = require("../controller/moderatorController");

router.get("/", auth.ensureAdmin, mod.home);

// Login page (with failure message displayed upon login failure)
module.exports = router;
