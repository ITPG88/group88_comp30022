const User = require("../model/user");
const expressValidator = require("express-validator");
// Routing
const home = (req, res) => {
  res.render("Student-Homepage", { title: "Home" });
};

const browse = (req, res) => {
  res.render("Home page (Browse).html", { title: "Browse" });
};

const history = (req, res) => {
  res.render("Home page (History).html", { title: "History" });
};

const account = (req, res) => {
  res.render("Account-setting.html", { title: "Account" });
};
const appearance = (req, res) => {
  res.render("Appearence-setting.html", { title: "Appearance" });
};
const interests = (req, res) => {
  res.render("Interest_areas-setting .html", { title: "Interests" });
};

const getCurrentStudent = async (req) => {
  const userId = req.user._id;
  const student = await User.findOne({ userId: userId }).lean();
  return student;
};

const getReviewSortByTime = async (req) => {
  try {
    var reviews = await Review.find().sort("-createdAt").lean();
    for (let i = 0; i < reviews.length; i++) {
      // Change the format of createAt to YYYY/MM/DD
      reviews[i].createdAt = reviews[i].createdAt.toISOString().split("T")[0];
    }
    return res.render("APAGE", { layout: false, reviews: reviews });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getCurrentStudent,
  getReviewSortByTime,
  home,
  browse,
  history,
  account,
  appearance,
  interests,
};
