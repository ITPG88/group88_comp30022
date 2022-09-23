const express = require('express');
const router = express.Router();
const passport = require("passport");

const userController = require("../controller2/userController");
const {ensureAuthenticated} = require("../services/auth");

// @desc Landing
// @route GET /
router.get('/', (req, res) => {
    res.render("landing", { title: "landing", layout: false});
});

// @desc Login page
// @route GET /login
router.get('/login', (req, res) => {
    res.render("login.ejs", { title: "Login" });
});

// @desc Attempt login
// @route POST /login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: `/${req.user.type}/home`,
        failureRedirect: '/login',
    })(req, res, next);
});

// @desc Signup page
// @route GET /signup
router.get('/signup', (req, res) => {
    res.render("signup.ejs", { title: "signup" })
});

// @desc Attempt Signup
// @route POST /signup
router.post('/signup', userController.createStudent);

// @desc Signup interests page
// @route GET /signup/choose_interests
router.get('/signup/choose_interests', (req, res) => {
    res.render("signup_interests.ejs", {title: "interests"});
})

// @desc Add fields on sign-up handle
// @route PATCH /signup
router.patch('/signup/choose_interests');


router.get("/forgot_password", (req, res) => {
    res.render("forgot_password.ejs", {title: "forgot_password"});
});

module.exports = router;