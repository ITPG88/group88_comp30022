const express = require("express");
const passport = require("passport");
const router = express.Router();

const student = require("../controller/studentController");
const login = require("../controller/loginController");
const auth = require("../helper/auth");
router.get("/", auth.ensureAuth, auth.hasPriv, student.account);
router.get("/appearance", auth.ensureAuth, auth.hasPriv, student.appearance);
router.get("/interests", auth.ensureAuth, auth.hasPriv, student.interests);
module.exports = router;
