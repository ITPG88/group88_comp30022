const express = require('express');
const router = express.Router();
const passport = require("passport");

const loginController = require("../controller2/loginController");
const auth = require("../services/auth");
const reviewController = require("../controller2/reviewController");
const student = require("../controller/studentController");

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
    console.log(req.body);
    passport.authenticate('local', {
        successRedirect: '/home',
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
router.post('/signup', loginController.createStudent);

// @desc Signup interests page
// @route GET /signup/choose_interests
router.get('/signup/choose_interests', (req, res) => {
    res.render("signup_interests.ejs", {title: "interests"});
})

// @desc Add fields on sign-up handle
// @route PATCH /signup
router.patch('/signup/choose_interests', loginController.editStudentFieldsOfInterest);

// @desc Add
router.get("/forgot_password", (req, res) => {
    res.render("forgot_password.ejs", {title: "forgot_password"});
});

/**
 * @desc Get homepage
 * @route GET /home
 */
router.get('/home', reviewController.getHomepageReviews);


// @desc get browsepage
// @route GET /browse
router.get('/browse', auth.ensureAuthenticated, reviewController.getBrowsePageReviews)

// @desc get historypage
// @route GET /history
router.get("/history", auth.ensureAuthenticated, reviewController.getHistoryReviews);


// @desc get account
// @route GET /account
router.get("/account", (req, res) => {
    res.redirect("/settings");
});

// @desc get write_review
// @route GET /write_review
router.get('/write_review', (req, res) => {
    res.render("/student/write_review");
});

router.post('/write_review', auth.ensureAuthenticated, reviewController.postReview);

module.exports = router;