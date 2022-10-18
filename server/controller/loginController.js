const User = require("../model/user").User;
const Student = require("../model/user").Student;
const Review = require("../model/review").Review;
const Moderator = require("../model/user").Moderator;
const expressValidator = require("express-validator");

exports.createStudent = (req, res, next) => {
  const { username, fullName, email, password } = req.body;
  let errors = [];

  if (!username || !fullName || !email || !password) {
    errors.push("All fields required");
  }

  if (req.body.password.length < 5) {
    errors.push("Password should be at least 5 characters");
  }
  if (!ValidateEmail(email)) {
    errors.push("Needs to be a unimelb email");
  }
  if (errors.length > 0) {
    console.log("We get here :(");
    console.log(errors);
    res.render("signup.ejs", {
      errors: errors,
      fullName: fullName,
      email: email,
      username: username,
    });
    return;
  }

  const query = {
    $or: [{ username: username }, { email: email }],
  };
  Student.findOne(query).then((data) => {
    console.log(data);
    if (data) {
      errors.push("Username or Email is already exists");
      res.render("signup.ejs", {
        errors: errors,
        fullName: fullName,
        email: email,
        username: username,
      });
      return;
    }
    console.log("here");

    Student.create(req.body)
      .then((data) => {
        next();
        //req.flash("success_msg", "You are now registered.");
      })
      .catch((err) => {
        console.log("Error detected");
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while creating a create operation",
        });
      });
  });
};

exports.getStudentReviews = async (req, res) => {
  let reviews = [];
  if (req.user.likedList.length > 0) {
    for (const reviewID of req.user.likedList.length) {
      const review = await Review.findById(reviewID).populate("subject");
      reviews.push(review);
    }
  } else {
    reviews = await Review.find().populate("subject").limit(12);
  }
  res.render("student/home", { reviews: reviews });
};


exports.editStudentFieldsOfInterest = async (req, res) => {
  console.log(req.body);
  const username = req.user.username;

  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    console.log("Object missing");
    res.redirect("/logout");
    return;
  }
  let fieldsofInterest = [];
  for (let code in req.body) {
    fieldsofInterest.push(code);
  }
  await Student.findOneAndUpdate(
    { username: username },
    { fieldsOfInterest: fieldsofInterest }
  );
  res.redirect("/logout?signedup");
};

exports.resetPassword = async (req, res) => {
  const newPassword = req.body.password;
  await Student.findByIdAndUpdate(req.user._id, { password: newPassword });
  res.redirect("/login", { message: "Password reset. Please login." });
};

// Password and email functions

const STUDENT_EMAIL = "student.unimelb.edu.au";
// RFC-5322 Email regex
let emailRegex = new RegExp(
  "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])"
);
// validate email
function ValidateEmail(email) {
  if (emailRegex.test(email)) {
    if (email.endsWith(STUDENT_EMAIL)) return true;
  }
  console.log("You have entered an invalid email address!");
  return false;
}

exports.sendPasswordEmailLink = async (req, res) => {};
