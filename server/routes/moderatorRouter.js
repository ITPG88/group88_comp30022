const express = require('express')
const passport = require('passport')


// create Router object
const moderatorRouter = express.Router();
// import controller functions
const loginController = require("../controller/loginController");

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/moderator/login')
    }
    if (req.user.user_type != 'moderator'){
        req.logout()
        return res.redirect('/moderator/login')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

// Login page (with failure message displayed upon login failure)
moderatorRouter.get('/login', (req, res) => {
    res.render('ModeratorLogin', { flash: req.flash('error'), title: 'Login' })
})

// Handle login
moderatorRouter.post('/login',
    passport.authenticate('local', {
        successRedirect: './homepage', failureRedirect: './login', failureFlash: true
    })
)
// Handle logout
moderatorRouter.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/doctor/login')
})

// Some initial routing
moderatorRouter.get("/landing", loginController.landing);
moderatorRouter.get("/signup", loginController.signup);
module.exports = moderatorRouter;