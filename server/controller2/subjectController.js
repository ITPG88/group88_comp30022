const Review = require("../model/review").Review;
const Comment = require("../model/comment");
const Subject = require("../model/subject");
const User = require("../model/user").User;
const Student = require("../model/user").Student;
const mongoose = require("mongoose");

exports.loadSubjectPage = async (req, res) => {
  const result = await Subject.findOne({ subjectCode: req.params.subjectCode });
  console.log(result);
  if (result) {
    console.log(result);
    const same_subjectcode = await Review.find({
      subjectCode: req.params.subjectCode,
    });
    res.render("student/view_subject", {
      title: req.params.subjectCode,
      result: result[0],
      same_subjectcode: same_subjectcode,
    });
  } else {
    res.redirect("/error404");
  }
};

exports.loadSingleReview = async (req, res) => {
  const review = await Review.findById(req.params.id).populate('comments').populate('subject');

  if (!review) {
    res.status(404);
  }
  console.log(review);
  res.render("./student/view_review", {
    review: review,
    subjectCode: req.params.subject,
  });
};

exports.postReview = async (req, res) => {
  const subject = await Subject.findOne({ subjectCode: req.body.subjectCode });

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

exports.addComment = async (req, res) => {
  const content = req.body.content;
  const authorID = req.user._id;

  const reviewID = req.params.id;

  const newComment = await Comment.create({content: content, author: authorID});
  console.log(newComment);
  console.log(reviewID);
  Review.findByIdAndUpdate(reviewID, {$push: {comments: newComment}}).then(data => {
    console.log(data);
    if (!data){
      res.status(404).send({
        message: `Cannot update review with ${reviewID}. Is the id correct?`
      });
    } else{
      console.log("We get here ");
      res.redirect(`/subject/${req.params.subjectCode}/review/${req.params.id}`);
    }
  });
}

exports.likeReview = async (req, res) => {
  const reviewID = req.params._id;

  const reviewUpdated = await Review.update({_id: reviewID}, {$inc: {nLikes: 1}});

  // redirect back to the page POST request came from with new review
  res.redirect('back', {review: reviewUpdated});
}
