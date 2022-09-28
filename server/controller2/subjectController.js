const Review = require("../model/review").Review;
const pendingReview = require("../model/review").PendingReview;
const Comment = require("../model/comment");
const Subject = require("../model/subject");
const User = require("../model/user").User;
const Student = require("../model/user").Student;
const mongoose = require("mongoose");

exports.loadSubjectPage = async (req, res) => {
  const result = await Subject.findOne({ subjectCode: req.params.subjectCode });
  //console.log(result);
  if (result) {
    const reviews = await Review.find({subject: result._id}).populate('author');
    console.log(reviews);
    res.render("student/view_subject", {
      subjectCode: req.params.subjectCode,
      subject: result,
      reviews: reviews
    });
  } else {
    res.redirect("/error404");
  }
};

exports.loadSingleReview = async (req, res) => {
  const review = await Review.findById(req.params.id).populate('comments').populate('subject').populate('author');
  let comments = []
  for (const comment of review.comments) {
    comments.push(await comment.populate('author'));
  }

  if (!review) {
    res.status(404);
  }
  //review.comments = comments;
  console.log(review);
  res.render("./student/view_review", {
    review: review,
    subjectCode: req.params.subjectCode,
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

exports.flaggedReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  let reviewObject = {
    content: review.content,
    subject: review.subject,
    author: review.author,
    isPrivate: review.isPrivate,
    isVisible: review.isVisible,
    rating: review.rating,
    comments: review.comments,
    status: "FLAGGED",

  };
  await pendingReview.create(reviewObject);
  await Review.findByIdAndDelete(req.params.id);
  res.redirect(`/subject/${req.params.subjectCode}`)
}

exports.deleteReview = async (req, res) => {

  console.log('i am in delete')
  const review = await Review.findById(req.params.id);
  if (req.user.type === "moderator" || review.author.toString() === req.user._id.toString()){
    await Review.findByIdAndDelete(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete with id ${req.params.id}. Is the id correct?`,
        });
      } else {
        res.redirect(`/subject/${req.params.subjectCode}`)
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: `Could not delete review with id=${req.params.id}` });
    });
  }else {
    res.redirect(`/subject/${req.params.subjectCode}`);
  }
  
};

exports.addComment = async (req, res) => {
  const content = req.body.content;
  const authorID = req.user._id;

  const reviewID = req.params.id;

  const newComment = await Comment.create({content: content, author: authorID});
  console.log(newComment);
  console.log(reviewID);
  await Review.findByIdAndUpdate(reviewID, {$push: {comments: newComment}}).then(data => {
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

exports.deleteComment = async (req, res) => {
  console.log("delete comment called");
  const reviewID = req.params.id;
  const commentID = req.params.commentID;

  const comment = await Comment.findById(commentID);
  if (req.user.type === "moderator" || comment.author.toString() === req.user._id.toString()){

    await Comment.findByIdAndDelete(commentID);
    const review = await Review.findByIdAndUpdate(reviewID, {$pull: {comments: commentID}});
    console.log(commentID);
    console.log(review);
    res.redirect(`/subject/${req.params.subjectCode}/review/${req.params.id}`);
  } else {
    res.redirect(`/subject/${req.params.subjectCode}/review/${req.params.id}`);
  }

}

exports.likeReview = async (req, res) => {
  const reviewID = req.params._id;

  const reviewUpdated = await Review.update({_id: reviewID}, {$inc: {nLikes: 1}});

  if (reviewUpdated){
    if (req.user.type !== 'moderator') {
      await Student.findByIdAndUpdate(req.user._id, {$push: {likedList: reviewUpdated._id}});
    }
  }
  // redirect back to the page POST request came from with new review
  res.redirect('back');
}

exports.likeComment = async (req, res) => {
  const commentID = req.params.commentID;

  const commentUpdated = await Comment.findByIdAndUpdate(commentID, {$inc: {nLikes: 1}});

  if (!commentUpdated){
    console.log("comment liking error");
  }

  res.redirect('back');
}
