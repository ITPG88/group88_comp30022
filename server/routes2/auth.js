const express = require('express');
const router = express.Router();
const passport = require("passport");


router.get('/auth', passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/home');
});
