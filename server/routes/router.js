const express = require('express')

// create Router object
const router = express.Router()

// import controller functions
const studentController = require('../controller/studentController')

// Login page (with failure message displayed upon login failure)
router.get('/login', (req, res) => {
    res.render('Login', { flash: req.flash('error'), title: 'Login' })
})

// add a route to handle the GET request for student homepage
router.get('/:patient_id', studentController.getCurrentStudent)