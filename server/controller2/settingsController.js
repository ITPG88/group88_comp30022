const Review = require("../model/review").Review;
const Subject = require("../model/subject");
const User = require("../model/user").User;
const Student = require("../model/user").Student;
const mongoose = require("mongoose");


exports.editFieldsOfInterest = async (req, res) =>{
    const studentID = req.user._id;


    if (!req.body) {
        res.redirect("/home");
        return;
    }

    console.log(req.body);

    await Student.findByIdAndUpdate(studentID, {fieldsOfInterest: newFieldsOfInterest}).catch(err => {
        console.log("Error detected");
        res.status(500).send({
            message:
                err.message ||
                "Some error occurred while creating a updating fields of interest.",
        });

    });

    let fieldsofInterest = [];
    for (let code in req.body) {
      fieldsofInterest.push(code);
    }
    await Student.findOneAndUpdate(
      { studentID: username },
      { fieldsOfInterest: fieldsofInterest }
    );
    res.redirect("/interest_areas");
}

exports.editAccountSettings = async (req, res) => {
    if (!req.body){
        res.redirect("/account");
        return;
    }

    console.log(req.body);

    if (req.body.email && req.user.type === 'moderator'){
        console.log("Moderator email change attempted.");
        res.status(500).send({message: "Illegal modification attempted"});
        return;
    }

    const userID = req.user._id;
    let fields = {}
    if (req.body.fullName){
        fields.fullName = req.body.fullName;
    }
    if (req.body.email){
        fields.email = req.body.email;
    }

    await User.findByIdAndUpdate(userID, fields)
        .then(data => {
            res.redirect("/account");
        }).catch(err => {
        console.log("Error detected");
        res.status(500).send({
            message:
                err.message ||
                "Some error occurred while creating a updating user fields.",
        });
    });

}