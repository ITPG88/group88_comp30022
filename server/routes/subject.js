const express = require("express");
const passport = require("passport");
const router = express.Router();
const auth = require("../helper/auth");

router.get("/:subject_code", (req, res) => {
  // may need to move to a controller so that it renders based on the code
  // ALSO dont know where the normal review page is
  res.render("Guest view review page.include", { title: "Subject" });
});
router.get("/:subject_code/:review_id", (req, res) => {
  // may need to move to a controller so that it renders based on the code
  res.render("Comment.include", { title: "Review" });
});
module.exports = router;
