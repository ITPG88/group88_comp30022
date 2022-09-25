const Review = require("../model/review").Review;
const Subject = require("../model/subject");
const User = require("../model/user").User;
const Student = require("../model/user").Student;
const mongoose = require("mongoose");


exports.loadSubjectPage = async (req, res) => {

}

exports.loadSingleReview = async (req, res) => {
     const review = await Review.findById(req.params.id);

     if (!review){

     }

     res.render("./student/view_review", {review: review, subjectCode: req.params.subject});
}