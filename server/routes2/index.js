const express = require("express");
const router = express.Router();
const passport = require("passport");

const loginController = require("../controller2/loginController");
const auth = require("../services/auth");
const render = require("../services/render");
const reviewController = require("../controller2/reviewController");
const subjectController = require("../controller2/subjectController");
const student = require("../controller/studentController");

// @desc Landing
// @route GET /
router.get("/", auth.ensureGuest, (req, res) => {
  if (Object.keys(req.query)[0] === "signedup") {
    console.log("made an account");
    res.render("landing", { signedup: 1 });
  } else {
    res.render("landing");
  }
});

// @desc Login page
// @route GET /login
router.get("/login", (req, res) => {
  let error;
  let username;
  if (typeof req.session.messages === "undefined") {
  } else if (req.session.messages.length === 0) {
  } else {
    username = req.session.messages[0];
    req.session.messages = [];
  }
  res.render("login.ejs", {
    title: "Login",
    username: username,
  });
});

// @desc Attempt login
// @route POST /login
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect("/home");
  }
);

// @desc Signup page
// @route GET /signup
router.get("/signup", (req, res) => {
  res.render("signup.ejs", { title: "signup" });
});

// @desc Attempt Signup
// @route POST /signup
router.post("/signup", loginController.createStudent, (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/signup/choose_interests",
    failureRedirect: "/signup",
  })(req, res, next);
});

// @desc Signup interests page
// @route GET /signup/choose_interests
router.get("/signup/choose_interests", (req, res) => {
  res.render("signup_interests.ejs", { title: "interests" });
});

// @desc Add fields on sign-up handle
// @route POST /signup
router.post(
  "/signup/choose_interests",
  loginController.editStudentFieldsOfInterest
);

// @desc Forgot password
// @route GET /forgot_password
router.get("/forgot_password", (req, res) => {
  res.render("forgot_password.ejs", { title: "forgot_password" });
});

// @desc Get homepage
// @route GET /home
router.get(
  "/home",
  reviewController.setFullName,
  reviewController.getHomepageReviews
);

// @desc create review via pop-up from homepage
// @route POST /home
router.post("/home", (req, res) => {
  res.redirect(307, `/subject/${req.body.subjectCode}`);
});

// @desc get browsepage
// @route GET /browse
router.get("/browse", auth.ensureAuth, reviewController.getBrowsePageReviews);

// @desc get historypage
// @route GET /history
router.get(
  "/history",
  auth.ensureAuth,
  reviewController.setFullName,
  reviewController.getHistoryReviews
);

// @desc get account
// @route GET /account
router.get("/account", (req, res) => {
  res.redirect("/settings");
});

// @desc get logout
// @route GET /logout
router.get("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    if (Object.keys(req.query).length == 0) {
      res.redirect("/");
      return;
    }
    res.redirect("/?" + Object.keys(req.query)[0]);
  });
});

// @desc get write_review
// @route GET /write_review
router.get("/write_review", (req, res) => {
  res.render("student/write_review.ejs");
});

router.post(
  "/write_review",
  auth.ensureAuth,
  subjectController.FindSubject,
  reviewController.postReview
);

router.all("/error404", (req, res) => {
  res.status(404).render("error404.ejs");
});

/*
Moderator
 */

// @desc get pending_subject
// @route GET /home/pending_subject
// router.get("/home/pending_subject", auth.ensureAuth, reviewController.getSubjectPendingReviews);

router.get("/home/flagged", auth.ensureAuth, (req, res) => {
  res.redirect("/home");
});
module.exports = router;
