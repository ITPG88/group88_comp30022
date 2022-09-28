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

router.get("/", (req, res) => {
  res.status(404);
});

router.post("/subject/:subjectCode", subjectController.postReview);

module.exports = router;
