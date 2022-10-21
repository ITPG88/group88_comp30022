const express = require('express')
const router = express.Router()
const passport = require('passport')

const loginController = require('../controller/loginController')
const auth = require('../services/auth')
const reviewController = require('../controller/reviewController')
const subjectController = require('../controller/subjectController')
const settingsController = require('../controller/settingsController')

// @desc Landing
// @route GET /
router.get('/', auth.ensureGuest, (req, res) => {
  if (Object.keys(req.query)[0] === 'signedup') {
    console.log('made an account')
    res.render('landing', { signedup: 1 })
  } else {
    res.render('landing')
  }
})

// @desc Login page
// @route GET /login
router.get('/login', (req, res) => {
  let username
  if (
    typeof req.session.messages !== 'undefined' &&
    req.session.messages.length !== 0
  ) {
    username = req.session.messages[0]
    req.session.messages = []
  }
  res.render('login.ejs', {
    title: 'Login',
    username,
    emailSent: false
  })
})

// @desc Attempt login
// @route POST /login
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureMessage: true
  }),
  (req, res) => {
    res.redirect('/home')
  }
)

// @desc Signup page
// @route GET /signup
router.get('/signup', (req, res) => {
  res.render('signup.ejs', { title: 'signup' })
})

// @desc Attempt Signup
// @route POST /signup
router.post('/signup', loginController.createStudent, (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/signup/choose_interests',
    failureRedirect: '/signup'
  })(req, res, next)
})

// @desc Signup interests page
// @route GET /signup/choose_interests
router.get('/signup/choose_interests', (req, res) => {
  res.render('signup_interests.ejs', { title: 'interests' })
})

// @desc Add fields on sign-up handle
// @route POST /signup
router.post(
  '/signup/choose_interests',
  loginController.editStudentFieldsOfInterest
)

// @desc Forgot password
// @route GET /forgot_password
router.get('/forgot_password', (req, res) => {
  res.render('forgot_password.ejs', { title: 'forgot_password' })
})

// @desc Get homepage
// @route GET /home
// re-route moderators to /home/flagged
router.get(
  '/home',
  reviewController.setFullName,
  subjectController.getSubjectList,
  reviewController.getHomepageReviews
)

// @desc create review via pop-up from homepage
// @route POST /home
router.post('/home', auth.ensureAuth, reviewController.postReview)

// @desc get browsepage
// @route GET /browse
router.get(
  '/browse',
  auth.ensureAuth,
  subjectController.getSubjectList,
  reviewController.getBrowsePageReviews
)

// @desc get historypage
// @route GET /history
router.get(
  '/history',
  auth.ensureAuth,
  reviewController.setFullName,
  subjectController.getSubjectList,
  reviewController.getHistoryReviews
)

// @desc get account
// @route GET /account
router.get('/account', (req, res) => {
  res.redirect('/settings')
})

// @desc get logout
// @route GET /logout
router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error)
    }
    if (Object.keys(req.query).length === 0) {
      res.redirect('/')
      return
    }
    res.redirect('/?' + Object.keys(req.query)[0])
  })
})

// @desc get write_review
// @route GET /write_review
router.get(
  '/write_review',
  auth.ensureAuth,
  subjectController.getSubjectList,
  (req, res) => {
    res.render('student/write_review.ejs')
  }
)

router.post(
  '/write_review',
  auth.ensureAuth,
  subjectController.findSubject,
  reviewController.postReview
)

router.all('/error404', (req, res) => {
  res.status(404).render('error404.ejs')
})

/*
Moderator
 */

// @desc get pending_subject
// @route GET /home/pending_subject
// router.get("/home/pending_subject", auth.ensureAuth, reviewController.getSubjectPendingReviews);

/*****/
router.get(
  '/home/flagged',
  auth.ensureAuth,
  reviewController.setFullName,
  subjectController.getSubjectList,
  reviewController.getNumPendingReviews,
  reviewController.getFlaggedReviews
)

router.get(
  '/home/pending_subject',
  auth.ensureAuth,
  reviewController.setFullName,
  subjectController.getSubjectList,
  reviewController.getNumPendingReviews,
  reviewController.getPendingSubjectReviews
)

router.post(
  '/home/pending_subject/:id/reject',
  reviewController.deletePendingReview,
  (req, res) => {
    res.redirect('/home/pending_subject')
  }
)
router.post(
  '/home/pending_subject/:id/approve',
  reviewController.approvePendingSubjectReview
)
router.post(
  '/home/flagged/:id/remove',
  auth.ensureAuth,
  reviewController.deletePendingReview,
  (req, res) => {
    res.redirect('/home/flagged')
  }
)

router.post(
  '/home/flagged/:id/neglect',
  auth.ensureAuth,
  reviewController.neglectFlaggedPendingReview
)

router.post(
  '/home/flagged/:id',
  auth.ensureAuth,
  reviewController.deletePendingReview,
  (req, res) => {
    res.redirect('/home/flagged')
  }
)

router.post('/forget', settingsController.sendEmail)

module.exports = router
