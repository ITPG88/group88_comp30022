const express = require('express')
const passport = require('passport')


// create Router object
const studentRouter = express.Router();
// import controller functions
const loginController = require("../controller/loginController");
const studentController = require("../controller/studentController");

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/student/login')
    }
    if (req.user.user_type != 'student'){
        req.logout()
        return res.redirect('/student/login')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

// Login page (with failure message displayed upon login failure)
// router.get("/login", (req, res) => {
//   res.render("Login", { flash: req.flash("error"), title: "Login" });
// });


// Some initial routing
studentRouter.get("/", loginController.landing);
studentRouter.get("/signup", loginController.signup);

// add a route to handle the GET request for student homepage
studentRouter.get("/:student_id", studentController.getCurrentStudent);

module.exports = studentRouter;
