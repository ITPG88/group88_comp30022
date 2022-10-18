const Review = require("../model/review").Review;
const Subject = require("../model/subject");
const User = require("../model/user").User;
const Student = require("../model/user").Student;
const mongoose = require("mongoose");


exports.updateFieldsOfInterest = async (req, res) =>{
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log("Object missing");
        res.redirect("/logout");
        return;
    }
    let fieldsOfInterest = [];
    for (let code in req.body) {
        fieldsOfInterest.push(code);
    }
    const student = await Student.findOneAndUpdate(
        { username: req.user.username },
        { fieldsOfInterest: fieldsOfInterest }
    );
    res.redirect("/settings/interest_areas", {student: student});

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