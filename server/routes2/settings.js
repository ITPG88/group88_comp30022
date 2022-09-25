const auth = require("../services/auth");
const reviewController = require("../controller2/reviewController");
const settingsController = require("../controller2/settingsController");
const express = require("express");
const router = express.Router();
const passport = require("passport");


router.get("/", auth.ensureAuth, (req, res) => {
    res.redirect("/settings/account");
});

router.get('/account', auth.ensureAuth, (req, res) => {
    res.render("student/account_settings", {user: req.user});
});

router.post('/account', auth.ensureAuth, settingsController.editAccountSettings);

router.get('/interest_areas', auth.ensureAuth, (req, res) => {
    res.render("student/interest_areas_settings");
});

router.post('/interest_areas', auth.ensureAuth, settingsController.editFieldsOfInterest);

router.get('/logout', auth.ensureAuth, (req, res) => {
    res.redirect('logout');
});

router.get('/appearance', auth.ensureAuth, (req, res) => {
    res.render("student/appearance_settings");
});

router.get('/close', auth.ensureAuth, (req, res) => {
    res.redirect("home");
});


module.exports = router;