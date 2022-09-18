const User = require("../model/user");
const Review = require("../model/review");
const home = (req, res) => {
  res.render("Moderator-Homepage(Browse)", { title: "home" });
};

module.exports = {
  home,
};
