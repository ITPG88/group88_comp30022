const User = require("../model/user").User;
const Student = require("../model/user").Student;
const Review = require("../model/review");
const Moderator = require("../model/user").Moderator;
const expressValidator = require("express-validator");

exports.createStudent = (req, res) => {
  console.log(req.body);
  const { username, fullName, email, password } = req.body;
  let errors = [];

  if (!username || !fullName || !email || !password) {
    errors.push({ message: "All fields required" });
  }

  if (req.body.password.length < 5) {
    errors.push({ message: "Password should be at least 5 characters" });
  }

  if (errors.length > 0) {
    console.log("We get here :(");
    res.render("signup.ejs", {
      errors,
      fullName,
      email,
      password,
      username,
    });
    return;
  }

  //const query = {$or:[{username: req.body.username}, {email: req.body.email}]};
  const query = { username: req.body.username };
  console.log(query);
  User.find(query).then((data) => {
    console.log(data);
    if (data.length !== 0) {
      console.log(
        `${req.body.username} or ${req.body.email} already exist in user database.`
      );
      res.redirect("/signup");
      return;
    }
    console.log("here");
    Student.create(req.body)
      .then((data) => {
        console.log(data);
<<<<<<< Updated upstream
        //req.flash("success_msg", "You are now registered.");
        res.redirect("/signup/choose_interests");
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while creating a create operation",
=======
        if (data.length !== 0){
            console.log(`${req.body.username} or ${req.body.email} already exist in user database.`);
            res.redirect('/signup');
            return;
        }
        console.log("here")
        Student.create(req.body).
        then(data => {
            console.log(data);
            //req.flash("success_msg", "You are now registered.");
            res.locals.user = req.body.username;
            res.redirect("/signup/choose_interests");
        }).
        catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
>>>>>>> Stashed changes
        });
      });
  });
};

exports.getStudentReviews = async (req, res) => {
  let reviews = [];
  if (req.user.likedList.length > 0) {
    req.user.likedList.forEach((id) => {
      reviews.push();
    });
    reviews = await Review.findById().populate("subject");
  } else {
    reviews = await Review.find().populate("subject");
  }
  res.render("student/home", { reviews: reviews });
};

exports.editStudentFieldsOfInterest = async (req, res) => {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
    const username = req.locals.user;
>>>>>>> Stashed changes
    if (req.body.fieldsOfInterest.isEmpty()){
        res.redirect("/login", {message: "You are now signed up. Login with your new details."});
        return;
    }

    await Student.findOneAndUpdate({username: username}, {fieldsOfInterest: req.body.fieldsOfInterest});
    res.redirect("/login", {message: "You are now signed up. Login with your new details."});
}

exports.resetPassword = async (req, res) => {
    const newPassword = req.body.password;
    await Student.findByIdAndUpdate(req.user._id, {password: newPassword});
    res.redirect("/login", {message: "Password reset. Please login."});
}

exports.sendPasswordEmailLink = async (req, res) => {

}
=======
  console.log(req.user.fullName);
  //   if (req.body.fieldsOfInterest.isEmpty()) {
  //     res.redirect("/login", {
  //       message: "You are now signed up. Login with your new details.",
  //     });
  //   }
};
>>>>>>> Stashed changes
