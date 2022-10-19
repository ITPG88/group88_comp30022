const Review = require("../model/review").Review;
const Subject = require("../model/subject");
const User = require("../model/user").User;
const Student = require("../model/user").Student;
const mongoose = require("mongoose");
const SGmail = require("@sendgrid/mail");

const Sender = 'subjects_review@email.com';
const Chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const PasswordLength = 15;

exports.getFieldsOfInterest = async (req, res, next) =>{
    const studentID = req.user._id;
    const student = await Student.findById(studentID).lean();
    res.locals.fieldsOfInterest = student.fieldsOfInterest;

    next();
}


exports.editFieldsOfInterest = async (req, res) =>{
    console.log(req.body);
    const studentID = req.user._id;

    if (!req.body) {
        res.redirect("/home");
        return;
    }

    let fieldsofInterest = [];

    for (let interest in req.body) {
      fieldsofInterest.push(interest);
    }
    
    await Student.findOneAndUpdate(
      { _id: studentID },
      { fieldsOfInterest: fieldsofInterest }
    );
    res.redirect("/settings/interest_areas");
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

exports.sendEmail = async (req, res) => {
    SGmail.setApiKey(process.env.SENDGRID_API_KEY);

    const user = await User.findOne({email: req.body.email}).lean()
    console.log(user);

    if (user) { 

        // generate random password
        var password = "";
        for (var i = 0; i <= PasswordLength; i++) {
            var randomNumber = Math.floor(Math.random() * Chars.length);
            password += Chars.substring(randomNumber, randomNumber +1);
        }

        user.password = password;

        // same email in the database
        const msg = {
            to: req.body.email,
            from: Sender, // Change to your verified sender
            subject: 'password recovery',
            text: 'new password for your students review account',
            html: '<p>There is your new password which is auto generated by the server:</p><p>' 
                    + password + '</p>',
          }
          SGmail
            .send(msg)
            .then(() => {
                res.send({ emailSent: true});
            })
            .catch((err) => {
                console.log(err);
            })
    } else {
        console.log("wrong email");
    }
}