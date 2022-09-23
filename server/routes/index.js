const express = require("express");
const passport = require("passport");
const router = express.Router();
const studentController = require('../controller/studentController');
const services = require('../services/render');

const login = require("../controller/loginController");
const auth = require("../helper/auth");

// Landing Page
router.get("/", auth.ensureGuest, services.landing);

// Login Page
router.get("/login", auth.ensureGuest, services.login);

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
router.get("/signup", auth.ensureGuest, services.signup);
router.get("/signup/choose_interests", services.signupPreferences);



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



// API
//router.get('/api/users', studentController.getStudent);
router.post('/api/users', studentController.createNewStudent);
router.patch('/api/users/:id', studentController.updateStudentUser);
router.get('/api/users/:id', studentController.getCurrentStudent);



// Login page (with failure message displayed upon login failure)
// router.get("/login", (req, res) => {
//   res.render("Login", { flash: req.flash("error"), title: "Login" });
// });

// // add a route to handle the GET request for student homepage
// studentRouter.get("/:student_id", studentController.getCurrentStudent);