// Login Controller
const User = require("../model/user").User;

const landing = (req, res) => {
  res.render("Landing", { title: "Landing" });
};

const login = (req, res) => {
  res.render("Login", { title: "Login" });
};

const signup = (req, res) => {
  res.render("signup", { title: "signup" });
};

const forget = (req, res) => {
  res.render("forgettingemail", { title: "forgettingemail" });
};

module.exports = {
  landing,
  signup,
  login,
  forget,
};
