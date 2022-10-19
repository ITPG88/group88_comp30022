const auth = require('../services/auth')
const reviewController = require('../controller/reviewController')
const subjectController = require('../controller/subjectController')
const express = require('express')
const router = express.Router()
router.get('/', (req, res) => {
  const code = req.query.code

  if (code) {
    res.redirect('/subject/' + code)
  } else {
    res.redirect('/browse')
  }
})

router.get('/:subjectCode', subjectController.loadSubjectPage)
router.param('subjectCode', subjectController.findSubject)

router.get('/:subjectCode/review/:id', subjectController.loadSingleReview)

// @desc Edit a review
// @route Get
router.get('/:subjectCode/review/edit/:id', reviewController.editReviews)

// @desc Edit a review
// @route Post
router.post('/:subjectCode/review/edit/:id', reviewController.editreviews)

// @desc Add comment to review
// @route /POST
router.post(
  '/:subjectCode/review/:id',
  auth.ensureAuth,
  subjectController.addComment
)

// @desc Flagged a review
// @route /POST
router.post(
  '/:subjectCode/review/:id/flagged',
  auth.ensureAuth,
  subjectController.flaggedReview
)

// @desc delete a review
// @route DELETE
router.post(
  '/:subjectCode/review/:id/delete',
  auth.ensureAuth,
  subjectController.deleteReview
)

// @desc delete a comment
// @route DELETE via POST
router.delete(
  '/:subjectCode/review/:id/:commentID/',
  auth.ensureAuth,
  subjectController.deleteComment
)

// @desc like a comment
// @route PATCH via POST
router.post(
  '/:subjectCode/review/:id/:commentID/likeComment',
  auth.ensureAuth,
  subjectController.likeComment
)

// @desc like a review
// @route PATCH via POST /:subjectCode/review/:id/likeReview
router.post(
  '/:subjectCode/review/:id/likeReview',
  auth.ensureAuth,
  subjectController.likeReview
)

router.get('/', (req, res) => {
  res.status(404)
})

// @desc Post a review
// @route POST
router.post(
  '/subject/:subjectCode',
  auth.ensureAuth,
  subjectController.postReview
)

module.exports = router
