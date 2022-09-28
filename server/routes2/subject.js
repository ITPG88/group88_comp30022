const auth = require("../services/auth");
const reviewController = require("../controller2/reviewController");
const subjectController = require("../controller2/subjectController");
const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  let code = req.query.code;

  if (code) {
    res.redirect("/subject/" + code);
  } else {
    res.redirect("/browse");
  }
});

router.get("/:subjectCode", subjectController.loadSubjectPage);
router.param("subjectCode", (req, res, next, subjectCode) => {
  next();
});

router.get("/:subjectCode/review/:id", subjectController.loadSingleReview);

// @desc Add comment to review
// @route /POST
router.post("/:subjectCode/review/:id", auth.ensureAuth, subjectController.addComment);

// @desc Add thumbs up to review
// @route PATCH
router.patch("/:subjectCode/review/:id", auth.ensureAuth, subjectController.likeReview);

// @desc delete a review
// @route DELETE
router.post("/:subjectCode/review/:id/delete", auth.ensureAuth, subjectController.deleteReview);

// @desc delete a comment
// @route DELETE via POST
router.post("/:subjectCode/review/:id/:commentID/", auth.ensureAuth, subjectController.deleteComment)

router.get("/", (req, res) => {
  res.status(404);
});

router.post("/subject/:subjectCode", auth.ensureAuth, subjectController.postReview);

module.exports = router;
