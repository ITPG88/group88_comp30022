const express = require("express");
const passport = require("passport");
const router = express.Router();

const login = require("../controller/loginController");
const auth = require("../helper/auth");

// Landing Page
router.get("/", auth.ensureGuest, login.landing);

// Login Page
router.get("/login", auth.ensureGuest, login.login);
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/home");
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
});
router.get("/forgetpassword", auth.ensureGuest, login.forget);

// SignUp Page
router.get("/signup", auth.ensureGuest, login.signup);

// passport not set up yet
const student = require("../controller/studentController");
const mod = require("../controller/moderatorController");
// router.get("/home", login.ensureAuth, (req, res) => {
//   if (1 /*isStudent*/) {
//     student.home;
//   } else if (1 /* isAdmin*/) {
//     mod.home;
//   }
// });

router.get("/home", auth.isAdmin, student.home);
router.get("/browse", auth.isAdmin, student.browse);
router.get("/history", auth.isAdmin, student.history);
router.get("/account", (req, res) => {
  res.redirect("/settings");
});
module.exports = router;

// Login page (with failure message displayed upon login failure)
// router.get("/login", (req, res) => {
//   res.render("Login", { flash: req.flash("error"), title: "Login" });
// });

// // add a route to handle the GET request for student homepage
// studentRouter.get("/:student_id", studentController.getCurrentStudent);
