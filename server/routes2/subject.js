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
router.param("subjectCode", subjectController.FindSubject);

router.get("/:subjectCode/review/:id", subjectController.loadSingleReview);

// @desc Add comment to review
// @route /POST
router.post(
  "/:subjectCode/review/:id",
  auth.ensureAuth,
  subjectController.addComment
);

// @desc Flagged a review
// @route /POST
router.post(
  "/:subjectCode/review/:id/flagged",
  auth.ensureAuth,
  subjectController.flaggedReview
);

// @desc delete a review
// @route DELETE
router.post(
  "/:subjectCode/review/:id/delete",
  auth.ensureAuth,
  subjectController.deleteReview
);

// @desc delete a comment
// @route DELETE via POST
router.delete(
  "/:subjectCode/review/:id/:commentID/",
  auth.ensureAuth,
  subjectController.deleteComment
);

// @desc like a comment
// @route PATCH via POST
router.post(
  "/:subjectCode/review/:id/:commentID/likeComment",
  auth.ensureAuth,
  subjectController.likeComment
);

router.get("/", (req, res) => {
  res.status(404);
});

// @desc Post a review
// @route POST
router.post(
  "/subject/:subjectCode",
  auth.ensureAuth,
  subjectController.postReview
);

module.exports = router;
