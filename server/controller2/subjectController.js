const Review = require("../model/review").Review;
const Subject = require("../model/subject");
const User = require("../model/user").User;
const Student = require("../model/user").Student;
const mongoose = require("mongoose");

exports.loadSubjectPage = async (req, res) => {
  const subject = req.subject;
  if (subject.length !== 0) {
    const reviews = await Review.find({
      subject: subject._id,
    });
    res.render("student/view_subject", {
      reviews: reviews,
    });
  } else {
    res.redirect("/error404");
  }
};

exports.loadSingleReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
  }

  res.render("./student/view_review", {
    review: review,
    subjectCode: req.params.subject,
  });
};

exports.postReview = async (req, res) => {
  const subject = req.subject;
  let review = new Review({
    subject: subject._id,
    subjectCode: subject.subjectCode,
    subjectName: subject.subjectName,
    content: req.body.content,
    isPrivate: req.body.isPrivate,
    isVisible: req.body.isVisible,
    rating: req.body.rating,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  try {
    review = await review.save();
    //console.log(review)
    res.redirect(`/subject/${req.body.subjectCode}/review/${review._id}`);
  } catch (e) {
    console.log(e);
    res.render("student/write_review", { review: review });
  }
};

exports.FindSubject = async (req, res, next) => {
  const subject = await Subject.findOne({
    subjectCode: req.params.subjectCode,
  });
  res.locals.subjectCode = subject.subjectCode;
  res.locals.subjectName = subject.subjectName;
  req.subject = subject;
  next();
};
exports.deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete with id ${req.params.id}. Is the id correct?`,
        });
      } else {
        res.send({
          message: "Review was deleted",
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: `Could not delete review with id=${req.params.id}` });
    });
};
