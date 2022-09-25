const auth = require("../services/auth");
const reviewController = require("../controller2/reviewController");
const subjectController = require("../controller2/subjectController");
const express = require("express");
const router = express.Router();
const passport = require("passport");


router.get('/:subjectCode', subjectController.loadSubjectPage);

router.get('/:subjectCode/review/:id', subjectController.loadSingleReview);

router.get('/', (req, res) =>{
    res.status(404);
});

module.exports = router;