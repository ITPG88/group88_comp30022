// Login Controller
const User = require("../model/user");

const landing = (req, res) => {
  res.render("Landing", { title: "Landing" });
};

const login = (req, res) => {
  res.render("Landing", { title: "Landing" });
};

const signup = (req, res) => {
  res.render("signup", { title: "Landing" });
};

module.exports = {
  landing,
  signup,
};
