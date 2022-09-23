const express = require('express');
const router = express.Router();

// @desc Landing
// @route GET /
router.get('/', (req, res) => {
    res.render("landing.ejs",)
})

// @desc Login
// @route GET /
router.get('/login', (req, res) => {
    res.render("login.ejs",)
})

// @desc Signup
// @route GET /
router.get('/signup', (req, res) => {
    res.render("signup.ejs",)
})