const axios = require("axios");

exports.landing = (req, res) => {
  res.render("landing.ejs", { title: "Landing" });
};

exports.login = (req, res) => {
  res.render("login.ejs", { title: "Login" });
};

exports.signup = (req, res) => {
  res.render("signup.ejs", { title: "signup" });
};

exports.signupPreferences = (req, res) => {
  res.render("signup_interests.ejs", { title: "interests" });
};

exports.addUser = (req, res) => {
  console.log("we make it");
  axios
    .post(`${process.env.HOST}/api/users`)
    .then(function (response) {
      console.log(process.env.HOST);
      res.render("signup", { title: "signup" });
    })
    .catch((err) => {
      res.send(err);
    });
};
